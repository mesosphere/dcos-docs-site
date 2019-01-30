---
layout: layout.pug
navigationTitle:  Overview
title: Overview
menuWeight: 0
excerpt:

enterprise: false
---

# <a name="universe"></a>Package Repositories

The DC/OS Universe contains all of the services that are installable DC/OS. For more information on DC/OS Universe, see the [GitHub Universe repository][1].

All services in the package repositories are required to meet a certain standard as defined by Mesosphere. For details on submitting a DC/OS service, see [Contributing a package][2].

# <a name="adminrouter"></a>Admin Router and web interface integration

By default, a DC/OS service is deployed on a [private agent node][3]. To allow configuration control or monitoring of a service by a user, the admin router proxies calls on the master node to the service in a private node on the cluster. The HTTP service endpoint requires relative paths for artifacts and resources. The service endpoint can provide a web interface, a RESTful endpoint, or both. When creating a DC/OS CLI subcommand it is common to have a RESTful endpoint to communicate with the scheduler service.

The integration to the admin router is automatic when a framework scheduler registers a `webui_url` during the registration process with the Mesos master. There are a couple of limitations:

*   The URL must NOT end with a backslash (/). For example, this is good `internal.dcos.host.name:10000`, and this is bad `internal.dcos.host.name:10000/`.
*   DC/OS supports 1 URL and port.

When the `webui_url` is provided, the service is listed on the DC/OS web interface as a service with a link. That link is the admin router proxy URL name that is based on a naming convention of: `/service/<service_name>`. For example, `<dcos_host>/service/unicorn` is the proxy to the `webui_url`. If you provide a web interface, it will be integrated with the DC/OS web interface and users can click the link for quick access to your service.

Service health check information is provided from the DC/OS service tab when:

*   There are service health checks defined in the `marathon.json` file. For example:

>      "healthChecks": [
>      {
>        "path": "/",
>        "portIndex": 1,
>        "protocol": "HTTP",
>        "gracePeriodSeconds": 5,
>        "intervalSeconds": 60,
>        "timeoutSeconds": 10,
>        "maxConsecutiveFailures": 3
>
>

*   The `framework-name` property in the `marathon.json` file is valid. For example:

          "id": "{{kafka.framework-name}}"


*   The framework property in the `package.json` file is set to true. For example:

          "framework": true


You can provide public access to your service through the admin router or by deploying your own proxy or router to the public agent node. It is recommend to use the admin router for scheduler configuration and control allowing integration with the DC/OS web interface. It is also recommended to provide a CLI subcommand for command-line control of a RESTful service endpoint for the scheduler.

# DC/OS Service structure

Each DC/OS service contains `package.json`, `config.json`, and `marathon.json` files. The contents of these files are described in the DC/OS Service specification.

<!-- This information should be replaced with link to service spec. JSH 11/23/15 -->

*   **package.json**

    *   The `"name": "cassandra",` parameter specified here defines the DC/OS service name in the package repository. The must be the first parameter in the file.
    *   Focus the description on your service. Assume that all users are familiar with DC/OS and Mesos.
    *   The `tags` parameter is used for user searches (`dcos package search <criteria>`). Add tags that distinguish your service in some way. Avoid the following terms: Mesos, Mesosphere, DC/OS, and datacenter. For example, the unicorns service could have:

              "tags": ["rainbows", "mythical"]


    *   The `preInstallNotes` parameter gives the user information they'll need before starting the installation process. For example, you could explain what the resource requirements are for your service.

              "preInstallNotes":"Unicorns take 7 nodes with 1 core each and 1TB of ram."


    *   The `postInstallNotes` parameter gives the user information they'll need after the installation. Focus on providing a documentation URL, a tutorial, or both. For example:

              "postInstallNotes": "Thank you for installing the Unicorn service. Documentation: http://<your-url>. Issues: https://github.com/",


    *   The `postUninstallNotes` parameter gives the user information they'll need after an uninstall. For example, further cleanup before reinstalling again and a link to the details. A common issue is cleaning up ZooKeeper entries. For example:

              postUninstallNotes": "The Unicorn DC/OS Service has been uninstalled and will no longer run. Please follow the instructions at http://<your-URL> to clean up any persisted state" }


*   **config.json**

    *   The requirement block is for all properties that are required by the marathon.json file without a condition block (it is NOT properties that are not provided and thus must be supplied by the user)

*   **marathon.json**

    *   A second-level (nested) property must be the framework-name with a value of the service name. For example:

              "framework-name" : "{{unicorn-framework-name}}"


    *   Use the same value for the id parameter. For example:

              "id" : "{{unicorn-framework-name}}"


    *   All URLs used by the service must be passed to the service by using command line or environment variable

**NOTE**: All services submitted to the DC/OS package repositories are required to use versioned artifacts that do not change.

# Creating a DC/OS Service

Here is a detailed developer workflow for creating a DC/OS service:

1.  Fork the [Universe][1] repository.

2.  Create a DC/OS service in your local repository.

    1.  Name your service. For example, `unicorn`.

        The DC/OS package repository directory structure is:
        
        ```
        repo/packages/<initial-letter>/<service-name>/<version>
        ```

        Where:

        *   `<initial-letter>` is the uppercase first letter of your service name.
        *   `<service-name>` is the lowercase service name. Do not use keywords such as Apache, Mesos or DC/OS in your service name.
        *   `<version>` is the service version number.
    1.  Create a directory under `repo/packages` for your service. For example, `repo/packages/U/unicorn`.
    2.  Create a version index directory. For example, `repo/packages/U/unicorn/0`.
    3.  Add `package.json`, `config.json`, and `marathon.json` to your index directory.
    4.  If you have a CLI subcommand, create a `command.json` file and add to your index directory.

3.  Test your service on DC/OS:

    1.  Configure DC/OS to point to your local repository. For example, if your forked repository at `https://github.com/mesosphere/altuniverse` and using the `version-1.x` branch, add it to your DC/OS configuration with this command:
    2. 
        ```bash
            dcos package repo add my-repo https://github.com/mesosphere/altuniverse/archive/version-1.x.zip
        ```

# Make your service public

If your service is a Marathon application, you can make it accessible to those outside the cluster by adding labels to your application definition. The DC/OS [Admin Router](https://docs.mesosphere.com/1.8/overview/components/) reads the following labels and exposes your app at /service/<marathon-app-name>.

The labels are:

- `DCOS_SERVICE_NAME`: The name of your Marathon app.
- `DCOS_SERVICE_SCHEME`: This can be `https` or `http`.
- `DCOS_SERVICE_PORT_INDEX`: The port index can be any value greater than or equal to 0.

## Example usage

```json
"labels": [
   {
     "DCOS_SERVICE_NAME": "my-marathon-app",
     "DCOS_SERVICE_SCHEME": "https",
     "DCOS_SERVICE_PORT_INDEX": "3"
   }
]
```

# Naming and directory structure

After you add the JSON files to the index folder, there are scripts under the `<universe>/scripts` directory.

Run the package repository scripts in numerical order. If a script passes you can move on to the next script.

1.  Run the `0-validate-version.sh` script to validate the versioning.

2.  Run the `1-validate-packages.sh` script to validate the `command.json`, `config.json`, and `package.json` files against the schema.

3.  Run the `2-build-index.sh` script to add your DC/OS service to the `index.json` file.

4.  Run the `3-validate-index.sh` script to validate the `index.json` file.

For more information about the JSON files, see the [Universe Readme][1] page. <!-- ###

<a name="dcoscli"></a>DC/OS CLI The command.json schema access the service endpoint Developer notes: There currently is no support for service dependencies over riding the framework-name (service endpoint)? -->

 [1]: https://github.com/mesosphere/universe
 [2]: https://github.com/mesosphere/universe#contributing-a-package
 [3]: /1.8/overview/concepts/#private-agent-node
