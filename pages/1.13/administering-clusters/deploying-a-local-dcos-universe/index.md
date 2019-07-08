---
layout: layout.pug
navigationTitle:  Deploying a Local Catalog
title: Deploying a Local Catalog
menuWeight: 1000
excerpt: Installing and running DC/OS services on a local Catalog datacenter
enterprise: false
render: mustache
model: /1.13/data.yml
---

<p class="message--important"><strong>IMPORTANT: </strong> If you are using DC/OS Enterprise, use <tt>package-registry</tt> for seamless management of packages in air-gapped environments. Local {{ model.packageRepo }} support is deprecated.</p>

You can install and run DC/OS services on a datacenter without Internet access by using a local [{{ model.packageRepo }}](https://github.com/mesosphere/universe). You can deploy a local {{ model.packageRepo }} that includes all Certified packages (basic), or a local {{ model.packageRepo }} that includes selected packages (advanced).

**Prerequisites:**

- [DC/OS CLI installed](/1.13/cli/install/).

- Logged into the DC/OS CLI. On DC/OS Enterprise, you must be logged in as a user with the `dcos:superuser` permission.
<p class="message--note"><strong>NOTE: </strong>As the {{ model.packageRepo }} tarball is over two gigabytes in size it may take some time to download it to your local drive and upload it to each master.</p>

# <a name="certified"></a>Certified {{ model.packageRepo }} packages

This section explains how to deploy a local {{ model.packageRepo }} containing certified {{ model.packageRepo }} packages.

1.  From a terminal prompt, use the following commands to download the local {{ model.packageRepo }} and its service definitions onto your local drive.

    ```bash
    curl -v https://downloads.mesosphere.com/universe/public/local-universe.tar.gz -o local-universe.tar.gz
    curl -v https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-http.service -o dcos-local-universe-http.service
    curl -v https://raw.githubusercontent.com/mesosphere/universe/version-3.x/docker/local-universe/dcos-local-universe-registry.service -o dcos-local-universe-registry.service
    ```

1.  Use [secure copy](https://linux.die.net/man/1/scp) (scp) to transfer the {{ model.packageRepo }} and registry files to a master node, replacing `<master-IP>` with the public IP address of a master before issuing the following commands. (You can find the public IP address of a master in the top left corner of the DC/OS UI.)

    ```bash
    scp local-universe.tar.gz core@<master-IP>:~
    scp dcos-local-universe-http.service core@<master-IP>:~
    scp dcos-local-universe-registry.service core@<master-IP>:~
    ```

1.  [SSH](/1.13/administering-clusters/sshcluster/) into the master using the following command. Replace `<master-IP>` with the IP address used in the previous commands.

    ```bash
    ssh -A core@<master-IP>
    ```

1.  Confirm that the files were successfully copied.

    ```
    ls
    ```

    You should see the following files listed.

    ```
    dcos-local-universe-http.service  
    dcos-local-universe-registry.service  
    local-universe.tar.gz
    ```

1.  Move the registry files into the `/etc/systemd/system/` directory.

    ```
    sudo mv dcos-local-universe-registry.service /etc/systemd/system/
    sudo mv dcos-local-universe-http.service /etc/systemd/system/
    ```

1.  Confirm that the files were successfully copied into `/etc/systemd/system/`.

    ```bash
    ls -la /etc/systemd/system/dcos-local-universe-*
    ```

1.  Load the {{ model.packageRepo }} into the local Docker instance. This may take some time to complete.

    ```bash
    docker load < local-universe.tar.gz
    ```

1.  Restart the `systemd` daemon.

    ```bash
    sudo systemctl daemon-reload
    ```

1.  Enable and start the `dcos-local-universe-http` and `dcos-local-universe-registry` services.

    ```bash
    sudo systemctl enable dcos-local-universe-http
    sudo systemctl enable dcos-local-universe-registry
    sudo systemctl start dcos-local-universe-http
    sudo systemctl start dcos-local-universe-registry
    ```

1.  Use the following commands to confirm that the services are now up and running.

    ```bash
    sudo systemctl status dcos-local-universe-http
    sudo systemctl status dcos-local-universe-registry
    ```
<a href="configure-multiple"></a>

## Configuring multiple masters

If you only have one master, skip to [Linking local {{ model.packageRepo }} to master](#linking) below. If you have multiple masters, continue with the following procedure.

1.  Use the following command to discover the private IP addresses of all of your masters. Identify the private IP address of the master you are SSHed into right now from the list. It will match the path shown after `core@ip-` in your prompt, where the hyphens become periods.

    ```
    host master.mesos
    ```

1.  Use [secure copy](https://linux.die.net/man/1/scp) to transfer the {{ model.packageRepo }} and registry files to one of the other masters. Replace `<master-IP>` with the IP address of the other master.

    ```bash
    scp local-universe.tar.gz core@<master-IP>:~
    scp /etc/systemd/system/dcos-local-universe-registry.service core@<master-IP>:~
    scp /etc/systemd/system/dcos-local-universe-http.service core@<master-IP>:~
    ```

1.  [SSH](/1.13/administering-clusters/sshcluster/) into the master that you just copied these files to.

    ```bash
    ssh -A core@<master_IP>
    ```

1.  Confirm that the files were successfully copied.

    ```
    ls
    ```

    You should see the following files listed.

    ```
    dcos-local-universe-http.service  dcos-local-universe-registry.service  local-universe.tar.gz
    ```

1.  Move the registry files into the `/etc/systemd/system/` directory.

    ```
    sudo mv dcos-local-universe-registry.service /etc/systemd/system/
    sudo mv dcos-local-universe-http.service /etc/systemd/system/
    ```

1.  Confirm that the files were successfully copied into `/etc/systemd/system/`.

    ```bash
    ls -la /etc/systemd/system/dcos-local-universe-*
    ```

1.  Load the {{ model.packageRepo }} into the local Docker instance. This may take some time to complete.

    ```
    docker load < local-universe.tar.gz
    ```

1.  Restart the Docker daemon.

    ```bash
    sudo systemctl daemon-reload
    ```

1.  Start the `dcos-local-universe-http` and `dcos-local-universe-registry` services.

    ```bash
    sudo systemctl start dcos-local-universe-http
    sudo systemctl start dcos-local-universe-registry
    ```

1.  Confirm that the services are now up and running.

    ```bash
    sudo systemctl status dcos-local-universe-http
    sudo systemctl status dcos-local-universe-registry
    ```

Repeat this section until you have completed this procedure for all of your masters. Then continue to the Linking local {{ model.packageRepo }} to master section below.

<a name="linking"></a>

## Linking local {{ model.packageRepo }} to master

1.  Close the SSH session by typing `exit`, or open a new terminal prompt. You may have to exit more than one SSH session if you have multiple masters.

1.  (Optional) Use the following command to remove the references to the default {{ model.packageRepo }} from your cluster. If you want to leave the default {{ model.packageRepo }} in place and just add the local {{ model.packageRepo }} as an additional repository, skip to the next step. You can also remove the references to the default {{ model.packageRepo }} repository from **Settings** > **Package Repositories** in the DC/OS web interface.

    ```bash
    dcos package repo remove {{ model.packageRepo }}
    ```


1.  Use the following command to add a reference to the local {{ model.packageRepo }}s that you added to each master.

    ```bash
    dcos package repo add local-{{ model.packageRepo }} http://master.mesos:8082/repo
    ```
    
1.  [SSH into one of your agent nodes.](/1.13/administering-clusters/sshcluster/)

    ```bash
    dcos node ssh --master-proxy --mesos-id=<mesos-id>
    ```

1.  Use the following commands to download a copy of the DC/OS certificate locally and set it as trusted.

    ```bash
    sudo mkdir -p /etc/docker/certs.d/master.mesos:5000
    sudo curl -o /etc/docker/certs.d/master.mesos:5000/ca.crt http://master.mesos:8082/certs/domain.crt
    sudo systemctl restart docker
    ```

1. Configure the Apache Mesos fetcher to trust the downloaded Docker certificate.

   1. Copy the certificate:
   ```
   sudo cp /etc/docker/certs.d/master.mesos:5000/ca.crt /var/lib/dcos/pki/tls/certs/docker-registry-ca.crt
   ```
   1. Generate a hash:
   ```
   cd /var/lib/dcos/pki/tls/certs/
   openssl x509 -hash -noout -in docker-registry-ca.crt
   ```
   1. Create a soft link. You will need to create the `/pki/tls/certs` directory on the public agent.
   ```
   sudo ln -s /var/lib/dcos/pki/tls/certs/docker-registry-ca.crt /var/lib/dcos/pki/tls/certs/<hash_number>.0
   ```
  
1.  Close the SSH session by typing `exit`, or open a new terminal prompt. Repeat these steps on each agent node.
1.  To verify your success, log into the DC/OS web interface and click the **{{ model.packageRepo }}** tab. You should see a list of Certified packages. Install one of the packages.

### FAQ

*   **I can't install CLI subcommands**

    Packages are hosted at `master.mesos:8082`. If you cannot resolve or connect to `master.mesos:8082` from your DC/OS CLI install, you cannot install CLI subcommands. If you can connect to port 8082 on your masters, add the IP for one of the masters to `/etc/hosts`.

*   **The images are broken**

    All {{ model.packageRepo }} components are hosted inside of your cluster, including the images. The components are served up by `master.mesos:8082`. If you have connectivity to that IP, you can add it to `/etc/hosts` and get the images working.

*   **I don't see the package I was looking for**

    By default, only Certified packages are bundled. If you'd like to get something else, use the instructions in the next section.

# <a name="build"></a>Selected packages

**Prerequisite:** [Git](https://git-scm.com/). On Unix/Linux, see these <a href="https://git-scm.com/book/en/v2/Getting-Started-Installing-Git" target="_blank">installation instructions</a>.

To deploy a local {{ model.packageRepo }} containing your own set of packages you must build a customized local {{ model.packageRepo }} Docker image.

1.  Clone the {{ model.packageRepo }} repository:

    ```bash
    git clone https://github.com/mesosphere/universe.git --branch version-3.x
    ```

1.  Build the `universe-base` image:

    ```bash
    cd universe/docker/local-universe/
    sudo make base
    ```

1.  Build the `mesosphere/universe` Docker image and compress it to the `local-universe.tar.gz`
file. Specify a comma-separated list of package names and versions using the `DCOS_PACKAGE_INCLUDE`
variable. To minimize the container size and download time, you can select only what you need. If you do not use the `DCOS_PACKAGE_INCLUDE` variable, all Certified {{ model.packageRepo }} packages are
included. To view which packages are Certified, click the **Catalog** tab in the DC/OS web
interface.

    ```bash
    sudo make DCOS_VERSION=1.13 DCOS_PACKAGE_INCLUDE="cassandra:1.0.25-3.0.10,marathon:1.4.2" local-universe
    ```

1.  Perform all of the steps as described in [Certified {{ model.packageRepo }} packages](#certified).

