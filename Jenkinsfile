pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'ls -la'
            }
        }

        stage('Check Node.js') {
            steps {
                sh '''
                    node --version || echo "Node.js not found"
                    npm --version || echo "npm not found"
                '''
            }
        }

        stage('Install & Build') {
            steps {
                sh '''
                    echo "📦 Installing dependencies..."
                    npm install || exit 1

                    echo "🏗️ Building Vue app..."
                    npm run build || npm run build:prod || exit 1

                    echo "📁 Build result:"
                    ls -la
                    [ -d "dist" ] && ls -la dist/
                    [ -d "build" ] && ls -la build/
                '''
            }
        }

        stage('Create WAR') {
            steps {
                sh '''
                    mkdir -p war-build
                    cp -r dist/* war-build/ 2>/dev/null || cp -r build/* war-build/
                    cd war-build
                    jar -cvf ../app.war . 2>/dev/null
                    echo "✅ WAR file created"
                    ls -la ../app.war
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline finished: ${currentBuild.currentResult}"
        }
    }
}