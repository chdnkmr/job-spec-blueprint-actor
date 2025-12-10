# Deployment Guide

Complete guide for deploying the Job Spec → Blueprint Generator Actor to production.

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional, for containerized deployment)
- Apify CLI (for Apify platform deployment)

## Local Development

### 1. Setup
```bash
cd /Users/chandankumar/VS_Workspace/ApifyActor
npm install
```

### 2. Build
```bash
npm run build
```

### 3. Run Locally
```bash
npm start
```

## Testing Locally

### With Text Input
```bash
# Create test input
cp sample-input-text.json test-input.json

# Run with input
APIFY_INPUT_FILE=test-input.json npm start
```

### With URL Input
```bash
cp sample-input-url.json test-input.json
APIFY_INPUT_FILE=test-input.json npm start
```

### Custom Input
Create `test-input.json`:
```json
{
  "jobPostingText": "Your job description here...",
  "companyName": "Your Company",
  "roadmapDurationDays": 60,
  "outputFormat": "both"
}
```

Then run:
```bash
APIFY_INPUT_FILE=test-input.json npm start
```

## Docker Deployment

### Build Docker Image
```bash
docker build -t job-blueprint-actor:1.0 .
```

### Run in Docker
```bash
docker run \
  -e APIFY_INPUT_FILE=/tmp/input.json \
  -v $(pwd)/input.json:/tmp/input.json \
  -v $(pwd)/output:/tmp/output \
  job-blueprint-actor:1.0
```

## Apify Platform Deployment

### 1. Install Apify CLI
```bash
npm install -g apify-cli
```

### 2. Login to Apify
```bash
apify login
```

### 3. Create Actor (First Time)
```bash
apify create
# Follow the prompts
```

### 4. Push to Apify
```bash
apify push
```

### 5. View in Apify Console
```bash
apify open
```

### 6. Set Environment Variables (in Apify Console)
```
AI_PROVIDER=local
OPENAI_API_KEY=(optional, if using OpenAI)
ANTHROPIC_API_KEY=(optional, if using Anthropic)
LOG_LEVEL=info
```

### 7. Configure Actor Settings
In Apify Console:
- Set memory: 512 MB - 4 GB (default: 1 GB)
- Enable timeout: 60-300 seconds
- Set categories: Productivity, Utilities
- Add tags: job-posting, roadmap, ai-analysis, blueprint

## GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Apify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Lint
        run: npm run lint
      
      - name: Deploy to Apify
        run: |
          npm install -g apify-cli
          apify login --token ${{ secrets.APIFY_TOKEN }}
          apify push
```

## Docker Hub Deployment

### 1. Build Image
```bash
docker build -t yourusername/job-blueprint-actor:1.0 .
```

### 2. Push to Docker Hub
```bash
docker login
docker push yourusername/job-blueprint-actor:1.0
```

### 3. Deploy to Container Service
For AWS ECS, Google Cloud Run, Azure Container Instances, etc., use your usual deployment process with the image URL.

## Kubernetes Deployment

Create `k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: job-blueprint-actor
spec:
  replicas: 1
  selector:
    matchLabels:
      app: job-blueprint-actor
  template:
    metadata:
      labels:
        app: job-blueprint-actor
    spec:
      containers:
      - name: actor
        image: yourusername/job-blueprint-actor:1.0
        ports:
        - containerPort: 3000
        env:
        - name: AI_PROVIDER
          value: "local"
        - name: LOG_LEVEL
          value: "info"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
```

Deploy:
```bash
kubectl apply -f k8s-deployment.yaml
```

## AWS Lambda Deployment

### 1. Create Lambda Function
```bash
# Create deployment package
npm run build
zip -r lambda.zip dist node_modules

