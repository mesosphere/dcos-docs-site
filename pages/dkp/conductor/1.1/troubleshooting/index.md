---
navigationTitle: Troubleshooting
title: Troubleshooting
menuWeight: 60
excerpt: How to work around issues
---

Here are some issues that may come up with Conductor and some ways to workaround:

- If a component of the ILE - such as the terminal - seems to be out of sync with some other part, or is disconnected, you can refresh your browser to return Conductor to a usable state.

# Browser Compatibility

Conductor only supports the following browsers:

| Browser | Tested | Status |
|---|---|---|
| Chrome 81 |  Y | Works as expected.  |
| Firefox 76 | Y | Works as expected.  |
|  Microsoft Edge on Windows 10 81.0.416.77 |  Y |  Fails due to browser limitation - max supported URL length. |
| Safari 12 | Y | SSH can disconnect if browser left unattended too long. Max observed: 1-2 times per 2-3 hour session. Refreshing the browser is a workaround to reestablish ssh connectivity with the cluster. |
