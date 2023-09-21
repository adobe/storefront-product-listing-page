@Library("jenkins-pipeline-libraries") _
@Library('magento-saas-pipeline@0.8.12') l2

pipeline {
    agent {
        docker {
            label "worker"
            image "cypress/browsers-all-aws:16.14.2"
            args  "-v /etc/passwd:/etc/passwd"
            registryUrl "http://docker-data-solution-jenkins-node-aws-dev.dr-uw2.adobeitc.com"
            registryCredentialsId "artifactory-datasoln"
        }
    }

    environment {
        HOME = "$WORKSPACE"
        TMPDIR = "$WORKSPACE"
        GH_TOKEN = credentials("dsuser-jenkins-token")
        SEARCH_ARTIFACTORY = credentials("SEARCH_ARTIFACTORY")
        PROJECT = 'storefront-product-listing-page'
        DIST_PACKAGE_FILE = '~/packages/dist'

        PACKAGE_JSON = readJSON file: './package.json'
        MAJOR_VERSION = sh(returnStdout: true, script: "echo v${PACKAGE_JSON.version} | cut -f1 -d'.'").trim()
        tag = sh(returnStdout: true, script: 'git tag --contains').trim()
        // Match pattern like v1.0.1-rc.1 or v1.0.1 for a release
        git_tag_rc = sh(returnStdout: true, script: 'git tag --contains | egrep "^v[0-9]*\\.[0-9]*\\.[0-9]*-rc*" || echo "null"').trim()
        git_tag_release = sh(returnStdout: true, script: 'git tag --contains | egrep "^v[0-9]*\\.[0-9]*\\.[0-9]*$" || echo "null"').trim()

        CMR_SLACK_CHANNEL = '#magento-search-alerts'
        CMR_CHANGE_MODEL_ID = '338630'
        CMR_API_ACCOUNT_NAME = 'magento_search_cmr_skms_api_user'
    }

    stages {
        stage('Lint') {
            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        sh 'yarn install'
                        sh "yarn lint"
                    }
                }
            }
        } 

        stage('Unit Test & Coverage') {
            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        sh "yarn test"
                    }
                }
            }  
        }

        stage('Run E2E Tests with Coverage') {
            when { 
                changeRequest target: 'develop' 
            }
            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                            sh 'yarn cover:integration & echo $! > $WORKSPACE/DEV_SERVER_PID.pid; sleep 15'
                            sh 'yarn cy:run:chrome'
                            sh 'yarn cover:report'
                            sh 'kill -9 $(cat $WORKSPACE/DEV_SERVER_PID.pid)'
                    }
                }
            }
        }

        stage('Build QA') {
            when {
                not {
                    buildingTag()
                }
            }

            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        sh "yarn build:qa"
                    }
                }
            }
        }

        stage("Deploy QA") {
            when {
                branch "develop"
            }

            environment {
                def QA_URL = "plp-widgets-ui-qa.magento-datasolutions.com/"
                def QA_BUCKET_URL = "${QA_URL}${MAJOR_VERSION}/"
            }

            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        klam("klam-data-solutions-qa-api")
                        sh "aws s3 sync ${DIST_PACKAGE_FILE} s3://${QA_BUCKET_URL} --delete && aws cloudfront create-invalidation --distribution-id E2936K1R0FNG2P --paths \"/*\""
                    }
                }
            }
        }

        stage("Build Stage") {
            when {
                allOf {
                    buildingTag()
                    expression { return env.git_tag_rc != 'null' }
                    expression { return env.git_tag_release == 'null' }
                }
            }

            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        sh "yarn build:stage"
                    }
                }
            }
        }

        stage("Deploy Stage") {
            when {
                allOf {
                    buildingTag()
                    expression { return env.git_tag_rc != 'null' }
                    expression { return env.git_tag_release == 'null' }
                }
            }

            environment {
                def STAGE_URL = "plp-widgets-ui-stage.magento-ds.com/"
                def STAGE_BUCKET_URL = "${STAGE_URL}${MAJOR_VERSION}/"
            }

            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        klam("klam-data-solutions-prod-api")
                        sh "aws s3 sync ${DIST_PACKAGE_FILE} s3://${STAGE_BUCKET_URL} --delete && aws cloudfront create-invalidation --distribution-id E13LGX9TL8FGP3 --paths \"/*\""
                    }
                }
            }
        }

        stage('Create CMR for Prod Deployment') {
            when {
                allOf {
                    buildingTag()
                    expression { return env.git_tag_rc != 'null' }
                    expression { return env.git_tag_release != 'null' }
                }
            }
            steps {
                wrap([$class: 'BuildUser']) {
                    script {
                        echo "Creating CMR for Branch ${env.BRANCH_NAME}"
                        env.BUILD_USER = BUILD_USER
                        def CHANGE_ID = cmr([
                            change_model_id: "${env.CMR_CHANGE_MODEL_ID}",
                            api_account_name: "${env.CMR_API_ACCOUNT_NAME}",
                            cmr_function: "open",
                            user: "${BUILD_USER}",
                            summary: "Releasing tag version ${env.git_tag_release}",
                            ticket: "See release tag notes for more details: ${env.GIT_URL.replace('.git', '')}/releases/${env.git_tag_release}",
                            slack_channel: "${env.CMR_SLACK_CHANNEL}",
                            project: "${env.PROJECT}"
                        ])
                        env.CMR_ID = CHANGE_ID
                    }
                }
            }
        }

        stage("Build Prod") {
            when {
                allOf {
                    buildingTag()
                    expression { return env.git_tag_rc != 'null' }
                    expression { return env.git_tag_release != 'null' }
                }
            }

            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        sh "yarn build"
                    }
                }
            }
        }

        stage("Deploy Prod") {
            when {
                allOf {
                    buildingTag()
                    expression { return env.git_tag_rc != 'null' }
                    expression { return env.git_tag_release != 'null' }
                }
            }

            environment {
                def PROD_URL = "plp-widgets-ui.magento-ds.com/"
                def PROD_BUCKET_URL = "${PROD_URL}${MAJOR_VERSION}/"
            }

            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        klam("klam-data-solutions-prod-api")
                        sh "aws s3 sync ${DIST_PACKAGE_FILE} s3://${PROD_BUCKET_URL} --delete && aws cloudfront create-invalidation --distribution-id E13LGX9TL8FGP3 --paths \"/*\""
                    }
                }
            }
        }

        stage('Validate Production Deployment...waiting for validation response to close CMR...') {
            when {
                allOf {
                    buildingTag()
                    expression { return env.git_tag_rc != 'null' }
                    expression { return env.git_tag_release != 'null' }
                }
            }
            steps {
                script {
                    try {
                        timeout(time: 60, unit: 'MINUTES') {
                            input message: "VERIFY THE DEPLOYMENT. Was the deployment a SUCCESS or FAILURE? Choose ABORT if the deployment failed verification.", ok: 'Deployment was successful!'
                        }
                    } catch (err) {
                        // If 'CMR Success!' is not clicked in 60 minutes, the CMR will be closed as Completed successfully automatically. 'SYSTEM' user means timeout is reached.
                        def user = err.getCauses()[0].getUser().toString()
                        if (user == 'SYSTEM') {
                            currentBuild.result = 'SUCCESS'
                        } else {
                            currentBuild.result = 'FAILURE'
                            error "Deployment was not successful, input aborted."
                        }
                    }
                }
            }
        }
        
    }

    post {
        success {
            script {
                if (env.CMR_ID) {
                    env.CMR_COMPLETION_STATUS = "Completed - According to implementation plan"
                }
            }
        }
        failure {
            script {
                if (env.CMR_ID) {
                    env.CMR_COMPLETION_STATUS = "Canceled - Had to initiate backout plan"
                }
            }
        }
        always {
            cleanWs()
            slack(currentBuild.result, "#datasolutions-jenkins")
        }
        // 'cleanup' runs after all other post stages (learned that 'always' runs before 'success' stage ¯\_(ツ)_/¯) (https://www.jenkins.io/doc/book/pipeline/syntax/#post))
        cleanup {
            script {
                if (env.CMR_ID) {
                    echo "Closing CMR with status: ${env.CMR_COMPLETION_STATUS}..."
                    cmr([
                       cmr_id: "${env.CMR_ID}",
                       api_account_name: "${env.CMR_API_ACCOUNT_NAME}",
                       cmr_function: "close",
                       user: "${env.BUILD_USER}",
                       completion_status: "${env.CMR_COMPLETION_STATUS}",
                       slack_channel: "${env.CMR_SLACK_CHANNEL}"
                    ])
                }
            }
        }
    }
}