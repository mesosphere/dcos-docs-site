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

<h3>Networking configuration properties</h3>

<table class="table">
<thead>
<tr class="header">
<th>Property</th>
<th>Type</th>
<th>Description</th>
<th>Default Value</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>virtual-host</td>
<td>string</td>
<td>The virtual host address to configure for integration with Marathon-LB.</td>
<td><em>No default.</em></td>
</tr>
<tr class="even">
<td>https-redirect</td>
<td>boolean</td>
<td>Indicates whether Marathon-LB should redirect HTTP traffic to HTTPS. This requires ‘virtual-host’ to be set.</td>
<td><code>False</code></td>
</tr>
<tr class="odd">
<td>root-url</td>
<td>string</td>
<td>The web address of the Jenkins installation (e.g. <a href="http://jenkins.example.com" class="uri">http://jenkins.example.com</a>). This is used by Jenkins to refer to itself when creating links in emails, chat notifications, etc.</td>
<td><em>No default.</em></td>
</tr>
<tr class="even">
<td>known-hosts</td>
<td>string</td>
<td>A space-separated list of hosts used to populate the SSH known hosts file on the Jenkins master.</td>
<td><code>github.com</code></td>
</tr>
</tbody>
</table>

<h3>Storage configuration properties</h3>

<table class="table">
<thead>
<tr class="header">
<th>Property</th>
<th>Type</th>
<th>Description</th>
<th>Default Value</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>host-volume</td>
<td>string</td>
<td>The location of a volume on the host that is used for persisting Jenkins configuration and build data. The final location is derived from this value plus the name set in <code>name</code> (e.g. <code>/mnt/host_volume/jenkins</code>). Note that this path must be the same on all DC/OS agents.</td>
<td><code>/tmp</code></td>
</tr>
<tr class="even">
<td>pinned-hostname</td>
<td>string</td>
<td>An optional DC/OS agent hostname to run this Jenkins instance on (e.g. 10.0.0.1).</td>
<td><em>No default.</em></td>
</tr>
</tbody>
</table>

<h3>Service configuration properties</h3>

<table class="table">
<thead>
<tr class="header">
<th>Property</th>
<th>Type</th>
<th>Description</th>
<th>Default Value</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>cpus</td>
<td>number</td>
<td>CPU shares to allocate to each Jenkins master.</td>
<td><code>1.0</code></td>
</tr>
<tr class="even">
<td>name</td>
<td>string</td>
<td>The name of the service to display in the DC/OS dashboard.</td>
<td><code>jenkins</code></td>
</tr>
<tr class="odd">
<td>mem</td>
<td>number</td>
<td>Memory (in MB) to allocate to each Jenkins master.</td>
<td><code>2048.0</code></td>
</tr>
</tbody>
</table>

<h3>Advanced configuration properties</h3>

<table class="table">
<thead>
<tr class="header">
<th>Property</th>
<th>Type</th>
<th>Description</th>
<th>Default Value</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>mesos-master</td>
<td>string</td>
<td>URL of this cluster’s Mesos master.</td>
<td><code>zk://leader.mesos:2181/mesos</code></td>
</tr>
<tr class="even">
<td>docker-credentials-uri</td>
<td>string</td>
<td>An optional URI to be fetched and extracted that contains Docker credentials (e.g. <a href="file:///etc/docker/docker.tar.gz" class="uri">file:///etc/docker/docker.tar.gz</a>).</td>
<td><em>No default.</em></td>
</tr>
<tr class="odd">
<td>docker-image</td>
<td>string</td>
<td>The Docker image to use for the Jenkins service. By default, this package will use the Jenkins image in the Mesosphere organization on Docker Hub, which you must be authenticated against. Otherwise, specify the host, image, and tag for the Jenkins image on your private Docker Registry.</td>
<td><em>No default.</em></td>
</tr>
<tr class="even">
<td>jvm-opts</td>
<td>string</td>
<td>Optional arguments to pass to the JVM.</td>
<td><code>-Xms1024m -Xmx1024m</code></td>
</tr>
<tr class="odd">
<td>role</td>
<td>string</td>
<td>The accepted resource roles (e.g. slave_public). By default, this will deploy to any agents with the * role.</td>
<td><code>*</code></td>
</tr>
</tbody>
</table>

<h1>Examples</h1>

<h2>Create a new instance pinned to a single host</h2>

<p>You can also specify an optional <code>pinned-hostname</code> constraint. This is useful if you don't have NFS available and need to pin Jenkins to a specific node:

<pre><code>{
    "service": {
        "name": "jenkins-pinned"
    },
    "storage": {
        "host-volume": "/var/jepnkins_data",
        "pinned-hostname": "10.0.0.100"
    }
}
</code></pre>

<h2>Modify known hosts</h2>

With the <code>known-hosts</code> option you can specify a space-separated list of hostnames to retrieve the SSH public keys from. This list will be populated on the Jenkins master when the bootstrap script runs (at container launch time). You must manually ensure that the SSH known hosts list is populated in any Jenkins agent containers. This is discussed further in <a href="/services/jenkins/custom-docker/">Customizing your Docker container</a> and you can see an example in the <a href="https://github.com/mesosphere/dcos-jenkins-dind-agent/"><code>dcos-jenkins-dind-agent</code></a> repo.

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
