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

  onPR {
      def currentVersion = sh(
        script: "cat package.json | grep -Po '\"version\": \"\\K[^\"]*'",
        returnStdout: true
      ).trim()

    try {
      def latestVersion = sh(
        script: "npm view @hmcts/div-service-auth-provider-client version --registry https://artifactory.reform.hmcts.net/artifactory/api/npm/npm-local/",
        returnStdout: true
      ).trim()

      if (currentVersion == latestVersion) {
        error "Version needs to be bumped, ${latestVersion} already published"
      }
    } catch (error) {
      // Ignore 404 error when not already published
    }
  }

  onMaster {
    sh 'npm publish --registry https://artifactory.reform.hmcts.net/artifactory/api/npm/npm-local/'
  }
}
