---
layout: layout.pug
navigationTitle: Load Bootstrap Image
title: Load Bootstrap Image
menuWeight: 10
excerpt: Setup docker in your environment, configure your local registry, and load the bootstrap image.
beta: false
enterprise: false
---
In order to use the DKP CLI, you'll have to do the following in sequential order:

* Install the Docker engine
* Load and create a local registry
* Update Docker configuration with registry reference
* Seed a local registry
* Load the bootstrap image

## Prerequisites

* Docker CE requires a minimum version of 19.03

## Setup docker

1. Add the sudo username to the docker group.

```bash
systemctl enable --now docker
groupadd docker
usermod -aG docker $SUDO_USER
```
1. Refresh your group membership by re-logging.

1. Set the environment variables.

```bash
export KOMMANDER_AIRGAPPED_TAR_FILE=kommander_image_bundle_v2.1.1_linux_amd64.tar
export REGISTRY_URL="$(hostname -I | awk '{print $1}'):5000"
```

1. Setup your local registry, as a local registry requires docker to trust the endpoint.

```bash
cat <<-EOF | sudo tee /etc/docker/daemon.json
{
  "insecure-registries" : ["$(hostname -I | awk '{print $1}'):5000"]
}
EOF
```

1. Restart docker.

```bash
systemctl restart docker
```

1. Load and start the registry image.

```bash
docker load < registry_2.tar
docker run -d --name=registry --restart=always -p 5000:5000 registry:2
```
1. Seed the local or private registry by executing the following script using the provided image bundles.

```bash
cat << seed.sh > EOF
AIRGAPPED_TAR_FILE="$@"
echo "Loading ${AIRGAPPED_TAR_FILE}"
docker load <"${AIRGAPPED_TAR_FILE}"

while read -r IMAGE; do
    echo "Processing ${IMAGE}"
    REGISTRY_IMAGE="$(echo "${IMAGE}" | sed -E "s@^(quay|k8s\.gcr|mcr\.microsoft|us\.gcr|nvcr|gcr|ghcr|docker).(io|com)@${REGISTRY_URL}@")"
    echo "Tag ${REGISTRY_IMAGE}"
    docker tag "${IMAGE}" "${REGISTRY_IMAGE}"
    docker push "${REGISTRY_IMAGE}"
done < <(tar xfO "${AIRGAPPED_TAR_FILE}" "index.json" | grep -oP '(?<="io.containerd.image.name":").*?(?=",)')

echo "Loaded ${AIRGAPPED_TAR_FILE}"
EOF

seed.sh ${KOMMANDER_AIRGAPPED_TAR_FILE}
```
## Load the bootstrap image and verify the contents

1. Once the registry has been seeded, load the bootstrap image.

    ```bash
    docker load < konvoy-bootstrap_$VERSION.tar
    ```

1. Refresh your group membership.

 Logout:  
 ```bash
 exit
 ```
 Login:
 ```bash
 ssh user@x.x.x.x
 ```

1.  Verify the contents of the air-gapped bundle.

	```bash
	rpm -qa
	```
