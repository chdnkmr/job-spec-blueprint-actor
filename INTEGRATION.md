# Job Spec → Blueprint Generator - Integration Guide

Complete guide for integrating the Job Spec Blueprint Generator Actor into your workflows and applications.

## Table of Contents

1. [Quick Start](#quick-start)
2. [API Integration](#api-integration)
3. [CLI Integration](#cli-integration)
4. [JavaScript/Node.js Integration](#javascriptnodejs-integration)
5. [Python Integration](#python-integration)
6. [Webhook Integration](#webhook-integration)
7. [Output Handling](#output-handling)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

---

## Quick Start

### Prerequisites

- Apify Account ([apify.com](https://apify.com))
- Actor Published (or use: `chdnkmr/job-spec-blueprint-actor`)
- API Token (from Account Settings)

### Minimal Example

```bash
# Run actor via CLI
apify run chdnkmr/job-spec-blueprint-actor \
  --input '{"jobPostingText": "Senior Full-Stack Engineer..."}'
```

---

## API Integration

### REST API Endpoint

```
POST https://api.apify.com/v2/acts/chdnkmr~job-spec-blueprint-actor/runs
```

### Basic Request

```bash
curl -X POST \
  https://api.apify.com/v2/acts/chdnkmr~job-spec-blueprint-actor/runs \
  -H "Authorization: Bearer YOUR_APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobPostingText": "Senior Full-Stack Engineer with 5+ years experience in React, Node.js, and AWS...",
    "companyName": "TechCorp",
    "jobTitle": "Senior Full-Stack Engineer",
    "roadmapDurationDays": 60,
    "outputFormat": "both"
  }'
```

### Response

```json
{
  "id": "run_id_12345",
  "actId": "actor_id",
  "status": "READY",
  "startedAt": "2025-12-10T19:36:41.553Z",
  "finishedAt": "2025-12-10T19:38:45.123Z",
  "defaultDatasetId": "dataset_id_xyz"
}
```

### Retrieve Results

```bash
# Get all outputs
curl https://api.apify.com/v2/datasets/DATASET_ID/items \
  -H "Authorization: Bearer YOUR_APIFY_TOKEN"

# Get specific output type
curl "https://api.apify.com/v2/datasets/DATASET_ID/items?filter={\"type\":\"summary\"}" \
  -H "Authorization: Bearer YOUR_APIFY_TOKEN"
```

### Poll for Completion

```bash
# Check run status
curl https://api.apify.com/v2/runs/RUN_ID \
  -H "Authorization: Bearer YOUR_APIFY_TOKEN" \
  | jq '.status'
```

---

## CLI Integration

### Install Apify CLI

```bash
npm install -g apify-cli
apify login --token YOUR_APIFY_TOKEN
```

### Run Actor

```bash
# With text input
apify run chdnkmr/job-spec-blueprint-actor \
  --input '{
    "jobPostingText": "Your job description...",
    "companyName": "Your Company",
    "roadmapDurationDays": 60
  }'

# With input file
apify run chdnkmr/job-spec-blueprint-actor \
  --input-file input.json
```

### Save Outputs

```bash
# Outputs saved to default location
# ~/.apify/storage/datasets/default/

# Access specific run
apify open  # Opens in browser
apify logs  # Shows execution logs
```

---

## JavaScript/Node.js Integration

### Using Apify API Client

```javascript
const ApifyClient = require('apify-client');

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function generateBlueprint(jobPosting) {
  // Run the actor
  const run = await client.actor('chdnkmr/job-spec-blueprint-actor').call({
    jobPostingText: jobPosting,
    companyName: 'TechCorp',
    roadmapDurationDays: 60,
    outputFormat: 'both',
  });

  // Get dataset results
  const dataset = await client.dataset(run.defaultDatasetId).listItems();
  
  return {
    blueprint: dataset.items.find(i => i.type === 'blueprint'),
    tickets: dataset.items.find(i => i.type === 'tickets'),
    summary: dataset.items.find(i => i.type === 'summary'),
    error: dataset.items.find(i => i.type === 'error'),
  };
}

// Usage
generateBlueprint('Senior Engineer job description...')
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

### Async Polling Pattern

```javascript
async function waitForCompletion(runId, maxWaitMs = 600000) {
  const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const run = await client.run(runId).get();

    if (run.status === 'SUCCEEDED' || run.status === 'FAILED') {
      return run;
    }

    // Wait 2 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('Run timed out');
}
```

---

## Python Integration

### Using Apify SDK

```python
from apify_client import ApifyClient

client = ApifyClient(token='YOUR_APIFY_TOKEN')

def generate_blueprint(job_posting):
    # Run the actor
    run = client.actor('chdnkmr/job-spec-blueprint-actor').call(input={
        'jobPostingText': job_posting,
        'companyName': 'TechCorp',
        'roadmapDurationDays': 60,
        'outputFormat': 'both'
    })

    # Get dataset results
    dataset = client.dataset(run['defaultDatasetId']).list_items()
    
    results = {
        'blueprint': None,
        'tickets': None,
        'summary': None,
        'error': None
    }

    for item in dataset['items']:
        if item['type'] == 'blueprint':
            results['blueprint'] = item
        elif item['type'] == 'tickets':
            results['tickets'] = item
        elif item['type'] == 'summary':
            results['summary'] = item
        elif item['type'] == 'error':
            results['error'] = item

    return results

# Usage
result = generate_blueprint('Senior Engineer job description...')
print(result['summary'])
```

### With Async Support

```python
import asyncio
from apify_client import ApifyClient

async def generate_blueprint_async(job_posting):
    client = ApifyClient(token='YOUR_APIFY_TOKEN')
    
    # Start run asynchronously
    run = await client.actor('chdnkmr/job-spec-blueprint-actor').call(input={
        'jobPostingText': job_posting,
        'companyName': 'TechCorp'
    })

    # Poll for completion
    while True:
        run_info = await client.run(run['id']).get()
        if run_info['status'] in ['SUCCEEDED', 'FAILED']:
            break
        await asyncio.sleep(2)

    dataset = await client.dataset(run['defaultDatasetId']).list_items()
    return dataset['items']

# Usage
asyncio.run(generate_blueprint_async('Job description...'))
```

---

## Webhook Integration

### Zapier Integration

1. **Create Zap** → Choose Webhook Trigger
2. **URL**: `https://api.apify.com/v2/acts/chdnkmr~job-spec-blueprint-actor/runs`
3. **Headers**:
   ```
   Authorization: Bearer YOUR_APIFY_TOKEN
   Content-Type: application/json
   ```
4. **Body**:
   ```json
   {
     "jobPostingText": "{{job_description}}",
     "companyName": "{{company_name}}"
   }
   ```
5. **Action**: Send webhook to next Zap action

### Make (formerly Integromat)

```javascript
// In Make scenario:
// 1. Add "HTTP" module → Make a request
// 2. URL: https://api.apify.com/v2/acts/chdnkmr~job-spec-blueprint-actor/runs
// 3. Method: POST
// 4. Body:
{
  "jobPostingText": "{{step1.jobDescription}}",
  "companyName": "{{step1.companyName}}",
  "roadmapDurationDays": 60
}
// 5. Headers: Authorization: Bearer YOUR_TOKEN
```

### IFTTT Webhook

```bash
# Trigger webhook via IFTTT
curl -X POST \
  https://maker.ifttt.com/trigger/blueprint_generated/with/key/YOUR_KEY \
  -H "Content-Type: application/json" \
  -d '{
    "value1": "Senior Engineer",
    "value2": "TechCorp",
    "value3": "Full blueprint data"
  }'
```

---

## Output Handling

### Blueprint Output (JSON)

```javascript
{
  "type": "blueprint",
  "format": "json",
  "jobTitle": "Senior Full-Stack Engineer",
  "company": "TechCorp",
  "data": {
    "roadmap": {
      "projectName": "Senior Engineer Onboarding",
      "totalDuration": 60,
      "epics": [
        {
          "name": "Week 1-2: Setup & Foundations",
          "tickets": [...],
          "goals": [...]
        }
      ]
    },
    "architecture": {
      "overview": "...",
      "modules": [],
      "dataModels": []
    },
    "testPlan": {...},
    "learningPlan": {...}
  }
}
```

### Summary Output

```javascript
{
  "type": "summary",
  "jobTitle": "Senior Full-Stack Engineer",
  "company": "TechCorp",
  "seniority": "senior",
  "technologies": ["React", "Node.js", "AWS", "PostgreSQL"],
  "challenges": ["Microservices architecture", "Distributed systems"],
  "successCriteria": ["Deploy to production", "Lead architecture review"],
  "estimatedDuration": "8-12 weeks",
  "totalTickets": 24,
  "learningHours": 235
}
```

### Tickets Output (CSV)

```csv
id,title,description,storyPoints,priority,taskType,acceptanceCriteria
TICKET-ABC123,"Initialize project repository","Set up Git repo and CI/CD",5,critical,technical-debt,"Repo created, CI passes"
TICKET-ABC124,"Setup development environment","Install dependencies and tools",3,high,documentation,"Dev env ready"
```

### Markdown Output

```markdown
# Senior Full-Stack Engineer - Project Blueprint

## Project Overview
- **Duration**: 60 days
- **Team Size**: 3-4 engineers
- **Estimated Tickets**: 24

## Roadmap

### Week 1-2: Setup & Foundations
- Initialize project repository and CI/CD pipeline
- Set up development environment documentation
- Configure linting and pre-commit hooks

[... rest of blueprint ...]
```

---

## Error Handling

### Common Error Responses

```javascript
// Missing required input
{
  "type": "error",
  "error": "Either jobPostingUrl or jobPostingText must be provided",
  "timestamp": "2025-12-10T19:36:41.553Z"
}

// Network error
{
  "type": "error",
  "error": "Failed to fetch URL: Request failed with status code 404",
  "timestamp": "2025-12-10T19:36:41.553Z"
}
```

### Error Handling Best Practice

```javascript
async function safeGenerateBlueprint(jobPosting) {
  try {
    const run = await client.actor('chdnkmr/job-spec-blueprint-actor').call({
      jobPostingText: jobPosting,
      companyName: 'TechCorp'
    });

    const dataset = await client.dataset(run.defaultDatasetId).listItems();
    
    // Check for errors in output
    const errorItem = dataset.items.find(i => i.type === 'error');
    if (errorItem) {
      throw new Error(`Actor error: ${errorItem.error}`);
    }

    return dataset.items;

  } catch (error) {
    console.error('Blueprint generation failed:', error.message);
    
    // Implement retry logic
    if (error.status === 429) { // Rate limited
      await new Promise(r => setTimeout(r, 5000));
      return safeGenerateBlueprint(jobPosting);
    }
    
    throw error;
  }
}
```

---

## Best Practices

### 1. **Rate Limiting**

```javascript
// Implement exponential backoff
async function callWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

### 2. **Batch Processing**

```javascript
async function processBatch(jobPostings, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < jobPostings.length; i += batchSize) {
    const batch = jobPostings.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(jp => generateBlueprint(jp))
    );
    results.push(...batchResults);
  }
  
  return results;
}
```

### 3. **Data Validation**

```javascript
function validateInput(input) {
  if (!input.jobPostingUrl && !input.jobPostingText) {
    throw new Error('Either URL or text must be provided');
  }

  if (input.roadmapDurationDays) {
    const days = parseInt(input.roadmapDurationDays);
    if (days < 7 || days > 180) {
      throw new Error('Duration must be between 7 and 180 days');
    }
  }

  const validFormats = ['json', 'markdown', 'both'];
  if (input.outputFormat && !validFormats.includes(input.outputFormat)) {
    throw new Error(`Output format must be one of: ${validFormats.join(', ')}`);
  }

  return true;
}
```

### 4. **Caching Results**

```javascript
const cache = new Map();

async function cachedGenerateBlueprint(jobPosting) {
  const cacheKey = hashJobPosting(jobPosting);
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const result = await generateBlueprint(jobPosting);
  cache.set(cacheKey, result);
  
  return result;
}
```

### 5. **Logging & Monitoring**

```javascript
async function generateBlueprintWithLogging(jobPosting) {
  const startTime = Date.now();
  
  try {
    console.log('Starting blueprint generation...');
    const result = await generateBlueprint(jobPosting);
    
    const duration = Date.now() - startTime;
    console.log(`Blueprint generated in ${duration}ms`);
    
    return result;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Blueprint generation failed after ${duration}ms:`, error);
    throw error;
  }
}
```

---

## Configuration

### Environment Variables

```bash
# Required
export APIFY_TOKEN="your_token_here"

# Optional
export APIFY_API_BASE_URL="https://api.apify.com"
export APIFY_PROXY_URL="http://proxy.apify.com:8000"
export LOG_LEVEL="info"
```

### Input Schema Reference

```json
{
  "jobPostingUrl": "string (URL to job posting)",
  "jobPostingText": "string (Raw job posting text)",
  "companyName": "string (Optional)",
  "jobTitle": "string (Optional)",
  "includeArchitecture": "boolean (default: true)",
  "includeTestPlan": "boolean (default: true)",
  "includeLearningPlan": "boolean (default: true)",
  "roadmapDurationDays": "integer (7-180, default: 60)",
  "outputFormat": "string (json|markdown|both, default: both)"
}
```

---

## Support & Resources

- **GitHub**: https://github.com/chdnkmr/job-spec-blueprint-actor
- **Apify Docs**: https://docs.apify.com
- **API Reference**: https://docs.apify.com/api/v2
- **Community**: https://apify.com/community

---

## Changelog

### Version 1.0.0 (2025-12-10)
- Initial release
- Full blueprint generation from job postings
- JSON, Markdown, and CSV output formats
- Architecture recommendations
- Test plan generation
- Learning plan with skill gaps
