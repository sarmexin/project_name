pipeline {
    agent any

    tools {
        nodejs "NodeJS" // имя вашей NodeJS установки в Jenkins
    }

    triggers {
        githubPush() // webhook
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'develop',
                url: 'https://github.com/sarmexin/project_name.git',
                credentialsId: 'your-github-credentials'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build:prod'
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                sh '''
                    # Останавливаем Tomcat (опционально)
                    sudo systemctl stop tomcat

                    # Копируем собранные файлы в webapps директорию Tomcat
                    sudo rm -rf /var/lib/tomcat/webapps/your-app-name
                    sudo cp -r dist/* /var/lib/tomcat/webapps/your-app-name/

                    # Устанавливаем правильные права
                    sudo chown -R tomcat:tomcat /var/lib/tomcat/webapps/your-app-name

                    # Запускаем Tomcat
                    sudo systemctl start tomcat
                '''
            }
        }
    }

    post {
        always {
            cleanWs() // очистка workspace
        }
        success {
            emailext (
                subject: "SUCCESS: Job ${env.JOB_NAME}",
                body: "Build ${env.BUILD_NUMBER} deployed successfully",
                to: "dev-team@yourcompany.com"
            )
        }
        failure {
            emailext (
                subject: "FAILED: Job ${env.JOB_NAME}",
                body: "Build ${env.BUILD_NUMBER} failed",
                to: "dev-team@yourcompany.com"
            )
        }
    }
}