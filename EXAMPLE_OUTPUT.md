# Example Output

This file shows example outputs from the Job Spec → Blueprint Generator Actor.

## Input Example

```json
{
  "jobPostingText": "Senior Full-Stack Engineer - Python & React\n\nAbout the Role:\nWe're looking for a talented Senior Full-Stack Engineer to join our growing team. You'll be responsible for designing and implementing scalable web applications using Python and React.\n\nResponsibilities:\n- Design and develop RESTful APIs using Python and FastAPI\n- Build responsive user interfaces with React and TypeScript\n- Optimize database queries and implement caching strategies\n- Lead code reviews and mentor junior developers\n\nRequired Skills:\n- 5+ years of professional experience\n- Expert-level Python development\n- Advanced React and TypeScript knowledge\n- SQL and NoSQL database design\n- AWS or cloud platform experience\n- Docker and Kubernetes\n\nBenefits:\n- Competitive salary\n- Remote work options\n- Professional development budget",
  "companyName": "TechStartup",
  "jobTitle": "Senior Full-Stack Engineer",
  "roadmapDurationDays": 60,
  "outputFormat": "markdown"
}
```

## Output Example (Markdown)

```markdown
# Project Blueprint: Senior Full-Stack Engineer

**Generated**: 12/10/2024, 8:30 PM
**Company**: TechStartup
**Seniority Level**: senior
**Estimated Duration**: 60 days

## 📋 Summary

Project roadmap for Senior Full-Stack Engineer @ TechStartup. Total estimated duration: 60 days.

### Key Technologies

- python
- typescript
- react
- postgres
- aws
- docker
- kubernetes

### Main Challenges

- Distributed system consistency
- Horizontal scaling architecture
- High code quality standards
- Performance optimization

### Success Criteria

- All epics completed within timeline
- 80%+ test coverage achieved
- Performance benchmarks met
- Zero critical security issues
- Smooth deployment to production
- Complete documentation

## 🗺️ Project Roadmap

**Total Duration**: 60 days
**Start Date**: 2024-12-10
**Estimated Team Size**: 3 people

### Key Milestones

- Week 2: Foundation
- Week 4: Core Features
- Week 6: Integration
- Week 8: Testing
- Week 9+: Deployment

### Epics & Tickets

#### EPIC-1: Project Setup & Architecture Foundation

**Duration**: Week 1-2
**Description**: Initialize project structure, set up development environment, and establish architectural foundation

**Goals**:
- Set up development environment and toolchain
- Establish project repository and CI/CD pipeline
- Create architectural design documents
- Set up database schema

**Success Metrics**:
- All tickets completed and tested
- Code review approval from lead
- No critical issues remaining
- > 80% test coverage for new code

**Tickets**:
- **TICKET-abc1**: Initialize project repository and CI/CD pipeline (5 pts, critical)
  - Type: technical-debt
  - Criteria: Code is written and passes linting; Unit tests written with >80% coverage
- **TICKET-def2**: Set up development environment documentation (3 pts, high)
  - Type: documentation
  - Criteria: Code is written and passes linting; Unit tests written with >80% coverage
- **TICKET-ghi3**: Configure linting, formatting, and pre-commit hooks (3 pts, high)
  - Type: technical-debt
  - Criteria: Code is written and passes linting; Unit tests written with >80% coverage
- **TICKET-jkl4**: Design and document system architecture (8 pts, critical)
  - Type: documentation
  - Criteria: Code is written and passes linting; Unit tests written with >80% coverage

#### EPIC-2: Core Features Implementation - Phase 1

**Duration**: Week 3-4
**Description**: Build foundational features and core business logic

[... more epics follow similar pattern ...]

## 🏗️ Architecture Blueprint

A scalable, modular architecture designed for the domain(s) using python, typescript with react frameworks and postgres databases.

### Architecture Modules

**API Gateway**
- Responsibility: Route requests, handle authentication, rate limiting, and request validation
- Technologies: HTTP, REST/GraphQL
- Dependencies: Auth Service

**Authentication & Authorization**
- Responsibility: User authentication, JWT/OAuth management, and permission enforcement
- Technologies: JWT, OAuth 2.0, RBAC

**Core Business Logic**
- Responsibility: Implement domain-specific business rules and workflows
- Technologies: react
- Dependencies: Data Access Layer, External Services

**Data Access Layer**
- Responsibility: Database operations, caching, and query optimization
- Technologies: postgres

### Data Models

**User**
| Field | Type |
|-------|------|
| id | UUID (Primary Key) |
| email | String (Unique) |
| passwordHash | String |
| firstName | String |
| lastName | String |
| role | Enum (admin, user, moderator) |
| createdAt | Timestamp |
| updatedAt | Timestamp |
| isActive | Boolean |

- Relationships: has many Profiles, has many Sessions
- Indexes: email, createdAt

**Session**
| Field | Type |
|-------|------|
| id | UUID (Primary Key) |
| userId | UUID (Foreign Key) |
| token | String |
| expiresAt | Timestamp |
| createdAt | Timestamp |
| lastActivityAt | Timestamp |

- Relationships: belongs to User

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | \`/api/auth/register\` | Register a new user |
| POST | \`/api/auth/login\` | User login |
| GET | \`/api/users/:userId\` | Get user profile |
| PUT | \`/api/users/:userId\` | Update user profile |
| GET | \`/api/health\` | Health check endpoint |

### Non-Functional Requirements

- High availability (99.9% uptime)
- Low latency (<500ms p99)
- Horizontal scalability
- Data consistency and ACID compliance
- Auto-scaling capability

### Security Considerations

- Input validation and sanitization
- SQL injection prevention
- XSS prevention
- CSRF protection
- Rate limiting and DDoS protection
- Secure password hashing (bcrypt/Argon2)
- JWT/OAuth 2.0 implementation

### Scaling Strategy

Kubernetes-based auto-scaling with pod replication and load distribution across multiple nodes.

## ✅ Test Plan

Comprehensive testing strategy including unit tests, integration tests, and end-to-end tests. Target 80%+ code coverage with focus on critical paths.

### Unit Testing

Aim for 80%+ code coverage. Use Jest/Vitest for JS, pytest for Python, or JUnit for Java.

### Integration Testing

- API endpoint integration tests with mock databases
- Database transaction rollback scenarios
- External API integration failures and retries
- Cache invalidation and refresh
- Multi-service communication (if microservices)
- Authentication and authorization flows

### End-to-End Testing

- Complete user registration and login flow
- Core business process workflows
- Payment/transaction flows (if applicable)
- Error handling and recovery
- Performance under load
- Database consistency checks

### Performance Targets

| Metric | Target |
|--------|--------|
| API response time (p99) | < 500ms |
| Database query latency (p99) | < 200ms |
| Authentication latency | < 100ms |
| Throughput | > 1000 requests/second |

### Security Testing

- SQL injection prevention
- XSS prevention
- CSRF protection
- Authentication bypass attempts
- Authorization boundary testing
- Rate limiting validation

## 📚 Learning Plan

Customized learning plan for Senior Full-Stack Engineer. Estimated 105 hours of learning. Covers python, typescript with react frameworks and domain knowledge.

### Recommended Learning Path

Start with python fundamentals, then progress to react framework deep dive, followed by domain-specific patterns in software engineering.

### Learning Phases

#### Phase 1: Foundation & Setup (1-2 weeks)

**Focus Areas**:
- Project setup and development environment
- Version control and CI/CD basics
- Core language features and best practices

**Milestones**:
- Local dev environment running
- First commit to repo
- Simple unit test passing

#### Phase 2: Core Concepts (2-3 weeks)

**Focus Areas**:
- Selected frameworks deep dive
- Database design and queries
- API design principles
- Authentication and authorization

**Milestones**:
- Complete framework course
- Design database schema
- Implement first API

#### Phase 3: Domain Expertise (2-4 weeks)

**Focus Areas**:
- Domain-specific patterns
- Testing strategies
- Performance optimization
- Security best practices

**Milestones**:
- 80% test coverage
- Performance benchmarks established
- Security audit passed

### Skill Gaps & Resources

**python Advanced Proficiency** [critical]
- Current Level: 0/10 → Target: 8/10
- Estimated Hours: 40
- Resources:
  - [Python Official Docs](https://docs.python.org/3/) - documentation (10h, intermediate)
  - [Real Python Tutorials](https://realpython.com/) - tutorial (20h, intermediate)

**TypeScript Advanced Proficiency** [critical]
- Current Level: 0/10 → Target: 8/10
- Estimated Hours: 40
- Resources:
  - [TypeScript Handbook](https://www.typescriptlang.org/docs/) - documentation (10h, intermediate)
  - [Advanced TypeScript Course](https://www.udemy.com/course/advanced-typescript/) - course (15h, advanced)

**React Deep Dive** [high]
- Current Level: 0/10 → Target: 7/10
- Estimated Hours: 30
- Resources:
  - [React Official Tutorial](https://react.dev/learn) - tutorial (10h, beginner)
  - [Advanced React Patterns](https://advancedreact.com/) - course (20h, advanced)

**PostgreSQL Database Design** [high]
- Current Level: 0/10 → Target: 7/10
- Estimated Hours: 20
- Resources:
  - [PostgreSQL Official Documentation](https://www.postgresql.org/docs/) - documentation (10h, intermediate)

**AWS Domain Expertise** [high]
- Current Level: 0/10 → Target: 6/10
- Estimated Hours: 25
- Resources:
  - [AWS Official Docs](https://aws.org) - documentation (10h, intermediate)

**Docker Deep Dive** [high]
- Current Level: 0/10 → Target: 7/10
- Estimated Hours: 20
- Resources:
  - [Docker Official Docs](https://docker.org) - documentation (10h, intermediate)

**Kubernetes Domain Expertise** [high]
- Current Level: 0/10 → Target: 6/10
- Estimated Hours: 25
- Resources:
  - [Kubernetes Official Docs](https://kubernetes.org) - documentation (10h, intermediate)

```

