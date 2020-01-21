## Migrating your workloads from Jenkins on DC/OS to Jenkins on Konvoy

**Note:** This guide assumes you are moving to a Jenkins instance on Konvoy from a Jenkins instance on DC/OS. For any other migration reference, please refer to the guides at the bottom of this page:

### Step 1: Download the `$JENKINS_HOME/jobs` directory.

Make sure the DC/OS Jenkins instance is healthy. Identify the Jenkins task ID by running:

```bash
$ dcos task list <name-of-your-jenkins-task> -q
```

for e.g.:

```bash
$ dcos task list jenkins -q
jenkins.instance-5d5cfb57-365b-11ea-8f22-3ece2a18bc93._app.1
```

You may have multiple tasks with the string "jenkins" in their names. Make sure you have the correct task ID by looking at the json output as needed (append `--json` to above command).

Download the `$JENKINS_HOME/jobs` directory to your work station. This can be accomplished by:

```bash
$ dcos task download <task-id> [<path>]
```

for e.g.:
```bash
$ dcos task download jenkins.instance-5d5cfb57-365b-11ea-8f22-3ece2a18bc93._app.1 jenkins_home/jobs --target-dir=$(pwd)/jenkins_home
```

The above command may take a while and after its done, you should have the `jenkins_home/jobs` folder locally.

### Step 2: Write the `$JENKINS_HOME/jobs` directory to new instance of Jenkins.

Copy the above files (`jobs` folder) in to the running Jenkins pod. This can be done by:

```bash
# Get the pod id of running jenkins instance
$ kubectl get pods --namespace jenkinsnamespace

# Change the namespace, pod name and entry command as needed.
$ kubectl cp ./jenkins_home/jobs/ <POD_ID>:/var/jenkins_home --container jenkins --namespace jenkinsnamespace
```

These operations can be done even when Jenkins is running. For changes like these to take effect, you must go to Jenkins GUI "Manage Jenkins" page and select "Reload Configuration from Disk" to force Jenkins to reload configuration from the disk.

---
- https://wiki.jenkins.io/display/JENKINS/Administering+Jenkins
- https://support.cloudbees.com/hc/en-us/articles/216241937-Migration-Guide-CloudBees-Jenkins-Platform-and-CloudBees-Jenkins-Team-
