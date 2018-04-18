---
layout: layout.pug
navigationTitle:  Deploying a Load-Balanced Data Pipeline
title: Deploying a Load-Balanced Data Pipeline
menuWeight: 16
excerpt:

---


In this tutorial you install and deploy a containerized Ruby on Rails app named Tweeter. Tweeter is an app similar to Twitter that you can use to post 140-character messages to the internet. Then, you use Zeppelin to perform real-time analytics on the data created by Tweeter.

Tweeter:

<ul>
<li>Stores tweets in the DC/OS <a href="/services/cassandra/">Cassandra</a> service.</li>
<li>Streams tweets to the DC/OS <a href="/services/kafka/">Kafka</a> service in real-time.</li>
<li>Performs real-time analytics with the DC/OS <a href="/services/spark/">Spark</a> and <a href="http://zeppelin.apache.org/">Zeppelin</a> services.</li>
</ul>

This tutorial demonstrates how you can build a complete load-balanced data pipeline on DC/OS in about 15 minutes! You will learn:

<ul>
<li>How to install DC/OS services.</li>
<li>How to add apps to DC/OS Marathon.</li>
<li>How to route apps to the public node with the <a href="https://github.com/mesosphere/marathon-lb">Marathon load balancer</a>.</li>
<li>How your apps are discovered.</li>
<li>How to scale your apps.</li>
</ul>

<strong>Prerequisites:</strong>

<ul>
<li>A DC/OS cluster with at least 5 <a href="/1.7/overview/concepts/">private agents</a> and 1 <a href="/1.7/overview/concepts/">public agent</a>. You can <a href="/1.7/administration/installing/ent/cloud/">deploy a cluster to the public cloud</a> or follow the <a href="/1.7/administration/installing/ent/custom/">enterprise installation instructions</a>.</li>
<li>The fully qualified domain name of your DC/OS <a href="/1.7/overview/concepts/#public">public agent</a>.</li>
</ul>

# Install the DC/OS services you'll need

<ol>
<li>From the DC/OS web interface <strong>Universe</strong> tab, install the packages with a single click.

<img src="/assets/images/webui-universe-install.png" alt="Universe UI" />

<strong>Tip:</strong> You can also install DC/OS packages from the DC/OS CLI with the <a href="/1.7/usage/cli/command-reference/"><code>dcos package install</code></a> command.

<ul>
<li><strong>Cassandra</strong> The Cassandra database is used on the backend to store the Tweeter app data. Cassandra will spin up to at least 3 nodes. You will see the Health status go from Idle to Unhealthy, and finally to Healthy as the nodes come online. This may take several minutes.</p></li>
<li><strong>Kafka</strong> The Kafka publish-subscribe message service receives tweets from Cassandra and routes them to Zeppelin for real-time analytics. Kafka will spin up 3 brokers.</p></li>
<li><p><strong>Marathon-LB</strong> The <a href="/1.7/usage/service-discovery/marathon-lb/">Marathon load balancer (Marathon-LB)</a> is a supplementary service discovery tool that can work in conjunction with native Mesos-DNS.</p></li>
<li><p><strong>Zeppelin:</strong> Zeppelin is an interactive analytics notebook that works with DC/OS Spark on the backend to enable interactive analytics and visualization. Because it's possible for Spark and Zeppelin to consume all of your cluster resources, you must specify a maximum number of cores for the Zeppelin service. Choose the <strong>Advanced Installation</strong> option when you install Zeppelin. Then, click the <strong>spark</strong> tab and set <code>cores_max</code> to <code>8</code>. Click <strong>Review and Install</strong>.

<strong>Tip:</strong> You can also do this from the DC/OS CLI:

<ul>
<li>From the DC/OS CLI, create a JSON options file, here called <code>zeppelin-options.json</code>, that sets spark.cores.max to 8:

<pre><code>{  
   "spark":{  
      "cores_max":"8"
   }
}
</code></pre></li>
</ul>

Then, pass the file to <code>dcos package install</code> using the <code>--options</code> parameter:

<pre><code>   dcos package install --options=zeppelin-options.json zeppelin
</code></pre></li>
</ul></li>
<li>Verify that the Kafka and Cassandra services are healthy before moving on to the next step. You can check that they have a status of Healthy in the DC/OS web interface or use the following commands on the DC/OS CLI:

<pre><code>dcos kafka connection
...
dcos cassandra connection
...
</code></pre></li>
</ol>

<p><strong>Note:</strong> It can take up to 10 minutes for Cassandra to initialize with DC/OS because of race conditions.

