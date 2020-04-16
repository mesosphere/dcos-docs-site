---
layout: layout.pug
navigationTitle: SSH connection issues
title: SSH connection issues
menuWeight: 10
excerpt: SSH connection issues
enterprise: false
---

## Too many authentication failures

If SSH agent forwarding is used, sometimes you might see the following error.

```text
STAGE [Running Preflights]

PLAY [Configure Cluster Prerequisites] ****************************************************************

TASK [all : wait 180 seconds for target connection to become reachable] *******************************

fatal: [10.0.129.25]: FAILED! => {
   "changed": false,
   "elapsed": 180
}

MSG:

timed out waiting for ping module test success: EOF on stream; last 300 bytes received: 'Received disconnect from 54.218.158.21 port 22:2: Too many authentication failures\r\n'
```

To troubleshoot this issue, please first make sure the private key is in your SSH agent.
You can verify that by using the following command.

```bash
ssh-add -L
```

The above command will show you the public keys of the corresponding private keys in the SSH agent.
If you do not find the corresponding public keys from the output of the above command, please add the private key to the SSH agent.

It is possible that the valid key is in the SSH agent, but you still get `Too many authentication failures` error.
SSH server has a retry limit on the number of authentication attempt [MaxAuthTries][sshd_config].
If you have more keys in the SSH agent than the retry limit, then you might see this issue.
You can resolve the issue by resetting SSH agent using the following command, and add the private key after that.

```bash
ssh-add -D
ssh-add <PRIVATE_KEY>
```

[sshd_config]: https://linux.die.net/man/5/sshd_config
