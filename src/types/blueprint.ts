export interface Ticket {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  acceptanceCriteria: string[];
  dependencies?: string[];
  taskType: 'feature' | 'bug' | 'technical-debt' | 'documentation';
}

export interface Epic {
  id: string;
  name: string;
  description: string;
  duration: string;
  weekNumber: number;
  tickets: Ticket[];
  goals: string[];
  successMetrics: string[];
}

export interface ProjectRoadmap {
  projectName: string;
  description: string;
  totalDuration: number;
  startDate: string;
  epics: Epic[];
  estimatedTeamSize: number;
  keyMilestones: string[];
}

export interface ArchitectureBlueprint {
  overview: string;
  modules: ArchitectureModule[];
  dataModels: DataModel[];
  apis: ApiEndpoint[];
  integrations: string[];
  nonFunctionalRequirements: string[];
  securityConsiderations: string[];
  scalingStrategy: string;
}

export interface ArchitectureModule {
  name: string;
  responsibility: string;
  dependencies: string[];
  technologies: string[];
}

export interface DataModel {
  entity: string;
  fields: Record<string, string>;
  relationships: string[];
  indexes?: string[];
}

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  requestBody?: Record<string, string>;
  responseBody?: Record<string, string>;
}

export interface TestPlan {
  overview: string;
  unitTestCoverage: string;
  integrationTestScenarios: string[];
  e2eTestScenarios: string[];
  performanceTargets: Record<string, string>;
  loadTestingStrategy: string;
  securityTestCases: string[];
}

export interface SkillGap {
  skill: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  currentLevel: number; // 0-10
  targetLevel: number; // 0-10
  estimatedHours: number;
  resources: LearningResource[];
}

export interface LearningResource {
  title: string;
  type: 'course' | 'documentation' | 'book' | 'tutorial' | 'practice';
  url: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningPlan {
  overview: string;
  estimatedTotalHours: number;
  learningPhases: LearningPhase[];
  skillGaps: SkillGap[];
  recommendedPath: string;
}

export interface LearningPhase {
  phase: number;
  name: string;
  duration: string;
  focus: string[];
  milestones: string[];
}

export interface ProjectBlueprint {
  metadata: {
    generatedAt: string;
    jobTitle: string;
    company?: string;
    seniority: string;
    estimatedDuration: number;
  };
  roadmap: ProjectRoadmap;
  architecture: ArchitectureBlueprint;
  testPlan: TestPlan;
  learningPlan: LearningPlan;
  summary: {
    keyTechnologies: string[];
    mainChallenges: string[];
    successCriteria: string[];
  };
}
