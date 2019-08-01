---
layout: layout.pug
navigationTitle:  Customizing your Docker container
title: Customizing your Docker container
menuWeight: 40
excerpt:
featureMaturity:
enterprise: false
---
<h1>About customizing your Docker container</h1>

By default, Mesosphere DC/OS runs everything inside Docker containers to minimize dependencies on the underlying host operating system and to offer resilience in the event of a machine failure. When using Jenkins for DC/OS, the underlying Mesos scheduler in DC/OS creates new Jenkins agents that run as Mesos tasks within a Docker container. User-configured builds are then run inside the same container.

Because builds typically have steps that invoke the Docker utility, such as <code>docker build</code> or <code>docker push</code>, we provide the <a href="https://hub.docker.com/r/mesosphere/jenkins-dind">mesosphere/jenkins-dind</a> Docker image and configure Jenkins for DC/OS to use this by default. The <code>mesosphere/jenkins-dind</code> image also includes several other well-known tools. For a complete list, see the <a href="https://github.com/mesosphere/dcos-jenkins-dind-agent/blob/master/Dockerfile.alpine">Dockerfile</a>.

If you have dependencies to specify for your applications and environment, you can create custom Docker images for your Jenkins build agents with your environment-specific packages and configurations. Below, you'll find several common scenarios and a recipe for each. After your new Docker image is built, you can then push it to Docker Hub or your own private Docker registry. This registry must be accessible by each of the DC/OS agents.

At a minimum, a custom agent requires the following packages:

<ul>
<li><em>OpenJDK 8:</em> Required by Jenkins to launch the agent and register with the master.</li>
<li><em>CA certificates:</em> Required to verify SSL/TLS certificates.</li>
</ul>

Additionally, you might also want these commonly-used packages:

<ul>
<li><em>Bash:</em> Required by many Jenkins build scripts.</li>
<li><em>Git:</em> Popular version control system.</li>
<li><em>OpenSSH client:</em> Required to clone Git repositories via SSH.</li>
</ul>

<h1>Creating a new image based on mesosphere/jenkins-dind</h1>

To provide your own dependencies, we recommend extending the provided <code>jenkins-dind</code> image and install your required packages.

This example shows how to create an image which includes <code>sbt</code>, a Scala build tool (this code snippet is based on <a href="https://github.com/1science/docker-sbt/blob/latest/Dockerfile">docker-sbt</a>):

<pre><code>FROM mesosphere/jenkins-dind:0.2.2

ENV SBT_VERSION 0.13.8
ENV SBT_HOME /usr/local/sbt
ENV PATH ${PATH}:${SBT_HOME}/bin

RUN curl -sL "http://dl.bintray.com/sbt/native-packages/sbt/$SBT_VERSION/sbt-$SBT_VERSION.tgz" 
    | gunzip | tar -x -C /usr/local &amp;&amp; echo -ne "- with sbt $SBT_VERSIONn" &gt;&gt; /root/.built
</code></pre>

<h1>Modifying the SSH host keys</h1>

By default, Jenkins includes the SSH public keys used by GitHub. If you aren't using GitHub to host your Git repositories and you want to use SSH when cloning your Git repositories, you must add your Git server's SSH public keys to <code>/etc/ssh/ssh_known_hosts</code>. You can do this by appending these lines to your Dockerfile:

<pre><code>    ENV SSH_KNOWN_HOSTS github.com my.git.server
    RUN ssh-keyscan $SSH_KNOWN_HOSTS | tee /etc/ssh/ssh_known_hosts
</code></pre>

<h1>Configuring Jenkins</h1>

After the image is created and available on Docker Hub or your private Docker registry, you must configure Jenkins to make this image available in your job configurations.

<ol>
<li>From the Jenkins web interface, navigate to the <strong>Manage Jenkins</strong> page, and then to the <strong>Configure Jenkins</strong> page.</p></li>
<li><p>Scroll to the <strong>Cloud</strong> section at the bottom and click <strong>Advanced</strong>. You should see a grey button to <strong>Add Slave Info</strong>.

<img src="/services/jenkins/img/velocity-add-slave-info.png" alt="Add slave info button" /></p></li>
<li><p>On the <strong>Add Slave Info</strong> page, set values based on the needs of your particular job or application. Some options include:

<ul>
<li><em>Label string.</em> Specify a label for the Jenkins agent. This will be referenced in any jobs that make use of this image.</li>
<li><em>Usage.</em> Leave this as the default, "Utilize this node as much as possible."</li>
<li><em>Jenkins slave CPUs.</em> The CPU shares consumed by a single agent.</li>
<li><em>Jenkins slave memory in MB.</em> The memory consumed by a single agent.</li>
<li><em>Maximum number of executors per slave.</em> Number of Jenkins executors that will exist within a single container.</li>
<li><em>Jenkins executor CPUs.</em> The CPU shares given to each executor within the container (estimated).</li>
<li><em>Jenkins executor memory.</em> The memory given to each Jenkins executor within the container (estimated).</li>
</ul>

<strong>Note:</strong> The actual resources available to the Jenkins agent are calculated using the following formulas. Use these to create your estimates when you configure the agent's CPUs and memory.

<pre><code>actualCpus = slaveCpus + maxExecutors * executorCpus
actualMem = slaveMem + maxExecutors * executorMem
</code></pre>

<img src="/services/jenkins/img/velocity-jenkins-slave-info.png" alt="velocity-jenkins-slave-info" /></p></li>
<li><p>To configure this Jenkins agent with a custom Docker image, click <strong>Advanced</strong> again and select the <strong>Use Docker Containerizer</strong> checkbox. Here you can specify the <strong>Docker Image</strong> name.

<img src="/services/jenkins/img/velocity-docker-containerizer-settings.png" alt="velocity-docker-containerizer-settings" />

<strong>Note:</strong> If you're creating a new Docker-in-Docker image, be sure to select <strong>Docker Privileged Mode</strong> and specify a custom Docker command shell.</p></li>
<li><p>Click <strong>Save</strong>.</p></li>
</ol>

<h1>Configuring your Jenkins job to use the new agent</h1>

<ol>
<li><p>To configure a build to use the newly specified image, click on <strong>Configure</strong> for the build, select <strong>Restrict where this project can be run</strong>, and specify the same <strong>Label String</strong>.

<p><img src="/services/jenkins/img/velocity-job-build-label-string.png" alt="" /></p></li>
<li><p>Click <strong>Save</strong>.</p></li>
</ol>
