---
layout: layout.pug
navigationTitle: 故障排除
title: 故障排除
menuWeight: 25
excerpt: 排除 DC/OS 安装问题
---

# <a name="general"></a>一般故障排除方法

* 验证您具有有效的 IP 检测脚本、运行正常的 DNS 解析器将 DC/OS 服务绑定到 NTP，以及所有节点与 NTP 同步。


## IP 检测脚本

您必须具有有效的 [ip-detect](/cn/1.11/installing/production/advanced/#create-an-ip-detection-script) 脚本。您可以手动运行集群中所有节点上的 `ip-detect`，或检查现有装置上的 `/opt/mesosphere/bin/detect_ip`，以确保其返回有效的 IP 地址。有效的 IP 地址没有：

 - 额外的行
 - 空白空格
 - 特殊或隐藏字符

我们建议您使用 `ip-detect` [示例](/cn/1.11/installing/production/deploying-dcos/installation/)。

## DNS 解析器

您必须具有正常运行的 DNS 解析器，在 [config.yaml](cn/1.11/installing/production/advanced-configuration/configuration-reference/#resolvers) 文件中指定。我们建议您对 FQDN、短主机名和 IP 地址进行正向和反向查找。DC/OS 可以在没有有效 DNS 支持的环境中运行，但以下必须工作才能支持 DC/OS 服务，包括 Spark：

 - `hostname -f` 返回 FQDN
 - `hostname -s` 返回短主机名

 您还应对所有节点上 `hostnamectl` 的输出执行运行状况检查。

在处理 DC/OS 安装问题时，您应该按以下顺序检查组件：

 1. Exhibitor
 1. Mesos 管理节点
 1. Mesos DNS
 1. DNS 转发器
 1. DC/OS Marathon
 1. 作业
 1. Admin Router

 确保在验证代理节点之前先验证所有服务都在管理节点上是否都运行且状态良好。

 ### NTP

 网络时间协议 (NTP) 必须在所有节点上启用，以便时钟同步。默认情况下，在 DC/OS 启动期间，如果未启用，将会出现错误。您可以通过运行以下一个命令来验证 NTP 是否启用，具体取决于您的操作系统和配置：

    
 ntptime
 adjtimex -p
 timedatectl
    

* 确保防火墙和任何其他连接过滤机制不干扰集群组件通信。必须允许 TCP、UDP 和 ICMP。


* 确保绑定到端口 `53` 的服务（DNS 转发器 (>`dcos-net.service`) 需要此操作）被禁用并停止。例如：


   ```bash
   sudo systemctl disable dnsmasq && sudo systemctl stop dnsmasq
   ```

* 验证 Exhibitor 是否已在 `http:// <MASTER_IP>:8181/exhibitor` 启动并运行。如果 Exhibitor 未启动和运行：

 - 对管理节点执行 [SSH](/cn/1.11/administering-clusters/sshcluster/)，并输入以下命令来检查 Exhibitor 服务日志：

    ```bash
    journalctl -flu dcos-exhibitor
    ```

* 验证 `/tmp` 是否*无 *`noexec` 挂载。如果挂载有 `noexec`，Exhibitor 将不能停住 ZooKeeper，因为 Java JNI 不能 `exec` 其在 `/tmp` 中创建的文件，而且您会在日志中看到多个 `permission denied` 错误。

* 要修复挂载有 `noexec` 的 `/tmp`，请运行以下命令：


 mount -o remount,exec /tmp

	    
* 检查 `/exhibitor/v1/cluster/status` 的输出，并验证其是否显示了正确数量的管理节点，所有管理节点是否为 `"serving"`，但只有其中一个被指定为 `"isLeader": true`。

 例如，对管理节点执行 [SSH](/cn/1.11/administering-clusters/sshcluster/) 并输入以下命令：


 curl -fsSL http://localhost:8181/exhibitor/v1/cluster/status | python -m json.tool
        [
                {
 "code": 3, 
 "description": "serving", 
 "hostname": "10.0.6.70", 
 "isLeader": false
                },
                {
 "code": 3, 
 "description": "serving", 
 "hostname": "10.0.6.69", 
 "isLeader": false
                },
                {
 "code": 3, 
 "description": "serving", 
 "hostname": "10.0.6.68", 
 "isLeader": true
                }
            ]



**注意：** 在多管理节点配置中运行此命令需要 10-15 分钟才能完成。如果 10-15 分钟后未完成，请认真查看 `journalctl -flu dcos-exhibitor` 日志。

* 验证您是否可以 ping DNS 转发器 (`ready.spartan`)。如果没有，请查看 DNS 调度器服务日志：


 journalctl -flu dcos-net﻿⁠⁠⁠⁠

* 验证您是否可以 ping `⁠⁠⁠⁠leader.mesos` 和 `master.mesos`。如果不可以：
 - 使用此命令查看 Mesos-DNS 服务日志：

    ```bash
    journalctl -flu dcos-mesos-dns﻿⁠⁠⁠⁠
    ```

 - 如果能够 ping `ready.spartan`，但不是 `leader.mesos`，则使用以下命令查看 Mesos 管理节点服务日志：

       ```bash
       ⁠⁠⁠⁠journalctl -flu dcos-mesos-master
       ```
       ﻿
 Mesos 管理节点必须在 Mesos-DNS 从 `⁠⁠⁠⁠/state` 生成其 DNS 记录之前，与选举的首要实例一起启动并运行。

# <a name="component-logs"></a>组件日志

在 DC/OS 安装期间，每个组件将在日志中从故障状态收敛到运行状态。

- [Admin Router](#admin-router)
- [DC/OS 代理节点](#dcos-agent-node)
- [DC/OS Marathon](#dcos-marathon)
- [gen_resolvconf](#gen-resolvconf)
- [Mesos DNS](#mesos-dns)
- [Mesos 管理节点进程](#mesos-master-process)
- [ZooKeeper 和 Exhibitor](#zookeeper-and-exhibitor)

## <a name="admin-router"></a>Admin Router

Admin Router 在管理节点上启动。Admin Router 为集群中的 DC/OS 服务提供中央认证和代理。这让您可以在没有 VPN 或 SSH 隧道的情况下从网络的外部管理集群进行管理。对于 HA，可以在每个管理节点（负载均衡端口 80）的前面配置一个可选的负载均衡器，以提供故障切换和负载均衡。

**故障排除：**

对管理节点执行 SSH，并输入以下命令来查看从启动时间起的日志：

 journalctl -u dcos-adminrouter -b
    

例如，此处是随着其转为成功状态，Admin Router 日志的一个片段：

 systemd[1]：正在启动高性能 Web 服务器和反向代理服务器... 
 systemd[1]：已启动高性能 Web 服务器和反向代理服务器。
 nginx[1652]: ip-10-0-7-166.us-west-2.compute.internal nginx: 10.0.7.166 - - [18/Nov/2015:14:01:10 +0000] "GET /mesos/master/state-summary HTTP/1.1" 200 575 "-" "python-requests/2.6.0 CPython/3.4.2 Linux/4.1.7-coreos" 
 nginx[1652]: ip-10-0-7-166.us-west-2.compute.internal nginx: 10.0.7.166 - - [18/Nov/2015:14:01:10 +0000] "GET /metadata HTTP/1.1" 200 175 "-" "python-requests/2.6.0 CPython/3.4.2 Linux/4.1.7-coreos" 
    

## <a name="dcos-agent-nodes"></a>DC/OS 代理节点

DC/OS 专用和公共代理节点启动。已部署的应用程序和服务在专用代理节点上运行。您必须至少有一个专用代理节点。

公共可访问应用程序在公共代理节点上运行。=公共代理节点可设置为允许外部流量访问您的集群。公共代理节点是可选的，没有最小值。您可以在这里运行负载均衡器，从集群内部向外部公众提供服务。

**故障排除：**

* 您可能无法对代理节点执行 SSH，具体取决于集群网络的配置。我们通过 DC/OS CLI 使之更简单易用。如需更多信息，请参阅 [对 DC/OS 集群执行 SSH][6]。

* 您可以从 DC/OS 仪表盘的**节点**选项卡获取已注册代理节点的 IP 地址。未注册的节点未显示。

* 对代理节点执行 SSH，并输入以下命令查看从启动时间起的日志：

    ```bash
    journalctl -u dcos-marathon -b
    ```
    

例如，此处是随着其转为成功状态，Mesos 代理节点日志的一个片段：

 mesos-slave[1080]: I1118 14:00:43.687366 1080 main.cpp:272] 正在启动 Mesos 从设备
 mesos-slave[1080]: I1118 14:00:43.688474 1080 slave.cpp:190] 从设备启动于 1)@10.0.1.108:5051
 mesos-slave[1080]: I1118 14:00:43.688503 1080 slave.cpp:191] 启动时的标记：--appc_store_dir="/tmp/mesos/store/appc" --authenticatee="crammd5" --cgroups_cpu_enable_pids_and_tids_count="false" --cgroups_enable_cfs="false" --cgroups_hierarchy="/sys/fs/cgroup" --cgroups_limit_swap="false" --cgroups_root="mesos" --container_disk_watch_interval="15secs" --containerizers="docker,mesos" --default_role="*" --disk_watch_interval="1mins" --docker="docker" --docker_kill_orphans="true" --docker_remove_delay="1hrs" --docker_socket="/var/run/docker.sock" --docker_stop_timeout="0ns" --enforce_container_disk_quota="false" --executor_environment_variables="{"LD_LIBRARY_PATH":"\/opt\/mesosphere\/lib","PATH":"\/usr\/bin","SASL_PATH":"\/opt\/mesosphere\/lib\/sasl2","SHELL":"\/usr\/bin\/bash"}" --executor_registration_timeout="5mins" --executor_shutdown_grace_period="5secs" --fetcher_cache_dir="/tmp/mesos/fetch" --fetcher_cache_size="2GB" --frameworks_home="" --gc_delay="2days" --gc_disk_headroom="0.1" --hadoop_home="" --help="false" --hostname_lookup="false" --image_provisioner_backend="copy" --initialize_driver_logging="true" --ip_discovery_command="/opt/mesosphere/bin/detect_ip" --isolation="cgroups/cpu,cgroups/mem" --launcher_dir="/opt/mesosphere/packages/mesos--30d3fbeb6747bb086d71385e3e2e0eb74ccdcb8b/libexec/mesos" --log_dir="/var/log/mesos" --logbufsecs="0" --logging_level="INFO" --master="zk://leader.mesos:2181/mesos" --oversubscribed_resources_interval="15secs" --perf_duration="10secs" --perf_interval="1mins" --port="5051" --qos_correction_interval_min="0ns" --quiet="false" --recover="reconnect" --recovery_timeout="15mins" --registration_backoff_factor="1secs" --resource_monitoring_interval="1secs" --resources="ports:[1025-2180,2182-3887,3889-5049,5052-8079,8082-8180,8182-32000]" --revocable_cpu_low_priority="true" --sandbox_directory="/mnt/mesos/sandbox" --slave_subsystems="cpu,memory" --strict="true" --switch_user="true" --systemd_runtime_directory="/run/systemd/system" --version="false" --work_dir="/var/lib/mesos/slave" 
 mesos-slave[1080]: I1118 14:00:43.688711 1080 slave.cpp:211] 将从设备进程转入其本身的子系统 cgroup：cpu
 mesos-slave[1080]: 2015-11-18 14:00:43,689:1080(0x7f9b526c4700):ZOO_INFO@check_events@1703: 发起与服务器的连接 [10.0.7.166:2181]
 mesos-slave[1080]: I1118 14:00:43.692811 1080 slave.cpp:211] 将从设备进程转入其本身的子系统 cgroup：内存
 mesos-slave[1080]: I1118 14:00:43.697872 1080 slave.cpp:354] 从设备资源：ports(*):[1025-2180, 2182-3887, 3889-5049, 5052-8079, 8082-8180, 8182-32000]; cpus(*):4; mem(*):14019; disk(*):32541
 mesos-slave[1080]: I1118 14:00:43.697916 1080 slave.cpp:390] 从设备主机名：10.0.1.108
 mesos-slave[1080]: I1118 14:00:43.697928 1080 slave.cpp:395] 从设备检查点：true



