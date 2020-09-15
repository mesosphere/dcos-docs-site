---
layout: layout.pug
navigationTitle: SSH connection issues
title: SSH connection issues
menuWeight: 10
excerpt: SSH connection issues
beta: true
enterprise: false
---

## Too many authentication failures

If SSH agent forwarding is used, you might see the following error:

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

To troubleshoot this issue, make sure that the private key is in your SSH agent using the following command:

```bash
ssh-add -L
```

The above command will display the public keys of the corresponding private keys represented by the SSH agent.
If you do not find the corresponding public keys from the output of the above command, add the private key to the SSH agent using `ssh-add <PRIVATE_KEY>`.

Even with the valid key in the SSH agent, it is possible to still get the `Too many authentication failures` due to the SSH server authentication retry limit [MaxAuthTries][sshd_config].

If you have more keys in the SSH agent than the retry limit `MaxAuthTries`, you can resolve the issue by resetting the SSH agent and add the private key after that using the following commands:

```bash
ssh-add -D
ssh-add <PRIVATE_KEY>
```

[sshd_config]: https://linux.die.net/man/5/sshd_config
