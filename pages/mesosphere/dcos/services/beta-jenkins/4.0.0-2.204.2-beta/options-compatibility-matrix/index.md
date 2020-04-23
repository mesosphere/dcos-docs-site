---
layout: layout.pug
navigationTitle: Configuration Options Matrix
title: Configuration Options Matrix
menuWeight: 5
excerpt: Configuration changes in this release of the Jenkins Service
enterprise: false
--- 

# Options Compatibility Matrix

## Jenkins Service Related Options
4.0.0-2.204.3 |    Default   |    3.6.0-2.190.1    |    Default    |    Notes    
--------------|--------------|---------------------|---------------|-------------
service.name  | jenkins | service.name | jenkins
service.user | nobody | service.user | N/A | Changed
service.marathon-name | marathon | service.marathon-name | marathon
service.mesos-master | https://leader.mesos:5050 | advanced.mesos-master | zk://zk-1.zk:2181,zk-2.zk:2181,zk-3.zk:2181,zk-4.zk:2181,zk-5.zk:2181/mesos | Changed & Relocated
service.roles.jenkins-master-role | slave_public | roles.jenkins-master-role | slave_public | Relocated
service.roles.jenkins-agent-role | * | roles.jenkins-agent-role | * | Relocated
service.security.security-account | "" | N/A | N/A | Added
service.security.strict-mode | false | security.strict-mode | false | Relocated
service.security.secret-name | "" | N/A | N/A | Added
service.containerizer | MESOS | advanced.containerizer | DOCKER | Changed & Relocated
service.docker-image | "" | advanced.docker-image | "" | Relocated
service.docker-credentials-uri | "" | advanced.docker-credentials-uri | "" | Relocated
service.prometheus-endpoint | "v1/metrics/prometheus" | advanced.prometheus-endpoint | "v1/metrics/prometheus" | Relocated
service.os-anti-affinity | "windows" | N/A | N/A | Added
service.storage.host-volume| "" | storage.host-volume | "" | Relocated
service.storage.pinned-hostname| "" | storage.pinned-hostname | "" | Relocated
service.marathon-lb.virtual-host | "" | networking.virtual-host | "" | Relocated
service.marathon-lb.https-redirect | false | networking.https-redirect | false | Relocated
---
## Jenkins Master Related Options
4.0.0-2.204.3 |    Default   |    3.6.0-2.190.1    |    Default    |    Notes    
--------------|--------------|---------------------|---------------|-------------
jenkins-master.cpus | 1.0 | service.cpus | 1.0 | Relocated
jenkins-master.mem | 4096.0 | service.mem | 4096.0 | Relocated
jenkins-master.known-hosts | "github.com" | networking.known-hosts | "github.com" | Relocated
jenkins-master.agent-port | 50000 | networking.agent-port | 50000 | Relocated
jenkins-master.jvm-opts | "-Xms1024m -Xmx1024m" | advanced.jvm-opts |  "-Xms1024m -Xmx1024m" | Relocated
jenkins-master.jenkins-opts | "" | advanced.jenkins-opts |  "" | Relocated
jenkins-master.additional-plugins | "" | N/A |  N/A | Added
---
## Jenkins Agent Related Options
4.0.0-2.204.3 |    Default   |    3.6.0-2.190.1    |    Default    |    Notes    
--------------|--------------|---------------------|---------------|-------------
jenkins-agent.jenkins-agent-user | "nobody" | advanced.jenkins-agent-user | "root" | Changed & Relocated
---
### Jenkins Linux Agent Related Options
4.0.0-2.204.3 |    Default   |    3.6.0-2.190.1    |    Default    |    Notes    
--------------|--------------|---------------------|---------------|-------------
jenkins-agent.linux-agent.label | "linux" | N/A | N/A | Added
jenkins-agent.linux-agent.cpus | 0.1 | N/A | N/A | Added
jenkins-agent.linux-agent.mem | 512.0 | N/A | N/A | Added
jenkins-agent.linux-agent.disk | 0.0 | N/A | N/A | Added
jenkins-agent.linux-agent.max-executors | 1 | N/A | N/A | Added
jenkins-agent.linux-agent.min-executors | 1 | N/A | N/A | Added
jenkins-agent.linux-agent.offer-selection-attributes | "" | N/A | N/A | Added
jenkins-agent.linux-agent.jnlp-args | "-noReconnect" | N/A | N/A | Added
jenkins-agent.linux-agent.idle-termination-minutes | 3 | N/A | N/A | Added
jenkins-agent.linux-agent.image | "mesosphere/jenkins-dind:0.8.0" | N/A | N/A | Added
---
### Jenkins Windows Agent Related Options
4.0.0-2.204.3 |    Default   |    3.6.0-2.190.1    |    Default    |    Notes    
--------------|--------------|---------------------|---------------|-------------
jenkins-agent.windows-agent.label | "windows" | N/A | N/A | Added
jenkins-agent.windows-agent.cpus | 1.0 | N/A | N/A | Added
jenkins-agent.windows-agent.mem | 4096.0 | N/A | N/A | Added
jenkins-agent.windows-agent.disk | 0.0 | N/A | N/A | Added
jenkins-agent.windows-agent.max-executors | 1 | N/A | N/A | Added
jenkins-agent.windows-agent.min-executors | 1 | N/A | N/A | Added
jenkins-agent.windows-agent.offer-selection-attributes | "os:windows" | N/A | N/A | Added
jenkins-agent.windows-agent.jnlp-args | "-noReconnect" | N/A | N/A | Added
jenkins-agent.windows-agent.idle-termination-minutes | 3 | N/A | N/A | Added
jenkins-agent.windows-agent.image | "mesosphere/jenkins-windows-node:0.1.0" | N/A | N/A | Added
---
## Jenkins Health-Check Related Options
4.0.0-2.204.3 |    Default   |    3.6.0-2.190.1    |    Default    |    Notes    
--------------|--------------|---------------------|---------------|-------------
health-checks.grace-period | 30 | health-checks.grace-period | 30 |
health-checks.interval | 60 | health-checks.interval | 60 |
health-checks.timeout | 20 | health-checks.timeout | 20 |
health-checks.max-consecutive-failures | 3 | health-checks.max-consecutive-failures | 3 |

