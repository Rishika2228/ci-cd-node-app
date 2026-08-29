# CI/CD Node App

This app is deployed by the `Jenkinsfile` whenever a commit reaches the `main`
branch. Jenkins runs the Node.js tests, builds a Docker image, and replaces the
running `ci-cd-node-app` container on port 3000.

## Run the app locally

```bash
npm ci
npm test
docker build -t ci-cd-node-app:local .
docker run --rm -p 3000:3000 ci-cd-node-app:local
```

Open `http://localhost:3000` to confirm the deployment.

## Set up Jenkins with Docker

On a Linux Jenkins host with Docker installed, create a Jenkins image that has
the Docker CLI available:

```bash
mkdir jenkins-docker && cd jenkins-docker
cat > Dockerfile <<'EOF'
FROM jenkins/jenkins:lts-jdk21
USER root
RUN apt-get update && apt-get install -y --no-install-recommends docker.io \
    && rm -rf /var/lib/apt/lists/*
USER jenkins
EOF
docker build -t jenkins-with-docker .
docker volume create jenkins-data
docker run -d --name jenkins --restart unless-stopped \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins-with-docker
```

Get the initial administrator password, then open `http://YOUR_SERVER:8080`:

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Install the suggested plugins plus **Docker Pipeline** and **GitHub**. The
Jenkins service account must be allowed to access the Docker socket. Mounting
the Docker socket gives Jenkins high privilege on the host; use a dedicated
deployment host for this learning setup.

## Create the Jenkins pipeline

1. In Jenkins, select **New Item** → **Pipeline** and name it
   `ci-cd-node-app`.
2. Under **Pipeline**, set **Definition** to **Pipeline script from SCM**.
3. Select **Git**, set the repository URL to
   `https://github.com/Rishika2228/ci-cd-node-app.git`, and choose branch
   `*/main`.
4. Keep the script path as `Jenkinsfile`, save, and select **Build Now**.

## Trigger a build for each push

Make Jenkins reachable at a public HTTPS URL (for example, through a reverse
proxy or a tunnel), then set **Manage Jenkins** → **System** → **Jenkins URL**
to that URL. In the GitHub repository, open **Settings** → **Webhooks** →
**Add webhook** and configure:

| Setting | Value |
| --- | --- |
| Payload URL | `https://YOUR_JENKINS_URL/github-webhook/` |
| Content type | `application/json` |
| Events | **Just the push event** |

Push a change to `main` to verify the webhook. The Jenkins dashboard should
show the **Checkout**, **Test**, **Build Docker image**, and **Deploy** stages.
For a non-main branch, the build and tests run but the deploy stage is skipped.