## <a name="dcos-marathon"></a>DC/OS Marathon

DC/OS Marathon 在管理节点上启动。本地 Marathon 实例是 DC/OS 的“init system”。它启动并监控应用程序和服务。

**故障排除：**

* 转到 DC/OS 仪表盘上的**服务 > 服务**选项卡并查看状态。

* 对管理节点执行 SSH，并输入以下命令来查看从启动时间起的日志：

    ```bash
    journalctl -u dcos-marathon -b
    ```


例如，此处是随着其转为成功状态，DC/PS Marathon 日志的一个片段：

 java[1288]: I1118 13:59:39.125041 1363 group.cpp:331] 组进程 (group(1)@10.0.7.166:48531) 已连接到 ZooKeeper
 java[1288]: I1118 13:59:39.125100 1363 group.cpp:805] 同步组操作：队列大小 (joins, cancels, datas) = (0, 0, 0)
 java[1288]: I1118 13:59:39.125121 1363 group.cpp:403] 尝试在 ZooKeeper 中创建路径 '/mesos' 
 java[1288]: [2015-11-18 13:59:39,130] INFO 调度器角色就绪 (mesosphere.marathon.MarathonSchedulerActor:marathon-akka.actor.default-dispatcher-5)
 java[1288]: I1118 13:59:39.147804 1363 detector.cpp:156] 检测到新的领导者：(id='1')
 java[1288]: I1118 13:59:39.147924 1363 group.cpp:674] 尝试在 ZooKeeper 中获取 '/mesos/json.info_0000000001' 
 java[1288]: I1118 13:59:39.148727 1363 detector.cpp:481] 检测到新的领导管理节点 (UPID=master@10.0.7.166:5050)
 java[1288]: I1118 13:59:39.148787 1363 sched.cpp:262] 在 master@10.0.7.166:5050 处检测到新的管理节点
 java[1288]: I1118 13:59:39.148952 1363 sched.cpp:272] 未提供凭据。尝试在没有认证的情况下注册
 java[1288]: I1118 13:59:39.150403 1363 sched.cpp:641] 框架已向 cdcb6222-65a1-4d60-83af-33dadec41e92-0000 注册
    


