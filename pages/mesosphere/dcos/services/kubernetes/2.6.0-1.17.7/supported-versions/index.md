---
navigationTitle: Supported Versions
title: Supported Versions
menuWeight: 80
excerpt: Understanding DC/OS Kubernetes versions and policies
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Supported and Bundled Versions

DC/OS Kubernetes supports the following versions of DC/OS and DC/OS Enterprise:

- [DC/OS](https://dcos.io/) 1.12 or later.

DC/OS Kubernetes bundles the following versions of the base technology:

- [etcd](https://coreos.com/etcd/) 3.3.22.
- [Docker](https://www.docker.com/) 19.03.8.
- [Kubernetes](https://kubernetes.io/) 1.17.7.
    - [CoreDNS](https://coredns.io/) 1.7.0.
    - [Calico](https://www.projectcalico.org/) 3.14.1.
    - [Kubernetes Dashboard](https://github.com/kubernetes/dashboard/) 1.10.1.
    - [Metrics Server](https://github.com/kubernetes-incubator/metrics-server/) 0.3.6.
    - [Velero](https://velero.io/) 1.4.0.

# Package Versioning Scheme

Packages are versioned with an `a.b.c-x.y.z` format, where `a.b.c` is the version of the DC/OS integration and `x.y.z` indicates the version of Kubernetes.
For example, `1.0.0-1.9.3` indicates version `1.0.0` of the DC/OS integration and version `1.9.3` of Kubernetes.

# Debian packages installed by default

The containers providing the Mesosphere Kubernetes Engine are based on Debian Buster. The control-plane, private worker, and public worker nodes have these Debian packages included with the base image:

```bash
adduser/now 3.118 all
apt/now 1.8.2.1 amd64
base-files/now 10.3+deb10u4 amd64
base-passwd/now 3.5.46 amd64
bash/now 5.0-4 amd64
bind9-host/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
bsdutils/now 1:2.33.1-0.1 amd64
bzip2/now 1.0.6-9.2~deb10u1 amd64
ca-certificates/now 20200601~deb10u1 all
conntrack/now 1:1.4.5-2 amd64
coreutils/now 8.30-3 amd64
curl/now 7.64.0-4+deb10u1 amd64
dash/now 0.5.10.2-5 amd64
debconf/now 1.5.71 all
debian-archive-keyring/now 2019.1 all
debianutils/now 4.8.6.1 amd64
diffutils/now 1:3.7-3 amd64
dmsetup/now 2:1.02.155-3 amd64
dnsutils/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
dpkg/now 1.19.7 amd64
e2fsprogs/now 1.44.5-1+deb10u3 amd64
ethtool/now 1:4.19-1 amd64
fdisk/now 2.33.1-0.1 amd64
file/now 1:5.35-4+deb10u1 amd64
findutils/now 4.6.0+git+20190209-2 amd64
gcc-8-base/now 8.3.0-6 amd64
geoip-database/now 20181108-1 all
gpgv/now 2.2.12-1+deb10u1 amd64
grep/now 3.3-1 amd64
gzip/now 1.9-3 amd64
hostname/now 3.21 amd64
init-system-helpers/now 1.56+nmu1 all
iproute2/now 4.20.0-2 amd64
iptables/now 1.8.2-4 amd64
iputils-ping/now 3:20180629-2+deb10u1 amd64
jq/now 1.5+dfsg-2+b1 amd64
keyutils/now 1.6-6 amd64
kmod/now 26-1 amd64
krb5-locales/now 1.17-3 all
libacl1/now 2.2.53-4 amd64
libapt-pkg5.0/now 1.8.2.1 amd64
libatm1/now 1:2.5.1-2 amd64
libattr1/now 1:2.4.48-4 amd64
libaudit-common/now 1:2.8.4-3 all
libaudit1/now 1:2.8.4-3 amd64
libbind9-161/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libblkid1/now 2.33.1-0.1 amd64
libbz2-1.0/now 1.0.6-9.2~deb10u1 amd64
libc-bin/now 2.28-10 amd64
libc6/now 2.28-10 amd64
libcap-ng0/now 0.7.9-2 amd64
libcap2-bin/now 1:2.25-2 amd64
libcap2/now 1:2.25-2 amd64
libcom-err2/now 1.44.5-1+deb10u3 amd64
libcurl4/now 7.64.0-4+deb10u1 amd64
libdb5.3/now 5.3.28+dfsg1-0.5 amd64
libdebconfclient0/now 0.249 amd64
libdevmapper1.02.1/now 2:1.02.155-3 amd64
libdns1104/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libelf1/now 0.176-1.1 amd64
libevent-2.1-6/now 2.1.8-stable-4 amd64
libexpat1/now 2.2.6-2+deb10u1 amd64
libext2fs2/now 1.44.5-1+deb10u3 amd64
libfdisk1/now 2.33.1-0.1 amd64
libffi6/now 3.2.1-9 amd64
libfstrm0/now 0.4.0-1 amd64
libgcc1/now 1:8.3.0-6 amd64
libgcrypt20/now 1.8.4-5 amd64
libgeoip1/now 1.6.12-1 amd64
libgmp10/now 2:6.1.2+dfsg-4 amd64
libgnutls30/now 3.6.7-4+deb10u4 amd64
libgpg-error0/now 1.35-1 amd64
libgpm2/now 1.20.7-5 amd64
libgssapi-krb5-2/now 1.17-3 amd64
libhogweed4/now 3.4.1-1 amd64
libicu63/now 63.1-6+deb10u1 amd64
libidn2-0/now 2.0.5-1+deb10u1 amd64
libip4tc0/now 1.8.2-4 amd64
libip6tc0/now 1.8.2-4 amd64
libiptc0/now 1.8.2-4 amd64
libirs161/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libisc1100/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libisccc161/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libisccfg163/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libjansson4/now 2.12-1 amd64
libjq1/now 1.5+dfsg-2+b1 amd64
libjson-c3/now 0.12.1+ds-2 amd64
libk5crypto3/now 1.17-3 amd64
libkeyutils1/now 1.6-6 amd64
libkmod2/now 26-1 amd64
libkrb5-3/now 1.17-3 amd64
libkrb5support0/now 1.17-3 amd64
libldap-2.4-2/now 2.4.47+dfsg-3+deb10u2 amd64
libldap-common/now 2.4.47+dfsg-3+deb10u2 all
liblmdb0/now 0.9.22-1 amd64
liblwres161/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
liblz4-1/now 1.8.3-1 amd64
liblzma5/now 5.2.4-1 amd64
libmagic-mgc/now 1:5.35-4+deb10u1 amd64
libmagic1/now 1:5.35-4+deb10u1 amd64
libmnl0/now 1.0.4-2 amd64
libmount1/now 2.33.1-0.1 amd64
libncurses6/now 6.1+20181013-2+deb10u2 amd64
libncursesw6/now 6.1+20181013-2+deb10u2 amd64
libnetfilter-conntrack3/now 1.0.7-1 amd64
libnettle6/now 3.4.1-1 amd64
libnfnetlink0/now 1.0.1-3+b1 amd64
libnfsidmap2/now 0.25-5.1 amd64
libnftables0/now 0.9.0-2 amd64
libnftnl11/now 1.1.2-2 amd64
libnghttp2-14/now 1.36.0-2+deb10u1 amd64
libonig5/now 6.9.1-1 amd64
libp11-kit0/now 0.23.15-2 amd64
libpam-cap/now 1:2.25-2 amd64
libpam-modules-bin/now 1.3.1-5 amd64
libpam-modules/now 1.3.1-5 amd64
libpam-runtime/now 1.3.1-5 all
libpam0g/now 1.3.1-5 amd64
libpcre3/now 2:8.39-12 amd64
libprocps7/now 2:3.3.15-2 amd64
libprotobuf-c1/now 1.3.1-1+b1 amd64
libpsl5/now 0.20.2-2 amd64
libpython-stdlib/now 2.7.16-1 amd64
libpython2-stdlib/now 2.7.16-1 amd64
libpython2.7-minimal/now 2.7.16-2+deb10u1 amd64
libpython2.7-stdlib/now 2.7.16-2+deb10u1 amd64
libreadline7/now 7.0-5 amd64
librtmp1/now 2.4+20151223.gitfa8646d.1-2 amd64
libsasl2-2/now 2.1.27+dfsg-1+deb10u1 amd64
libsasl2-modules-db/now 2.1.27+dfsg-1+deb10u1 amd64
libsasl2-modules/now 2.1.27+dfsg-1+deb10u1 amd64
libseccomp2/now 2.3.3-4 amd64
libselinux1/now 2.8-1+b1 amd64
libsemanage-common/now 2.8-2 all
libsemanage1/now 2.8-2 amd64
libsepol1/now 2.8-1 amd64
libsmartcols1/now 2.33.1-0.1 amd64
libsqlite3-0/now 3.27.2-3 amd64
libss2/now 1.44.5-1+deb10u3 amd64
libssh2-1/now 1.8.0-2.1 amd64
libssl1.1/now 1.1.1d-0+deb10u3 amd64
libstdc++6/now 8.3.0-6 amd64
libsystemd0/now 241-7~deb10u4 amd64
libtasn1-6/now 4.13-3 amd64
libtinfo6/now 6.1+20181013-2+deb10u2 amd64
libtirpc-common/now 1.1.4-0.4 all
libtirpc3/now 1.1.4-0.4 amd64
libudev1/now 241-7~deb10u4 amd64
libunistring2/now 0.9.10-1 amd64
libuuid1/now 2.33.1-0.1 amd64
libwrap0/now 7.6.q-28 amd64
libxml2/now 2.9.4+dfsg1-7+b3 amd64
libxtables12/now 1.8.2-4 amd64
libzstd1/now 1.3.8+dfsg-3 amd64
login/now 1:4.5-1.1 amd64
lsb-base/now 10.2019051400 all
mawk/now 1.3.3-17+b3 amd64
mime-support/now 3.62 all
mount/now 2.33.1-0.1 amd64
ncurses-base/now 6.1+20181013-2+deb10u2 all
ncurses-bin/now 6.1+20181013-2+deb10u2 amd64
nfs-common/now 1:1.3.4-2.5 amd64
nftables/now 0.9.0-2 amd64
openssl/now 1.1.1d-0+deb10u3 amd64
passwd/now 1:4.5-1.1 amd64
perl-base/now 5.28.1-6 amd64
procps/now 2:3.3.15-2 amd64
psmisc/now 23.2-1 amd64
publicsuffix/now 20190415.1030-1 all
python-minimal/now 2.7.16-1 amd64
python2-minimal/now 2.7.16-1 amd64
python2.7-minimal/now 2.7.16-2+deb10u1 amd64
python2.7/now 2.7.16-2+deb10u1 amd64
python2/now 2.7.16-1 amd64
python/now 2.7.16-1 amd64
readline-common/now 7.0-5 all
rpcbind/now 1.2.5-0.3+deb10u1 amd64
sed/now 4.7-1 amd64
sensible-utils/now 0.0.12 all
socat/now 1.7.3.2-2 amd64
sysvinit-utils/now 2.93-8 amd64
tar/now 1.30+dfsg-6 amd64
tzdata/now 2020a-0+deb10u1 all
ucf/now 3.0038+nmu1 all
util-linux/now 2.33.1-0.1 amd64
xz-utils/now 5.2.4-1 amd64
zlib1g/now 1:1.2.11.dfsg-1 amd64
```

# Version Policy

The DC/OS Kubernetes Service is engineered and tested to work with a specific release of [Kubernetes](https://kubernetes.io).
We select stable versions of the base technology in order to promote customer success.
We have selected the latest stable version of Kubernetes for new releases.

# Contacting Technical Support

## Mesosphere DC/OS

[Submit a request](https://support.mesosphere.com/s/).
