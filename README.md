# CI/CD Node App

This app is deployed by the `Jenkinsfile` whenever a commit reaches the `main`
branch. Jenkins runs the Node.js tests, builds a Docker image, and replaces the
running `ci-cd-node-app` container on port 3000.

