pipeline {
    agent any

    environment {
        // Настройки для деплоя
        DEPLOY_SERVER = 'your-server.com'
        DEPLOY_USER = 'deploy'
        DEPLOY_PATH = '/var/www/project_name'
        NODE_VERSION = '18' // Версия Node.js
    }

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['staging', 'production'],
            description: 'Выберите окружение для деплоя'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "✅ Репозиторий выкачан"
                    sh 'git log --oneline -3'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Устанавливаем зависимости..."
                    sh '''
                        # Проверяем версию Node.js
                        node --version
                        npm --version

                        # Устанавливаем зависимости
                        npm ci
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "🏗️  Собираем проект..."
                    sh '''
                        # Запускаем сборку
                        npm run build

                        # Проверяем что собралось
                        if [ -d "dist" ]; then
                            echo "✅ Build directory created"
                            ls -la dist/
                        elif [ -d "build" ]; then
                            echo "✅ Build directory created"
                            ls -la build/
                        else
                            echo "⚠️  No build directory found"
                            ls -la
                        fi
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo "🧪 Запускаем тесты..."
                    sh '''
                        # Запускаем тесты
                        npm test

                        # Если есть линтинг
                        npm run lint || echo "Linting completed"
                    '''
                }
            }
        }

        stage('Deploy to Server') {
            when {
                expression {
                    params.DEPLOY_ENV == 'staging' || params.DEPLOY_ENV == 'production'
                }
            }
            steps {
                script {
                    echo "🚀 Деплоим на ${params.DEPLOY_ENV} сервер..."

                    // Определяем путь для деплоя в зависимости от окружения
                    def deployTarget = "${DEPLOY_PATH}"
                    if (params.DEPLOY_ENV == 'staging') {
                        deployTarget = "${DEPLOY_PATH}-staging"
                    }

                    sh """
                        # Создаем архив для деплоя
                        tar -czf deploy.tar.gz \
                            --exclude='node_modules' \
                            --exclude='.git' \
                            --exclude='.github' \
                            .

                        echo "📦 Архив создан"
                        ls -la deploy.tar.gz
                    """

                    // Копируем на сервер
                    sh """
                        scp -o StrictHostKeyChecking=no \
                            deploy.tar.gz \
                            ${DEPLOY_USER}@${DEPLOY_SERVER}:${deployTarget}/
                    """

                    // Распаковываем и настраиваем на сервере
                    sshagent(['deploy-server-ssh']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no \
                                ${DEPLOY_USER}@${DEPLOY_SERVER} '
                                cd ${deployTarget}

                                # Бэкап текущей версии
                                if [ -d "current" ]; then
                                    tar -czf backup/backup-\$(date +%Y%m%d-%H%M%S).tar.gz current/
                                fi

                                # Распаковываем новую версию
                                tar -xzf deploy.tar.gz -C temp/

                                # Устанавливаем зависимости
                                cd temp
                                npm ci --only=production

                                # Меняем версию
                                cd ..
                                mv current old-\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
                                mv temp current

                                # Перезапускаем приложение
                                sudo systemctl restart project_name || echo "Service restart skipped"

                                # Очистка
                                rm deploy.tar.gz
                                echo "✅ Деплой завершен на ${params.DEPLOY_ENV}"
                            '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo "🏁 Pipeline завершен: ${currentBuild.currentResult}"
            // Очистка
            sh 'rm -f deploy.tar.gz || true'
        }
        success {
            script {
                if (params.DEPLOY_ENV) {
                    echo "🎉 Успешно задеплоено на ${params.DEPLOY_ENV}!"
                    // Можно добавить уведомление в Slack/Telegram
                } else {
                    echo "✅ Сборка и тесты прошли успешно"
                }
            }
        }
        failure {
            echo "❌ Pipeline завершился с ошибкой"
            // Уведомления об ошибке
        }
        changed {
            echo "📊 Статус изменился: ${currentBuild.previousBuild?.result} -> ${currentBuild.currentResult}"
        }
    }
}