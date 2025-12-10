# Extension Guide

This document explains how to extend and customize the Job Spec Blueprint Generator Actor.

## Architecture Overview

```
src/
├── main.ts                      # Actor entry point
├── parsers/
│   └── jobPostingParser.ts      # Extract data from job postings
├── analyzers/
│   └── stackDetector.ts         # Detect tech stack and domains
├── generators/
│   └── blueprintGenerator.ts    # Generate blueprint components
├── formatters/
│   └── outputFormatter.ts       # Format output (JSON, Markdown)
└── types/
    └── blueprint.ts             # TypeScript interfaces
```

## Adding Support for New Technologies

Edit `src/analyzers/stackDetector.ts`:

```typescript
private static readonly STACK_PATTERNS: Record<string, string[]> = {
  // Add new pattern
  nextjs: ['next.js', 'nextjs', 'next js'],
  // ...
};

private static categorizeKeyword(keyword: string): keyof StackDetectionResult | null {
  const categories: Record<string, keyof StackDetectionResult> = {
    nextjs: 'frameworks',  // Add mapping
    // ...
  };
  // ...
}
```

## Customizing Roadmap Generation

Edit `src/generators/blueprintGenerator.ts`:

### Add Epic Templates
```typescript
private static generateEpics(...): Epic[] {
  const epicTemplates = [
    // Add your custom epic template
    {
      name: 'Your Custom Epic',
      description: '...',
      duration: 'Week X-Y',
      goals: [...],
    },
    // ...
  ];
  // ...
}
```

### Add Ticket Templates
```typescript
private static generateTicketsForEpic(epicName: string, ...): Ticket[] {
  const baseTickets = [];
  
  if (epicName.includes('CustomName')) {
    baseTickets.push(
      { title: 'Custom ticket', type: 'feature', priority: 'high', points: 5 },
      // ...
    );
  }
  // ...
}
```

## Integrating AI Models

To use AI for enhanced analysis:

### 1. Create AI Service Module

Create `src/services/aiService.ts`:

```typescript
export class AIService {
  static async analyzeJobDescription(text: string, apiKey: string): Promise<Analysis> {
    // Implement AI-based analysis
    // Use OpenAI, Anthropic, or other providers
  }
}
```

### 2. Update Main Entry Point

```typescript
import { AIService } from './services/aiService';

// In main():
if (input.apiKey && input.aiProvider !== 'local') {
  const aiAnalysis = await AIService.analyzeJobDescription(
    jobData.description,
    input.apiKey
  );
  // Enhance stackDetection with AI insights
}
```

## Adding Output Formats

Edit `src/formatters/outputFormatter.ts`:

```typescript
static toXML(blueprint: ProjectBlueprint): string {
  // Implement XML formatting
}

static toYAML(blueprint: ProjectBlueprint): string {
  // Implement YAML formatting
}
```

## Domain-Specific Enhancements

### Add Healthcare Domain Support

Edit `src/generators/blueprintGenerator.ts`:

```typescript
if (stack.domains.includes('healthcare')) {
  modules.push({
    name: 'HIPAA Compliance Module',
    responsibility: 'Ensure HIPAA compliance for patient data',
    dependencies: ['Data Access Layer'],
    technologies: ['Encryption', 'Audit Logging']
  });
  
  considerations.push('HIPAA compliance');
  considerations.push('Patient data encryption');
}
```

### Add Fintech Security Features

```typescript
if (stack.domains.includes('fintech')) {
  // Add security considerations
  // Add compliance frameworks
  // Add encryption modules
}
```

## Customizing Learning Plans

Edit `src/generators/blueprintGenerator.ts` `generateLearningPlan()`:

```typescript
private static getDomainResources(domain: string): LearningResource[] {
  const resources: Record<string, LearningResource[]> = {
    'healthcare': [
      {
        title: 'HIPAA Compliance Training',
        type: 'course',
        url: 'https://example.com/hipaa',
        estimatedHours: 8,
        difficulty: 'beginner'
      }
    ],
    // Add more domain resources
  };
  return resources[domain.toLowerCase()] || [];
}
```

## Database Schema Customization

Edit the `generateDataModels()` method:

