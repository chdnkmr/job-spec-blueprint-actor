import { Actor, log } from 'apify';
import * as fs from 'fs';
import * as path from 'path';
import { JobPostingParser, ExtractedJobData } from './parsers/jobPostingParser';
import { StackDetector } from './analyzers/stackDetector';
import { BlueprintGenerator } from './generators/blueprintGenerator';
import { OutputFormatter } from './formatters/outputFormatter';
import { ProjectBlueprint } from './types/blueprint';

interface ActorInput {
  jobPostingUrl?: string;
  jobPostingText?: string;
  companyName?: string;
  jobTitle?: string;
  includeArchitecture?: boolean;
  includeTestPlan?: boolean;
  includeLearningPlan?: boolean;
  roadmapDurationDays?: number;
  outputFormat?: 'json' | 'markdown' | 'both';
  aiProvider?: string;
  apiKey?: string;
}

async function main(): Promise<void> {
  log.info('Job Spec → Blueprint Actor started');

  // Get input from Apify or from file (for local development)
  let input = await Actor.getInput() as ActorInput;

  // For local development: read from APIFY_INPUT_FILE if provided
  if (!input && process.env.APIFY_INPUT_FILE) {
    try {
      const inputPath = path.resolve(process.env.APIFY_INPUT_FILE);
      const fileContent = fs.readFileSync(inputPath, 'utf-8');
      input = JSON.parse(fileContent);
      log.info(`Loaded input from: ${inputPath}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      log.error(`Failed to read input file: ${errorMsg}`);
    }
  }

  if (!input) {
    throw new Error('No input provided. Please provide jobPostingUrl or jobPostingText.');
  }

  try {
    // Validate input
    if (!input.jobPostingUrl && !input.jobPostingText) {
      throw new Error('Either jobPostingUrl or jobPostingText must be provided');
    }

    log.info('Extracting job posting data...');
    let jobData: ExtractedJobData;

    if (input.jobPostingUrl) {
      jobData = await JobPostingParser.parseFromUrl(input.jobPostingUrl);
    } else {
      jobData = JobPostingParser.parseFromText(input.jobPostingText || '', input.jobTitle);
    }

    // Override with provided values if available
    if (input.companyName) jobData.company = input.companyName;
    if (input.jobTitle) jobData.title = input.jobTitle;

    log.info(`Processing job: ${jobData.title} @ ${jobData.company}`);

    // Detect technology stack
    log.info('Analyzing technology stack and requirements...');
    const stackDetection = StackDetector.detectStack(jobData.description, jobData.requirements);

    log.info('Detected technologies:');
    log.info(`- Languages: ${stackDetection.languages.join(', ')}`);
    log.info(`- Frameworks: ${stackDetection.frameworks.join(', ')}`);
    log.info(`- Databases: ${stackDetection.databases.join(', ')}`);
    log.info(`- Platforms: ${stackDetection.platforms.join(', ')}`);
    log.info(`- Domains: ${stackDetection.domains.join(', ')}`);
    log.info(`- Seniority: ${stackDetection.estimatedSeniority}`);

    // Generate blueprint
    log.info('Generating project blueprint...');
    const blueprint: ProjectBlueprint = BlueprintGenerator.generateBlueprint(
      jobData.title,
      jobData.company,
      jobData.description,
      stackDetection,
      input.roadmapDurationDays || 60,
      input.includeArchitecture !== false,
      input.includeTestPlan !== false,
      input.includeLearningPlan !== false
    );

    // Format output
    const outputFormat = input.outputFormat || 'both';
    const results: Record<string, unknown> = {};

    if (outputFormat === 'json' || outputFormat === 'both') {
      const jsonBlueprint = JSON.parse(OutputFormatter.toJSON(blueprint));
      results.blueprint_json = jsonBlueprint;

      // Save to file
      await Actor.pushData({
        type: 'blueprint',
        format: 'json',
        jobTitle: jobData.title,
        company: jobData.company,
        data: jsonBlueprint
      });
    }

    if (outputFormat === 'markdown' || outputFormat === 'both') {
      const mdBlueprint = OutputFormatter.toMarkdown(blueprint);
      results.blueprint_markdown = mdBlueprint;

      // Save to file
      await Actor.pushData({
        type: 'blueprint',
        format: 'markdown',
        jobTitle: jobData.title,
        company: jobData.company,
        data: mdBlueprint
      });
    }

    // Generate CSV with tickets
    const ticketsCSV = OutputFormatter.ticketsToCSV(blueprint);
    await Actor.pushData({
      type: 'tickets',
      format: 'csv',
      jobTitle: jobData.title,
      company: jobData.company,
      data: ticketsCSV
    });

    // Push summary
    await Actor.pushData({
      type: 'summary',
      jobTitle: jobData.title,
      company: jobData.company,
      seniority: stackDetection.estimatedSeniority,
      technologies: blueprint.summary.keyTechnologies,
      challenges: blueprint.summary.mainChallenges,
      successCriteria: blueprint.summary.successCriteria,
      estimatedDuration: blueprint.metadata.estimatedDuration,
      totalTickets: blueprint.roadmap.epics.reduce((sum, epic) => sum + epic.tickets.length, 0),
      learningHours: blueprint.learningPlan.estimatedTotalHours
    });

    log.info('✅ Blueprint generation completed successfully!');
    log.info(`- Generated ${blueprint.roadmap.epics.length} epics`);
    log.info(`- Created ${blueprint.roadmap.epics.reduce((sum, epic) => sum + epic.tickets.length, 0)} tickets`);
    log.info(`- Learning plan: ${blueprint.learningPlan.estimatedTotalHours} hours`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.error(`❌ Error: ${errorMessage}`);

    await Actor.pushData({
      type: 'error',
      error: errorMessage,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
}

Actor.main(main);
