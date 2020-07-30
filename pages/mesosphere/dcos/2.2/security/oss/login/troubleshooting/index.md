---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting Login 
excerpt: Troubleshooting login issues in DC/OS
menuWeight: 50
---

# Debugging Login

## Admin Router

Admin Router hands over login requests to the IAM. Confirm that the request is received by Admin Router on any of the master nodes using the following command:

```bash
sudo journalctl -u dcos-adminrouter.service
```

## Identity and Access Manager

The IAM is the only entity issuing DC/OS authentication tokens.
To debug login problems, check the IAM (Bouncer) on the masters using the following command:

```bash
sudo journalctl -u dcos-bouncer.service
```
