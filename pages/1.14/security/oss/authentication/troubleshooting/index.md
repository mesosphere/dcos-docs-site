---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting Authentication 
excerpt: Troubleshooting authentication issues in DC/OS
render: mustache
model: /1.14/data.yml
menuWeight: 50
---
# Ad Blockers and the DC/OS UI

During testing, we have observed issues with loading the DC/OS UI login page when certain ad blockers such as HTTP Switchboard or Privacy Badger are active. Other ad blockers like uBlock Origin are known to work.

# Debugging Authentication

## Admin Router

Admin Router is the only entity verfiying DC/OS authentication tokens.
To debug authentication problems, check the Admin Router on the masters using the following commands.

```bash
sudo journalctl -u dcos-adminrouter.service
```
