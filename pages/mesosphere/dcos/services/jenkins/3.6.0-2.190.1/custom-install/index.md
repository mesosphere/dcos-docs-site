---
layout: layout.pug
navigationTitle:  Customizing your install
title: Customizing your install
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---
<h1>About customizing your installation parameters</h1>

The Jenkins for DC/OS package accepts a range of configuration parameters at install.

By default, Jenkins for DC/OS uses a <code>/tmp</code> directory on the local host to store its configuration and build data. At a minimum, you should change this before going into production. We recommend setting up a shared file system. Alternatively, you can pin to an agent.

We also expect that you'll want to customize the default Docker container to add your own dependencies.

<h1>Using the CLI</h1>

<h2>About using the CLI</h2>

You can perform a custom installation from either the web interface or the CLI.

<h2>Creating a JSON file</h2>

<ol>
<li>Create a new file.

<strong>Tip:</strong> You might want to choose a pattern like <code>&lt;package-name&gt;-config.json</code>.

<pre><code class="bash">nano jenkins-config.json
</code></pre></li>
<li>Use the information in the configuration reference below to build your JSON. This example creates a new Jenkins for DC/OS service named <code>jenkins-myteam</code> and uses the NFS share located at <code>/mnt/nfs/jenkins-data</code>.

<pre><code class="json">{
    "service": {
        "name": "jenkins-myteam"
    },
    "storage": {
        "host-volume": "/mnt/nfs/jenkins_data"
    }
}
</code></pre>

<strong>Tip:</strong> The value of <code>host-volume</code> is the base path to a share on a NFS server or other distributed filesystem. The actual path on-disk for this example is <code>/mnt/nfs/jenkins_data/jenkins-myteam</code>.</p></li>
<li>From the CLI, pass the custom options file.

<pre><code class="bash">dcos package install jenkins --options=jenkins-config.json
</code></pre></li>
</ol>

<h1>Configuration reference</h1>
The exact configuration can change between releases of the DC/OS Jenkins Service, the following links describe options available for each release.

<li><a href="https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/J/jenkins/40/config.json">Jenkins 3.6.0-2.190.1 Configuration options.</a></li>
<li><a href="https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/J/jenkins/30/config.json">Jenkins 3.5.4-2.150.1 Configuration options.</a></li>
<li><a href="https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/J/jenkins/29/config.json">Jenkins 3.5.3-2.150.1 Configuration options.</a></li>
<li><a href="https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/J/jenkins/28/config.json">Jenkins 3.5.2-2.107.2 Configuration options.</a></li>



<h1>Examples</h1>

<h2>Create a new instance pinned to a single host</h2>

<p>You can also specify an optional <code>pinned-hostname</code> constraint. This is useful if you don't have NFS available and need to pin Jenkins to a specific node:

<pre><code>{
    "service": {
        "name": "jenkins-pinned"
    },
    "storage": {
        "host-volume": "/var/jepkins_data",
        "pinned-hostname": "10.0.0.100"
    }
}
</code></pre>

<h2>Modify known hosts</h2>

With the <code>known-hosts</code> option you can specify a space-separated list of hostnames from which to retrieve the SSH public keys. This list will be populated on the Jenkins master when the bootstrap script runs (at container launch time). You must manually ensure that the SSH known hosts list is populated in any Jenkins agent containers. This is discussed further in <a href="/mesosphere/dcos/services/jenkins/custom-docker/">Customizing your Docker container</a> and you can see an example in the <a href="https://github.com/mesosphere/dcos-jenkins-dind-agent/"><code>dcos-jenkins-dind-agent</code></a> repo.

<pre><code>{
    "service": {
        "name": "jenkins-private-git"
    },
    "storage": {
        "host-volume": "/mnt/nfs/jenkins_data"
    },
    "networking": {
        "known-hosts": "github.com git.apache.org git.example.com"
    }
}
</code></pre>
