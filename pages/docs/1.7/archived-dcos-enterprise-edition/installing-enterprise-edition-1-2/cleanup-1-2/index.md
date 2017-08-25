---
layout: layout.pug
title: DC/OS cleanup script (1.2)
menuWeight: 0
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  DC/OS cleanup script (1.2)
---




Sometimes, you can get your hosts into a bad spot and want to start over. Instead of creating brand new instances, you can run this cleanup script and get rid of all the <span class="caps">DCOS</span> specific things.

To run the <span class="caps">DCOS</span> cleanup script:

    rm -rf /opt/mesosphere /etc/systemd/system/dcos.target.wants