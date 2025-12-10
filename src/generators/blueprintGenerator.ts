import {
  ProjectBlueprint,
  ProjectRoadmap,
  ArchitectureBlueprint,
  TestPlan,
  LearningPlan,
  Epic,
  Ticket,
  ArchitectureModule,
  DataModel,
  ApiEndpoint,
  SkillGap,
  LearningResource,
  LearningPhase
} from '../types/blueprint';
import { StackDetectionResult } from '../analyzers/stackDetector';

export class BlueprintGenerator {
  /**
   * Generate complete project blueprint from job analysis
   */
  static generateBlueprint(
    jobTitle: string,
    company: string | undefined,
    description: string,
    stackDetection: StackDetectionResult,
    durationDays: number = 60,
    includeArchitecture: boolean = true,
    includeTestPlan: boolean = true,
    includeLearningPlan: boolean = true
  ): ProjectBlueprint {
    const projectName = `${jobTitle}${company ? ` @ ${company}` : ''}`;

    const roadmap = this.generateRoadmap(
      projectName,
      description,
      stackDetection,
      durationDays
    );

    const architecture = includeArchitecture
      ? this.generateArchitecture(stackDetection, description)
      : this.generateMinimalArchitecture();

    const testPlan = includeTestPlan
      ? this.generateTestPlan(stackDetection, description)
      : { overview: '', unitTestCoverage: '', integrationTestScenarios: [], e2eTestScenarios: [], performanceTargets: {}, loadTestingStrategy: '', securityTestCases: [] };

    const learningPlan = includeLearningPlan
      ? this.generateLearningPlan(stackDetection, jobTitle)
      : { overview: '', estimatedTotalHours: 0, learningPhases: [], skillGaps: [], recommendedPath: '' };

    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        jobTitle,
        company,
        seniority: stackDetection.estimatedSeniority,
        estimatedDuration: durationDays
      },
      roadmap,
      architecture,
      testPlan,
      learningPlan,
      summary: {
        keyTechnologies: [
          ...stackDetection.languages,
          ...stackDetection.frameworks,
          ...stackDetection.databases,
          ...stackDetection.platforms
        ],
        mainChallenges: this.extractChallenges(stackDetection, description),
        successCriteria: this.extractSuccessCriteria(description, stackDetection)
      }
    };
  }

  /**
   * Generate project roadmap with epics and tickets
   */
  private static generateRoadmap(
    projectName: string,
    description: string,
    stack: StackDetectionResult,
    durationDays: number
  ): ProjectRoadmap {
    const startDate = new Date().toISOString().split('T')[0];
    const epics = this.generateEpics(stack, durationDays, description);

    return {
      projectName,
      description: `Project roadmap for ${projectName}. Total estimated duration: ${durationDays} days.`,
      totalDuration: durationDays,
      startDate,
      epics,
      estimatedTeamSize: this.estimateTeamSize(stack),
      keyMilestones: this.generateMilestones(durationDays)
    };
  }

  /**
   * Generate epics with tickets for the roadmap
   */
  private static generateEpics(stack: StackDetectionResult, durationDays: number, description: string): Epic[] {
    const epicsPerPhase = Math.ceil(durationDays / 30);
    const epics: Epic[] = [];

    const epicTemplates = [
      {
        name: 'Project Setup & Architecture Foundation',
        description: 'Initialize project structure, set up development environment, and establish architectural foundation',
        duration: 'Week 1-2',
        weekNumber: 1,
        goals: [
          'Set up development environment and toolchain',
          'Establish project repository and CI/CD pipeline',
          'Create architectural design documents',
          'Set up database schema'
        ]
      },
      {
        name: 'Core Features Implementation - Phase 1',
        description: 'Build foundational features and core business logic',
        duration: 'Week 3-4',
        weekNumber: 3,
        goals: [
          'Implement authentication and authorization',
          'Build core API endpoints',
          'Create data access layer',
          'Establish error handling patterns'
        ]
      },
      {
        name: 'Core Features Implementation - Phase 2',
        description: 'Continue with additional core features and integrations',
        duration: 'Week 5-6',
        weekNumber: 5,
        goals: [
          'Implement business logic features',
          'Add external integrations',
          'Optimize database queries',
          'Build admin features'
        ]
      },
      {
        name: 'Testing & Quality Assurance',
        description: 'Comprehensive testing, performance optimization, and code quality improvements',
        duration: 'Week 7-8',
        weekNumber: 7,
        goals: [
          'Write unit tests (>80% coverage)',
          'Integration testing',
          'Performance testing and optimization',
          'Security audit and fixes'
        ]
      },
      {
        name: 'Deployment & Documentation',
        description: 'Prepare for production deployment and complete documentation',
        duration: 'Week 9+',
        weekNumber: 9,
        goals: [
          'Containerize and deploy application',
          'Set up monitoring and logging',
          'Complete API documentation',
          'Create user and developer guides'
        ]
      }
    ];

    for (let i = 0; i < Math.min(epicsPerPhase, epicTemplates.length); i++) {
      const template = epicTemplates[i];
      const tickets = this.generateTicketsForEpic(template.name, stack, description);

      epics.push({
        id: `EPIC-${i + 1}`,
        name: template.name,
        description: template.description,
        duration: template.duration,
        weekNumber: template.weekNumber,
        tickets,
        goals: template.goals,
        successMetrics: this.generateSuccessMetrics(template.name)
      });
    }

    return epics;
  }

  /**
   * Generate tickets for an epic
   */
  private static generateTicketsForEpic(epicName: string, _stack: StackDetectionResult, _description: string): Ticket[] {
    const baseTickets: Array<{ title: string; type: Ticket['taskType']; priority: Ticket['priority']; points: number }> = [];

    if (epicName.includes('Setup')) {
      baseTickets.push(
        { title: 'Initialize project repository and CI/CD pipeline', type: 'technical-debt', priority: 'critical', points: 5 },
        { title: 'Set up development environment documentation', type: 'documentation', priority: 'high', points: 3 },
        { title: 'Configure linting, formatting, and pre-commit hooks', type: 'technical-debt', priority: 'high', points: 3 },
        { title: 'Design and document system architecture', type: 'documentation', priority: 'critical', points: 8 },
        { title: 'Set up database schema and migrations', type: 'feature', priority: 'critical', points: 5 },
        { title: 'Create base project structure and utilities', type: 'technical-debt', priority: 'high', points: 5 }
      );
    } else if (epicName.includes('Phase 1')) {
      baseTickets.push(
        { title: 'Implement user authentication system', type: 'feature', priority: 'critical', points: 8 },
        { title: 'Build authorization and role management', type: 'feature', priority: 'critical', points: 5 },
        { title: 'Create REST API endpoints for core resources', type: 'feature', priority: 'critical', points: 8 },
        { title: 'Implement data access layer/ORM', type: 'technical-debt', priority: 'high', points: 5 },
        { title: 'Set up comprehensive error handling', type: 'technical-debt', priority: 'high', points: 3 },
        { title: 'Implement request validation', type: 'feature', priority: 'high', points: 3 }
      );
    } else if (epicName.includes('Phase 2')) {
      baseTickets.push(
        { title: 'Implement core business logic features', type: 'feature', priority: 'high', points: 8 },
        { title: 'Add third-party API integrations', type: 'feature', priority: 'high', points: 5 },
        { title: 'Optimize database queries and indexes', type: 'technical-debt', priority: 'medium', points: 5 },
        { title: 'Implement caching layer', type: 'feature', priority: 'medium', points: 5 },
        { title: 'Build admin/management features', type: 'feature', priority: 'medium', points: 5 },
        { title: 'Implement file upload/processing if needed', type: 'feature', priority: 'medium', points: 3 }
      );
    } else if (epicName.includes('Testing')) {
      baseTickets.push(
        { title: 'Write unit tests for core modules', type: 'feature', priority: 'high', points: 8 },
        { title: 'Implement integration tests', type: 'feature', priority: 'high', points: 8 },
        { title: 'Set up end-to-end testing', type: 'feature', priority: 'high', points: 5 },
        { title: 'Performance profiling and optimization', type: 'technical-debt', priority: 'high', points: 8 },
        { title: 'Security vulnerability assessment', type: 'bug', priority: 'critical', points: 5 },
        { title: 'Load testing and capacity planning', type: 'technical-debt', priority: 'medium', points: 5 }
      );
    } else if (epicName.includes('Deployment')) {
      baseTickets.push(
        { title: 'Containerize application with Docker', type: 'technical-debt', priority: 'high', points: 5 },
        { title: 'Set up Kubernetes deployment (if applicable)', type: 'technical-debt', priority: 'medium', points: 5 },
        { title: 'Configure production monitoring and alerting', type: 'feature', priority: 'high', points: 3 },
        { title: 'Set up centralized logging', type: 'technical-debt', priority: 'high', points: 3 },
        { title: 'Complete API and technical documentation', type: 'documentation', priority: 'high', points: 5 },
        { title: 'Create deployment runbooks and guides', type: 'documentation', priority: 'medium', points: 3 }
      );
    }

    return baseTickets.map((ticket, index) => ({
      id: `TICKET-${Math.random().toString(36).substring(7).toUpperCase()}`,
      title: ticket.title,
      description: `Implement: ${ticket.title}`,
      storyPoints: ticket.points,
      priority: ticket.priority,
      taskType: ticket.type,
      acceptanceCriteria: this.generateAcceptanceCriteria(ticket.title),
      dependencies: index > 0 ? [baseTickets[0].title] : undefined
    }));
  }

  /**
   * Generate architecture blueprint
   */
  private static generateArchitecture(stack: StackDetectionResult, description: string): ArchitectureBlueprint {
    const modules = this.generateArchitectureModules(stack);
    const dataModels = this.generateDataModels(stack, description);
    const apis = this.generateApiEndpoints(stack, description);

    return {
      overview: `A scalable, modular architecture designed for the ${stack.domains.join(', ')} domain(s) using ${stack.languages.join(', ')} with ${stack.frameworks.join(', ')} frameworks and ${stack.databases.join(', ')} databases.`,
      modules,
      dataModels,
      apis,
      integrations: this.generateIntegrations(stack, description),
      nonFunctionalRequirements: this.generateNonFunctionalRequirements(stack),
      securityConsiderations: this.generateSecurityConsiderations(stack, description),
      scalingStrategy: this.generateScalingStrategy(stack)
    };
  }

  /**
   * Generate architecture modules
   */
  private static generateArchitectureModules(stack: StackDetectionResult): ArchitectureModule[] {
    const modules: ArchitectureModule[] = [
      {
        name: 'API Gateway',
        responsibility: 'Route requests, handle authentication, rate limiting, and request validation',
        dependencies: ['Auth Service'],
        technologies: ['HTTP', 'REST/GraphQL']
      },
      {
        name: 'Authentication & Authorization',
        responsibility: 'User authentication, JWT/OAuth management, and permission enforcement',
        dependencies: [],
        technologies: ['JWT', 'OAuth 2.0', 'RBAC']
      },
      {
        name: 'Core Business Logic',
        responsibility: 'Implement domain-specific business rules and workflows',
        dependencies: ['Data Access Layer', 'External Services'],
        technologies: stack.frameworks
      },
      {
        name: 'Data Access Layer',
        responsibility: 'Database operations, caching, and query optimization',
        dependencies: [],
        technologies: stack.databases
      }
    ];

    if (stack.domains.includes('ml')) {
      modules.push({
        name: 'ML Pipeline',
        responsibility: 'Model training, inference, and data processing',
        dependencies: ['Data Access Layer'],
        technologies: ['TensorFlow', 'PyTorch', 'scikit-learn']
      });
    }

    if (stack.platforms.includes('microservices') || stack.specializations.includes('distributed')) {
      modules.push({
        name: 'Service Mesh',
        responsibility: 'Inter-service communication, load balancing, and resilience patterns',
        dependencies: [],
        technologies: ['gRPC', 'Kafka', 'message queues']
      });
    }

    return modules;
  }

  /**
   * Generate data models
   */
  private static generateDataModels(stack: StackDetectionResult, _description: string): DataModel[] {
    const models: DataModel[] = [
      {
        entity: 'User',
        fields: {
          id: 'UUID (Primary Key)',
          email: 'String (Unique)',
          passwordHash: 'String',
          firstName: 'String',
          lastName: 'String',
          role: 'Enum (admin, user, moderator)',
          createdAt: 'Timestamp',
          updatedAt: 'Timestamp',
          isActive: 'Boolean'
        },
        relationships: ['has many Profiles', 'has many Sessions'],
        indexes: ['email', 'createdAt']
      },
      {
        entity: 'Session',
        fields: {
          id: 'UUID (Primary Key)',
          userId: 'UUID (Foreign Key)',
          token: 'String',
          expiresAt: 'Timestamp',
          createdAt: 'Timestamp',
          lastActivityAt: 'Timestamp'
        },
        relationships: ['belongs to User'],
        indexes: ['userId', 'token']
      }
    ];

    if (stack.domains.includes('fintech') || stack.domains.includes('ecommerce')) {
      models.push({
        entity: 'Transaction',
        fields: {
          id: 'UUID (Primary Key)',
          userId: 'UUID (Foreign Key)',
          amount: 'Decimal',
          currency: 'String',
          status: 'Enum (pending, completed, failed)',
          metadata: 'JSON',
          createdAt: 'Timestamp',
          completedAt: 'Timestamp'
        },
        relationships: ['belongs to User', 'has many Logs'],
        indexes: ['userId', 'status', 'createdAt']
      });
    }

    return models;
  }

  /**
   * Generate API endpoints
   */
  private static generateApiEndpoints(_stack: StackDetectionResult, _description: string): ApiEndpoint[] {
    return [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user',
        requestBody: { email: 'string', password: 'string', firstName: 'string', lastName: 'string' },
        responseBody: { userId: 'string', token: 'string', message: 'string' }
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'User login',
        requestBody: { email: 'string', password: 'string' },
        responseBody: { token: 'string', user: 'object', expiresIn: 'number' }
      },
      {
        method: 'GET',
        path: '/api/users/:userId',
        description: 'Get user profile',
        responseBody: { id: 'string', email: 'string', firstName: 'string', lastName: 'string', role: 'string' }
      },
      {
        method: 'PUT',
        path: '/api/users/:userId',
        description: 'Update user profile',
        requestBody: { firstName: 'string', lastName: 'string' },
        responseBody: { id: 'string', email: 'string', firstName: 'string', lastName: 'string' }
      },
      {
        method: 'GET',
        path: '/api/health',
        description: 'Health check endpoint',
        responseBody: { status: 'string', timestamp: 'string' }
      }
    ];
  }

  /**
   * Generate test plan
   */
  private static generateTestPlan(_stack: StackDetectionResult, _description: string): TestPlan {
    return {
      overview: `Comprehensive testing strategy including unit tests, integration tests, and end-to-end tests. Target 80%+ code coverage with focus on critical paths.`,
      unitTestCoverage: 'Aim for 80%+ code coverage. Use Jest/Vitest for JS, pytest for Python, or JUnit for Java.',
      integrationTestScenarios: [
        'API endpoint integration tests with mock databases',
        'Database transaction rollback scenarios',
        'External API integration failures and retries',
        'Cache invalidation and refresh',
        'Multi-service communication (if microservices)',
        'Authentication and authorization flows'
      ],
      e2eTestScenarios: [
        'Complete user registration and login flow',
        'Core business process workflows',
        'Payment/transaction flows (if applicable)',
        'Error handling and recovery',
        'Performance under load',
        'Database consistency checks'
      ],
      performanceTargets: {
        'API response time (p99)': '< 500ms',
        'Database query latency (p99)': '< 200ms',
        'Authentication latency': '< 100ms',
        'Throughput': '> 1000 requests/second'
      },
      loadTestingStrategy: 'Use k6, JMeter, or Locust. Simulate realistic user load with ramp-up patterns. Test to 2x expected peak traffic.',
      securityTestCases: [
        'SQL injection prevention',
        'XSS prevention',
        'CSRF protection',
        'Authentication bypass attempts',
        'Authorization boundary testing',
        'Rate limiting validation'
      ]
    };
  }

  /**
   * Generate learning plan
   */
  private static generateLearningPlan(stack: StackDetectionResult, jobTitle: string): LearningPlan {
    const skillGaps = this.generateSkillGaps(stack);
    const estimatedHours = skillGaps.reduce((sum, gap) => sum + gap.estimatedHours, 0);

    const learningPhases: LearningPhase[] = [
      {
        phase: 1,
        name: 'Foundation & Setup',
        duration: '1-2 weeks',
        focus: [
          'Project setup and development environment',
          'Version control and CI/CD basics',
          'Core language features and best practices'
        ],
        milestones: ['Local dev environment running', 'First commit to repo', 'Simple unit test passing']
      },
      {
        phase: 2,
        name: 'Core Concepts',
        duration: '2-3 weeks',
        focus: [
          'Selected frameworks deep dive',
          'Database design and queries',
          'API design principles',
          'Authentication and authorization'
        ],
        milestones: ['Complete framework course', 'Design database schema', 'Implement first API']
      },
      {
        phase: 3,
        name: 'Domain Expertise',
        duration: '2-4 weeks',
        focus: [
          'Domain-specific patterns',
          'Testing strategies',
          'Performance optimization',
          'Security best practices'
        ],
        milestones: ['80% test coverage', 'Performance benchmarks established', 'Security audit passed']
      }
    ];

    return {
      overview: `Customized learning plan for ${jobTitle}. Estimated ${estimatedHours} hours of learning. Covers ${stack.languages.join(', ')} with ${stack.frameworks.join(', ')} and ${stack.domains.join(', ')} domain knowledge.`,
      estimatedTotalHours: estimatedHours,
      learningPhases,
      skillGaps,
      recommendedPath: `Start with ${stack.languages[0] || 'JavaScript'} fundamentals, then progress to ${stack.frameworks[0] || 'framework'} deep dive, followed by domain-specific patterns in ${stack.domains[0] || 'software engineering'}.`
    };
  }

  /**
   * Generate skill gaps
   */
  private static generateSkillGaps(stack: StackDetectionResult): SkillGap[] {
    const gaps: SkillGap[] = [];

    // Language gaps
    for (const lang of stack.languages) {
      gaps.push({
        skill: `${lang} Advanced Proficiency`,
        importance: 'critical',
        currentLevel: 0,
        targetLevel: 8,
        estimatedHours: 40,
        resources: this.getLanguageResources(lang)
      });
    }

    // Framework gaps
    for (const framework of stack.frameworks) {
      gaps.push({
        skill: `${framework} Deep Dive`,
        importance: 'high',
        currentLevel: 0,
        targetLevel: 7,
        estimatedHours: 30,
        resources: this.getFrameworkResources(framework)
      });
    }

    // Database gaps
    for (const db of stack.databases) {
      gaps.push({
        skill: `${db} Database Design`,
        importance: 'high',
        currentLevel: 0,
        targetLevel: 7,
        estimatedHours: 20,
        resources: this.getDatabaseResources(db)
      });
    }

    // Domain-specific gaps
    for (const domain of stack.domains) {
      gaps.push({
        skill: `${domain} Domain Expertise`,
        importance: 'high',
        currentLevel: 0,
        targetLevel: 6,
        estimatedHours: 25,
        resources: this.getDomainResources(domain)
      });
    }

    return gaps.slice(0, 8); // Return top 8 skills
  }

  /**
   * Helper methods for resources
   */
  private static getLanguageResources(lang: string): LearningResource[] {
    const resources: Record<string, LearningResource[]> = {
      typescript: [
        {
          title: 'TypeScript Handbook',
          type: 'documentation',
          url: 'https://www.typescriptlang.org/docs/',
          estimatedHours: 10,
          difficulty: 'intermediate'
        },
        {
          title: 'Advanced TypeScript Course',
          type: 'course',
          url: 'https://www.udemy.com/course/advanced-typescript/',
          estimatedHours: 15,
          difficulty: 'advanced'
        }
      ],
      python: [
        {
          title: 'Python Official Docs',
          type: 'documentation',
          url: 'https://docs.python.org/3/',
          estimatedHours: 10,
          difficulty: 'intermediate'
        },
        {
          title: 'Real Python Tutorials',
          type: 'tutorial',
          url: 'https://realpython.com/',
          estimatedHours: 20,
          difficulty: 'intermediate'
        }
      ],
      kotlin: [
        {
          title: 'Kotlin Official Documentation',
          type: 'documentation',
          url: 'https://kotlinlang.org/docs/',
          estimatedHours: 12,
          difficulty: 'intermediate'
        },
        {
          title: 'Kotlin for Android Development',
          type: 'course',
          url: 'https://developer.android.com/kotlin',
          estimatedHours: 25,
          difficulty: 'intermediate'
        }
      ],
      java: [
        {
          title: 'Java Official Documentation',
          type: 'documentation',
          url: 'https://docs.oracle.com/en/java/',
          estimatedHours: 15,
          difficulty: 'intermediate'
        }
      ]
    };

    return resources[lang.toLowerCase()] || [
      {
        title: `${lang} Official Documentation`,
        type: 'documentation',
        url: `https://${lang.toLowerCase()}.org/docs`,
        estimatedHours: 15,
        difficulty: 'intermediate'
      }
    ];
  }

  private static getFrameworkResources(framework: string): LearningResource[] {
    const resources: Record<string, LearningResource[]> = {
      react: [
        {
          title: 'React Official Tutorial',
          type: 'tutorial',
          url: 'https://react.dev/learn',
          estimatedHours: 10,
          difficulty: 'beginner'
        },
        {
          title: 'Advanced React Patterns',
          type: 'course',
          url: 'https://advancedreact.com/',
          estimatedHours: 20,
          difficulty: 'advanced'
        }
      ],
      django: [
        {
          title: 'Django for Beginners',
          type: 'book',
          url: 'https://djangoforbeginners.com/',
          estimatedHours: 20,
          difficulty: 'beginner'
        }
      ],
      fastapi: [
        {
          title: 'FastAPI Full Stack',
          type: 'tutorial',
          url: 'https://fastapi.tiangolo.com/',
          estimatedHours: 15,
          difficulty: 'intermediate'
        }
      ]
    };

    return resources[framework.toLowerCase()] || [
      {
        title: `${framework} Official Documentation`,
        type: 'documentation',
        url: `https://${framework.toLowerCase()}.org`,
        estimatedHours: 15,
        difficulty: 'intermediate'
      }
    ];
  }

  private static getDatabaseResources(db: string): LearningResource[] {
    const resources: Record<string, LearningResource[]> = {
      postgres: [
        {
          title: 'PostgreSQL Official Documentation',
          type: 'documentation',
          url: 'https://www.postgresql.org/docs/',
          estimatedHours: 10,
          difficulty: 'intermediate'
        }
      ],
      mongodb: [
        {
          title: 'MongoDB University',
          type: 'course',
          url: 'https://learn.mongodb.com/',
          estimatedHours: 15,
          difficulty: 'beginner'
        }
      ]
    };

    return resources[db.toLowerCase()] || [
      {
        title: `${db} Official Docs`,
        type: 'documentation',
        url: `https://${db.toLowerCase()}.org`,
        estimatedHours: 10,
        difficulty: 'intermediate'
      }
    ];
  }

  private static getDomainResources(domain: string): LearningResource[] {
    const resources: Record<string, LearningResource[]> = {
      fintech: [
        {
          title: 'Fintech Fundamentals Course',
          type: 'course',
          url: 'https://www.coursera.org/learn/blockchain-basics',
          estimatedHours: 20,
          difficulty: 'intermediate'
        }
      ],
      ml: [
        {
          title: 'Fast.ai - Practical Deep Learning',
          type: 'course',
          url: 'https://www.fast.ai/',
          estimatedHours: 40,
          difficulty: 'intermediate'
        }
      ]
    };

    return resources[domain.toLowerCase()] || [];
  }

  /**
   * Helper functions for roadmap generation
   */
  private static estimateTeamSize(stack: StackDetectionResult): number {
    let size = 2; // Base: lead + developer

    if (stack.specializations.includes('microservices')) size += 1;
    if (stack.specializations.includes('distributed')) size += 1;
    if (stack.domains.includes('ml')) size += 1;
    if (stack.domains.includes('security')) size += 1;

    return size;
  }

  private static generateMilestones(durationDays: number): string[] {
    const milestones: string[] = [];
    const weeksPerMilestone = Math.max(1, Math.floor(durationDays / 28));

    for (let i = weeksPerMilestone * 7; i <= durationDays; i += weeksPerMilestone * 7) {
      const weekNum = Math.ceil(i / 7);
      milestones.push(`Week ${weekNum}: ${['Foundation', 'Core Features', 'Integration', 'Testing', 'Deployment'][Math.min(4, Math.floor(weekNum / 2))]}`);
    }

    return milestones;
  }

  private static generateSuccessMetrics(_epicName: string): string[] {
    return [
      'All tickets completed and tested',
      'Code review approval from lead',
      'No critical issues remaining',
      '> 80% test coverage for new code'
    ];
  }

  private static generateAcceptanceCriteria(_ticketTitle: string): string[] {
    return [
      'Code is written and passes linting',
      'Unit tests written with >80% coverage',
      'Code review completed and approved',
      'Merged to main branch',
      'Documentation updated'
    ];
  }

  private static extractChallenges(stack: StackDetectionResult, _description: string): string[] {
    const challenges: string[] = [];

    if (stack.domains.includes('ml')) challenges.push('Model training and optimization');
    if (stack.specializations.includes('distributed')) challenges.push('Distributed system consistency');
    if (stack.specializations.includes('scaling')) challenges.push('Horizontal scaling architecture');
    if (stack.domains.includes('security')) challenges.push('Security implementation and compliance');
    if (stack.domains.includes('fintech')) challenges.push('Transaction consistency and auditability');

    return challenges.length > 0 ? challenges : ['High code quality standards', 'Performance optimization', 'Testing coverage'];
  }

  private static extractSuccessCriteria(_description: string, _stack: StackDetectionResult): string[] {
    return [
      'All epics completed within timeline',
      '80%+ test coverage achieved',
      'Performance benchmarks met',
      'Zero critical security issues',
      'Smooth deployment to production',
      'Complete documentation'
    ];
  }

  private static generateIntegrations(stack: StackDetectionResult, description: string): string[] {
    const integrations: string[] = [];

    if (stack.platforms.includes('aws')) integrations.push('AWS Services (S3, Lambda, RDS)');
    if (stack.platforms.includes('gcp')) integrations.push('Google Cloud Platform');
    if (stack.platforms.includes('azure')) integrations.push('Microsoft Azure Services');
    if (description.toLowerCase().includes('payment')) integrations.push('Payment Gateway (Stripe/PayPal)');
    if (description.toLowerCase().includes('email')) integrations.push('Email Service (SendGrid/Mailgun)');
    if (description.toLowerCase().includes('sms')) integrations.push('SMS Service (Twilio)');

    return integrations.length > 0 ? integrations : ['REST API Integration', 'OAuth 2.0'];
  }

  private static generateNonFunctionalRequirements(stack: StackDetectionResult): string[] {
    const requirements: string[] = [
      'High availability (99.9% uptime)',
      'Low latency (<500ms p99)',
      'Horizontal scalability',
      'Data consistency and ACID compliance'
    ];

    if (stack.domains.includes('security')) requirements.push('End-to-end encryption');
    if (stack.specializations.includes('scaling')) requirements.push('Auto-scaling capability');

    return requirements;
  }

  private static generateSecurityConsiderations(stack: StackDetectionResult, description: string): string[] {
    const considerations: string[] = [
      'Input validation and sanitization',
      'SQL injection prevention',
      'XSS prevention',
      'CSRF protection',
      'Rate limiting and DDoS protection',
      'Secure password hashing (bcrypt/Argon2)',
      'JWT/OAuth 2.0 implementation'
    ];

    if (stack.domains.includes('fintech')) {
      considerations.push('PCI DSS compliance');
      considerations.push('Encrypted payment data handling');
    }

    if (description.toLowerCase().includes('user data')) {
      considerations.push('GDPR/CCPA compliance');
      considerations.push('Data anonymization');
    }

    return considerations;
  }

  private static generateScalingStrategy(stack: StackDetectionResult): string {
    if (stack.specializations.includes('microservices')) {
      return 'Horizontal scaling with containerized microservices, load balancing, and service mesh for inter-service communication.';
    }

    if (stack.platforms.includes('kubernetes')) {
      return 'Kubernetes-based auto-scaling with pod replication and load distribution across multiple nodes.';
    }

    return 'Database read replicas with caching layer (Redis), application server horizontal scaling, and CDN for static content.';
  }

  private static generateMinimalArchitecture(): ArchitectureBlueprint {
    return {
      overview: 'Standard three-tier architecture with API layer, business logic, and data persistence.',
      modules: [],
      dataModels: [],
      apis: [],
      integrations: [],
      nonFunctionalRequirements: [],
      securityConsiderations: [],
      scalingStrategy: ''
    };
  }
}