# Upload to AWS Lambda
# Runtime: Node.js 18.x
# Handler: dist/main.handler
# Memory: 512 MB
# Timeout: 300 seconds
```

### 2. Create API Gateway Trigger
- Create API Gateway
- Create POST method
- Map to Lambda function
- Deploy

## Production Checklist

- [ ] Build successful with `npm run build`
- [ ] No TypeScript errors
- [ ] ESLint passes with `npm run lint`
- [ ] Test with sample inputs
- [ ] Review error handling
- [ ] Set environment variables
- [ ] Configure memory limits
- [ ] Set timeout values
- [ ] Enable logging
- [ ] Configure monitoring
- [ ] Test with diverse job descriptions
- [ ] Verify output formats
- [ ] Check performance metrics
- [ ] Review security settings

## Performance Optimization

### For Speed
```bash
# Disable unnecessary features
APIFY_HEADLESS=1 npm start
```

### For Reliability
```bash
# Enable detailed logging
LOG_LEVEL=debug npm start
```

### Memory Management
In `actor.json`:
```json
"platform": {
  "minMemMbytes": 512,
  "maxMemMbytes": 2048
}
```

## Monitoring & Logging

### Apify Console
- View runs and logs
- Monitor performance
- Track errors
- Manage schedules

### CloudWatch (if using AWS)
```bash
# View logs
aws logs tail /aws/lambda/job-blueprint-actor --follow
```

### Local Logs
```bash
tail -f storage/logs/actor.log
```

## Scaling

### Apify Platform
- Automatic scaling built-in
- Configure max parallelization
- Set run timeout limits

### Docker/Kubernetes
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: job-blueprint-actor-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: job-blueprint-actor
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Rollback Strategy

### Git-based
```bash
git revert COMMIT_HASH
apify push
```

### Docker-based
```bash
docker pull yourusername/job-blueprint-actor:previous-version
# Update deployment
```

## Troubleshooting

### Actor fails to start
1. Check logs: `apify logs`
2. Verify input schema
3. Check memory allocation
4. Review error message

### No output generated
1. Check job description content
2. Verify input format
3. Review stack detection
4. Check log for errors

### Memory issues
1. Increase memory: Edit `actor.json`
2. Optimize parsing: Reduce input size
3. Stream output: For large datasets

### Performance issues
1. Enable caching
2. Optimize regex patterns
3. Use node --max-old-space-size=4096
4. Profile with `--prof` flag

## Maintenance

### Weekly
- Monitor error rates
- Check performance metrics
- Review logs for patterns

### Monthly
- Update dependencies
- Run security audit: `npm audit`
- Review performance trends

### Quarterly
- Major version updates
- Feature enhancements
- Performance optimization

## Backup & Recovery

### Backup Configuration
```bash
# Backup actor configuration
apify export actor-id > backup.json
```

### Restore Configuration
```bash
apify import < backup.json
```

## Versioning

### Update Version
Edit `package.json` and `actor.json`:
```json
"version": "1.1.0"
```

### Tag Release
```bash
git tag -a v1.1.0 -m "Add new features"
git push origin v1.1.0
```

## Security Considerations

1. **Secrets Management**
   - Store API keys in environment variables
   - Use Apify secrets feature
   - Rotate keys regularly

2. **Input Validation**
   - Validate all inputs against schema
   - Sanitize before processing
   - Prevent injection attacks

3. **Error Messages**
   - Don't expose sensitive information
   - Log detailed errors internally
   - Return safe error messages

4. **Rate Limiting**
   - Implement rate limiting if exposed via API
   - Monitor for abuse
   - Set reasonable timeouts

## Cost Optimization

### Apify Platform
- Use free tier for development
- Monitor computing unit usage
- Optimize run duration
- Schedule off-peak runs

### Cloud Services
- Use spot instances
- Scale down during off-hours
- Batch process requests
- Cache results

## Documentation Updates

When deploying changes:
1. Update README.md if needed
2. Update EXTENSION_GUIDE.md if adding features
3. Update EXAMPLE_OUTPUT.md if changing output
4. Update version numbers
5. Create release notes

## Support & Escalation

If issues arise:
1. Check logs in Apify console
2. Review recent changes
3. Test with sample inputs
4. Check resource allocation
5. Verify environment variables

---

**Deployment Complete!** 🚀

Your Actor is now ready for production use.
