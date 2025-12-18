# Input Examples for Job Spec → Blueprint Actor

## ⚠️ IMPORTANT: Input Required

This actor **requires input** to run. You must provide **either**:
- `jobPostingUrl` (a URL to a job posting), **OR**
- `jobPostingText` (the job posting text directly)

**The actor will fail if you don't provide at least one of these fields.**

---

## Example 1: Using Job Posting URL

```json
{
  "jobPostingUrl": "https://example.com/careers/senior-fullstack-engineer",
  "outputFormat": "both"
}
```

### With Additional Options:

```json
{
  "jobPostingUrl": "https://example.com/careers/senior-fullstack-engineer",
  "companyName": "TechCorp",
  "jobTitle": "Senior Full-Stack Engineer",
  "includeArchitecture": true,
  "includeTestPlan": true,
  "includeLearningPlan": true,
  "roadmapDurationDays": 60,
  "outputFormat": "both"
}
```

---

## Example 2: Using Job Posting Text

```json
{
  "jobPostingText": "Senior Full-Stack Engineer - Python & React\n\nAbout the Role:\nWe're looking for a talented Senior Full-Stack Engineer to join our growing team. You'll be responsible for designing and implementing scalable web applications using Python and React.\n\nResponsibilities:\n- Design and develop RESTful APIs using Python and FastAPI\n- Build responsive user interfaces with React and TypeScript\n- Optimize database queries and implement caching strategies\n- Lead code reviews and mentor junior developers\n- Collaborate with product and design teams\n\nRequired Skills:\n- 5+ years of professional experience\n- Expert-level Python development\n- Advanced React and TypeScript knowledge\n- SQL and NoSQL database design\n- AWS or cloud platform experience\n- Docker and Kubernetes\n- CI/CD pipeline experience\n\nNice to Have:\n- Experience with microservices architecture\n- GraphQL API development\n- Machine Learning basics\n- Open source contributions",
  "companyName": "InnovateTech",
  "jobTitle": "Senior Full-Stack Engineer",
  "outputFormat": "both"
}
```

---

## Example 3: Minimal Input (URL only)

```json
{
  "jobPostingUrl": "https://www.linkedin.com/jobs/view/12345678"
}
```

---

## Example 4: Minimal Input (Text only)

```json
{
  "jobPostingText": "Software Engineer needed. Must know Python, React, and AWS. 3+ years experience required."
}
```

---

## How to Provide Input on Apify

### Option A: Web Interface
1. Go to your actor in the Apify Console
2. Click "Try it" or "Start"
3. Fill in the input form fields
4. Click "Start" to run

### Option B: API Call

```bash
curl -X POST https://api.apify.com/v2/acts/YOUR_ACTOR_ID/runs \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobPostingUrl": "https://example.com/job",
    "outputFormat": "both"
  }'
```

### Option C: Apify Client (Node.js)

```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: 'YOUR_API_TOKEN',
});

const run = await client.actor('YOUR_ACTOR_ID').call({
    jobPostingUrl: 'https://example.com/job',
    outputFormat: 'both'
});

console.log('Results:', run.defaultDatasetId);
```

---

## All Available Input Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `jobPostingUrl` | string | Either this or `jobPostingText` | - | URL of the job posting |
| `jobPostingText` | string | Either this or `jobPostingUrl` | - | Job posting text directly |
| `companyName` | string | No | Auto-detected | Company name override |
| `jobTitle` | string | No | Auto-detected | Job title override |
| `includeArchitecture` | boolean | No | `true` | Include architecture suggestions |
| `includeTestPlan` | boolean | No | `true` | Include test plan |
| `includeLearningPlan` | boolean | No | `true` | Include learning plan |
| `roadmapDurationDays` | integer | No | `60` | Roadmap timeline (7-180 days) |
| `outputFormat` | enum | No | `both` | Output format: `json`, `markdown`, or `both` |
| `aiProvider` | enum | No | `openai` | AI provider: `openai`, `anthropic`, or `local` |
| `apiKey` | string | No | - | API key for AI provider (use Apify secrets) |

---

## Common Errors

### Error: "Either jobPostingUrl or jobPostingText must be provided"

**Cause**: No input was provided when running the actor.

**Solution**: Provide at least one of the required fields (`jobPostingUrl` or `jobPostingText`) in your input.

### Error: "Failed to fetch job posting from URL"

**Cause**: The URL is invalid or inaccessible.

**Solution**: 
- Verify the URL is correct and accessible
- Try using `jobPostingText` instead and paste the content directly

