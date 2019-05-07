---
layout: layout.pug
navigationTitle:  Upgrading
title: Upgrading
menuWeight: 60
excerpt:
featureMaturity:
enterprise: false
---
<h1>Upgrading</h1>

To upgrade from one version of the Jenkins for DC/OS package to another, simply uninstall the current version, update your package repository cache, and install a new version.

<ol>
<li>Uninstall Jenkins as per the instructions in <a href="/services/jenkins/uninstall/">Uninstalling</a>. Any builds that are current in progress or queued will be lost.</p></li>
<li><p>Use the CLI to update your local cache of the package repository. 
    dcos package update</p></li>
<li><p>Install Jenkins, again following the instructions on <a href="/services/jenkins/custom-install/">Customizing your install</a>. Make sure you use the same configuration file as previously, specifically pointing Jenkins to the same <code>host-volume</code>.</p></li>
<li><p>Currently it is necessary to upgrade plugins by hand using the Jenkins UI at <code>&lt;dcos_url&gt;/service/jenkins/pluginManager</code>.</p></li>
</ol>

<h1>Upgrading to 0.1.3</h1>

<h2>Label String Configuration Changes</h2>

<p>Prior to this release, it was necessary to select <strong>Restrict where this project can be run</strong> and set the <strong>Label Expression</strong> to <strong>mesos</strong>. This was because the Jenkins Mesos plugin would only run builds that matched a <strong>Label String</strong>, which we configured to be <strong>mesos</strong>.

In this release, we upgraded the Jenkins Mesos plugin from version 0.8.0 to version 0.9.0 which allows you to leave <strong>Label String</strong> blank. This means you no longer need to set this for each build.

If you have previously installed Jenkins, the package will reuse your existing configuration. If you wish to remove this limitation, simply go to <strong>Manage Jenkins</strong> > <strong>Configure System</strong> and click on the <strong>Advanced</strong> button under <strong>Mesos Cloud</strong>. Then, delete the contents of the <strong>Label String</strong> textbox.
