---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 70
excerpt:
featureMaturity:
enterprise: false
---
<h1>About uninstalling Jenkins for DC/OS</h1>

Jenkins for DC/OS can be uninstalled using either the web interface or the CLI.

The process does not delete the data stored on either the pinned agent or the shared file system. You must delete this data manually.

<h1>Using the web interface</h1>

<ol>
<li>Click the <strong>Universe</strong> tab.</p></li>
<li><p>Click <strong>Installed</strong> to view your installed services.</p></li>
<li><p>Hover over the Jenkins instance that you wish to uninstall. A red <strong>Uninstall</strong> link will appear on the far right.</p></li>
<li><p>Click <strong>Uninstall</strong>.</p></li>
</ol>

<h1>Using the CLI</h1>

<p>From the CLI, you can uninstall with the following command.

<pre><code class="bash">dcos package uninstall jenkins
</code></pre>
