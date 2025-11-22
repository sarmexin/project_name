pipeline {
    agent any

    parameters {
        string(name: 'TARGET_FOLDER', defaultValue: '/var/lib/jenkins/my_project', description: 'Целевая папка для развертывания')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate') {
            steps {
                script {
                    echo "📋 Информация о сборке:"
                    echo "Ветка: ${env.BRANCH_NAME}"
                    echo "Рабочая директория: ${WORKSPACE}"
                    echo "Целевая папка: ${params.TARGET_FOLDER}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Создаем целевую папку если не существует
                    sh "mkdir -p ${params.TARGET_FOLDER}"

                    // Копируем файлы
                    sh "cp -rf ${WORKSPACE}/* ${params.TARGET_FOLDER}/"

                    echo "✅ Содержимое репозитория скопировано в ${params.TARGET_FOLDER}"
                }
            }
        }
    }

    post {
        always {
            echo "🏁 Статус сборки: ${currentBuild.result ?: 'SUCCESS'}"
        }
        success {
            sh "ls -la ${params.TARGET_FOLDER}/"
            echo "🎉 Развертывание завершено успешно!"
        }
        failure {
            echo "💥 Произошла ошибка при развертывании"
        }
    }
}