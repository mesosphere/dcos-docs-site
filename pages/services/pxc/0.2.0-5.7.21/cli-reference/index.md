---
layout: layout.pug
navigationTitle:  CLI Reference
title: CLI Reference
menuWeight: 70
excerpt: All CLI commands available
featureMaturity:
enterprise: false
model: /services/pxc/data.yml
render: mustache
---


This is the complete list of DC/OS {{ model.techName }} commands available:
   
## dcos {{ model.serviceName }} describe 
View the configuration for this service

## dcos {{ model.serviceName }} endpoints `[<name>]`
View client endpoints   

## dcos {{ model.serviceName }} plan list
Show all plans for this service    
   
## dcos {{ model.serviceName }} plan status 
Display the status of the plan with the provided plan name.

    [<flags>] <plan>   
    --json  Show raw JSON response instead of user-friendly tree

## dcos {{ model.serviceName }} plan start
Start the plan with the provided name and any optional plan arguments

    
     <flags> <plan>
    -p, --params=PARAMS ...  Envvar definition in VAR=value form; can be repeated for multiple variables
          
## dcos {{ model.serviceName }} plan stop `<plan>`
Stop the running plan with the provided name
## dcos {{ model.serviceName }} plan pause 

    <plan> [<phase>]

Pause the plan, or a specific phase in that plan with the provided phase name (or UUID)
## dcos {{ model.serviceName }} plan resume `<plan>`               
Resume the plan, or a specific phase in that plan with the provided phase name (or UUID)

 
    [<phase>]
  
## dcos {{ model.serviceName }} plan force-restart 

    <plan> <phase> <step>

Restart the plan with the provided name, or a specific phase in the plan with the provided name, or a specific step in a phase of the plan with the provided step name.   
## dcos {{ model.serviceName }} plan force-complete 

    <plan>    
Force complete a specific step in the provided phase. Example uses include the following: Abort a sidecar operation due to observed failure or known required manual preparation that was not performed

 
    [<phase>] [<step>]
   
## dcos {{ model.serviceName }} pod list   
Display the list of known pod instances             
## dcos {{ model.serviceName }} pod restart `<pod>`    
Restarts a given pod without moving it to a new agent
## dcos {{ model.serviceName }} pod replace `<pod>`    
Destroys a given pod and moves it to a new agent  
## dcos {{ model.serviceName }} update start
Launches an update operation

    [<flags>]
    --options=OPTIONS  Path to a JSON file that contains customized package installation options
    --package-version=PACKAGE-VERSION  
    The desired package version
    --replace   Replace the existing configuration in whole. Otherwise, the existing configuration and options are merged.


## dcos {{ model.serviceName }} update force-complete 

    <phase> <step> 

Force complete a specific step in the provided phase
## dcos {{ model.serviceName }} update force-restart 
Restart update plan, or specific step in the provided phase

 
    [<phase> [<step>]
 
## dcos {{ model.serviceName }} update package-versions
View a list of available package versions to downgrade or upgrade to

## dcos {{ model.serviceName }} update pause   
Pause update plan
## dcos {{ model.serviceName }} update resume
Resume update plan
## dcos {{ model.serviceName }} update status   
View status of a running update   

 
    [<flags>]
     --json  Show raw JSON response instead of user-friendly tree
             