## <a name="gen-resolvconf"></a>gen_resolvconf

gen_resolvconf 已启动。这是一个帮助代理节点找到管理节点的服务。它更新了 `/etc/resolv.conf`，使得代理节点可以使用 Mesos-DNS 服务进行服务发现。gen_resolvconf 使用内部负载均衡器、vrrp 或管理节点静态列表来定位管理节点。如需更多信息，请参阅 `master_discovery` [配置参数][3]。

**故障排除：**

* 当 gen_resolvconf 启动并运行时，您可以查看 `/etc/resolv.conf` 内容。它应该包含管理节点的一个或多个 IP 地址，以及可选的外部 DNS 服务器。

* 对管理节点执行 SSH，并输入以下命令来查看从启动时间起的日志：

    ```bash
    journalctl -u dcos-gen-resolvconf -b
    ```

例如，此处是随着其转为成功状态，gen_resolvconf 日志的一个片段：

 systemd[1]：已开始更新 Update systemd-resolved for mesos-dns。
 systemd[1]：正在开始更新 Update systemd-resolved for mesos-dns... 
 gen_resolvconf.py[1073]: options timeout:1
 gen_resolvconf.py[1073]: options attempts:3
 gen_resolvconf.py[1073]: nameserver 10.0.7.166
 gen_resolvconf.py[1073]: nameserver 10.0.0.2
 gen_resolvconf.py[1073]: 正在更新 /etc/resolv.conf
    


