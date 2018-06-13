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

  help 
    [<command> ...]
      Show help.


  config list
    
    List IDs of all available
    configurations


  config show <config_id>
    
    Display a specified configuration


  config target
    
    Display the target configuration

config target_id

    configuration

debug config list
    
    List IDs of all available configurations


debug config show <config_id>
    
    Display a specified configuration

debug config target
    
    Display the target configuration

debug config target_id
    
    List ID of the target configuration

debug state framework_id
    
    Display the Mesos framework ID

debug state properties
    
    List names of all custom properties

debug state property <name>
    
    Display the content of a specified property

debug state refresh_cache
    
    Refresh the state cache, used for debugging

debug pod pause <flags> <pod>
    
    Pauses a pod's tasks for debugging

    -t, --tasks=TASKS ...  List of specific tasks to be paused, otherwise the
                           entire pod
debug pod resume <flags> <pod>
    
    Resumes a pod's normal execution following a pause command

    -t, --tasks=TASKS ...  List of specific tasks to be resumed, otherwise the
                           entire pod
describe
    
    View the configuration for this service

endpoints [<name>]
    
    View client endpoints

plan list
    
    Show all plans for this service

plan status <flags> <plan>
    
    Display the status of the plan with the provided plan name


plan stop <plan>
   
    Stop the running plan with the provided name


plan pause <plan> <phase>
    
    Pause the plan, or a specific phase in that plan with the provided phase
    name (or UUID)


plan resume <plan> <phase>
    
    Resume the plan, or a specific phase in that plan with the provided phase
    name (or UUID)


plan force-restart <plan> <phase> <step>
    
    Restart the plan with the provided name, or a specific phase in the plan
    with the provided name, or a specific step in a phase of the plan with the
    provided step name.


plan force-complete <plan> <phase> <step>
    
    Force complete a specific step in the provided phase. Example uses include
    the following: Abort a sidecar operation due to observed failure or known
    required manual preparation that was not performed


pod list
    
    Display the list of known pod instances


pod status [<flags>] [<pod>]
    
    Display the status for tasks in one pod or all pods

    --json  Show raw JSON response instead of user-friendly tree


pod info <pod>
    
    Display the full state information for tasks in a pod


pod restart <pod>
    
    Restarts a given pod without moving it to a new agent


pod replace <pod>
    
    Destroys a given pod and moves it to a new agent


state framework_id
   
    Display the Mesos framework ID


state properties List names of all custom properties


state property <name>
  
    Display the content of a specified property


state refresh_cache Refresh the state cache, used for debugging


update start [<flags>]
    
    Launches an update operation

    --options=OPTIONS  Path to a JSON file that contains customized package
                       installation options
    --package-version=PACKAGE-VERSION  
                       The desired package version
    --replace          Replace the existing configuration in whole. Otherwise,
                       the existing configuration and options are merged.


update force-complete <phase> <step>
           
    Force complete a specific step in the provided phase


update force-restart [<phase> [<step>]]
         
    Restart update plan, or specific step in the provided phase


update package-versions
    
    View a list of available package versions to downgrade or upgrade to


update pause 
     
     Pause update plan


update resume
    
    Resume update plan


update status [<flags>]
    
    View status of a running update

    --json  Show raw JSON response instead of user-friendly tree
