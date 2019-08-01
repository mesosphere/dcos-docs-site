---
layout: layout.pug
navigationTitle: Troubleshooting Authentication
menuWeight: 23
excerpt: Troubleshooting authentication issues in DC/OS Open Source deployments
title: Troubleshooting Authentication
---
## Ad Blockers and the DC/OS UI

During testing, we have observed issues with loading the DC/OS UI login page when certain ad blockers such as HTTP Switchboard or Privacy Badger are active. Other ad blockers like uBlock Origin are known to work.

## Debugging

To debug authentication problems, check the Admin Router and `dcos-oauth` logs on the masters using the following commands.

```bash
sudo journalctl -u dcos-adminrouter.service
sudo journalctl -u dcos-oauth.service
```