## <a name="mesos-master-process"></a>Mesos 管理节点进程

Mesos 管理节点进程在管理节点上开始。`mesos-master` 进程在集群中的一个节点上运行，通过接收来自代理节点的资源邀约并将这些资源提供给注册的服务（如 Marathon 或 Chronos）来编排代理节点上任务的运行。如需更多信息，请参阅 [Mesos 管理节点配置][2] 文档。

**故障排除：**

* 直接转到 Mesos Web 界面，并在 ` 查看其状态<master-hostname>/mesos`。
* 对管理节点执行 SSH，并输入以下命令来查看从启动时间起的日志：

    ```bash 
    journalctl -u dcos-mesos-master -b
    ```


例如，此处是随着其转为成功状态，Mesos 管理节点日志的一个片段：

 mesos-master[1250]: I1118 13:59:33.890916 1250 master.cpp:376] 管理节点 cdcb6222-65a1-4d60-83af-33dadec41e92 (10.0.7.166) 启动于 10.0.7.166:5050
 mesos-master[1250]: I1118 13:59:33.890945 1250 master.cpp:378] 启动时的标记：--allocation_interval="1secs" --allocator="HierarchicalDRF" --authenticate="false" --authenticate_slaves="false" --authenticators="crammd5" --authorizers="local" --cluster="pool-880dfdbf0f2845bf8191" --framework_sorter="drf" --help="false" --hostname_lookup="false" --initialize *driver_logging="true" --ip_discovery_command="/opt/mesosphere/bin/detect_ip" --log_auto_initialize="true" --log_dir="/var/log/mesos" --logbufsecs="0" --logging_level="INFO" --max* slave_ping_timeouts="5" --port="5050" --quiet="false" --quorum="1" --recovery_slave_removal_limit="100%" --registry="replicated_log" --registry_fetch_timeout="1mins" --registry_sto re_timeout="5secs" --registry_strict="false" --roles="slave_public" --root_submissions="true" --slave_ping_timeout="15secs" --slave_reregister_timeout="10mins" --user_sorter="drf" --version="false" --webui_dir="/opt/mesosphere/packages/mesos--30d3fbeb6747bb086d71385e3e2e0eb74ccdcb8b/share/mesos/webui" --weights="slave_public=1" --work_dir="/var/lib/mesos/mas ter" --zk="zk://127.0.0.1:2181/mesos" --zk_session_timeout="10secs" mesos-master[1250]: 2015-11-18 13:59:33,891:1250(0x7f14427fc700):ZOO_INFO@check_events@1750: 会话确立已在服务器上完成 [127.0.0.1:2181], sessionId=0x1511ae440bc0001, negotiated timeout=10000


