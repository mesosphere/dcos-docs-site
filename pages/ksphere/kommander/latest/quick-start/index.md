---
layout: layout.pug
navigationTitle: Quick start
title: Quick start
menuWeight: 3
excerpt: Getting started with Kommander
---

Kommander is tool that provides a command console for deploying, monitoring and managing production-ready Kubernetes clusters on an enterprise scale. Kommander supports both Konvoy and non-Konvoy clusters.

### Prerequisites

Currently, installing Kommander also installs Konvoy. Prerequisites and initial requirements for Kommander are the same as those for Konvoy. See the [Konvoy Prerequisites](/ksphere/konvoy/latest/quick-start/#prequisites) topic for information.

### Download and Install

To download Konvoy with Kommander, see the [Download Konvoy](https://docs.d2iq.com/ksphere/konvoy/latest/download/) topic for information.

Download the tarball to your local Downloads directory.

For example, if you are installing on MacOS, download the compressed archive to the default `~/Downloads` directory.
Afterward, extract the tarball to your local system by running the following command:

```
tar -xf ~/Downloads/konvoy-kommander_darwin.tar.bz2
```

Copy the Konvoy package files to a directory in your user's `PATH` to ensure you can invoke the konvoy command from any directory.

For example, copy the package to `/usr/local/bin/` by running the following command:

```
sudo cp ~/Downloads/darwin/konvoy-kommander.tar.bz2/* /usr/local/bin/
```

Check version

```
konvoy --version
```

Once you have the newest version of konvoy, move into the directory where you would like to test and run:

```
konvoy up
```

## Logging In

### Logging in with Username and Password

After you provision your first Konvoy cluster, your username, password, and a URL to Konvoy will be printed to the command-line. Once in Konvoy, you should see a button labelled "Try Kommander Beta!". If not, check to ensure you've installed the Konvoy release that includes Kommander.

![Try Kommander button](/ksphere/kommander/img/try-kommander-beta.png)

To retrieve this information again, you can use the following command:

```
konvoy get ops-portal
```
