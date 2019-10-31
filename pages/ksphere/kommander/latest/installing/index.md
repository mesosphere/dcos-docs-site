---
layout: layout.pug
navigationTitle: Installation
title: Installation Guide
menuWeight: 4
excerpt: Installation Guide for Kommander
---

# Kommander Installation Guide

### Prerequisites

Latest version of Konvoy

## Download

Download Konvoy with Kommander Beta 1 here https://github.com/mesosphere/konvoy/releases/tag/v1.3.0-kommander-beta1
Download the tarball to your local Downloads directory.

For example, if you are installing on MacOS, download the compressed archive to the default ~/Downloads directory.
Extract the tarball to your local system by running the following command:
`tar -xf ~/Downloads/konvoy_v1.3.0-kommander-beta1_darwin.tar.bz2`
`cd ~/Downloads/darwin/konvoy_v1.3.0-kommander-beta1`

Copy the Konvoy package files to a directory in your user PATH to ensure you can invoke the konvoy command from any directory.

For example, copy the package to the /usr/local/bin/ directory by running the following command:
`sudo cp ~/Downloads/darwin/konvoy_v1.3.0-kommander-beta1/* /usr/local/bin/`
Check version
`konvoy --version`
Once you have the newest version of konvoy, move into the directory where you would like to test and run
`konvoy up`

## Install

## Upgrade