The output should read as follows:

	```bash
	amazon-ssm-agent.rpm				      libndp-1.2-9.el7.x86_64.rpm				 polkit-pkla-compat-0.1-4.el7.x86_64.rpm
	audit-2.8.5-4.el7.x86_64.rpm			      libnetfilter_conntrack-1.0.6-1.el7_3.x86_64.rpm		 python3-3.6.8-18.el7.x86_64.rpm
	audit-libs-python-2.8.5-4.el7.x86_64.rpm	      libnetfilter_cthelper-1.0.0-11.el7.x86_64.rpm		 python3-libs-3.6.8-18.el7.x86_64.rpm
	ca-certificates-2021.2.50-72.el7_9.noarch.rpm	      libnetfilter_cttimeout-1.0.0-7.el7.x86_64.rpm		 python3-pip-9.0.3-8.el7.noarch.rpm
	checkpolicy-2.5-8.el7.x86_64.rpm		      libnetfilter_queue-1.0.2-2.el7_2.x86_64.rpm		 python3-setuptools-39.2.0-10.el7.noarch.rpm
	chrony-3.4-1.el7.x86_64.rpm			      libnfnetlink-1.0.1-4.el7.x86_64.rpm			 python-backports-1.0-8.el7.x86_64.rpm
	conntrack-tools-1.4.4-7.el7.x86_64.rpm		      libnfsidmap-0.25-19.el7.x86_64.rpm			 python-backports-ssl_match_hostname-3.5.0.1-1.el7.noarch.rpm
	containerd.io-1.4.11-3.1.el7.x86_64.rpm		      libnl3-3.2.28-4.el7.x86_64.rpm				 python-chardet-2.2.1-3.el7.noarch.rpm
	container-selinux-2.119.2-1.911c772.el7_8.noarch.rpm  libpath_utils-0.2.1-32.el7.x86_64.rpm			 python-ipaddress-1.0.16-2.el7.noarch.rpm
	cri-tools-1.22.0-0.x86_64.rpm			      libpciaccess-0.14-1.el7.x86_64.rpm			 python-IPy-0.75-6.el7.noarch.rpm
	cronie-1.4.11-23.el7.x86_64.rpm			      libref_array-0.1.5-32.el7.x86_64.rpm			 python-kitchen-1.1.1-5.el7.noarch.rpm
	cronie-anacron-1.4.11-23.el7.x86_64.rpm		      libseccomp-2.3.1-4.el7.x86_64.rpm				 python-netifaces-0.10.4-3.el7.x86_64.rpm
	crontabs-1.11-6.20121102git.el7.noarch.rpm	      libselinux-python-2.5-15.el7.x86_64.rpm			 python-requests-2.6.0-10.el7.noarch.rpm
	curl-7.29.0-59.el7_9.1.x86_64.rpm		      libselinux-utils-2.5-15.el7.x86_64.rpm			 python-six-1.9.0-2.el7.noarch.rpm
	e2fsprogs-libs-1.42.9-19.el7.x86_64.rpm		      libsemanage-python-2.5-14.el7.x86_64.rpm			 python-urllib3-1.10.2-7.el7.noarch.rpm
	ebtables-2.0.10-16.el7.x86_64.rpm		      libsmartcols-2.23.2-65.el7_9.1.x86_64.rpm			 quota-4.01-19.el7.x86_64.rpm
	ethtool-4.8-10.el7.x86_64.rpm			      libtirpc-0.2.4-0.16.el7.x86_64.rpm			 quota-nls-4.01-19.el7.noarch.rpm
	fuse-2.9.2-11.el7.x86_64.rpm			      libtool-ltdl-2.4.2-22.el7_3.x86_64.rpm			 repodata
	fuse-libs-2.9.2-11.el7.x86_64.rpm		      libuuid-2.23.2-65.el7_9.1.x86_64.rpm			 rpcbind-0.2.0-49.el7.x86_64.rpm
	gssproxy-0.7.0-30.el7_9.x86_64.rpm		      libverto-libevent-0.2.5-4.el7.x86_64.rpm			 selinux-policy-3.13.1-268.el7_9.2.noarch.rpm
	hwdata-0.252-9.7.el7.x86_64.rpm			      libxml2-2.9.1-6.el7_9.6.x86_64.rpm			 selinux-policy-targeted-3.13.1-268.el7_9.2.noarch.rpm
	iproute-4.11.0-30.el7.x86_64.rpm		      libxml2-python-2.9.1-6.el7_9.6.x86_64.rpm			 setools-libs-3.3.8-4.el7.x86_64.rpm
	iptables-1.4.21-35.el7.x86_64.rpm		      libxslt-1.1.28-6.el7.x86_64.rpm				 socat-1.7.3.2-2.el7.x86_64.rpm
	keyutils-1.5.8-3.el7.x86_64.rpm			      lm_sensors-libs-3.4.0-8.20160601gitf9185e5.el7.x86_64.rpm  sysstat-10.1.5-19.el7.x86_64.rpm
	kubeadm-1.21.6-0.x86_64.rpm			      mozjs17-17.0.0-20.el7.x86_64.rpm				 systemd-219-78.el7_9.3.x86_64.rpm
	kubectl-1.21.6-0.x86_64.rpm			      NetworkManager-1.18.8-2.el7_9.x86_64.rpm			 systemd-libs-219-78.el7_9.3.x86_64.rpm
	kubelet-1.21.6-0.x86_64.rpm			      NetworkManager-libnm-1.18.8-2.el7_9.x86_64.rpm		 systemd-sysv-219-78.el7_9.3.x86_64.rpm
	kubernetes-cni-0.8.7-0.x86_64.rpm		      nfs-utils-1.3.0-0.68.el7.2.x86_64.rpm			 tcp_wrappers-7.6-77.el7.x86_64.rpm
	libbasicobjects-0.1.1-32.el7.x86_64.rpm		      nspr-4.32.0-1.el7_9.x86_64.rpm				 tcp_wrappers-libs-7.6-77.el7.x86_64.rpm
	libblkid-2.23.2-65.el7_9.1.x86_64.rpm		      nss-3.67.0-4.el7_9.x86_64.rpm				 tzdata-2021e-1.el7.noarch.rpm
	libcgroup-0.41-21.el7.x86_64.rpm		      nss-softokn-3.67.0-3.el7_9.x86_64.rpm			 util-linux-2.23.2-65.el7_9.1.x86_64.rpm
	libcollection-0.7.0-32.el7.x86_64.rpm		      nss-softokn-freebl-3.67.0-3.el7_9.x86_64.rpm		 which-2.20-7.el7.x86_64.rpm
	libcurl-7.29.0-59.el7_9.1.x86_64.rpm		      nss-tools-3.67.0-4.el7_9.x86_64.rpm			 wpa_supplicant-2.6-12.el7_9.2.x86_64.rpm
	libdrm-2.4.97-2.el7.x86_64.rpm			      nss-util-3.67.0-1.el7_9.x86_64.rpm			 xmlsec1-1.2.20-7.el7_4.x86_64.rpm
	libedit-3.0-12.20121213cvs.el7.x86_64.rpm	      open-vm-tools-11.0.5-3.el7_9.3.x86_64.rpm			 xmlsec1-openssl-1.2.20-7.el7_4.x86_64.rpm
	libevent-2.0.21-4.el7.x86_64.rpm		      pciutils-3.5.1-3.el7.x86_64.rpm				 yum-plugin-ovl-1.1.31-54.el7_8.noarch.rpm
	libini_config-1.3.1-32.el7.x86_64.rpm		      pciutils-libs-3.5.1-3.el7.x86_64.rpm			 yum-plugin-versionlock-1.1.31-54.el7_8.noarch.rpm
	libmnl-1.0.3-7.el7.x86_64.rpm			      policycoreutils-2.5-34.el7.x86_64.rpm			 yum-utils-1.1.31-54.el7_8.noarch.rpm
	libmount-2.23.2-65.el7_9.1.x86_64.rpm		      policycoreutils-python-2.5-34.el7.x86_64.rpm
	libmspack-0.5-0.8.alpha.el7.x86_64.rpm		      polkit-0.112-26.el7.x86_64.rpm
	```
 <p class="message--note"><strong>NOTE: </strong>The version numbers of the files included within the air-gapped bundle may be different than the versions listed above.</p>

## RHEL 7.9 GPG Keys

RHEL 7.9 requires copying the CentOS mirror GPG Key to all nodes.

1. Copy the CentOS mirror GPG key to all of the nodes.

	```bash
	curl -O http://mirror.centos.org/centos/RPM-GPG-KEY-CentOS-7
	```

1. 	Move the GPG key to the Bastion node.

	```bash
	scp RPM-GPG-KEY-CentOS-7 <user>@<bastion_host>:~/
	```
1. 	Log in to the Bastion host using the same credentials from the previous step.

	```bash
	ssh <user>@<bastion_host>
	```

1. 	Then, copy the GPG key to all nodes.

	```bash
	scp RPM-GPG-KEY-CentOS-7 <user>@<node-1-3>:/tmp/RPM-GPG-KEY-CentOS-7
	```
1.	Refresh your group membership.

	```bash
	// Logout
	exit

	// Login
	ssh user@x.x.x.x
  ```
After a successful login, move on to setting up Konvoy Image Builder.
