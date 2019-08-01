---
layout: layout.pug
navigationTitle:  Quickstart
title: Quickstart
menuWeight: 10
excerpt:
featureMaturity:
enterprise: false
---
<h1>About installing Jenkins for DC/OS</h1>

As a package available in the Universe, Jenkins for DC/OS can be installed using either the web interface or the DC/OS CLI. With its sensible defaults, you can get up and running very quickly.

<strong>Important:</strong> The default installation will use a <code>/tmp</code> directory on the local host to store configuration and build data. This configuration will not scale to accommodate multiple Jenkins masters. In addition, it will result in the loss of data when the agent goes down. Before going into production, you must perform a <a href="/services/jenkins/custom-install/">custom install</a> and set up either a shared file system (recommended) or pin to a single agent.

<h1>Prerequisites</h1>

DC/OS 1.8 or later

<strong>Note:</strong> If you are on an earlier version and would like to try out Jenkins for DC/OS, contact <a href="mailto:support@mesosphere.io">support@mesosphere.io</a>.

<h1>Installing Jenkins for DC/OS</h1>

<h2>Using the web interface</h2>

<ol>
<li>Click <strong>Universe</strong>.</p></li>
<li><p>Click the <strong>Install Package</strong> button for the Jenkins package.</p></li>
<li><p>To accept the default settings, click <strong>Install Package</strong> on the pop-up. To customize the installation parameters, click <strong>Advanced Installation</strong> instead. Refer to <a href="/services/jenkins/custom-install/">Customizing your install</a> for more information about each option.</p></li>
</ol>

<h2>Using the CLI</h2>

<p><strong>Tip:</strong> To install Jenkins using the CLI, you must have the <a href="/1.8/usage/cli/install/">CLI installed</a>.

From the CLI, type the following command to install Jenkins for DC/OS.

<pre><code class="bash">dcos package install jenkins
</code></pre>

<strong>Note:</strong> You can use the <code>--options</code> flag to pass custom configuration parameters. Refer to <a href="/services/jenkins/custom-install/">Customizing your install</a> for more information.

<h1>Verifying your installation</h1>

<ol>
<li>You can use either the web interface or the CLI to verify that Jenkins for DC/OS has installed successfully.

<ul>
<li>From the DC/OS CLI, run the following command to list the installed packages:

<pre><code class="bash">dcos package list
</code></pre></li>
<li><p>From the web interface, click the <strong>Services</strong> tab and confirm that Jenkins is running at <code>/#/services</code>.</p></li>
</ul></li>
<li><p>Launch your browser and navigate to the Jenkins interface at <code>http://&lt;host-name&gt;/service/jenkins</code>.</p></li>
</ol>