## <a name="mesos-dns"></a>Mesos-DNS

Mesos-DNS 在 DC/OS 管理节点上启动。Mesos DNS 在集群内提供服务发现。可选的是，Mesos-DNS 可以将未处理的请求转发到外部 DNS 服务器，具体取决于集群的配置方式。例如，任何未在 `.mesos` 结束的内容将会转发给外部解析器。

**故障排除：**

* 对管理节点执行 SSH，并输入以下命令来查看从启动时间起的日志：

    ```bash
    journalctl -u dcos-mesos-dns -b
    ```


例如，此处是随着其转为成功状态，Mesos-DNS 日志的一个片段：


 mesos-dns[1197]: I1118 13:59:34.763885 1197 detect.go:135] 从 "" -> "json.info_0000000001" 更改首要节点
 mesos-dns[1197]: I1118 13:59:34.764537 1197 detect.go:145] 检测到管理节点信息：&MasterInfo{Id:*cdcb6222-65a1-4d60-83af-33dadec41e92,Ip:*2785476618,Port:*5050,Pid:*master@10.0.7.166:5050,Hostname:*10\.0.7.166,Version:*0\.25.0,Address:&Address{Hostname:*10\.0.7.166,Ip:*10\.0.7.166,Port:*5050,XXX_unrecognized:[],},XXX_unrecognized:[],}
 mesos-dns[1197]: 非常冗长：2015/11/18 13:59:34 masters.go:47: 更新的首要节点：&MasterInfo{Id:*cdcb6222-65a1-4d60-83af-33dadec41e92,Ip:*2785476618,Port:*5050,Pid:*master@10.0.7.166:5050,Hostname:*10\.0.7.166,Version:*0\.25.0,Address:&Address{Hostname:*10\.0.7.166,Ip:*10\.0.7.166,Port:*5050,XXX_unrecognized:[],},XXX_unrecognized:[],}
 mesos-dns[1197]: 非常冗长：2015/11/18 13:59:34 main.go:76: 检测到新的管理节点：[10.0.7.166:5050]
 mesos-dns[1197]: 非常冗长：2015/11/18 13:59:34 generator.go:70: Zookeeper 认为首要节点是：10.0.7.166:5050
 mesos-dns[1197]: 非常冗长：2015/11/18 13:59:34 generator.go:162: 从管理节点 10.0.7.166 重新加载
 mesos-dns[1197]: I1118 13:59:34.766005 1197 detect.go:219] 通知管理节点成员变化：[&MasterInfo{Id:*cdcb6222-65a1-4d60-83af-33dadec41e92,Ip:*2785476618,Port:*5050,Pid:*master@10.0.7.166:5050,Hostname:*10\.0.7.166,Version:*0\.25.0,Address:&Address{Hostname:*10\.0.7.166,Ip:*10\.0.7.166,Port:*5050,XXX_unrecognized:[],},XXX_unrecognized:[],}]
 mesos-dns[1197]: 非常冗长：2015/11/18 13:59:34 masters.go:56: 更新的管理节点：[&MasterInfo{Id:*cdcb6222-65a1-4d60-83af-33dadec41e92,Ip:*2785476618,Port:*5050,Pid:*master@10.0.7.166:5050,Hostname:*10\.0.7.166,Version:*0\.25.0,Address:&Address{Hostname:*10\.0.7.166,Ip:*10\.0.7.166,Port:*5050,XXX_unrecognized:[],},XXX_unrecognized:[],}]
 mesos-dns[1197]: I1118 13:59:34.766124 1197 detect.go:313] 在下一个检测周期之前休息


