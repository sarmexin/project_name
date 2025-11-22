pipeline {
    agent any

    environment {
        TOMCAT_SERVER = 'your-server.com'
        TOMCAT_USER = 'deploy'
        TOMCAT_PATH = '/var/lib/tomcat9/webapps'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build Vue') {
            steps {
                sh '''
                    echo "📦 Устанавливаем зависимости..."
                    npm ci

                    echo "🏗️  Собираем Vue приложение..."
                    npm run build
                '''
            }
        }

        stage('Create WAR') {
            steps {
                sh '''
                    # Создаем структуру WAR
                    mkdir -p war-build/WEB-INF
                    cp -r dist/* war-build/

                    # Создаем web.xml
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

                    # Пакуем в WAR
                    cd war-build
                    jar -cvf ../app.war .
                    echo "✅ WAR файл создан"
                '''
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['deploy-server-ssh']) {
                    sh """
                        # Копируем WAR в webapps Tomcat
                        scp -o StrictHostKeyChecking=no \
                            app.war \
                            ${TOMCAT_USER}@${TOMCAT_SERVER}:${TOMCAT_PATH}/

                        echo "🚀 WAR файл задеплоен. Tomcat автоматически развернет приложение."
                    """
                }
            }
        }
    }
}