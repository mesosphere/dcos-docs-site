---
layout: layout.pug
navigationTitle: Upgrade Custom Applications
title: Upgrade Custom Applications
menuWeight: 60
excerpt: Verify the compatibility of Custom Applications with the current Kubernetes version
beta: false
enterprise: true
---

We recommend upgrading your Custom Applications to the latest compatible version as soon as possible. Since Custom Applications are not created, maintained or supported by D2iQ, you must upgrade them manually.

<p class="message--warning"><strong>WARNING: </strong>Ensure you validate any Custom Applications you run for compatibility issues against the <a href="https://docs.d2iq.com/dkp/kommander/2.2/release-notes/">Kubernetes version</a> in the new release. If the Custom Application’s version is not compatible with the Kubernetes version, do not continue with the Konvoy upgrade. Otherwise, your custom Applications may stop running.
</p>

Once you have ensured your Custom Applications are compatible with the current Kubernetes version, return to the [DKP Upgrade overview][dkp_upgrade] documentation, to review the next steps depending on your environment and license type.

[dkp_upgrade]: ../../dkp-upgrade/
[release_notes]: ../../release-notes/
