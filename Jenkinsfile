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
                    echo "Рабочая директория: ${WORKSPACE}"
                    echo "Целевая папка: ${params.TARGET_FOLDER}"

                    // Покажем что скачалось
                    sh 'ls -la'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Создаем целевую папку если не существует
                    sh "mkdir -p '${params.TARGET_FOLDER}'"

                    // Копируем файлы с экранированием пути
                    sh "cp -rf '${WORKSPACE}'/* '${params.TARGET_FOLDER}'/"

                    echo "✅ Содержимое репозитория скопировано в ${params.TARGET_FOLDER}"
                }
            }
        }

        stage('Verify') {
            steps {
                script {
                    // Проверяем что скопировалось
                    sh "ls -la '${params.TARGET_FOLDER}'/"
                    echo "🎉 Развертывание завершено успешно!"
                }
            }
        }
    }

    post {
        always {
            echo "🏁 Статус сборки: ${currentBuild.result ?: 'SUCCESS'}"
        }
        failure {
            echo "💥 Произошла ошибка при развертывании"
        }
    }
}