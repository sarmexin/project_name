pipeline {
    agent any

    environment {
        TOMCAT_SERVER = 'your-tomcat-server.com'
        TOMCAT_USER = 'deploy'
        TOMCAT_PATH = '/var/lib/tomcat9/webapps'
        WAR_FILENAME = 'vue-app'
    }

    stages {
        stage('Check Node.js') {
            steps {
                script {
                    echo "🔍 Проверяем наличие Node.js..."
                    sh '''
                        # Проверяем установлен ли Node.js
                        if command -v node > /dev/null 2>&1; then
                            echo "✅ Node.js установлен"
                            node --version
                            npm --version
                        else
                            echo "❌ Node.js НЕ установлен на сервере Jenkins"
                            echo "📢 Установите Node.js вручную:"
                            echo "1. Manage Jenkins -> Tools -> NodeJS"
                            echo "2. Или установите на сервер: sudo apt install nodejs npm"
                            exit 1
                        fi
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

        stage('Check Package.json') {
            steps {
                script {
                    echo "📄 Проверяем package.json..."
                    sh '''
                        if [ -f "package.json" ]; then
                            echo "✅ package.json найден"
                            echo "Скрипты в package.json:"
                            cat package.json | grep -A 20 '"scripts"' || echo "Не удалось прочитать scripts"
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

        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Устанавливаем зависимости..."
                    sh '''
                        # Устанавливаем зависимости
                        npm install

                        # Проверяем установку
                        echo "Установленные зависимости:"
                        npm list --depth=0
                    '''
                }
            }
        }

        stage('Build Vue App') {
            steps {
                script {
                    echo "🏗️  Собираем Vue приложение..."
                    sh '''
                        # Пробуем разные команды сборки
                        if npm run build:prod; then
                            echo "✅ Сборка build:prod завершена"
                        elif npm run build; then
                            echo "✅ Сборка build завершена"
                        elif npm run dist; then
                            echo "✅ Сборка dist завершена"
                        else
                            echo "❌ Не удалось собрать проект"
                            echo "Доступные скрипты:"
                            npm run
                            exit 1
                        fi

                        # Проверяем результат
                        echo "📁 Результат сборки:"
                        find . -name "dist" -type d | head -5 | xargs ls -la 2>/dev/null || true
                        find . -name "build" -type d | head -5 | xargs ls -la 2>/dev/null || true
                    '''
                }
            }
        }

        stage('Create WAR') {
            steps {
                script {
                    echo "📦 Создаем WAR файл..."
                    sh '''
                        # Ищем директорию сборки
                        if [ -d "dist" ]; then
                            BUILD_DIR="dist"
                        elif [ -d "build" ]; then
                            BUILD_DIR="build"
                        else
                            echo "🔍 Ищем директорию сборки..."
                            find . -type d -name "dist" -o -name "build" | head -5
                            echo "❌ Директория сборки не найдена!"
                            exit 1
                        fi

                        echo "📁 Используем директорию: $BUILD_DIR"
                        ls -la $BUILD_DIR/

                        # Создаем WAR структуру
                        mkdir -p war-build/WEB-INF
                        cp -r $BUILD_DIR/* war-build/

                        # Простой web.xml
                        cat > war-build/WEB-INF/web.xml << 'EOF'
                        <web-app version="4.0">
                            <display-name>Vue App</display-name>
                            <error-page>
                                <error-code>404</error-code>
                                <location>/index.html</location>
                            </error-page>
                            <welcome-file-list>
                                <welcome-file>index.html</welcome-file>
                            </welcome-file-list>
                        </web-app>
                        EOF

                        # Создаем WAR
                        cd war-build
                        jar -cvf ../${WAR_FILENAME}.war . 2>/dev/null
                        cd ..

                        echo "✅ WAR создан: $(ls -la ${WAR_FILENAME}.war)"
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "🚀 Деплоим на Tomcat..."
                    sh """
                        # Просто создаем файл для демонстрации
                        echo "Здесь будет деплой на ${TOMCAT_SERVER}"
                        echo "WAR файл: ${WAR_FILENAME}.war ($(du -h ${WAR_FILENAME}.war | cut -f1))"

                        # Для теста - копируем в локальную папку
                        mkdir -p /var/lib/jenkins/deploy-test/
                        cp ${WAR_FILENAME}.war /var/lib/jenkins/deploy-test/
                        echo "✅ WAR скопирован в /var/lib/jenkins/deploy-test/"
                    """
                }
            }
        }
    }

    post {
        always {
            echo "🏁 Pipeline завершен: ${currentBuild.currentResult}"
            sh '''
                rm -f *.war 2>/dev/null || true
                rm -rf war-build/ 2>/dev/null || true
            '''
        }
        success {
            echo "🎉 Сборка завершена успешно!"
        }
    }
}