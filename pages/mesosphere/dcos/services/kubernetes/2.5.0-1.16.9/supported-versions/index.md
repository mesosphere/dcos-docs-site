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

- [etcd](https://coreos.com/etcd/) 3.3.20.
- [Docker](https://www.docker.com/) 19.03.3.
- [Kubernetes](https://kubernetes.io/) 1.16.9.
    - [CoreDNS](https://coredns.io/) 1.6.9.
    - [Calico](https://www.projectcalico.org/) 3.13.1.
    - [Kubernetes Dashboard](https://github.com/kubernetes/dashboard/) 1.10.1.
    - [Metrics Server](https://github.com/kubernetes-incubator/metrics-server/) 0.3.6.
    - [Velero](https://velero.io/) 1.3.2.

# Package Versioning Scheme

Packages are versioned with an `a.b.c-x.y.z` format, where `a.b.c` is the version of the DC/OS integration and `x.y.z` indicates the version of Kubernetes.
For example, `1.0.0-1.9.3` indicates version `1.0.0` of the DC/OS integration and version `1.9.3` of Kubernetes.

# Debian packages installed by default

The containers providing the Mesosphere Kubernetes Engine are based on Debian Buster. The control-plane, private worker, and public worker nodes have these Debian packages included with the base image:

```bash
adduser 3.118 all
apt 1.8.2 amd64
base-files 10.3+deb10u3 amd64
base-passwd 3.5.46 amd64
bash 5.0-4 amd64
bind9-host 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
bsdutils 1:2.33.1-0.1 amd64
bzip2 1.0.6-9.2~deb10u1 amd64
ca-certificates 20200601~deb10u1 all
conntrack 1:1.4.5-2 amd64
coreutils 8.30-3 amd64
curl 7.64.0-4+deb10u1 amd64
dash 0.5.10.2-5 amd64
debconf 1.5.71 all
debian-archive-keyring 2019.1 all
debianutils 4.8.6.1 amd64
diffutils 1:3.7-3 amd64
dmsetup 2:1.02.155-3 amd64
dnsutils 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
dpkg 1.19.7 amd64
e2fsprogs 1.44.5-1+deb10u3 amd64
fdisk 2.33.1-0.1 amd64
file 1:5.35-4+deb10u1 amd64
findutils 4.6.0+git+20190209-2 amd64
gcc-8-base 8.3.0-6 amd64
geoip-database 20181108-1 all
gpgv 2.2.12-1+deb10u1 amd64
grep 3.3-1 amd64
gzip 1.9-3 amd64
hostname 3.21 amd64
init-system-helpers 1.56+nmu1 all
iproute2 4.20.0-2 amd64
iptables 1.8.2-4 amd64
jq 1.5+dfsg-2+b1 amd64
keyutils 1.6-6 amd64
kmod 26-1 amd64
krb5-locales 1.17-3 all
libacl1 2.2.53-4 amd64
libapt-pkg5.0 1.8.2 amd64
libatm1 1:2.5.1-2 amd64
libattr1 1:2.4.48-4 amd64
libaudit-common 1:2.8.4-3 all
libaudit1 1:2.8.4-3 amd64
libbind9-161 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libblkid1 2.33.1-0.1 amd64
libbz2-1.0 1.0.6-9.2~deb10u1 amd64
libc-bin 2.28-10 amd64
libc6 2.28-10 amd64
libcap-ng0 0.7.9-2 amd64
libcap2-bin 1:2.25-2 amd64
libcap2 1:2.25-2 amd64
libcom-err2 1.44.5-1+deb10u3 amd64
libcurl4 7.64.0-4+deb10u1 amd64
libdb5.3 5.3.28+dfsg1-0.5 amd64
libdebconfclient0 0.249 amd64
libdevmapper1.02.1 2:1.02.155-3 amd64
libdns1104 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libelf1 0.176-1.1 amd64
libevent-2.1-6 2.1.8-stable-4 amd64
libexpat1 2.2.6-2+deb10u1 amd64
libext2fs2 1.44.5-1+deb10u3 amd64
libfdisk1 2.33.1-0.1 amd64
libffi6 3.2.1-9 amd64
libfstrm0 0.4.0-1 amd64
libgcc1 1:8.3.0-6 amd64
libgcrypt20 1.8.4-5 amd64
libgeoip1 1.6.12-1 amd64
libgmp10 2:6.1.2+dfsg-4 amd64
libgnutls30 3.6.7-4+deb10u3 amd64
libgpg-error0 1.35-1 amd64
libgpm2 1.20.7-5 amd64
libgssapi-krb5-2 1.17-3 amd64
libhogweed4 3.4.1-1 amd64
libicu63 63.1-6+deb10u1 amd64
libidn2-0 2.0.5-1+deb10u1 amd64
libip4tc0 1.8.2-4 amd64
libip6tc0 1.8.2-4 amd64
libiptc0 1.8.2-4 amd64
libirs161 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libisc1100 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libisccc161 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libisccfg163 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
libjansson4 2.12-1 amd64
libjq1 1.5+dfsg-2+b1 amd64
libjson-c3 0.12.1+ds-2 amd64
libk5crypto3 1.17-3 amd64
libkeyutils1 1.6-6 amd64
libkmod2 26-1 amd64
libkrb5-3 1.17-3 amd64
libkrb5support0 1.17-3 amd64
libldap-2.4-2 2.4.47+dfsg-3+deb10u2 amd64
libldap-common 2.4.47+dfsg-3+deb10u2 all
liblmdb0 0.9.22-1 amd64
liblwres161 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
liblz4-1 1.8.3-1 amd64
liblzma5 5.2.4-1 amd64
libmagic-mgc 1:5.35-4+deb10u1 amd64
libmagic1 1:5.35-4+deb10u1 amd64
libmnl0 1.0.4-2 amd64
libmount1 2.33.1-0.1 amd64
libncurses6 6.1+20181013-2+deb10u2 amd64
libncursesw6 6.1+20181013-2+deb10u2 amd64
libnetfilter-conntrack3 1.0.7-1 amd64
libnettle6 3.4.1-1 amd64
libnfnetlink0 1.0.1-3+b1 amd64
libnfsidmap2 0.25-5.1 amd64
libnftables0 0.9.0-2 amd64
libnftnl11 1.1.2-2 amd64
libnghttp2-14 1.36.0-2+deb10u1 amd64
libonig5 6.9.1-1 amd64
libp11-kit0 0.23.15-2 amd64
libpam-cap 1:2.25-2 amd64
libpam-modules-bin 1.3.1-5 amd64
libpam-modules 1.3.1-5 amd64
libpam-runtime 1.3.1-5 all
libpam0g 1.3.1-5 amd64
libpcre3 2:8.39-12 amd64
libprocps7 2:3.3.15-2 amd64
libprotobuf-c1 1.3.1-1+b1 amd64
libpsl5 0.20.2-2 amd64
libpython-stdlib 2.7.16-1 amd64
libpython2-stdlib 2.7.16-1 amd64
libpython2.7-minimal 2.7.16-2+deb10u1 amd64
libpython2.7-stdlib 2.7.16-2+deb10u1 amd64
libreadline7 7.0-5 amd64
librtmp1 2.4+20151223.gitfa8646d.1-2 amd64
libsasl2-2 2.1.27+dfsg-1+deb10u1 amd64
libsasl2-modules-db 2.1.27+dfsg-1+deb10u1 amd64
libsasl2-modules 2.1.27+dfsg-1+deb10u1 amd64
libseccomp2 2.3.3-4 amd64
libselinux1 2.8-1+b1 amd64
libsemanage-common 2.8-2 all
libsemanage1 2.8-2 amd64
libsepol1 2.8-1 amd64
libsmartcols1 2.33.1-0.1 amd64
libsqlite3-0 3.27.2-3 amd64
libss2 1.44.5-1+deb10u3 amd64
libssh2-1 1.8.0-2.1 amd64
libssl1.1 1.1.1d-0+deb10u3 amd64
libstdc++6 8.3.0-6 amd64
libsystemd0 241-7~deb10u3 amd64
libtasn1-6 4.13-3 amd64
libtinfo6 6.1+20181013-2+deb10u2 amd64
libtirpc-common 1.1.4-0.4 all
libtirpc3 1.1.4-0.4 amd64
libudev1 241-7~deb10u3 amd64
libunistring2 0.9.10-1 amd64
libuuid1 2.33.1-0.1 amd64
libwrap0 7.6.q-28 amd64
libxml2 2.9.4+dfsg1-7+b3 amd64
libxtables12 1.8.2-4 amd64
libzstd1 1.3.8+dfsg-3 amd64
login 1:4.5-1.1 amd64
lsb-base 10.2019051400 all
mawk 1.3.3-17+b3 amd64
mime-support 3.62 all
mount 2.33.1-0.1 amd64
ncurses-base 6.1+20181013-2+deb10u2 all
ncurses-bin 6.1+20181013-2+deb10u2 amd64
nfs-common 1:1.3.4-2.5 amd64
nftables 0.9.0-2 amd64
openssl 1.1.1d-0+deb10u3 amd64
passwd 1:4.5-1.1 amd64
perl-base 5.28.1-6 amd64
procps 2:3.3.15-2 amd64
psmisc 23.2-1 amd64
publicsuffix 20190415.1030-1 all
python-minimal 2.7.16-1 amd64
python2-minimal 2.7.16-1 amd64
python2.7-minimal 2.7.16-2+deb10u1 amd64
python2.7 2.7.16-2+deb10u1 amd64
python2 2.7.16-1 amd64
python 2.7.16-1 amd64
readline-common 7.0-5 all
rpcbind 1.2.5-0.3+deb10u1 amd64
sed 4.7-1 amd64
sensible-utils 0.0.12 all
socat 1.7.3.2-2 amd64
sysvinit-utils 2.93-8 amd64
tar 1.30+dfsg-6 amd64
tzdata 2019c-0+deb10u1 all
ucf 3.0038+nmu1 all
util-linux 2.33.1-0.1 amd64
xz-utils 5.2.4-1 amd64
zlib1g 1:1.2.11.dfsg-1 amd64
```

# Version Policy

The DC/OS Kubernetes Service is engineered and tested to work with a specific release of [Kubernetes](https://kubernetes.io).
We select stable versions of the base technology in order to promote customer success.
We have selected the latest stable version of Kubernetes for new releases.

# Contacting Technical Support

## Mesosphere DC/OS

[Submit a request](https://support.mesosphere.com/s/).
