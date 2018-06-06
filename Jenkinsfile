#!groovy

node {
  deleteDir()
  checkout scm

  try {

    stage('Install') {
      sh 'yarn install'
    }

    stage('Test') {
      sh 'yarn test'
    }

    stage('Sonar scanner') {
      onPR {
        sh 'yarn sonar-scanner -Dsonar.analysis.mode=preview -Dsonar.host.url=https://sonar.reform.hmcts.net'
      }

      onMaster {
        sh 'yarn sonar-scanner -Dsonar.host.url=https://sonar.reform.hmcts.net'
      }
    }

  } finally {
    sh 'rm -rf node_modules coverage .sonar .scannerwork'
  }
}
