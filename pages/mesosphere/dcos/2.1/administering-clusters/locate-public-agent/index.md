---
layout: layout.pug
navigationTitle:  Finding a Public Agent IP
title: Finding a Public Agent IP
menuWeight: 3
excerpt: Finding a public agent IP address
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---
After you have installed DC/OS with a public agent node declared, you can navigate to the public IP address of your public agent node. You can expose the public-facing IP address for an agent as a gateway for access to services that are running inside the DC/OS cluster. For example, if you are configuring load balancing to distribute inbound requests to the services in a cluster, the requests are typically routed through the public IP address frontend to an appropriate service instance backend isolated behind a firewall. 

# Before you begin
- You must have DC/OS installed with at least one master node and at least one [public agent](/mesosphere/dcos/2.0/overview/concepts/#public-agent-node) node.
- You must have the most recent version of the DC/OS [CLI](/mesosphere/dcos/2.0/cli/) installed.
- You must have [secure shell (SSH)](/mesosphere/dcos/2.0/administering-clusters/sshcluster/) installed and configured to allow remote session access to cluster nodes.
- You should have [jq](https://github.com/stedolan/jq/wiki/Installation) or [Python](https://www.python.org/) installed if you want to format the output from an API call.
  You can also use [jq](https://github.com/stedolan/jq/wiki/Installation) or another program to find public agent IP addresses if you are using an older version of the DC/OS cluster. 

<p class="message--note"><strong>NOTE: </strong>You can look up the public agent IP address using the DC/OS web-based console, command-line interface, or API calls for DC/OS cluster nodes if DC/OS is deployed on a public cloud provider such as AWS, Google Cloud, or Azure. If DC/OS is installed on an internal network (on-premise) or a private cloud, nodes do not typically have separate public and private IP addresses. For nodes on an internal network or private cloud, the public IP address is often the same as the IP address defined for the server in the DNS namespace.</p>

# Viewing public IP addresses in the DC/OS console
You can view the public agent IP addresses for the nodes in a cluster interactively from the DC/OS web-based administrative console.

To view public IP addresses using the DC/OS web-based console:
1. Open a web browser and log in with administrative user name and password.

1. Click **Nodes** to display information about your agent nodes.

1. Check the **Public IP** column to determine the public-facing IP address for the agent node you want to expose.

    For example:
    <p>
    <img src="/mesosphere/dcos/2.0/img/node-public-ip-address.png" alt="Viewing the public-facing IP address for cluster nodes">
    </p>

    In most cases, looking up the public-facing IP address for an agent node is sufficient. You can, however, also look up the public IP address for master nodes, if needed. If you need to find the public IP address for a master node, use the `dcos node list` [command](#public-ip-cmd) or the `net/v1/nodes` [API call](#public-ip-api).

<a name="public-ip-cmd"></a>

# Listing public IP addresses from the command line
You can list the public agent IP addresses for the nodes in a cluster interactively or programmatically using the DC/OS core command-line interface (CLI).

To list public IP addresses using the DC/OS CLI:
1. Open a shell terminal. 

1. Run the following command:
    ```bash
    dcos node list
    ```

1. Review the command output to locate the public-facing IP address for a node designated as a public agent.

    For example, the command returns node information similar to the following:
    ```bash
    HOSTNAME         IP       PUBLIC IP(S)                     ID                           TYPE           REGION           ZONE       
    10.0.5.46      10.0.5.46   34.223.48.55    ecb5e39c-2d3e-4eea-8c07-af0c4e9e8443-S1  agent (public)    aws/us-west-2  aws/us-west-2d  
    10.0.1.112     10.0.1.112                  ecb5e39c-2d3e-4eea-8c07-af0c4e9e8443-S0  agent             aws/us-west-2  aws/us-west-2d  
    master.mesos.  10.0.6.157  34.222.201.246  ecb5e39c-2d3e-4eea-8c07-af0c4e9e8443     master (leader)   aws/us-west-2  aws/us-west-2d  
    master.mesos.  10.0.7.169  34.223.44.83    N/A                                      master (standby)  aws/us-west-2  N/A             
    master.mesos.  10.0.7.38   34.222.181.165  N/A                                      master (standby)  aws/us-west-2  N/A             
    ```

    From this output, you can identify the specific public-facing IP addresses to use for both public and private agent nodes and for master nodes.

    In this example, there is one public IP address for the public agent:
    - 34.223.48.55
    
    There are three public IP addresses for the master nodes:
    - 34.222.201.246 (leader)
    - 34.223.44.83 (standby)
    - 34.222.181.165 (standby)

    There are no public-facing IP addresses available for the private agent node. 

    In most cases, you can use this command to verify both the private and public IP addresses for each node. You should keep in mind, however, that the public and private IP addresses returned might not be accurate if the Edge-LB pool uses virtual networks.

<a name="public-ip-api"></a>

# Finding a public IP address using an API call
The DC/OS application programming interface (API) provides the underlying functionality that you can access through the DC/OS web-based administrative console and command-line interface (CLI). In most cases, therefore, you only use the API directly if you are integrating the API call in a custom program or automation script. However, you can retrieve the public IP addresses for public agents directly through calls to the DC/OS application programming interface (API) for networking, if needed.

To find public IP addresses by using the DC/OS API:
1. Identify the URL for a DC/OS cluster running on a public cloud instance.

1. Use the following REST API `net/v1/nodes` endpoint to find the public IP of the public agents:

    ```bash
    <cluster-url>/net/v1/nodes
    ```

    For example, you might issue a call with a cluster URL similar to the following to specify where the DC/OS cluster is running:
    ```bash
    http://luxi-sf7-elasticl-u70m3un6kcab-1100943753.us-west-2.elb.amazonaws.com/net/v1/nodes
    ```

1. Review the command output.

    If you have a user account that is authorized to access the cluster and retrieve node information, this API call returns node and IP information in an unfiltered format.

## Looking up addresses from a master node
If you are calling the API endpoint directly, you can find the public IP addresses by using the client URL (`cURL`) command from a master node. For example, you can find the public-facing IP addresses for public agents using the following cURL command: 

```bash
curl -skSL -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/net/v1/nodes
```

This command sets the authorization token and identifies the cluster URL using the `dcos config show` commands and returns raw output similar to the following: 

```bash
[{"updated":"2019-01-07T22:22:22.171Z","public_ips":["34.212.37.79"],"private_ip":"10.0.6.210","hostname":"ip-10-0-6-210"},{"updated":"2019-01-07T22:22:22.119Z","public_ips":["52.25.254.97"],"private_ip":"10.0.6.181","hostname":"ip-10-0-6-181"},{"updated":"2019-01-07T22:21:09.585Z","public_ips":["54.218.23.75"],"private_ip":"10.0.6.148","hostname":"ip-10-0-6-148"},{"updated":"2019-01-07T22:22:28.582Z","public_ips":[],"private_ip":"10.0.1.139","hostname":"ip-10-0-1-139"},{"updated":"2019-01-07T22:22:28.649Z","public_ips":[],"private_ip":"10.0.0.138","hostname":"ip-10-0-0-138"}]
```

<!--You can also execute the cURL command directly on a master node to find the public IP addresses for public agents from a central location using a command similar to the following: 

```bash
curl http://localhost:62080/v1/nodes
```

This command output displays the public IP addresses of the same public agents that are running on the DC/OS cluster. For example: 

    ```bash
    curl http://localhost:62080/v1/nodes
    [{"updated":"2019-01-07T22:22:22.171Z","public_ips":["34.212.37.79"],"private_ip":"10.0.6.210","hostname":"ip-10-0-6-210"},{"updated":"2019-01-07T22:22:22.119Z","public_ips":["52.25.254.97"],"private_ip":"10.0.6.181","hostname":"ip-10-0-6-181"},{"updated":"2019-01-07T22:21:09.585Z","public_ips":["54.218.23.75"],"private_ip":"10.0.6.148","hostname":"ip-10-0-6-148"},{"updated":"2019-01-07T22:22:28.582Z","public_ips":[],"private_ip":"10.0.1.139","hostname":"ip-10-0-1-139"},{"updated":"2019-01-07T22:22:28.649Z","public_ips":[],"private_ip":"10.0.0.138","hostname":"ip-10-0-0-138"}]
    ```

    In both of these examples, there are three public IP addresses, one for each of the public agent nodes:
    - 34.212.37.79
    - 52.25.254.97
    - 54.218.23.75

    As with the previous example, there are no public IP addresses available for the private nodes. 
-->

## Formatting API output
If you have `jq` or `python` installed, you can parse the API output to display node information using more readable JSON formatting. For example, you can execute the API call and pass the output to `jq` for formatting by running the following command:

```bash
curl -skSL -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/net/v1/nodes | jq
```

This command returns formatted output for the information retrieved similar to the following:

```json
[
  {
    "updated": "2019-01-07T22:22:22.171Z",
    "public_ips": [
      "34.212.37.79"
    ],
    "private_ip": "10.0.6.210",
    "hostname": "ip-10-0-6-210"
  },
  {
    "updated": "2019-01-07T22:22:22.119Z",
    "public_ips": [
      "52.25.254.97"
    ],
    "private_ip": "10.0.6.181",
    "hostname": "ip-10-0-6-181"
  },
  {
    "updated": "2019-01-07T22:21:09.585Z",
    "public_ips": [
      "54.218.23.75"
    ],
    "private_ip": "10.0.6.148",
    "hostname": "ip-10-0-6-148"
  },
  {
    "updated": "2019-01-07T22:22:28.582Z",
    "public_ips": [],
    "private_ip": "10.0.1.139",
    "hostname": "ip-10-0-1-139"
  },
  {
    "updated": "2019-01-07T22:22:28.649Z",
    "public_ips": [],
    "private_ip": "10.0.0.138",
    "hostname": "ip-10-0-0-138"
  }
]
```

In these API examples, there are three public IP addresses for the public agent and master nodes:
- 34.212.37.79
- 52.25.254.97
- 54.218.23.75

As illustrated in the example, there are no public IP addresses available for the private agent nodes. For private agent nodes, the API call returns an empty value for the setting (`"public_ips": []`).

# Executing a query to return the public IP addresses
If you are working with an older version of the DC/OS cluster, you can find your public agent IP address by executing a `jq` query in a script or from the command-line in a shell terminal. The following sample script uses a `jq` query to open a secure shell (SSH) session on the DC/OS cluster to obtain cluster information then queries [ifconfig.co](https://ifconfig.co/) to determine the public IP address.

```bash
for id in $(dcos node --json | jq --raw-output '.[] | select(.attributes.public_ip == "true") | .id'); do dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --mesos-id=$id "curl -s ifconfig.co" ; done 2>/dev/null
```

The following is an example that returns the public IP address `52.39.29.79`:

```
for id in $(dcos node --json | jq --raw-output '.[] | select(.attributes.public_ip == "true") | .id'); do dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --mesos-id=$id "curl -s ifconfig.co" ; done 2>/dev/null
52.39.29.79
```