```typescript
if (stack.domains.includes('ecommerce')) {
  models.push({
    entity: 'Product',
    fields: {
      id: 'UUID',
      name: 'String',
      sku: 'String (Unique)',
      price: 'Decimal',
      inventory: 'Integer',
      // Custom fields
    },
    relationships: ['belongs to Category', 'has many Reviews']
  });
}
```

## API Endpoint Generation

Customize `generateApiEndpoints()`:

```typescript
if (stack.domains.includes('ecommerce')) {
  apis.push(
    {
      method: 'GET',
      path: '/api/products',
      description: 'List all products with pagination',
      responseBody: { products: 'array', total: 'number', page: 'number' }
    },
    // ... more endpoints
  );
}
```

## Testing Strategy Customization

Enhance `generateTestPlan()`:

```typescript
if (stack.domains.includes('fintech')) {
  return {
    // ... existing config
    securityTestCases: [
      'PCI DSS compliance testing',
      'Encryption validation',
      'Transaction integrity checks',
      // ... more test cases
    ]
  };
}
```

## Building Custom Analyzers

Create `src/analyzers/customAnalyzer.ts`:

```typescript
export class CustomAnalyzer {
  static analyzeJobRequirements(text: string): CustomInsights {
    // Custom analysis logic
    return {
      // Return insights
    };
  }
}
```

Use in main:
```typescript
import { CustomAnalyzer } from './analyzers/customAnalyzer';

const customInsights = CustomAnalyzer.analyzeJobRequirements(jobData.description);
```

## Extending Output Formatters

Add new format support:

```typescript
// In outputFormatter.ts
static toHTML(blueprint: ProjectBlueprint): string {
  // Generate HTML report
}

static toGitHubIssues(blueprint: ProjectBlueprint): string[] {
  // Generate GitHub issue templates
}
```

## Performance Optimization

### Caching Stack Detection
```typescript
private static detectionCache = new Map<string, StackDetectionResult>();

static detectStack(text: string, requirements: string[]): StackDetectionResult {
  const cacheKey = hash(text);
  if (this.detectionCache.has(cacheKey)) {
    return this.detectionCache.get(cacheKey)!;
  }
  // ... existing logic
}
```

### Parallel Processing
```typescript
// Process multiple job postings
const blueprints = await Promise.all(
  jobPostings.map(posting => generateBlueprint(posting))
);
```

## Error Handling Improvements

Add custom error types:

```typescript
// src/errors/BlueprintError.ts
export class BlueprintError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}
```

## Integration Examples

### Jira Integration
```typescript
import JiraClient from 'jira.js';

export class JiraIntegration {
  static async createTickets(blueprint: ProjectBlueprint, jiraConfig: JiraConfig) {
    // Create epics and tickets in Jira
  }
}
```

### GitHub Integration
```typescript
import { Octokit } from '@octokit/rest';

export class GitHubIntegration {
  static async createIssues(blueprint: ProjectBlueprint, repoConfig: RepoConfig) {
    // Create issues in GitHub repository
  }
}
```

### Slack Notifications
```typescript
export class SlackIntegration {
  static async notifyCompletion(blueprint: ProjectBlueprint, webhookUrl: string) {
    // Send summary to Slack
  }
}
```

## Testing Your Extensions

Add tests in `src/__tests__/`:

```typescript
import { BlueprintGenerator } from '../generators/blueprintGenerator';

describe('BlueprintGenerator', () => {
  test('should generate blueprint for fintech job', () => {
    const stack = { domains: ['fintech'], /* ... */ };
    const blueprint = BlueprintGenerator.generateBlueprint(/* ... */);
    
    expect(blueprint.architecture.securityConsiderations).toContain('PCI DSS compliance');
  });
});
```

## Publishing Extensions

To share your extensions:

1. Fork the repository
2. Create a branch for your feature
3. Add tests
4. Update documentation
5. Submit a pull request

## Best Practices

1. **Type Safety**: Always use TypeScript types
2. **Error Handling**: Handle parsing and generation errors gracefully
3. **Performance**: Cache expensive operations
4. **Extensibility**: Use composition over inheritance
5. **Documentation**: Document custom features thoroughly
6. **Testing**: Write tests for custom logic
7. **Backward Compatibility**: Don't break existing features

## Resources

- [Apify SDK Documentation](https://docs.apify.com/sdk)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
