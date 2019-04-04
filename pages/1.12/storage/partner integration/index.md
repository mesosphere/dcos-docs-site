# Partner Integrations

## Portworx

Portworx solves the operational and data management problems enterprises encounter when running stateful applications on DC/OS. 
Using Portworx volumes, you can:

* Dynamically create volumes for tasks at run time, no more submitting tickets for storage provisioning
* Dynamically and automatically resize volumes based on demand while task is running
* Run tasks on the same hosts that your data is located on for optimum performance
* Avoid pinning services to particular hosts, reducing the value of automated scheduling
* Avoid fragile block device mount/unmount operations that block or delay failover operations
* Encrypt data at rest and in flight at the container level

## Installing Portworx with DC/OS

It is fairly straightforward to install Portworx with DC/OS. 
For detailed instructions, visit https://docs.portworx.com/install-with-other/dcos/#installation

## Building applications

For developers building applications using DC/OS, Portworx offers an alternative way (to local volumes) to provision storage with high availability, data protection, encryption and a host of other attributes. Portworx volumes are created, instantiated, and managed by DC/OS. Portworx volumes can be used with both Docker containers and Mesos/UCR container.
Portworx supports passing the volume spec inline along with the volume name. This is useful when creating a volume with DC/OS through a marathon application template. Using the inline spec, volumes can be created dynamically and all attributes, such as volume size, encryption keys etc can be passed in through marathon.

### Using Docker containers in Marathon 

You can specify Portworx as a volume driver in a task being launched via Marathon as Docker container. You can also specify additional driver options for the volume as key:value pairs in the parameters. For example to create a volume with replication factor 3 and mount it under `/data` you would add the following lines in your marathon spec:

```json
{
  "id": "hello",
  "instances": 1,
  "cpus": 0.1,
  "mem": 32,
  "cmd": "date >> /data/test.txt; cat /data/test.txt",
  "container": 
  {
     "type": "DOCKER",
     "docker": 
     {
      "image": "alpine:3.1",
      "network": "HOST",
      "forcePullImage": true
      "parameters": [
        {
          "key": "volume-driver",
           "value": "pxd"
        }, 
        {
          "key":"volume",
          "value": "repl=3,size=500,name=px_vol1:/data"
        }
       ]
     },
    "upgradeStrategy": {
    "minimumHealthCapacity": 0,
    "maximumOverCapacity": 0
   }
}
```
### Using Mesos/UCR containers in Marathon 
You can specify Portworx as a volume driver in a task being launched via Marathon as Mesos/UCR container. This would mount the Portworx volume under /data. You can also specify additional driver options for the volume as key:value pairs. For example, to create a volume with replication factor 3 and mount it under `/data` in the container you would add the following lines in your marathon spec:

```json
{
  "id": "/test-docker",
  "instances": 1,
  "cpus": 0.1,
  "mem": 32,
  "cmd": "date >> /data/test.txt; cat /data/test.txt",
  "container": 
  {
      "type": "MESOS",
      "volumes": [
      {
         "containerPath": "/data",
         "mode": "RW",
         "external": 
         {
             "size": 500,
             "name": "px_vol2",
             "provider": "dvdi",
             "options": 
              {
                 "dvdi/repl": "3",
                 "dvdi/driver": "pxd"
              }
         }   
      }
    ],
    "upgradeStrategy": {
    "minimumHealthCapacity": 0,
    "maximumOverCapacity": 0
  }
}
```

## Application examples

For a full list of frameworks supported and step-by-step instructions, visit: https://docs.portworx.com/install-with-other/dcos/application-installs/

## Operate and Maintain

For information on production setups, upgrades, and advanced configurations, visit: https://docs.portworx.com/install-with-other/dcos/operate-and-maintain/

