---
layout: layout.pug
navigationTitle: Continuous Integration
title: Continuous Integration
beta: false
menuWeight: 10
---

Here are step-by-step tutorials for setting up some commonly-used pipeline configuration. All tutorials begin with a "Prerequisites" section that contains links to any steps that need to be taken first. This means you can visit any tutorial to get started. All tutorials assume you have read through and followed the instructions on the [Getting Started](../../quickstart/), [Installation](../../install/), and [Repository Setup](../ci_tutorials/repo-setup/) pages.

# Tutorials

## Configuring Credentials for Dispatch

Configure various service account and ssh credentials for usage by Dispatch to access various services such as code repositories. [Follow the tutorial here](./credentials/)

## Configuring ChatOps to trigger pipelines via GitHub comments

Configure your `Dispatchfile` to enable triggers based on GitHub comments. [Follow the tutorial here](./triggering-pipelines-using-chatops/)

## Configuring cron based triggers in Dispatchfile

Configure your `Dispatchfile` to enable cron based triggers for your pipelines. [Follow the tutorial here](./configuring-cron-triggers/)

## Configure a git based code repository for access by Dispatch

Configure and set up a code repository for access by Dispatch, including configuring a Dispatchfile. [Follow the tutorial here](./repo-setup/)

## Building images with Buildkit

Build a docker image using Buildkit, a cache-efficient, distributed build system for Docker images made by Moby. [Follow the tutorial here](./buildkit/)

## Running pipelines locally

Configure and run a Dispatchfile locally, powered by [KIND](https://kind.sigs.k8s.io/). Local runner is a handy way to run a Dispatchfile on a git repository locally. The runners handles the end to end flow of a creating a kubernetes cluster (using KIND), installing Dispatch on to the cluster and then running the tests on the cluster. Optional flags exist to teardown the KIND cluster at the end of the run.

## Import tasks and functions into a Dispatchfile

Extract tasks and functions into a separate "utility" Dispatchfile then import them from a main Dispatchfile. [Follow the tutorial here](./import-tasks-from-dispatchfile/)

## Logging walkthrough

Understand how to triage configuration and runtime errors in pipelines using CLI and/or GUI. Learn commands to triage failures across multiple Dispatch components. [Follow the tutorial here](./logging/)
