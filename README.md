# AWS Personal Projects

[![DevOps CI/CD Pipeline](https://github.com/aniketnandi/AWS-Personal-Projects/actions/workflows/devops-pipeline.yml/badge.svg)](https://github.com/aniketnandi/AWS-Personal-Projects/actions/workflows/devops-pipeline.yml) [![Serverless CRUD API](https://github.com/aniketnandi/AWS-Personal-Projects/actions/workflows/crud-api.yml/badge.svg)](https://github.com/aniketnandi/AWS-Personal-Projects/actions/workflows/crud-api.yml)

Hands-on AWS projects covering **DevOps / CI/CD automation** and **serverless application development**. Each project folder has its own README with an architecture diagram, the code and configuration I used, screenshots of the results, and a full step-by-step build guide.

## Projects

### 🚀 [AWS DevOps CI/CD Pipeline](AWS%20DevOps%20Project/)

**Git · GitHub · Jenkins · Maven · Ansible · Docker · Docker Hub · Kubernetes (Amazon EKS) · EC2 · ELB · IAM**

A pipeline that takes a Java web app from `git push` to a load-balanced, 3-replica Kubernetes deployment on Amazon EKS. Jenkins builds the app, Ansible builds the Docker image and pushes it to Docker Hub, and then Ansible rolls the new version out to EKS. I built it in four stages: Tomcat on EC2 → Docker → Ansible → EKS.

**Try it:** from the project folder, `docker build -t regapp:local app && docker run -p 8080:8080 regapp:local` serves the app at `localhost:8080/webapp`. You can also deploy it to a local kind cluster. GitHub Actions rebuilds and deploys it on every push.

[README](AWS%20DevOps%20Project/README.md) · [Demo video](https://drive.google.com/file/d/1XCPMsMGVa63H0cUDvO9HMZcQM9QgMOOj/view?usp=drive_link) · [Ansible playbooks](AWS%20DevOps%20Project/ansible) · [Kubernetes manifests](AWS%20DevOps%20Project/kubernetes) · [Jenkins jobs](AWS%20DevOps%20Project/jenkins/README.md) · [Full documentation (PDF)](AWS%20DevOps%20Project/AWS%20DevOps%20CI_CD%20Project%20Documentation.pdf)

### ⚡ [Serverless CRUD API with Lambda and DynamoDB](CRUD%20API%20with%20Lambda%20and%20DynamoDB%20Project/)

**API Gateway (HTTP API) · AWS Lambda (Node.js, AWS SDK v3) · DynamoDB · IAM**

A REST API for student grade records. API Gateway sends four routes to a single Lambda function, which performs create, read, update, and delete operations on a DynamoDB table.

**Try it:** `npm test` runs the unit tests locally, and `sam deploy --guided` deploys your own copy from the SAM template.

[README](CRUD%20API%20with%20Lambda%20and%20DynamoDB%20Project/README.md) · [Lambda source](CRUD%20API%20with%20Lambda%20and%20DynamoDB%20Project/lambda/index.mjs) · [Full documentation (PDF)](CRUD%20API%20with%20Lambda%20and%20DynamoDB%20Project/Build%20a%20CRUD%20API%20with%20Lambda%20and%20DynamoDB.pdf)

## Skills demonstrated

| Area | Skills |
|---|---|
| CI/CD | Jenkins job design, SCM polling, chained CI and CD jobs, artifact promotion over SSH, GitHub Actions |
| Infrastructure and configuration | Ansible inventories and playbooks, passwordless SSH between servers, EC2 provisioning, security groups |
| Containers and orchestration | Dockerfiles on Tomcat, Docker Hub registry, Kubernetes Deployments and Services, rolling updates, `eksctl` and `kubectl` |
| Serverless | API Gateway HTTP API routes and integrations, Lambda handlers, DynamoDB data modeling, AWS SAM |
| AWS security | Least-privilege IAM execution roles, an instance role for the EKS bootstrap server |
