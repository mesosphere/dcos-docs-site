---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting User Account Management
excerpt: Troubleshooting user account management issues
render: mustache
model: /1.13/data.yml
menuWeight: 50
---

# Debugging User Account Management

## Admin Router

Admin Router receives all user account management operations via HTTP and hands them over to the IAM. To debug user management problems, make sure Admin Router on the masters receives the HTTP request for the intended operation using the following commands.

```bash
sudo journalctl -u dcos-adminrouter.service
```

## Identity and Access Manager

To debug user account management problems, check the IAM (Bouncer) on the masters using the following commands.

```bash
sudo journalctl -u dcos-bouncer.service
```

## CockroachDB

The IAM stores user information in CockroachDB running on master nodes.
If Admin Router and the IAM received the user management operation to perform according to their logs and the IAM could not fulfill the request in it likely that CockroachDB is in trouble. In this case, check for errors or unusual patterns in the CockroachDB log on all master nodes.

```bash
sudo journalctl -u dcos-cockroach.service
```

The simplest way to determine whether a CockroachDB cluster is healthy is to query the CockroachDB node status information from a master node like this.

```bash
sudo /opt/mesosphere/bin/cockroach node status --ranges --host=$(/opt/mesosphere/bin/detect_ip) --insecure
```

The reported number of nodes should match the number of DC/OS master nodes in general. However, each time a master node is replaced the CockroachDB node of the old DC/OS master node is not automatically removed.

The number of `is_live` CockroachDB nodes should always match the current number of master nodes.

DC/OS sets the number of replicas for CockroachDB ranges equal to the number of DC/OS master nodes. This implies that one master node should hold one copy of the data. Therefore, the number of `ranges_underreplicated` can go up temporarily if a master node goes out of business. After a new master node joins the cluster, `ranges_underreplicated` is expected to go down again to zero after about five minutes.

If the number of `ranges_unavailable` is non-zero, this data is at least temporarily unavailable for reading and writing. In this case, the CockroachDB range's raft group quorum is most likely impaired.

Getting the state of the majority of CockroachDB instances to `is_live` again on the majority of DC/OS master nodes is expected to restore the quorum and thus to bring `ranges_unavailable` down to zero.

This is most easily done by restarting the CockroachDB instances that report `is_live = false`. Execute the following command to restart the CockroachDB node on the corresponding master node.

```bash
sudo systemctl restart dcos-cockroach.service
```

If the raft quorum for a particular range cannot be recovered and the `ranges_unavailable` persist, the unavailable data is inevitably lost because it cannot be read nor written.

<p class="message--note"><strong>NOTE: </strong>Re-installing or adding new DC/OS master nodes (CockroachDB nodes) will not add to the quorum for the ranges that are already in <code>ranges_unavailable</code> state. Furthermore, deleting existing CockroachDB instances lowers the chance for recovery.</p>