# Deploy the containerized app

In this step you deploy the containerized Tweeter app.

<ol>
<li>Go to the <a href="https://github.com/mesosphere/tweeter">Tweeter</a> GitHub repository and download the following files to your <code>dcos</code> directory:

<ul>
<li><code>tweeter.json</code></p></li>
<li><code>post-tweets.json</code></p></li>
<li><p><code>tweeter-analytics.json</code></p></li>
</ul></li>
<li><p>Modify the Marathon app definition file <code>tweeter.json</code> with vi or another text editor of your choice. A Marathon app definition file specifies the required parameters for launching an app with Marathon.

<pre><code>vi tweeter.json
</code></pre></li>
<li>Edit the <code>HAPROXY_0_VHOST</code> label to match the hostname of your public agent node. Be sure to remove the leading <code>http://</code> and the trailing <code>/</code>. If you are using AWS, this is your public ELB hostname. It should look similar to this: <code>brenden-7-publicsl-1dnroe89snjkq-221614774.us-west-2.elb.amazonaws.com</code>.

<pre><code>   {
     "labels": {
       "HAPROXY_0_VHOST": "brenden-7-publicsl-1dnroe89snjkq-221614774.us-west-2.elb.amazonaws.com"
     }
   }
</code></pre></li>
<li>Launch 3 instances of Tweeter with this command:

<pre><code>dcos marathon app add 1.7/tweeter.json
</code></pre>

<strong>Tip:</strong> The <code>instances</code> parameter in <code>tweeter.json</code> specifies the number of app instances. Use the following command to scale your app up or down:

<pre><code>dcos marathon app update tweeter instances=&lt;number_of_desired_instances&gt;
</code></pre></li>
<li>Verify that your app is added to Marathon by either finding it in the DC/OS web interface or running the following command from the DC/OS CLI:

<pre><code>dcos marathon app list
</code></pre></li>
</ol>

<p>The service talks to Cassandra via <code>node-0.cassandra.mesos:9042</code>, and Kafka via <code>broker-0.kafka.mesos:9557</code> in this example. Traffic is routed via the Marathon load balancer (Marathon-LB) because you added the HAPROXY_0_VHOST tag on the <code>tweeter.json</code> definition.

Go to the Marathon web interface to verify your app is up and healthy. Then, navigate to <code>http://&lt;public_agent_hostname&gt;</code> to see the Tweeter UI and post a Tweet.

<img src="/assets/images/tweeter.png" alt="Tweeter" />

# Post 100K Tweets

Use the <code>post-tweets.json</code> app a large number of Shakespeare tweets from a file:

<pre><code>    dcos marathon app add post-tweets.json
</code></pre>

The app will post more than 100k tweets one by one, so you'll see them coming in steadily when you refresh the page. Click the <strong>Network</strong> tab in the DC/OS web interface to see the load balancing in action:

<img src="/assets/images/network-tab.png" alt="Network Tab" />

The post-tweets app works by streaming to the VIP <code>1.1.1.1:30000</code>. This address is declared in the <code>cmd</code> parameter of the <code>post-tweets.json</code> app definition. The app uses the service discovery and load balancer service that is installed on every DC/OS node. You can see the Tweeter app defined with this VIP in the json definition under <code>VIP_0</code>.

# Add Streaming Analytics

Next, you'll perform real-time analytics on the stream of tweets coming in from Kafka.

<ol>
<li>Navigate to Zeppelin at <code>https://&lt;master_ip&gt;/service/zeppelin/</code>, click <strong>Import Note</strong> and import tweeter-analytics.json. Zeppelin is preconfigured to execute Spark jobs on the DC/OS cluster, so there is no further configuration or setup required. Be sure to use <code>https://</code>, not <code>http://</code>.

<strong>Tip:</strong> Your master IP address is the URL of the DC/OS web interface.</p></li>
<li>Navigate to <strong>Notebook</strong> > <strong>tweeter-analytics</strong>.</p></li>
<li><p>Run the Load Dependencies step to load the required libraries into Zeppelin.</p></li>
<li><p>Run the Spark Streaming step, which reads the tweet stream from ZooKeeper and puts them into a temporary table that can be queried using SparkSQL.</p></li>
<li><p>Run the Top Tweeters SQL query, which counts the number of tweets per user using the table created in the previous step. The table updates continuously as new tweets come in, so re-running the query will produce a different result every time.</p></li>
</ol>

<p><img src="/assets/images/top-tweeters.png" alt="Top Tweeters" />
