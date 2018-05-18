#!/usr/bin/env groovy
import jenkins.model.Jenkins

def envVars = Jenkins.instance.getGlobalNodeProperties()[0].getEnvVars()

// the job name is a global Jenkins variable, so I get it from there
def item = Jenkins.instance.getItem(envVars['JOB_NAME'])

def  ff=item.getLastSuccessfulBuild()
//println ff.getTime().format("YYYY-MMM-dd HH:MM:SS")
println ff.getTime().format("yyyy-MM-dd")

