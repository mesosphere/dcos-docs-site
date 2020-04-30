---
layout: layout.pug
navigationTitle: Install
title: Install
menuWeight: 3
excerpt: Getting started with Kommander
---

Kommander is a tool that provides a command console for deploying, monitoring, and managing production-ready Kubernetes clusters on an enterprise scale. Kommander supports both Konvoy and non-Konvoy clusters.

### Prerequisites

Currently, installing Kommander also installs Konvoy. Prerequisites and initial requirements for Kommander are the same as those for Konvoy. See the [Konvoy Prerequisites](/ksphere/konvoy/latest/quick-start/#prequisites) topic for information.

### Download and Install

To download Konvoy with Kommander, see the [Download Konvoy](https://docs.d2iq.com/ksphere/konvoy/latest/download/) topic for information.

Download the tarball to your local Downloads directory.

For example, if you are installing on MacOS, download the compressed archive to the default `~/Downloads` directory.
Afterward, extract the tarball to your local system by running the following command (ensure the name of the file that you downloaded, and change konvoy-kommander_darwin.tar.bz2 accordingly):

```
tar -xf ~/Downloads/konvoy-kommander_darwin.tar.bz2
```

Copy the Konvoy package files to a directory in your user's `PATH` to ensure you can invoke the konvoy command from any directory.

For example, copy the package to `/usr/local/bin/` by returning to the directory that Kommander was extracted to, and running the following command:

```
sudo cp ~/Downloads/darwin/konvoy-kommander.tar.bz2/* /usr/local/bin/
```

<p class="message--note"><strong>NOTE:</strong> The extracted folder may have a different name (such as `konvoy_dev`, or perhaps it was given a custom directory, or have the version affixed to the end of the directory name).</p>

Check version

```
konvoy --version
```

Once you have the newest version of Konvoy, move into the directory where you would like to test. Please note, you will have to confirm your access to your cloud or internal network provider, or you may encounter a message that says `failed to deploy the cluster: error provisioning cluster`.

Once done, run this command:

```
konvoy up
```

## Logging In

### Logging in with Username and Password

After you provision your first Konvoy cluster, your randomly-generated username, password, and a URL to Konvoy are printed to the command-line. Once in Konvoy, you should see a button labelled "Try Kommander". If not, ensure you've installed the Konvoy release that includes Kommander.

![Try Kommander button](/ksphere/kommander/1.0/img/try-kommander.png)

To retrieve this information again, you can use the following command:

```
konvoy get ops-portal
```