## <a name="zookeeper-and-exhibitor"></a>ZooKeeper 和 Exhibitor 

ZooKeeper 和 Exhibitor 在管理节点上启动。Exhibitor 存储位置必须正确配置才能让其工作。如需更多信息，请参阅 [exhibitor_storage_backend](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#exhibitor-storage-backend) 参数。

DC/OS 使用 ZooKeeper，后者是一个高性能协调服务，用来管理已安装的 DC/OS 服务。Exhibitor 在 DC/OS 安装期间自动配置管理节点上的 ZooKeeper。如需更多信息，请参阅 [配置参数](/cn/1.11/installing/production/advanced-configuration/configuration-reference/)。

* 转到 Exhibitor Web 界面，并在 `<master-hostname>/exhibitor` 查看状态。

* 对管理节点执行 SSH，并输入以下命令来查看从启动时间起的日志：

    ```bash
    journalctl -u dcos-exhibitor -b
    ```


例如，此处是随着 Exhibitor 转为成功状态，Exhibitor 日志的一个片段：

 INFO com.netflix.exhibitor.core.activity.ActivityLog 自动实例管理将更改服务器列表：==> 1:10.0.7.166 [ActivityQueue-0]
 INFO com.netflix.exhibitor.core.activity.ActivityLog 状态：正在服务 [ActivityQueue-0]
 INFO com.netflix.exhibitor.core.activity.ActivityLog 服务器列表已更改 [ActivityQueue-0]
 INFO com.netflix.exhibitor.core.activity.ActivityLog 尝试停止实例 [ActivityQueue-0]
 INFO com.netflix.exhibitor.core.activity.ActivityLog 尝试启动/重启 ZooKeeper [ActivityQueue-0]
 INFO com.netflix.particiitor.core.activity.ActivityLog 结束尝试的结果：0 [ActivityQueue-0]
 INFO com.netflix.exhibitor.core.activity.ActivityLog 进程通过以下启动：/opt/mesosphere/active/exhibitor/usr/zookeeper/bin/zkServer.sh [ActivityQueue-0]
 ERROR com.netflix.exhibitor.core.activity.ActivityLog ZooKeeper 服务器：JMX 默认启用 [pool-3-thread-1] ERROR com.netflix.exhibitor.core.activity.ActivityLog ZooKeeper 服务器：使用配置：/opt/mesosphere/active/exhibitor/usr/zookeeper/bin/../conf/zoo.cfg [pool-3-thread-1]
 INFO com.netflix.exhibitor.core.activity.ActivityLog ZooKeeper 服务器：正在启动 Cookeeper ... 已启动 [pool-3-thread-3]
 INFO com.netflix.exhibitor.core.activity.ActivityLog 清理任务已完成 [pool-3-thread-6]
 INFO com.netflix.exhibitor.core.activity.ActivityLog 清理任务已完成 [pool-3-thread-9]
    



 [1]: /1.11/installing/ent/custom/configuration/configuration-parameters/#exhibitor-storage-backend
 [2]: https://open.mesosphere.com/reference/mesos-master/
 [3]: /1.11/installing/production/advanced-configuration/configuration-reference/#master-discovery
 [4]: /1.11/overview/architecture/boot-sequence/
 [5]: /1.11/installing/ent/custom/configuration/configuration-parameters/
 [6]: /1.11/administering-clusters/sshcluster/