## JSON Output Sample

```json
{
  "metadata": {
    "generatedAt": "2024-12-10T20:30:45.123Z",
    "jobTitle": "Senior Full-Stack Engineer",
    "company": "TechStartup",
    "seniority": "senior",
    "estimatedDuration": 60
  },
  "roadmap": {
    "projectName": "Senior Full-Stack Engineer @ TechStartup",
    "description": "Project roadmap for Senior Full-Stack Engineer @ TechStartup. Total estimated duration: 60 days.",
    "totalDuration": 60,
    "startDate": "2024-12-10",
    "estimatedTeamSize": 3,
    "keyMilestones": ["Week 2: Foundation", "Week 4: Core Features", "Week 6: Integration", "Week 8: Testing", "Week 9+: Deployment"],
    "epics": [
      {
        "id": "EPIC-1",
        "name": "Project Setup & Architecture Foundation",
        "description": "Initialize project structure, set up development environment, and establish architectural foundation",
        "duration": "Week 1-2",
        "weekNumber": 1,
        "goals": ["Set up development environment and toolchain", "Establish project repository and CI/CD pipeline", "Create architectural design documents", "Set up database schema"],
        "successMetrics": ["All tickets completed and tested", "Code review approval from lead", "No critical issues remaining", "> 80% test coverage for new code"],
        "tickets": [
          {
            "id": "TICKET-xyz123",
            "title": "Initialize project repository and CI/CD pipeline",
            "description": "Implement: Initialize project repository and CI/CD pipeline",
            "storyPoints": 5,
            "priority": "critical",
            "taskType": "technical-debt",
            "acceptanceCriteria": ["Code is written and passes linting", "Unit tests written with >80% coverage", "Code review completed and approved", "Merged to main branch", "Documentation updated"]
          }
        ]
      }
    ]
  },
  "summary": {
    "keyTechnologies": ["python", "typescript", "react", "postgres", "aws", "docker", "kubernetes"],
    "mainChallenges": ["Distributed system consistency", "Horizontal scaling architecture", "High code quality standards"],
    "successCriteria": ["All epics completed within timeline", "80%+ test coverage achieved", "Performance benchmarks met", "Zero critical security issues", "Smooth deployment to production", "Complete documentation"]
  }
}
```

