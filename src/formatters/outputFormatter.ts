import { ProjectBlueprint } from '../types/blueprint';

export class OutputFormatter {
  /**
   * Generate Markdown format
   */
  static toMarkdown(blueprint: ProjectBlueprint): string {
    const md: string[] = [];

    // Header
    md.push(`# Project Blueprint: ${blueprint.metadata.jobTitle}`);
    md.push(`**Generated**: ${new Date(blueprint.metadata.generatedAt).toLocaleString()}`);
    if (blueprint.metadata.company) md.push(`**Company**: ${blueprint.metadata.company}`);
    md.push(`**Seniority Level**: ${blueprint.metadata.seniority}`);
    md.push(`**Estimated Duration**: ${blueprint.metadata.estimatedDuration} days`);
    md.push('');

    // Summary
    md.push('## 📋 Summary');
    md.push(blueprint.roadmap.description);
    md.push('');

    // Key Technologies
    md.push('### Key Technologies');
    md.push(blueprint.summary.keyTechnologies.map(t => `- ${t}`).join('\n'));
    md.push('');

    // Main Challenges
    md.push('### Main Challenges');
    md.push(blueprint.summary.mainChallenges.map(c => `- ${c}`).join('\n'));
    md.push('');

    // Success Criteria
    md.push('### Success Criteria');
    md.push(blueprint.summary.successCriteria.map(c => `- ${c}`).join('\n'));
    md.push('');

    // Project Roadmap
    md.push('## 🗺️ Project Roadmap');
    md.push(`**Total Duration**: ${blueprint.roadmap.totalDuration} days`);
    md.push(`**Start Date**: ${blueprint.roadmap.startDate}`);
    md.push(`**Estimated Team Size**: ${blueprint.roadmap.estimatedTeamSize} people`);
    md.push('');

    md.push('### Key Milestones');
    blueprint.roadmap.keyMilestones.forEach(milestone => {
      md.push(`- ${milestone}`);
    });
    md.push('');

    // Epics
    md.push('### Epics & Tickets');
    blueprint.roadmap.epics.forEach(epic => {
      md.push(`\n#### ${epic.id}: ${epic.name}`);
      md.push(`**Duration**: ${epic.duration}`);
      md.push(`**Description**: ${epic.description}`);
      md.push('');
      md.push('**Goals**:');
      epic.goals.forEach(goal => md.push(`- ${goal}`));
      md.push('');
      md.push('**Success Metrics**:');
      epic.successMetrics.forEach(metric => md.push(`- ${metric}`));
      md.push('');
      md.push('**Tickets**:');
      epic.tickets.forEach(ticket => {
        md.push(`- **${ticket.id}**: ${ticket.title} (${ticket.storyPoints} pts, ${ticket.priority})`);
        md.push(`  - Type: ${ticket.taskType}`);
        md.push(`  - Criteria: ${ticket.acceptanceCriteria.slice(0, 2).join('; ')}`);
      });
    });
    md.push('');

    // Architecture
    md.push('## 🏗️ Architecture Blueprint');
    md.push(blueprint.architecture.overview);
    md.push('');

    md.push('### Architecture Modules');
    blueprint.architecture.modules.forEach(module => {
      md.push(`\n**${module.name}**`);
      md.push(`- Responsibility: ${module.responsibility}`);
      md.push(`- Technologies: ${module.technologies.join(', ')}`);
      if (module.dependencies.length > 0) {
        md.push(`- Dependencies: ${module.dependencies.join(', ')}`);
      }
    });
    md.push('');

    md.push('### Data Models');
    blueprint.architecture.dataModels.forEach(model => {
      md.push(`\n**${model.entity}**`);
      md.push('| Field | Type |');
      md.push('|-------|------|');
      Object.entries(model.fields).forEach(([field, type]) => {
        md.push(`| ${field} | ${type} |`);
      });
      if (model.relationships.length > 0) {
        md.push(`- Relationships: ${model.relationships.join(', ')}`);
      }
    });
    md.push('');

    md.push('### API Endpoints');
    md.push('| Method | Path | Description |');
    md.push('|--------|------|-------------|');
    blueprint.architecture.apis.forEach(api => {
      md.push(`| ${api.method} | \`${api.path}\` | ${api.description} |`);
    });
    md.push('');

    // Non-functional requirements
    md.push('### Non-Functional Requirements');
    blueprint.architecture.nonFunctionalRequirements.forEach(req => {
      md.push(`- ${req}`);
    });
    md.push('');

    // Security
    md.push('### Security Considerations');
    blueprint.architecture.securityConsiderations.forEach(sec => {
      md.push(`- ${sec}`);
    });
    md.push('');

    md.push('### Scaling Strategy');
    md.push(blueprint.architecture.scalingStrategy);
    md.push('');

    // Test Plan
    md.push('## ✅ Test Plan');
    md.push(blueprint.testPlan.overview);
    md.push('');

    md.push('### Unit Testing');
    md.push(blueprint.testPlan.unitTestCoverage);
    md.push('');

    md.push('### Integration Testing');
    blueprint.testPlan.integrationTestScenarios.forEach(scenario => {
      md.push(`- ${scenario}`);
    });
    md.push('');

    md.push('### End-to-End Testing');
    blueprint.testPlan.e2eTestScenarios.forEach(scenario => {
      md.push(`- ${scenario}`);
    });
    md.push('');

    md.push('### Performance Targets');
    md.push('| Metric | Target |');
    md.push('|--------|--------|');
    Object.entries(blueprint.testPlan.performanceTargets).forEach(([metric, target]) => {
      md.push(`| ${metric} | ${target} |`);
    });
    md.push('');

    md.push('### Security Testing');
    blueprint.testPlan.securityTestCases.forEach(testCase => {
      md.push(`- ${testCase}`);
    });
    md.push('');

    // Learning Plan
    md.push('## 📚 Learning Plan');
    md.push(blueprint.learningPlan.overview);
    md.push(`**Estimated Total Hours**: ${blueprint.learningPlan.estimatedTotalHours}`);
    md.push('');

    md.push('### Recommended Learning Path');
    md.push(blueprint.learningPlan.recommendedPath);
    md.push('');

    md.push('### Learning Phases');
    blueprint.learningPlan.learningPhases.forEach(phase => {
      md.push(`\n#### Phase ${phase.phase}: ${phase.name} (${phase.duration})`);
      md.push(`**Focus Areas**:`);
      phase.focus.forEach(f => md.push(`- ${f}`));
      md.push(`**Milestones**:`);
      phase.milestones.forEach(m => md.push(`- ${m}`));
    });
    md.push('');

    md.push('### Skill Gaps & Resources');
    blueprint.learningPlan.skillGaps.forEach(gap => {
      md.push(`\n**${gap.skill}** [${gap.importance}]`);
      md.push(`- Current Level: ${gap.currentLevel}/10 → Target: ${gap.targetLevel}/10`);
      md.push(`- Estimated Hours: ${gap.estimatedHours}`);
      md.push('- Resources:');
      gap.resources.forEach(resource => {
        md.push(`  - [${resource.title}](${resource.url}) - ${resource.type} (${resource.estimatedHours}h, ${resource.difficulty})`);
      });
    });

    return md.join('\n');
  }

  /**
   * Generate JSON format
   */
  static toJSON(blueprint: ProjectBlueprint, pretty: boolean = true): string {
    return pretty ? JSON.stringify(blueprint, null, 2) : JSON.stringify(blueprint);
  }

  /**
   * Generate CSV format for tickets
   */
  static ticketsToCSV(blueprint: ProjectBlueprint): string {
    const rows: string[] = [];
    rows.push('Epic ID,Epic Name,Ticket ID,Title,Type,Priority,Story Points,Acceptance Criteria');

    blueprint.roadmap.epics.forEach(epic => {
      epic.tickets.forEach(ticket => {
        const criteria = ticket.acceptanceCriteria.join('; ').replace(/"/g, '""');
        rows.push(
          `"${epic.id}","${epic.name}","${ticket.id}","${ticket.title}","${ticket.taskType}","${ticket.priority}","${ticket.storyPoints}","${criteria}"`
        );
      });
    });

    return rows.join('\n');
  }
}
