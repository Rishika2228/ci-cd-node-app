pipeline {
    agent any

    environment {
        IMAGE_NAME = 'ci-cd-node-app'
        CONTAINER_NAME = 'ci-cd-node-app'
        HOST_PORT = '3000'
        DOCKER_BIN = 'C:/Users/Rishika/AppData/Local/Programs/DockerDesktop/resources/bin'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

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
                bat 'npm ci'
                bat 'npm test'
            }
        }

        stage('Build Docker image') {
            steps {
                bat '"%DOCKER_BIN%/docker.exe" build --pull -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest .'
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
                bat '''
                    "%DOCKER_BIN%/docker.exe" rm -f %CONTAINER_NAME% >nul 2>&1 || echo No existing container to remove
                    "%DOCKER_BIN%/docker.exe" run -d ^
                      --name %CONTAINER_NAME% ^
                      --restart unless-stopped ^
                      -p %HOST_PORT%:3000 ^
                      %IMAGE_NAME%:%BUILD_NUMBER%
                    "%DOCKER_BIN%/docker.exe" ps --filter "name=%CONTAINER_NAME%"
                '''
            }
        }
    }
}