## CSV Output Sample

```csv
Epic ID,Epic Name,Ticket ID,Title,Type,Priority,Story Points,Acceptance Criteria
EPIC-1,Project Setup & Architecture Foundation,TICKET-1,Initialize project repository and CI/CD pipeline,technical-debt,critical,5,"Code is written and passes linting; Unit tests written with >80% coverage; Code review completed and approved; Merged to main branch; Documentation updated"
EPIC-1,Project Setup & Architecture Foundation,TICKET-2,Set up development environment documentation,documentation,high,3,"Code is written and passes linting; Unit tests written with >80% coverage; Code review completed and approved; Merged to main branch; Documentation updated"
EPIC-1,Project Setup & Architecture Foundation,TICKET-3,Configure linting and formatting,technical-debt,high,3,"Code is written and passes linting; Unit tests written with >80% coverage; Code review completed and approved; Merged to main branch; Documentation updated"
EPIC-2,Core Features Implementation - Phase 1,TICKET-4,Implement user authentication system,feature,critical,8,"Code is written and passes linting; Unit tests written with >80% coverage; Code review completed and approved; Merged to main branch; Documentation updated"
EPIC-2,Core Features Implementation - Phase 1,TICKET-5,Build authorization and role management,feature,critical,5,"Code is written and passes linting; Unit tests written with >80% coverage; Code review completed and approved; Merged to main branch; Documentation updated"
```

## Summary Output Sample

```json
{
  "type": "summary",
  "jobTitle": "Senior Full-Stack Engineer",
  "company": "TechStartup",
  "seniority": "senior",
  "technologies": ["python", "typescript", "react", "postgres", "aws", "docker", "kubernetes"],
  "challenges": ["Distributed system consistency", "Horizontal scaling architecture", "High code quality standards"],
  "successCriteria": ["All epics completed within timeline", "80%+ test coverage achieved", "Performance benchmarks met", "Zero critical security issues", "Smooth deployment to production", "Complete documentation"],
  "estimatedDuration": 60,
  "totalTickets": 28,
  "learningHours": 105
}
```

---

These outputs demonstrate the comprehensive nature of the generated blueprints. The Actor produces structured, actionable artifacts that can be immediately used for project planning, onboarding, or skill development.
