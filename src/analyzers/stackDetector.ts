export interface StackDetectionResult {
  languages: string[];
  frameworks: string[];
  databases: string[];
  platforms: string[];
  domains: string[];
  specializations: string[];
  estimatedSeniority: 'junior' | 'mid' | 'senior';
}

export class StackDetector {
  private static readonly STACK_PATTERNS: Record<string, string[]> = {
    // Languages
    python: ['python', 'py'],
    typescript: ['typescript', 'ts', 'tsx'],
    javascript: ['javascript', 'js', 'nodejs', 'node.js'],
    kotlin: ['kotlin', 'kt'],
    java: ['java ', 'jvm'],
    csharp: ['c#', 'csharp', '.net'],
    swift: ['swift', 'ios', 'macos'],
    rust: ['rust', 'cargo'],
    golang: ['golang', 'go ', 'goland'],
    cpp: ['c++', 'cpp'],
    cppbuild: ['cmake', 'make'],

    // Frameworks
    react: ['react', 'reactjs'],
    vue: ['vue', 'vuejs'],
    angular: ['angular'],
    nextjs: ['next.js', 'nextjs'],
    fastapi: ['fastapi'],
    django: ['django'],
    springboot: ['spring boot', 'springboot'],
    express: ['express.js', 'expressjs'],
    nestjs: ['nestjs', 'nest.js'],
    flutter: ['flutter', 'dart'],

    // Databases
    postgres: ['postgres', 'postgresql'],
    mysql: ['mysql', 'mariadb'],
    mongodb: ['mongodb', 'mongo'],
    redis: ['redis'],
    elasticsearch: ['elasticsearch'],
    dynamodb: ['dynamodb', 'dynamodb '],
    firestore: ['firestore'],
    graphql: ['graphql'],

    // Platforms
    aws: ['aws ', 'amazon web', 'ec2', 's3', 'lambda', 'sqs'],
    gcp: ['google cloud', 'gcp'],
    azure: ['azure', 'microsoft azure'],
    docker: ['docker'],
    kubernetes: ['kubernetes', 'k8s'],
    android: ['android'],
    ios: ['ios', 'iphone'],
    webdev: ['web development', 'frontend', 'backend'],

    // Domains
    fintech: ['fintech', 'financial', 'banking', 'crypto', 'blockchain'],
    healthcare: ['healthcare', 'medical', 'health', 'hipaa'],
    ecommerce: ['ecommerce', 'e-commerce', 'marketplace'],
    ml: ['machine learning', 'ml', 'ai', 'nlp', 'deep learning', 'neural'],
    iot: ['iot', 'internet of things', 'embedded'],
    ble: ['ble', 'bluetooth low energy'],
    realtime: ['real-time', 'realtime', 'websocket'],
    security: ['security', 'encryption', 'auth'],
    devops: ['devops', 'ci/cd', 'infrastructure'],
    analytics: ['analytics', 'data engineering', 'etl'],

    // Specializations
    microservices: ['microservices', 'microservice architecture'],
    distributed: ['distributed', 'distributed systems', 'consensus'],
    scaling: ['scaling', 'scalable', 'high availability'],
    performance: ['performance', 'optimization', 'latency'],
  };

  /**
   * Detect technology stack from job description
   */
  static detectStack(jobDescription: string, requirements: string[]): StackDetectionResult {
    const lowerDesc = jobDescription.toLowerCase();
    const lowerReqs = requirements.map(r => r.toLowerCase()).join(' ');
    const fullText = `${lowerDesc} ${lowerReqs}`;

    const result: StackDetectionResult = {
      languages: [],
      frameworks: [],
      databases: [],
      platforms: [],
      domains: [],
      specializations: [],
      estimatedSeniority: 'mid'
    };

    // Detect each category
    for (const [key, patterns] of Object.entries(this.STACK_PATTERNS)) {
      for (const pattern of patterns) {
        if (fullText.includes(pattern)) {
          const category = this.categorizeKeyword(key);
          if (category && !result[category as keyof StackDetectionResult].includes(key)) {
            (result[category as keyof StackDetectionResult] as string[]).push(key);
          }
          break; // Found this keyword, move to next
        }
      }
    }

    // Detect seniority level
    result.estimatedSeniority = this.detectSeniority(fullText);

    return result;
  }

  /**
   * Categorize detected keyword
   */
  private static categorizeKeyword(keyword: string): keyof StackDetectionResult | null {
    const categories: Record<string, keyof StackDetectionResult> = {
      python: 'languages',
      typescript: 'languages',
      javascript: 'languages',
      kotlin: 'languages',
      java: 'languages',
      csharp: 'languages',
      swift: 'languages',
      rust: 'languages',
      golang: 'languages',
      cpp: 'languages',
      cppbuild: 'platforms',
      react: 'frameworks',
      vue: 'frameworks',
      angular: 'frameworks',
      nextjs: 'frameworks',
      fastapi: 'frameworks',
      django: 'frameworks',
      springboot: 'frameworks',
      express: 'frameworks',
      nestjs: 'frameworks',
      flutter: 'frameworks',
      postgres: 'databases',
      mysql: 'databases',
      mongodb: 'databases',
      redis: 'databases',
      elasticsearch: 'databases',
      dynamodb: 'databases',
      firestore: 'databases',
      graphql: 'databases',
      aws: 'platforms',
      gcp: 'platforms',
      azure: 'platforms',
      docker: 'platforms',
      kubernetes: 'platforms',
      android: 'platforms',
      ios: 'platforms',
      webdev: 'platforms',
      fintech: 'domains',
      healthcare: 'domains',
      ecommerce: 'domains',
      ml: 'domains',
      iot: 'domains',
      ble: 'domains',
      realtime: 'domains',
      security: 'domains',
      devops: 'domains',
      analytics: 'domains',
      microservices: 'specializations',
      distributed: 'specializations',
      scaling: 'specializations',
      performance: 'specializations',
    };

    return categories[keyword] || null;
  }

  /**
   * Detect seniority level from job description
   */
  private static detectSeniority(fullText: string): 'junior' | 'mid' | 'senior' {
    const juniorKeywords = ['entry-level', 'junior', 'graduate', 'newly', 'less than 2 years'];
    const seniorKeywords = ['senior', '5+ years', '7+ years', 'principal', 'lead', 'architect', 'expert'];

    const hasJunior = juniorKeywords.some(kw => fullText.includes(kw));
    const hasSenior = seniorKeywords.some(kw => fullText.includes(kw));

    if (hasSenior) return 'senior';
    if (hasJunior) return 'junior';
    return 'mid';
  }
}
