---
post_title: Quick Start
menu_order: 40
post_excerpt: ""
enterprise: 'no'
---

# Prerequisite

- DC/OS should be installed on your cluster. To know about installing DC/OS visit (Link will be here).

# Steps

If you are using open source DC/OS, install percona-pxc-mysql on the cluster with the following command from the DC/OS CLI. If you are using Enterprise DC/OS, you may need to follow additional instructions. See the Install and Customize section for information.

```shell
dcos package install --yes percona-pxc-mysql
```
Alternatively, you can install percona-pxc-mysql from [the DC/OS web interface].

Once the install command is triggered, the service will deploy with a default configuration. You can monitor its deployment via the Services tab of the DC/OS web interface. Mentioned below is the complete list of DC/OS percona-pxc-mysql Commands Available:

1. List IDs of all available configurations

    ```shell
    dcos percona-pxc-mysql config list
    ```
2. Display a specified configuration   
    
    ```shell
    dcos percona-pxc-mysql config show <config_id>
    ```  
3. Display the target configuration    

    ```shell
    dcos percona-pxc-mysql config target
    ```
4. List ID of the target configuration      

    ```shell
    dcos percona-pxc-mysql config <target_id>
    ```
5. List IDs of all available configurations     

    ```shell
    dcos percona-pxc-mysql debug config list
    ```
6. Display a specified configuration       

    ```shell
    dcos percona-pxc-mysql debug config show <config_id>
    ```      
7. Display the target configuration

    ```shell
    dcos percona-pxc-mysql debug config target
    ```
8. List ID of the target configuration   
    
    ```shell
    dcos percona-pxc-mysql debug config <target_id>
    ```
9. Display the Mesos framework ID   
    
    ```shell
    dcos percona-pxc-mysql debug state <framework_id>
    ```
10. List names of all custom properties  
    
    ```shell
    dcos percona-pxc-mysql debug state properties
    ```
11. Display the content of a specified property      

    ```shell
    dcos percona-pxc-mysql debug state property <name>
    ```        
12. Refresh the state cache, used for debugging

    ```shell
    dcos percona-pxc-mysql debug state refresh_cache
    ```
13. Pauses a pod's tasks for debugging      

    ```shell
    dcos percona-pxc-mysql debug pod pause [<flags>] <pod>           
    -t, --tasks=TASKS ...  List of specific tasks to be paused, otherwise the entire pod
    ```
14. Resumes a pod's normal execution following a pause command

    ```shell
    dcos percona-pxc-mysql debug pod resume [<flags>] <pod>         
    -t, --tasks=TASKS ...  List of specific tasks to be resumed, otherwise the entire pod
    ```         
15. View the configuration for this service

    ```shell
    dcos percona-pxc-mysql describe
    ```
16. View client endpoints   

    ```shell  
    dcos percona-pxc-mysql endpoints [<name>]
    ```
17. Show all plans for this service    

    ```shell  
    dcos percona-pxc-mysql plan list
    ```    
18. Display the status of the plan with the provided plan name

    ```shell 
    dcos percona-pxc-mysql plan status [<flags>] <plan>   
    --json  Show raw JSON response instead of user-friendly tree
    ```    
19. Start the plan with the provided name and any optional plan arguments

    ```shell 
    dcos percona-pxc-mysql plan start <flags> <plan>
    -p, --params=PARAMS ...  Envvar definition in VAR=value form; can be repeated for multiple variables
    ```      
20. Stop the running plan with the provided name

    ```shell 
    dcos percona-pxc-mysql plan stop <plan>
    ```          
21. Pause the plan, or a specific phase in that plan with the provided phase name (or UUID)

    ```shell 
    dcos percona-pxc-mysql plan pause <plan> [<phase>]
    ```               
22. Resume the plan, or a specific phase in that plan with the provided phase name (or UUID)

    ```shell 
    dcos percona-pxc-mysql plan resume <plan> [<phase>]
    ```    
23. Restart the plan with the provided name, or a specific phase in the plan with the provided name, or a specific step in a              phase of the plan with the provided step name.   
    
    ```shell 
    dcos percona-pxc-mysql plan force-restart <plan> <phase> <step>
    ```       
24. Force complete a specific step in the provided phase. Example uses include the following: Abort a sidecar operation due to observed failure or known required manual preparation that was not performed

    ```shell 
    dcos percona-pxc-mysql plan force-complete <plan> [<phase> [<step>]]
    ```   
    
25. Display the list of known pod instances                 

    ```shell 
    dcos percona-pxc-mysql pod list
    ```   
    
26. Display the status for tasks in one pod or all pods  
  
    ```shell 
    dcos percona-pxc-mysql pod status [<flags> <pod>]
    --json  Show raw JSON response instead of user-friendly tree
    ```        
    
27. Display the full state information for tasks in a pod

    ```shell 
    dcos percona-pxc-mysql pod info <pod>
    ```      

28. Restarts a given pod without moving it to a new agent

    ```shell 
    dcos percona-pxc-mysql pod restart <pod>
    ```      
29. Destroys a given pod and moves it to a new agent  
 
    ```shell 
    dcos percona-pxc-mysql pod replace <pod>
    ```      
    
30. Display the Mesos framework ID

    ```shell 
    dcos percona-pxc-mysql state framework_id
    ```  
31. List names of all custom properties
  
    ```shell 
    dcos percona-pxc-mysql state properties
    ```  
 
32. Display the content of a specified property
 
    ```shell 
    dcos percona-pxc-mysql state property <name>
    ```   
    
33. Refresh the state cache, used for debugging     

    ```shell 
    dcos percona-pxc-mysql state refresh_cache
    ```     
34. Launches an update operation
 
    ```shell 
    dcos percona-pxc-mysql update start [<flags>]
    --options=OPTIONS  Path to a JSON file that contains customized package installation options
    --package-version=PACKAGE-VERSION  
                       The desired package version
    --replace          Replace the existing configuration in whole. Otherwise, the existing configuration and options are merged.
    ```     

35. Force complete a specific step in the provided phase
  
    ```shell 
    dcos percona-pxc-mysql update force-complete <phase> <step>
    ```         

36. Restart update plan, or specific step in the provided phase

    ```shell 
    dcos percona-pxc-mysql update force-restart [<phase> [<step>]]
    ``` 

35. View a list of available package versions to downgrade or upgrade to
    
    ```shell 
    dcos percona-pxc-mysql update package-versions
    ```     
    
36. Pause update plan

    ```shell 
    dcos percona-pxc-mysql update pause
    ```  
37. Resume update plan

    ```shell 
    dcos percona-pxc-mysql update resume
    ```  
    
38. View status of a running update   
  
    ```shell 
    dcos percona-pxc-mysql update status [<flags>]
    --json  Show raw JSON response instead of user-friendly tree
    ```               
