pipeline {
    agent any

    environment {
        IMAGE_NAME = 'ci-cd-node-app'
        CONTAINER_NAME = 'ci-cd-node-app'
        HOST_PORT = '3000'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    // Requires the GitHub plugin and a GitHub webhook pointing to /github-webhook/.
    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Build Docker image') {
            steps {
                sh 'docker build --pull -t $IMAGE_NAME:$BUILD_NUMBER -t $IMAGE_NAME:latest .'
            }
        }

        stage('Deploy') {
            when {
                expression {
                    env.BRANCH_NAME == 'main' ||
                    env.GIT_BRANCH == 'main' ||
                    env.GIT_BRANCH == 'origin/main'
                }
            }
            steps {
                sh '''
                    docker rm -f "$CONTAINER_NAME" || true
                    docker run -d \\
                      --name "$CONTAINER_NAME" \\
                      --restart unless-stopped \\
                      -p "$HOST_PORT:3000" \\
                      "$IMAGE_NAME:$BUILD_NUMBER"
                    docker ps --filter "name=$CONTAINER_NAME"
                '''
            }
        }
    }

}
