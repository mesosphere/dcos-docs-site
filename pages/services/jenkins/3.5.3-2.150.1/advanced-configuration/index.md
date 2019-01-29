---
layout: layout.pug
navigationTitle:  Advanced Configuration
title: Advanced Configuration
menuWeight: 50
excerpt:
featureMaturity:
enterprise: false
---
<h1>Advanced configuration</h1>

<h2>Running Jenkins with an insecure Docker registry</h2>

For testing purposes, you can configure an insecure Docker registry. To enable an insecure registry, pass in the <code>--insecure-registry</code> option to the Docker daemon that runs on each Jenkins agent.

The instructions below will show you how to use this option with the <a href="https://github.com/mesosphere/dcos-jenkins-dind-agent/">jenkins-dind</a> image that is configured by default when you install the Jenkins service.

<h3>Configuring Docker daemon</h3>

<ol>
<li>Get the hostname and port of your Docker registry. For example, if you're using the Artifactory package for DC/OS, it'll look something like:

artifactory-lb.marathon.mesos:5001</p></li>
<li><p>Navigate to "Manage Jenkins".

<img src="/services/jenkins/img/dcos-jenkins-manage-jenkins.png" alt="jenkins-manage-jenkins" /></p></li>
<li><p>Navigate to "Configure System".

<img src="/services/jenkins/img/dcos-jenkins-configure-system.png" alt="jenkins-configure-system" /></p></li>
<li><p>Scroll to the "Mesos Cloud" section and click on "Advanced...".

<img src="/services/jenkins/img/dcos-jenkins-cloud-advanced.png" alt="jenkins-cloud-advanced" /></p></li>
<li><p>Under the default label (defined with an empty label string), click "Advanced...".

<img src="/services/jenkins/img/dcos-jenkins-slave-info-advanced.png" alt="jenkins-slave-info-advanced" /></p></li>
<li><p>Find the "Parameters" section and create a new parameter.

<img src="/services/jenkins/img/dcos-jenkins-slave-info-parameters.png" alt="jenkins-slave-info-parameters" /></p></li>
<li><p>Set the "Name" to <code>env</code> and the "Value" to <code>DOCKER_EXTRA_OPTS=--insecure-registry  artifactory-lb.marathon.mesos:5001</code>, using the hostname of your insecure registry.

<img src="/services/jenkins/img/dcos-jenkins-docker-extra-opts.png" alt="jenkins-docker-extra-opts" /></p></li>
</ol>

<h3>Using this registry in a job</h3>

<p>To use this registry in a job, simply prefix its hostname when using the Docker command line, as normal. For example:

<pre><code>#!/bin/bash
docker login -u myuser -p mypassword -e my@email.com artifactory-lb.marathon.mesos:5001
docker build -t artifactory-lb.marathon.mesos:5001/myimage:mytag .
docker push artifactory-lb.marathon.mesos:5001/myimage:mytag
</code></pre>
