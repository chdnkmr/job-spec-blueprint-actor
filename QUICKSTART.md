# Quick Start Guide

Get started with the Job Spec → Blueprint Generator in minutes!

## Installation

### 1. Clone or Download
```bash
cd /Users/chandankumar/VS_Workspace/ApifyActor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build TypeScript
```bash
npm run build
```

## Running Locally

### Development Mode
```bash
npm run dev
```

### Production Mode
First build, then run:
```bash
npm run build
npm start
```

## Using with Sample Inputs

### Test with Text Input (Recommended First)
```bash
# Create a test input file
cat sample-input-text.json > test-input.json

# Run with the input
APIFY_INPUT_FILE=test-input.json npm run dev
```

### Test with URL Input
```bash
cat sample-input-url.json > test-input.json
APIFY_INPUT_FILE=test-input.json npm run dev
```

## Understanding the Output

The Actor generates 4 types of outputs:

### 1. Blueprint (JSON)
Complete structured data - import into applications
```json
{
  "metadata": { ... },
  "roadmap": { ... },
  "architecture": { ... },
  "testPlan": { ... },
  "learningPlan": { ... }
}
```

### 2. Blueprint (Markdown)
Human-readable document - share with team
```markdown
# Project Blueprint: Senior Full-Stack Engineer

## Roadmap
- EPIC-1: Setup & Architecture
  - TICKET-XXX: Initialize project
  - TICKET-YYY: Design architecture
  ...
```

### 3. Tickets (CSV)
Spreadsheet format - import into Jira/GitHub
```csv
Epic ID,Epic Name,Ticket ID,Title,Type,Priority,Story Points
EPIC-1,Setup,TICKET-1,Initialize project,feature,critical,5
...
```

### 4. Summary
Quick metrics and overview
```json
{
  "jobTitle": "Senior Full-Stack Engineer",
  "seniority": "senior",
  "technologies": ["typescript", "react", ...],
  "totalTickets": 35,
  "learningHours": 120
}
```

## Customizing for Your Job

### Input Parameters
```json
{
  // Required: either URL or text
  "jobPostingUrl": "https://job.example.com/senior-engineer",
  "jobPostingText": "Paste job description here...",
  
  // Optional overrides
  "companyName": "My Company",
  "jobTitle": "Senior Engineer",
  
  // Optional features (all default to true)
  "includeArchitecture": true,
  "includeTestPlan": true,
  "includeLearningPlan": true,
  
  // Optional customization
  "roadmapDurationDays": 60,        // Default: 60
  "outputFormat": "both"             // "json", "markdown", or "both"
}
```

### Disable Expensive Features
For faster processing, disable what you don't need:
```json
{
  "jobPostingText": "...",
  "includeArchitecture": false,
  "includeTestPlan": false,
  "roadmapDurationDays": 30
}
```

## Common Workflows

### For Hiring Teams
1. Paste job description
2. Generate blueprint
3. Share roadmap with team
4. Adjust tickets in Jira/GitHub
5. Use for onboarding new hires

### For Candidates
1. Paste job description
2. Generate blueprint with learning plan
3. Follow skill-gap resources
4. Build portfolio project from roadmap
5. Practice with test plan

### For Project Planning
1. Input job/project requirements
2. Generate roadmap and architecture
3. Export tickets to Jira
4. Estimate team size and timeline
5. Create project schedule

## API Integration

### Using with Apify API
```bash
curl https://api.apify.com/v2/acts/YOUR_ACTOR_ID/runs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "jobPostingText": "Senior Engineer...",
    "outputFormat": "both"
  }'
```

### Getting Results
```bash
# Get run details
curl https://api.apify.com/v2/actor-runs/RUN_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Download dataset
curl https://api.apify.com/v2/datasets/DATASET_ID/items \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Issue: "Cannot find module 'apify'"
**Solution**: Run `npm install` to install dependencies

### Issue: TypeScript compilation errors
**Solution**: 
```bash
npm run build
# Check output in dist/ folder
```

### Issue: Empty or incomplete output
**Solution**: 
- Ensure job description has clear requirements
- Provide longer, more detailed text
- Check that jobPostingText or URL is valid

### Issue: Stack detection missing frameworks
**Solution**: 
- Add technology to `stackDetector.ts` patterns
- See EXTENSION_GUIDE.md for custom patterns

## Performance Tips

### Optimize for Speed
```json
{
  "includeArchitecture": false,
  "includeTestPlan": false,
  "roadmapDurationDays": 30
}
```

### Optimize for Detail
```json
{
  "includeArchitecture": true,
  "includeTestPlan": true,
  "includeLearningPlan": true,
  "roadmapDurationDays": 60
}
```

## Environment Setup

### Local Development
```bash
# Copy example env file
cp .env.example .env

# Add your keys if using AI services
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
```

### Apify Deployment
1. Create Apify account
2. Create Actor
3. Push code: `apify push`
4. Set environment variables in Apify console
5. Deploy and share

## Next Steps

1. **Try Sample Inputs**
   - Use `sample-input-text.json` for quick test
   - Customize with your own job description

2. **Integrate with Tools**
   - Export to Jira
   - Create GitHub issues
   - Import to project management tool

3. **Extend the Actor**
   - Add custom frameworks/languages in `stackDetector.ts`
   - Customize roadmap in `blueprintGenerator.ts`
   - Add new output formats in `outputFormatter.ts`
   - See EXTENSION_GUIDE.md for details

4. **Deploy to Production**
   - Build with `npm run build`
   - Deploy to Apify or Docker
   - Integrate with workflows
   - Monitor execution

## Resources

- 📖 [README.md](./README.md) - Full documentation
- 🔧 [EXTENSION_GUIDE.md](./EXTENSION_GUIDE.md) - How to extend
- 📋 [input_schema.json](./input_schema.json) - Input validation
- 🎯 [sample-input-text.json](./sample-input-text.json) - Example input
- 🐳 [Dockerfile](./Dockerfile) - Container configuration

## Getting Help

1. Check error messages in logs
2. Review sample inputs
3. See EXTENSION_GUIDE.md for customization
4. Check input_schema.json for valid parameters
5. Review generated blueprints for insights

---

**Happy blueprint generating! 🚀**
