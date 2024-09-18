@Library("jenkins-pipeline-libraries") _
@Library('magento-saas-pipeline@0.8.12') l2

pipeline {
    agent {
        docker {
            label "worker"
            image "jenkins-cypress-chrome:18.12.1"
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
        DIST_PACKAGE_FILE = '~/dist'

        PACKAGE_JSON = readJSON file: './package.json'
        MAJOR_VERSION = sh(returnStdout: true, script: "echo v${PACKAGE_JSON.version} | cut -f1 -d'.'").trim()
        tag = sh(returnStdout: true, script: 'git tag --contains').trim()
        // Match pattern like v1.0.1-rc.1 or v1.0.1 for a release
        git_tag_rc = sh(returnStdout: true, script: 'git tag --contains | egrep "^v[0-9]*\\.[0-9]*\\.[0-9]*-rc*" || echo "null"').trim()
        git_tag_release = sh(returnStdout: true, script: 'git tag --contains | egrep "^v[0-9]*\\.[0-9]*\\.[0-9]*$" || echo "null"').trim()
    }

    stages {
        stage('Lint') {
            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        sh 'npm install'
                        sh "npm run lint"
                    }
                }
            }
        } 

        stage('Unit Test & Coverage') {
            steps {
                dir("${env.WORKSPACE}/storefront-product-listing-page"){    
                    script {
                        sh "npm run test"
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
                        sh 'npm run build:dev'
                        sh 'npm run cover:integration'
                        sh 'npm run cover:report'
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
                        sh "npm run build:qa"
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
                        sh "npm run build:stage"
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
            agent { label "ec2-worker" }
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
                        def cmr_job = build job: 'CMR Now',
                            parameters: [
                                string(name: 'PROJECT', value: 'search'),
                                string(name: 'DESCRIPTION', value: "${env.git_tag_release}"),
                                string(name: 'TICKET', value: "See ${env.GIT_URL} tag: ${env.git_tag_release} for more details")
                            ]
                        println("https://adobe.service-now.com/now/change-launchpad/homepage - CMR ID: ${cmr_job.getBuildVariables().CHANGE_ID}")
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
                        sh "npm run build"
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
    }

    post {
        always {
            cleanWs()
            slack(currentBuild.result, "#datasolutions-jenkins")
        }
    }
}
