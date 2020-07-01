---
layout: layout.pug
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
- [Docker](https://www.docker.com/) 19.03.11.
- [Kubernetes](https://kubernetes.io/) 1.17.8.
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
mapt/now 1.8.2.1 amd64
mbase-files/now 10.3+deb10u4 amd64
mbase-passwd/now 3.5.46 amd64
mbash/now 5.0-4 amd64
mbind9-host/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
mbsdutils/now 1:2.33.1-0.1 amd64
mbzip2/now 1.0.6-9.2~deb10u1 amd64
mca-certificates/now 20200601~deb10u1 all
mconntrack/now 1:1.4.5-2 amd64
mcoreutils/now 8.30-3 amd64
mcurl/now 7.64.0-4+deb10u1 amd64
mdash/now 0.5.10.2-5 amd64
mdebconf/now 1.5.71 all
mdebian-archive-keyring/now 2019.1 all
mdebianutils/now 4.8.6.1 amd64
mdiffutils/now 1:3.7-3 amd64
mdmsetup/now 2:1.02.155-3 amd64
mdnsutils/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
mdpkg/now 1.19.7 amd64
me2fsprogs/now 1.44.5-1+deb10u3 amd64
methtool/now 1:4.19-1 amd64
mfdisk/now 2.33.1-0.1 amd64
mfile/now 1:5.35-4+deb10u1 amd64
mfindutils/now 4.6.0+git+20190209-2 amd64
mgcc-8-base/now 8.3.0-6 amd64
mgeoip-database/now 20181108-1 all
mgpgv/now 2.2.12-1+deb10u1 amd64
mgrep/now 3.3-1 amd64
mgzip/now 1.9-3 amd64
mhostname/now 3.21 amd64
minit-system-helpers/now 1.56+nmu1 all
miproute2/now 4.20.0-2 amd64
miptables/now 1.8.2-4 amd64
miputils-ping/now 3:20180629-2+deb10u1 amd64
mjq/now 1.5+dfsg-2+b1 amd64
mkeyutils/now 1.6-6 amd64
mkmod/now 26-1 amd64
mkrb5-locales/now 1.17-3 all
mlibacl1/now 2.2.53-4 amd64
mlibapt-pkg5.0/now 1.8.2.1 amd64
mlibatm1/now 1:2.5.1-2 amd64
mlibattr1/now 1:2.4.48-4 amd64
mlibaudit-common/now 1:2.8.4-3 all
mlibaudit1/now 1:2.8.4-3 amd64
mlibbind9-161/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
mlibblkid1/now 2.33.1-0.1 amd64
mlibbz2-1.0/now 1.0.6-9.2~deb10u1 amd64
mlibc-bin/now 2.28-10 amd64
mlibc6/now 2.28-10 amd64
mlibcap-ng0/now 0.7.9-2 amd64
mlibcap2-bin/now 1:2.25-2 amd64
mlibcap2/now 1:2.25-2 amd64
mlibcom-err2/now 1.44.5-1+deb10u3 amd64
mlibcurl4/now 7.64.0-4+deb10u1 amd64
mlibdb5.3/now 5.3.28+dfsg1-0.5 amd64
mlibdebconfclient0/now 0.249 amd64
mlibdevmapper1.02.1/now 2:1.02.155-3 amd64
mlibdns1104/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
mlibelf1/now 0.176-1.1 amd64
mlibevent-2.1-6/now 2.1.8-stable-4 amd64
mlibexpat1/now 2.2.6-2+deb10u1 amd64
mlibext2fs2/now 1.44.5-1+deb10u3 amd64
mlibfdisk1/now 2.33.1-0.1 amd64
mlibffi6/now 3.2.1-9 amd64
mlibfstrm0/now 0.4.0-1 amd64
mlibgcc1/now 1:8.3.0-6 amd64
mlibgcrypt20/now 1.8.4-5 amd64
mlibgeoip1/now 1.6.12-1 amd64
mlibgmp10/now 2:6.1.2+dfsg-4 amd64
mlibgnutls30/now 3.6.7-4+deb10u4 amd64
mlibgpg-error0/now 1.35-1 amd64
mlibgpm2/now 1.20.7-5 amd64
mlibgssapi-krb5-2/now 1.17-3 amd64
mlibhogweed4/now 3.4.1-1 amd64
mlibicu63/now 63.1-6+deb10u1 amd64
mlibidn2-0/now 2.0.5-1+deb10u1 amd64
mlibip4tc0/now 1.8.2-4 amd64
mlibip6tc0/now 1.8.2-4 amd64
mlibiptc0/now 1.8.2-4 amd64
mlibirs161/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
mlibisc1100/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
mlibisccc161/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
mlibisccfg163/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
mlibjansson4/now 2.12-1 amd64
mlibjq1/now 1.5+dfsg-2+b1 amd64
mlibjson-c3/now 0.12.1+ds-2 amd64
mlibk5crypto3/now 1.17-3 amd64
mlibkeyutils1/now 1.6-6 amd64
mlibkmod2/now 26-1 amd64
mlibkrb5-3/now 1.17-3 amd64
mlibkrb5support0/now 1.17-3 amd64
mlibldap-2.4-2/now 2.4.47+dfsg-3+deb10u2 amd64
mlibldap-common/now 2.4.47+dfsg-3+deb10u2 all
mliblmdb0/now 0.9.22-1 amd64
mliblwres161/now 1:9.11.5.P4+dfsg-5.1+deb10u1 amd64
mliblz4-1/now 1.8.3-1 amd64
mliblzma5/now 5.2.4-1 amd64
mlibmagic-mgc/now 1:5.35-4+deb10u1 amd64
mlibmagic1/now 1:5.35-4+deb10u1 amd64
mlibmnl0/now 1.0.4-2 amd64
mlibmount1/now 2.33.1-0.1 amd64
mlibncurses6/now 6.1+20181013-2+deb10u2 amd64
mlibncursesw6/now 6.1+20181013-2+deb10u2 amd64
mlibnetfilter-conntrack3/now 1.0.7-1 amd64
mlibnettle6/now 3.4.1-1 amd64
mlibnfnetlink0/now 1.0.1-3+b1 amd64
mlibnfsidmap2/now 0.25-5.1 amd64
mlibnftables0/now 0.9.0-2 amd64
mlibnftnl11/now 1.1.2-2 amd64
mlibnghttp2-14/now 1.36.0-2+deb10u1 amd64
mlibonig5/now 6.9.1-1 amd64
mlibp11-kit0/now 0.23.15-2 amd64
mlibpam-cap/now 1:2.25-2 amd64
mlibpam-modules-bin/now 1.3.1-5 amd64
mlibpam-modules/now 1.3.1-5 amd64
mlibpam-runtime/now 1.3.1-5 all
mlibpam0g/now 1.3.1-5 amd64
mlibpcre3/now 2:8.39-12 amd64
mlibprocps7/now 2:3.3.15-2 amd64
mlibprotobuf-c1/now 1.3.1-1+b1 amd64
mlibpsl5/now 0.20.2-2 amd64
mlibpython-stdlib/now 2.7.16-1 amd64
mlibpython2-stdlib/now 2.7.16-1 amd64
mlibpython2.7-minimal/now 2.7.16-2+deb10u1 amd64
mlibpython2.7-stdlib/now 2.7.16-2+deb10u1 amd64
mlibreadline7/now 7.0-5 amd64
mlibrtmp1/now 2.4+20151223.gitfa8646d.1-2 amd64
mlibsasl2-2/now 2.1.27+dfsg-1+deb10u1 amd64
mlibsasl2-modules-db/now 2.1.27+dfsg-1+deb10u1 amd64
mlibsasl2-modules/now 2.1.27+dfsg-1+deb10u1 amd64
mlibseccomp2/now 2.3.3-4 amd64
mlibselinux1/now 2.8-1+b1 amd64
mlibsemanage-common/now 2.8-2 all
mlibsemanage1/now 2.8-2 amd64
mlibsepol1/now 2.8-1 amd64
mlibsmartcols1/now 2.33.1-0.1 amd64
mlibsqlite3-0/now 3.27.2-3 amd64
mlibss2/now 1.44.5-1+deb10u3 amd64
mlibssh2-1/now 1.8.0-2.1 amd64
mlibssl1.1/now 1.1.1d-0+deb10u3 amd64
mlibstdc++6/now 8.3.0-6 amd64
mlibsystemd0/now 241-7~deb10u4 amd64
mlibtasn1-6/now 4.13-3 amd64
mlibtinfo6/now 6.1+20181013-2+deb10u2 amd64
mlibtirpc-common/now 1.1.4-0.4 all
mlibtirpc3/now 1.1.4-0.4 amd64
mlibudev1/now 241-7~deb10u4 amd64
mlibunistring2/now 0.9.10-1 amd64
mlibuuid1/now 2.33.1-0.1 amd64
mlibwrap0/now 7.6.q-28 amd64
mlibxml2/now 2.9.4+dfsg1-7+b3 amd64
mlibxtables12/now 1.8.2-4 amd64
mlibzstd1/now 1.3.8+dfsg-3 amd64
mlogin/now 1:4.5-1.1 amd64
mlsb-base/now 10.2019051400 all
mmawk/now 1.3.3-17+b3 amd64
mmime-support/now 3.62 all
mmount/now 2.33.1-0.1 amd64
mncurses-base/now 6.1+20181013-2+deb10u2 all
mncurses-bin/now 6.1+20181013-2+deb10u2 amd64
mnfs-common/now 1:1.3.4-2.5 amd64
mnftables/now 0.9.0-2 amd64
mopenssl/now 1.1.1d-0+deb10u3 amd64
mpasswd/now 1:4.5-1.1 amd64
mperl-base/now 5.28.1-6 amd64
mprocps/now 2:3.3.15-2 amd64
mpsmisc/now 23.2-1 amd64
mpublicsuffix/now 20190415.1030-1 all
mpython-minimal/now 2.7.16-1 amd64
mpython2-minimal/now 2.7.16-1 amd64
mpython2.7-minimal/now 2.7.16-2+deb10u1 amd64
mpython2.7/now 2.7.16-2+deb10u1 amd64
mpython2/now 2.7.16-1 amd64
mpython/now 2.7.16-1 amd64
mreadline-common/now 7.0-5 all
mrpcbind/now 1.2.5-0.3+deb10u1 amd64
msed/now 4.7-1 amd64
msensible-utils/now 0.0.12 all
msocat/now 1.7.3.2-2 amd64
msysvinit-utils/now 2.93-8 amd64
mtar/now 1.30+dfsg-6 amd64
mtzdata/now 2020a-0+deb10u1 all
mucf/now 3.0038+nmu1 all
mutil-linux/now 2.33.1-0.1 amd64
mxz-utils/now 5.2.4-1 amd64
mzlib1g/now 1:1.2.11.dfsg-1 amd64
```

# Version Policy

The DC/OS Kubernetes Service is engineered and tested to work with a specific release of [Kubernetes](https://kubernetes.io).
We select stable versions of the base technology in order to promote customer success.
We have selected the latest stable version of Kubernetes for new releases.

# Contacting Technical Support

## Mesosphere DC/OS

[Submit a request](https://support.mesosphere.com/s/).
