# Serverless CRUD API: API Gateway + AWS Lambda + DynamoDB

[![Serverless CRUD API](https://github.com/aniketnandi/AWS-Personal-Projects/actions/workflows/crud-api.yml/badge.svg)](https://github.com/aniketnandi/AWS-Personal-Projects/actions/workflows/crud-api.yml)

A serverless REST API that creates, reads, updates, and deletes student grade records. It has no servers to manage: **Amazon API Gateway (HTTP API)** routes each request to one **AWS Lambda** function (Node.js, AWS SDK v3), which reads and writes an **Amazon DynamoDB** table.

![Architecture](images/architecture.png)

📄 **Step-by-step build guide with screenshots:** [PDF](Build%20a%20CRUD%20API%20with%20Lambda%20and%20DynamoDB.pdf) · [DOCX](Build%20a%20CRUD%20API%20with%20Lambda%20and%20DynamoDB.docx)

## Tech stack

| Component | Service / detail |
|---|---|
| API layer | Amazon API Gateway HTTP API (`students_grade_sheet_api`) |
| Compute | AWS Lambda, Node.js ES module, `@aws-sdk/lib-dynamodb` (`students_grade_sheet_function`) |
| Database | Amazon DynamoDB table `students_grade_sheet`, partition key `id` (String) |
| Security | IAM execution role `students_grade_sheet_role` built from the *Simple microservice permissions* policy template |
| Testing | `curl` from an EC2 instance; unit tests with `node:test` + `aws-sdk-client-mock` |
| Infrastructure as code | AWS SAM template (`template.yaml`) |

## API routes

All routes use one Lambda integration. The handler dispatches on `event.routeKey`.

| Method | Path | Action | DynamoDB call |
|---|---|---|---|
| `PUT` | `/items` | Create or update an item (`id`, `name`, `marks`) | `PutCommand` |
| `GET` | `/items` | List all items | `ScanCommand` |
| `GET` | `/items/{id}` | Get one item | `GetCommand` |
| `DELETE` | `/items/{id}` | Delete one item | `DeleteCommand` |

Source: [`lambda/index.mjs`](lambda/index.mjs)

## Example requests

```bash
API=https://<api-id>.execute-api.us-east-1.amazonaws.com

# Create or update
curl -X PUT -H "Content-Type: application/json" \
     -d '{"id": "124", "marks": 98, "name": "suhas"}' $API/items

# List all
curl $API/items

# Get one
curl $API/items/124

# Delete
curl -X DELETE $API/items/124
```

## How I built it

1. Created the DynamoDB table with `id` as the partition key.
2. Created the Lambda function with a least-privilege execution role from the *Simple microservice permissions* template, and deployed the handler in `lambda/index.mjs`.
3. Created an empty HTTP API in API Gateway with the default auto-deploy stage.
4. Added the four routes, including the `{id}` path parameter.
5. Created one Lambda integration and attached it to every route.
6. Tested each operation with `curl` against the API's invoke URL.

## Run it yourself

**Unit tests (no AWS account needed).** These mock DynamoDB and exercise every route plus the error paths.

```bash
cd "CRUD API with Lambda and DynamoDB Project"
npm install
npm test
```

**Deploy your own copy (a few minutes, free tier).** [`template.yaml`](template.yaml) is an AWS SAM template that creates the whole stack: the DynamoDB table, the Lambda function with a least-privilege role, and the HTTP API with all four routes. It requires the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) and AWS credentials.

```bash
sam build
sam deploy --guided          # prints ApiUrl when finished

API=<ApiUrl from the output>
curl -X PUT -H "Content-Type: application/json" -d '{"id": "1", "marks": 90, "name": "test"}' $API/items
curl $API/items

sam delete                   # remove everything
```

The [CI workflow](../.github/workflows/crud-api.yml) runs the unit tests, `cfn-lint`, `sam validate --lint`, and `sam build` on every push.

> I originally built this project by hand in the AWS console, following the steps above. The SAM template captures the same resources as infrastructure as code. The console-built resources have been deleted, so the invoke URL in the documentation is no longer live.
