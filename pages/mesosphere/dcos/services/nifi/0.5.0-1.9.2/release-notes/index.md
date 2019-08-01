---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 5
excerpt: Discover the new features, updates, and known limitations in this release of the NiFi Service
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---

# Release Notes for NiFi Service version 0.5.0-1.9.2

## Updates 
- Upgrade {{ model.packageName }} base tech to version 1.9.2. See [Apache NiFi's Release Notes](https://cwiki.apache.org/confluence/display/NIFI/Release+Notes#ReleaseNotes-Version1.9.2) for details.
- Support to add additional library 

## Bug Fix
- Fix restart bug while NiFi is installed with Kerberos.
