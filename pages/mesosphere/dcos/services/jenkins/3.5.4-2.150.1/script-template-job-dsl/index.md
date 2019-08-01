---
layout: layout.pug
navigationTitle:  Scripting and templating your jobs
title: Scripting and templating your jobs
menuWeight: 30
excerpt:
featureMaturity:
enterprise: false
---
<h1>About scripting and templating your jobs</h1>

Over a period of time, the creation and maintenance of hundreds of Jenkins jobs can become a burden. The Job DSL plugin allows for jobs to be scripted and templated, allowing entire pipelines to be defined within code rather than manually. In addition, once pipelines are defined in code, you can backup and version control your job configurations.

This is a tutorial for building Jenkins job pipelines using the Jenkins Job DSL plugin. This tutorial will offer a brief overview of the Job DSL plugin and walks you through creating a new Jenkins seed job, templating the creation of additional pipeline jobs, and storing job configurations in a version control system.

The tutorial assumes that you have a working Jenkins for DC/OS installation that includes Job DSL.

<h1>The seed job</h1>

A "seed job" is an initial Jenkins job template that is used to build additional jobs. The seed job is a standard "free-style" job, meaning it includes all the standard benefits of any Jenkins job: history, logs, emails, etc.

The first step is to manually create a seed job via the Jenkins UI. Click <strong>New Item</strong>, give your seed job a name (you’re using <strong>Job DSL Tutorial</strong>), select <strong>Freestyle project</strong>, and click <strong>OK</strong>.

<img src="/services/jenkins/img/velocity-jobdsl-seed-job.png" alt="velocity-jobdsl-seed-job.png" />

Next, define which project repository to monitor, how often, and the steps associated with testing the project.

For this tutorial, we’ll be checking the <code>mesosphere/jenkins-mesos</code> repository every 15 minutes and running a simple directory listing (<code>ls -l</code>) of the repository.

Scroll down to the "Build" section, click "Add build step", and select "Process Job DSLs" from the dropdown list. For this build step, select "Use the provided DSL script" and paste the following code into the provided text box.

<pre><code>def owner = 'mesosphere'
def project = 'jenkins-mesos'
def jobName = "${owner}-${project}".replaceAll('/','-')
job(jobName) {
  scm {
      git {
          remote {
            github("${owner}/${project}")
          }
          createTag(false)
      }
  }
  triggers {
      scm('*/15 * * * *')
  }
  steps {
      shell('ls -l')
  }
}
</code></pre>

<img src="/services/jenkins/img/velocity-jobdsl-add-build-step.png" alt="velocity-jobdsl-add-build-step.png" />

<strong>Note:</strong> Rather than pasting inline, you can also version control your Job DSL scripts in a Git repository. To do so, have the seed job clone the Git repository and use the <strong>Look on Filesystem</strong> option to process one or more of the Job DSL scripts within the build’s workspace.

Click <strong>Save</strong> and you’ll be presented with an overview of the seed job you’ve just created.

<img src="/services/jenkins/img/velocity-jobdsl-seed-overview.png" alt="velocity-jobdsl-seed-overview.png" />

Click <strong>Build Now</strong> on the seed job. A new <strong>Generated Jobs</strong> folder will appear in the overview containing the job you’ve justed templated, <code>mesosphere-jenkins-mesos</code>.

<img src="/services/jenkins/img/velocity-jobdsl-seed-overview-generated.png" alt="velocity-jobdsl-seed-overview-generated.png" />

You can follow the link to the new job and see its relation to the seed job in the overview.

<img src="/services/jenkins/img/velocity-jobdsl-generated-overview.png" alt="velocity-jobdsl-generated-overview.png" />

In the seed job, you configured the <code>mesosphere-jenkins-mesos</code> job to trigger every 15 minutes. Rather than wait for this trigger, let’s click <strong>Build Now</strong> to see the resulting console build log, which is a directory listing (<code>ls -l</code>) of the specified repository.

<img src="/services/jenkins/img/velocity-jobdsl-generated-console.png" alt="velocity-jobdsl-generated-console.png" />

<h1>Extending the seed job</h1>

To show the power of the Job DSL let’s extend the functionality of the seed job to monitor all branches of our target repository (<code>mesosphere/jenkins-mesos</code>).

Go back to the <strong>Job DSL Tutorial</strong> seed job and click <strong>Configure</strong>. Modify the code in the <strong>Process Job DSLs</strong> text box to find all repository branches and iterate over each one:

<pre><code>def owner = 'mesosphere'
def project = 'jenkins-mesos'
def branchApi = new URL("https://api.github.com/repos/${owner}/${project}/branches")
def branches = new groovy.json.JsonSlurper().parse(branchApi.newReader())
branches.each {
  def branchName = it.name
  def jobName = "${owner}-${project}-${branchName}".replaceAll('/','-')
  job(jobName) {
    scm {
        git {
            remote {
              github("${owner}/${project}")
            }
            branch("${branchName}")
            createTag(false)
        }
    }
    triggers {
        scm('*/15 * * * *')
    }
    steps {
        shell('ls -l')
    }
  }
}
</code></pre>

Click <strong>Save</strong> button, then <strong>Build Now</strong>. You should see three new <strong>Generated Items</strong>, one for each existing branch of the <code>mesosphere/jenkins-mesos</code> repository.

<img src="/services/jenkins/img/velocity-jobdsl-generated-per-branch.png" alt="velocity-jobdsl-generated-per-branch.png" />

<h1>Further reading</h1>

That’s it! While this tutorial is meant to show the simplest workflow possible using seed jobs, the Job DSL provides the full power of the Groovy scripting language. See the following links for more information:

<ul>
<li><a href="https://jenkinsci.github.io/job-dsl-plugin/">https://jenkinsci.github.io/job-dsl-plugin/</a></li>
<li><a href="https://github.com/jenkinsci/job-dsl-plugin/wiki/Real-World-Examples">https://github.com/jenkinsci/job-dsl-plugin/wiki/Real-World-Examples</a></li>
</ul>
