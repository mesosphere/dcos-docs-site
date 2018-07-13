---
layout: layout.pug
navigationTitle:  Command Reference
title: Command Reference
menuWeight: 60
excerpt: Commands used in the DC/OS Minio Service
featureMaturity:
enterprise: false
---

Here is the complete list of DC/OS Apache Minio Service commands available:

1. List IDs of all available configurations

    ```shell
    dcos minio config list
    ```
2. Display a specified configuration   

    ```shell
    dcos minio config show <config_id>
    ```  
3. Display the target configuration    

    ```shell
    dcos minio config target
    ```
4. List ID of the target configuration      

    ```shell
    dcos minio config target_id
    ```
5. List IDs of all available configurations     

    ```shell
    dcos minio debug config list
    ```
6. Display a specified configuration       

    ```shell
    dcos minio debug config show <config_id>
    ```      
7. Display the target configuration

    ```shell
    dcos minio debug config target
    ```
8. List ID of the target configuration   

    ```shell
    dcos minio debug config target_id
    ```
9. Display the Mesos framework ID   

    ```shell
    dcos minio debug state framework_id
    ```
10. List names of all custom properties  

    ```shell
    dcos minio debug state properties
    ```
11. Display the content of a specified property      

    ```shell
    dcos minio debug state property <name>
    ```        
12. Refresh the state cache, used for debugging

    ```shell
    dcos minio debug state refresh_cache
    ```
13. Pause a pod's tasks for debugging      

    ```shell
    dcos minio debug pod pause [<flags>] <pod>           
    -t, --tasks=TASKS ...  List of specific tasks to be paused, otherwise the entire pod
    ```
14. Resume a pod's normal execution following a `pause` command

    ```shell
    dcos minio debug pod resume [<flags>] <pod>         
    -t, --tasks=TASKS ...  List of specific tasks to be resumed, otherwise the entire pod
    ```         
15. View the configuration for this service

    ```shell
    dcos minio describe
    ```
16. View client endpoints   

    ```shell  
    dcos minio endpoints [<name>]
    ```
17. Show all plans for this service    

    ```shell  
    dcos minio plan list
    ```    
18. Display the status of the plan with the provided plan name

    ```shell
    dcos minio plan status [<flags>] <plan>   
    --json  Show raw JSON response instead of user-friendly tree
    ```    
19. Start the plan with the provided name and any optional plan arguments

    ```shell
    dcos minio plan start <flags> <plan>
    -p, --params=PARAMS ...  Envvar definition in VAR=value form; can be repeated for multiple variables
    ```      
20. Stop the running plan with the provided name

    ```shell
    dcos minio plan stop <plan>
    ```          
21. Pause the plan, or a specific phase in that plan with the provided phase name (or UUID)

    ```shell
    dcos minio plan pause <plan> [<phase>]
    ```               
22. Resume the plan, or a specific phase in that plan with the provided phase name (or UUID)

    ```shell
    dcos minio plan resume <plan> [<phase>]
    ```    
23. Restart the plan with the provided name, or a specific phase in the plan with the provided name, or a specific step in a  phase of the plan with the provided step name.   

    ```shell
    dcos minio plan force-restart <plan> <phase> <step>
    ```       
24. Force complete a specific step in the provided phase.

    ```shell
    dcos minio plan force-complete <plan> [<phase> [<step>]]
    ```   

Example uses include the following:

Abort a sidecar operation due to observed failure or known required manual preparation that was not performed.

25. Display the list of known pod instances                 

    ```shell
    dcos minio pod list
    ```   

26. Display the status for tasks in one pod or all pods  

    ```shell
    dcos minio pod status [<flags> <pod>]
    --json  Show raw JSON response instead of user-friendly tree
    ```        

27. Display the full state information for tasks in a pod

    ```shell
    dcos minio pod info <pod>
    ```      

28. Restart a given pod without moving it to a new agent

    ```shell
    dcos minio pod restart <pod>
    ```      
29. Destroy a given pod and move it to a new agent  

    ```shell
    dcos minio pod replace <pod>
    ```      

30. Display the Mesos framework ID

    ```shell
    dcos minio state framework_id
    ```  
31. List names of all custom properties

    ```shell
    dcos minio state properties
    ```  

32. Display the content of a specified property

    ```shell
    dcos minio state property <name>
    ```   

33. Refresh the state cache, used for debugging     

    ```shell
    dcos minio state refresh_cache
    ```     
34. Launch an update operation

    ```shell
    dcos minio update start [<flags>]
    --options=OPTIONS  Path to a JSON file that contains customized package installation options
    --package-version=PACKAGE-VERSION  
                       The desired package version
    --replace          Replace the existing configuration in whole. Otherwise, the existing configuration and options are merged.
    ```     

35. Force complete a specific step in the provided phase

    ```shell
    dcos minio update force-complete <phase> <step>
    ```         

36. Restart update plan, or specific step in the provided phase

    ```shell
    dcos minio update force-restart [<phase> [<step>]]
    ```

35. View a list of available package versions to downgrade or upgrade to

    ```shell
    dcos minio update package-versions
    ```     

36. Pause update plan

    ```shell
    dcos minio update pause
    ```  
37. Resume update plan

    ```shell
    dcos minio update resume
    ```  

38. View status of a running update   

    ```shell
    dcos minio update status [<flags>]
    --json  Show raw JSON response instead of user-friendly tree
    ```               

