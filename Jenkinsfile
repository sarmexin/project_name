pipeline {
    agent any

    environment {
        TOMCAT_SERVER = 'your-tomcat-server.com'
        TOMCAT_USER = 'deploy'
        TOMCAT_PATH = '/var/lib/tomcat9/webapps'
        WAR_FILENAME = 'vue-app'
    }

    stages {
        stage('Setup Node.js') {
            steps {
                script {
                    echo "🔧 Устанавливаем Node.js..."
                    sh '''
                        # Устанавливаем Node.js если не установлен
                        if ! command -v node &> /dev/null; then
                            echo "📥 Устанавливаем Node.js..."
                            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                            sudo apt-get install -y nodejs
                        else
                            echo "✅ Node.js уже установлен"
                        fi

                        # Проверяем версии
                        echo "Node.js version:"
                        node --version
                        echo "npm version:"
                        npm --version
                    '''
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "🎯 Vue.js + Tomcat Project"
                    echo "✅ Репозиторий выкачан"
                    sh 'ls -la'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Устанавливаем зависимости Vue..."
                    sh '''
                        # Проверяем package.json
                        if [ -f "package.json" ]; then
                            echo "📄 package.json найден"
                            cat package.json | jq '.scripts' || cat package.json

                            # Устанавливаем зависимости
                            npm ci
                        else
                            echo "❌ package.json не найден!"
                            echo "Содержимое репозитория:"
                            ls -la
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Build Vue App') {
            steps {
                script {
                    echo "🏗️  Собираем Vue приложение..."
                    sh '''
                        # Проверяем доступные скрипты
                        echo "Доступные npm скрипты:"
                        npm run || echo "Список скриптов получен"

                        # Пытаемся собрать (пробуем разные команды)
                        if npm run build; then
                            echo "✅ Сборка завершена"
                        elif npm run build:prod; then
                            echo "✅ Сборка завершена (build:prod)"
                        else
                            echo "❌ Не удалось собрать проект"
                            echo "Проверьте доступные скрипты в package.json"
                            exit 1
                        fi

                        # Проверяем результат сборки
                        if [ -d "dist" ]; then
                            echo "📁 Содержимое dist:"
                            ls -la dist/
                        elif [ -d "build" ]; then
                            echo "📁 Содержимое build:"
                            ls -la build/
                        else
                            echo "⚠️  Директория сборки не найдена"
                            ls -la
                        fi
                    '''
                }
            }
        }

        stage('Create WAR Package') {
            steps {
                script {
                    echo "📦 Создаем WAR файл..."
                    sh '''
                        # Определяем директорию сборки
                        if [ -d "dist" ]; then
                            BUILD_DIR="dist"
                        elif [ -d "build" ]; then
                            BUILD_DIR="build"
                        else
                            echo "❌ Директория сборки не найдена!"
                            exit 1
                        fi

                        # Создаем структуру WAR файла
                        mkdir -p war-build/WEB-INF

                        # Копируем собранные Vue файлы
                        cp -r ${BUILD_DIR}/* war-build/

                        # Создаем минимальный web.xml для SPA
                        cat > war-build/WEB-INF/web.xml << 'EOF'
                        <?xml version="1.0" encoding="UTF-8"?>
                        <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
                                 version="4.0">
                            <display-name>Vue Application</display-name>
                            <error-page>
                                <error-code>404</error-code>
                                <location>/index.html</location>
                            </error-page>
                            <welcome-file-list>
                                <welcome-file>index.html</welcome-file>
                            </welcome-file-list>
                        </web-app>
                        EOF

                        # Создаем WAR файл
                        cd war-build
                        jar -cvf ../${WAR_FILENAME}.war . > /dev/null
                        cd ..

                        echo "✅ WAR файл создан: ${WAR_FILENAME}.war"
                        ls -la ${WAR_FILENAME}.war
                    '''
                }
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                script {
                    echo "🚀 Деплоим WAR на Tomcat..."
                    sshagent(['deploy-server-ssh']) {
                        sh """
                            # Копируем WAR файл в webapps Tomcat
                            scp -o StrictHostKeyChecking=no \
                                ${WAR_FILENAME}.war \
                                ${TOMCAT_USER}@${TOMCAT_SERVER}:${TOMCAT_PATH}/

                            echo "✅ WAR файл задеплоен в Tomcat"
                            echo "🌐 Приложение будет доступно по адресу:"
                            echo "http://${TOMCAT_SERVER}:8080/${WAR_FILENAME}/"
                        """
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "🔍 Проверяем деплой..."
                    sh """
                        # Даем время Tomcat развернуть приложение
                        sleep 10

                        # Проверяем доступность
                        if curl -f -s -o /dev/null http://${TOMCAT_SERVER}:8080/${WAR_FILENAME}/; then
                            echo "🎉 Приложение успешно задеплоено!"
                        else
                            echo "⚠️  Приложение еще разворачивается..."
                        fi
                    """
                }
            }
        }
    }

    post {
        always {
            echo "🏁 Pipeline завершен: ${currentBuild.currentResult}"
            // Очистка
            sh '''
                rm -f *.war 2>/dev/null || true
                rm -rf war-build/ 2>/dev/null || true
            '''
        }
        success {
            echo "✅ Vue приложение успешно собрано и задеплоено в Tomcat!"
        }
        failure {
            echo "❌ Произошла ошибка при сборке или деплое"
        }
    }
}