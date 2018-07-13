---
layout: layout.pug
navigationTitle:  Command Reference
title: Command Reference
menuWeight: 60
excerpt: Commands used in the DC/OS Prometheus Service
featureMaturity:
enterprise: false
---

usage: dcos prometheus
  


Flags:

  -h, --help               Show context-sensitive help.
  
  -v, --verbose            Enable extra logging of requests/responses
  
      --name="prometheus"  Name of the service instance to query

Commands:

List IDs of all available
configurations

    dcos prometheus config list

Display a specified configuration

    dcos prometheus config show <config_id>

Display the target configuration   
 
    dcos prometheus  config target
    
configuration

    dcos prometheus config target_id

List IDs of all available configurations

    dcos prometheus debug config list
    
Display a specified configuration

    dcos prometheus debug config show <config_id>
    
Display the target configuration

    dcos prometheus debug config target
    
List ID of the target configuration

    dcos prometheus debug config target_id
    
Dsplay the Mesos framework ID

    dcos prometheus debug state framework_id

List names of all custom properties
 
    dcos prometheus debug state properties

Display the content of a specified property 

    dcos prometheus debug state property <name>
   
Refresh the state cache, used for debugging

    dcos prometheus debug state refresh_cache

Pauses a pod's tasks for debugging

    dcos prometheus debug pod pause <flags> <pod>
    -t, --tasks=TASKS ...  List of specific tasks to be paused, otherwise the
                           entire pod
Resumes a pod's normal execution following a pause command

    dcos prometheus debug pod resume <flags> <pod>
    -t, --tasks=TASKS ...  List of specific tasks to be resumed, otherwise the
                           entire pod

View the configuration for this service
    dcos prometheus describe
 
View client endpoints

    dcos prometheus endpoints <name>

    
Show all plans for this service

    dcos prometheus plan list
 
Display the status of the plan with the provided plan name

    dcos prometheus plan status <flags> <plan>

Stop the running plan with the provided name

    dcos prometheus plan stop <plan>

Pause the plan, or a specific phase in that plan with the provided phase
    name (or UUID)

    dcos prometheus plan pause <plan> <phase>

Resume the plan, or a specific phase in that plan with the provided phase name (or UUID)

    dcos prometheus plan resume <plan> <phase>

    
Restart the plan with the provided name, or a specific phase in the plan with the provided name, or a specific step in a phase of the plan with the provided step name.

    dcos prometheus plan force-restart <plan> <phase> <step>

    
Force complete a specific step in the provided phase. Example uses include the following: Abort a sidecar operation due to observed failure or known required manual preparation that was not performed

    dcos prometheus plan force-complete <plan> <phase> <step>

    
Display the list of known pod instances

    dcos prometheus pod list


Display the full state information for tasks in a pod
    
    dcos prometheus pod info <pod>
 

Restarts a given pod without moving it to a new agent
   
    dcos prometheus pod restart <pod>

Destroys a given pod and moves it to a new agent

    dcos prometheus pod replace <pod>

Display the Mesos framework ID

    dcos prometheus state framework_id

    
Display the content of a specified property

    dcos prometheus state properties List names of all custom properties

    dcos prometheus state property <name>

    dcos prometheus state refresh_cache Refresh the state cache, used for debugging


Launches an update operation
     
    dcos prometheus update start <flags>

    --options=OPTIONS  Path to a JSON file that contains customized package
                       installation options
    --package-version=PACKAGE-VERSION
                       The desired package version
    --replace          Replace the existing configuration in whole. Otherwise,
                       the existing configuration and options are merged.

Force complete a specific step in the provided phase

    dcos prometheus update force-complete <phase> <step>

Restart update plan, or specific step in the provided phase

    dcos prometheus update force-restart <phase> <step>

View a list of available package versions to downgrade or upgrade to

    dcos prometheus update package-versions

Resume update plan

    dcos prometheus update pause
  
    dcos prometheus update resume

View status of a running update

    dcos prometheus update status <flags>




