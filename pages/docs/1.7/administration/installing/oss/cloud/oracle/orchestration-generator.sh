#!/bin/bash
# This script will generate an orchestartion for mesos.
identity_domian=`curl -s http://192.0.0.192/latest/meta-data/instance-id|grep -o -P '(?<=\/Compute-).*(\/)'|awk -F "/" {'print $1'}`
echo "Your identity domain is $identity_domian"
function authenticate()
{	
	while [[ -z "$userid" ]]
	do
		echo -n "Enter your user id and press [ENTER]: "
        	read userid
	done
        while [[ -z "$password" ]]
        do
        	echo -n "Enter your password  and press [ENTER]: "
		read -s password
	done
	echo ""
	while [[ -z "$endpoint" ]]
        do
        	echo -n "Enter your REST Endpoint [Eg : https://api-z27.compute.us6.oraclecloud.com]: "
        	read  endpoint
	done

	echo "Authenticating..."
	auth_result=`curl -i -s -X POST      -H "Content-Type: application/oracle-compute-v3+json"      -d '{ "password": "'"${password}"'", "user": "/Compute-'"${identity_domian}"'/'"${userid}"'"}'         "${endpoint}"/authenticate/`
	if [[ $auth_result == *"204 No Content"* ]]
	then
		echo "Authentication Successful"
		#echo $auth_result
		auth_token=`echo $auth_result|grep Set|grep -o -P "(?<=Set-Cookie: ).*(?=; Path)"`
		#`echo $auth_token
	else
		echo "Authentication Failed. Try again"
		unset userid
		unset password;
		unset endpoint;
		authenticate
	fi
}
function getsshkeys
{
arr=($(curl -s -X GET      -H "Cookie: ${auth_token}"      -H "Accept: application/oracle-compute-v3+json"    "${endpoint}"/sshkey/Compute-"${identity_domian}"/|awk '{ gsub("},", "},\n") } 1'|grep "true,"|awk '{ gsub(",", "\n") } 1'|grep "\"name\""|awk '{ gsub(":", "},\n") } 1'|grep -v "\"name\""| awk -F '"' '{print $2}'))
#printf "%s\n" "${arr[@]}"
echo "Available ssh keys"
index_count=0
for i in "${!arr[@]}"; do 
  printf "%s\t%s\n" "$((i+1))" "${arr[$i]}"
  index_count=$((index_count+1))
done
#echo $index_count
while [[ ! $ssh_sel -gt 0 ]] || [[ ! $ssh_sel -le $index_count ]]
do
        echo -n "Select the ssh key to be used [Eg 1]: "
        read ssh_sel 
done
selected_ssh_key=`echo ${arr[$((ssh_sel-1))]}`
#echo $selected_ssh_key
}

function getImages
{
imagearr=($(curl -s -X GET -H "Cookie: ${auth_token}"      -H "Accept: application/oracle-compute-v3+json"    "${endpoint}"/imagelist/Compute-"${identity_domian}"/|awk '{ gsub(",", "\n") } 1'|grep "\"name\""|awk '{ gsub(":", "},\n") } 1'|grep -v "\"name\""| awk -F '"' '{print $2}'))
#echo $imagearr
echo "Available Images";
index_count=0
for i in "${!imagearr[@]}"; do
  printf "%s\t%s\n" "$((i+1))" "${imagearr[$i]}"
  index_count=$((index_count+1))
done
#echo $index_count
while [[ ! $image_sel -gt 0 ]] || [[ ! $image_sel -le $index_count ]]
do
        echo -n "Select the image to be used for instances [Eg 1]: "
        read image_sel
done
selected_image=`echo ${imagearr[$((image_sel-1))]}`
#echo $selected_ssh_key
}

function shape
{
	while [[ -z $shape_type ]] 
	do
	while [[ $shape_type != "oc3" ]] && [[ $shape_type != "oc4" ]] && [[ $shape_type != "oc5" ]] && [[ $shape_type != "oc6" ]] && [[ $shape_type != "oc7" ]] && [[ $shape_type != "oc1m" ]] && [[ $shape_type != "oc2m" ]] && [[ $shape_type != "oc3m" ]] && [[ $shape_type != "oc4m" ]] && [[ $shape_type != "oc5m" ]]
        do
	echo $shape_type
	echo "Select a shape you want to use"
	echo "
	oc3(1 CPU 7.5GB RAM)
	oc4(2 CPU 15GB RAM)
	oc5(4 CPU 30GB RAM)
	oc6(8 CPU 60GB RAM)
	oc7(16 CPU 120GB RAM)
	oc1m(1 CPU 15GB RAM)
	oc2m(2 CPU 30GB RAM)
	oc3m(4 CPU 60GB RAM)
	oc4m(8 CPU 120GB RAM)
	oc5m(16 CPU 240GB RAM)
	"
	echo -n "Enter shape type [Eg. oc3]"
	read shape_type
	done
	done

}

function ipreservation
{
#For Master Agenst
for (( c=1; c<=$master_count; c++ ))
do
ipres_json=$ipres_json'{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/ipres_master_'"${c}"'","parentpool":"/oracle/public/ippool","permanent":true},'
done
#For Public Agents
for (( c=1; c<=$public_count; c++ ))
do
ipres_json=$ipres_json'{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/ipres_public_'"${c}"'","parentpool":"/oracle/public/ippool","permanent":true},'
done
#For Private Agents
for (( c=1; c<=$private_count; c++ ))
do
ipres_json=$ipres_json'{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/ipres_private_'"${c}"'","parentpool":"/oracle/public/ippool","permanent":true},'
done
#For Bootstrap
ipres_json=$ipres_json'{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/ipres_boot","parentpool":"/oracle/public/ippool","permanent":true}'
#ipres_json=`echo "$ipres_json"|sed '$s/.$//'`
ipres_json='{"description":"IP reservations","name":"/Compute-'"${identity_domian}"'/'"${userid}"'/ipreservations","oplans":[{"label":"IP reservations","obj_type":"ip/reservation","objects": ['$ipres_json']}]}'
echo $ipres_json > conf/ipreservations.json

}

function volumes
{
#For Master Agenst
for (( c=1; c<=$master_count; c++ ))
do
volume_json=$volume_json'{"label":"master_'"${c}"'_volume","obj_type":"storage/volume","ha_policy":"monitor","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/master_'"${c}"'_volume","size":"'"${instance_size}"'G","index":1,"properties":["/oracle/public/storage/default"]}]},'
done
#For Public Agents
for (( c=1; c<=$public_count; c++ ))
do
volume_json=$volume_json'{"label":"public_'"${c}"'_volume","obj_type":"storage/volume","ha_policy":"monitor","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/public_'"${c}"'_volume","size":"'"${instance_size}"'G","index":1,"properties":["/oracle/public/storage/default"]}]},'
done
#For Private Agents
for (( c=1; c<=$private_count; c++ ))
do
volume_json=$volume_json'{"label":"private_'"${c}"'_volume","obj_type":"storage/volume","ha_policy":"monitor","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/private_'"${c}"'_volume","size":"'"${instance_size}"'G","index":1,"properties":["/oracle/public/storage/default"]}]},'
done
#For Bootstrap
volume_json=$volume_json'{"label":"boot_volume","obj_type":"storage/volume","ha_policy":"monitor","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/boot_volume","size":"'"${instance_size}"'G","index":1,"properties":["/oracle/public/storage/default"]}]}'
#volume_json=`echo "$volume_json"|sed '$s/.$//'`

volume_json='{"description":"Volumes","name":"/Compute-'"${identity_domian}"'/'"${userid}"'/Volumes","oplans": ['$volume_json']}'
echo $volume_json > conf/volumes.json

}

function security
{
security_json='{"description":"Seclists","name":"/Compute-'"${identity_domian}"'/'"${userid}"'/Seclists","oplans":[{"label":"seclists","obj_type":"seclist","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","policy":"permit","outbound_cidr_policy":"permit"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","policy":"permit","outbound_cidr_policy":"permit"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/boot_seclist","policy":"permit","outbound_cidr_policy":"permit"}]},{"label":"Ports","obj_type":"secapplication","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_53_udp","dport":53,"protocol":"udp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_53_tcp","dport":53,"protocol":"tcp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_5051_tcp","dport":5051,"protocol":"tcp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_2181_tcp","dport":2181,"protocol":"tcp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_2888_tcp","dport":2888,"protocol":"tcp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_3888_tcp","dport":3888,"protocol":"tcp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_5050_tcp","dport":5050,"protocol":"tcp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_8080_tcp","dport":8080,"protocol":"tcp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_8123_tcp","dport":8123,"protocol":"tcp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_8181_tcp","dport":8181,"protocol":"tcp"}]},{"label":"Ports_Extended","obj_type":"secapplication","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_9000_tcp","dport":9000,"protocol":"tcp"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_9090_tcp","dport":9090,"protocol":"tcp"}]},{"label":"Security rules Extended","obj_type":"secrule","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/boot_to_master_8181","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_8181_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/boot_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/master_to_agent_5051","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_5051_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/master_to_agent_53_tcp","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_53_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/master_to_agent_53_udp","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_53_udp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_53_tcp","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_53_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_53_udp","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_53_udp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/public_to_master_80","application":"/oracle/public/http","src_list":"seciplist:/oracle/public/public-internet","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/boot_to_master_443","application":"/oracle/public/https","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/boot_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/public_to_boot_9000","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_9000_tcp","src_list":"seciplist:/oracle/public/public-internet","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/boot_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/public_to_boot_9090","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_9090_tcp","src_list":"seciplist:/oracle/public/public-internet","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"}]},{"label":"Security rules","obj_type":"secrule","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_2181","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_2181_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/boot_to_master_2181","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_2181_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/boot_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_2888","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_2888_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_3888","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_3888_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_5050","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_5050_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_5051","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_5051_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_8080","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_8080_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/boot_to_master_8080","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_8080_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/boot_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_8123","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_8123_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"},{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/agent_to_master_8181","application":"/Compute-'"${identity_domian}"'/'"${userid}"'/port_8181_tcp","src_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist","dst_list":"seclist:/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist","action":"PERMIT"}]}],"relationships":[{"oplan":"Security rules","to_oplan":"Ports_Extended","type":"depends"},{"oplan":"Security rules","to_oplan":"Ports","type":"depends"},{"oplan":"Security rules","to_oplan":"seclists","type":"depends"},{"oplan":"Security rules Extended","to_oplan":"Ports_Extended","type":"depends"},{"oplan":"Security rules Extended","to_oplan":"Ports","type":"depends"},{"oplan":"Security rules Extended","to_oplan":"seclists","type":"depends"}]}'
echo $security_json > conf/security.json
}


function instances
{
#For Master Agenst
for (( c=1; c<=$master_count; c++ ))
do
instance_json=$instance_json'{"label":"master_'"${c}"'","obj_type":"launchplan","ha_policy":"active","objects":[{"instances":[{"imagelist":"'"${selected_image}"'","label":"master'"${c}"'","hostname":"master-'"${c}"'","name":"/Compute-'"${identity_domian}"'/'"${userid}"'/master_'"${c}"'","storage_attachments":[{"index":1,"volume":"/Compute-'"${identity_domian}"'/'"${userid}"'/master_'"${c}"'_volume"}],"networking":{"eth0":{"seclists":["/Compute-'"${identity_domian}"'/default/default","/Compute-'"${identity_domian}"'/'"${userid}"'/master_seclist"],"nat":"ipreservation:/Compute-'"${identity_domian}"'/'"${userid}"'/ipres_master_'"${c}"'"}},"shape":"oc2m","sshkeys":["'"${selected_ssh_key}"'"]}]}]},'
done
#For Public Agents
for (( c=1; c<=$public_count; c++ ))
do
instance_json=$instance_json'{"label":"public_agent_'"${c}"'","obj_type":"launchplan","ha_policy":"active","objects":[{"instances":[{"imagelist":"'"${selected_image}"'","label":"public_agent_'"${c}"'","hostname":"public-agent-'"${c}"'","name":"/Compute-'"${identity_domian}"'/'"${userid}"'/public_agent_'"${c}"'","storage_attachments":[{"index":1,"volume":"/Compute-'"${identity_domian}"'/'"${userid}"'/public_'"${c}"'_volume"}],"networking":{"eth0":{"seclists":["/Compute-'"${identity_domian}"'/default/default","/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist"],"nat":"ipreservation:/Compute-'"${identity_domian}"'/'"${userid}"'/ipres_public_'"${c}"'"}},"shape":"oc4","sshkeys":["'"${selected_ssh_key}"'"]}]}]},'
done
#For Private Agents
for (( c=1; c<=$private_count; c++ ))
do
instance_json=$instance_json'{"label":"private_agent_'"${c}"'","obj_type":"launchplan","ha_policy":"active","objects":[{"instances":[{"imagelist":"'"${selected_image}"'","label":"private_agent_'"${c}"'","hostname":"private-agent-'"${c}"'","name":"/Compute-'"${identity_domian}"'/'"${userid}"'/private_agent_'"${c}"'","storage_attachments":[{"index":1,"volume":"/Compute-'"${identity_domian}"'/'"${userid}"'/private_'"${c}"'_volume"}],"networking":{"eth0":{"seclists":["/Compute-'"${identity_domian}"'/default/default","/Compute-'"${identity_domian}"'/'"${userid}"'/agents_seclist"],"nat":"ipreservation:/Compute-'"${identity_domian}"'/'"${userid}"'/ipres_private_'"${c}"'"}},"shape":"oc4","sshkeys":["'"${selected_ssh_key}"'"]}]}]},'
done
#For Bootstrap
instance_json=$instance_json'{"label":"bootstrap","obj_type":"launchplan","ha_policy":"active","objects":[{"instances":[{"imagelist":"'"${selected_image}"'","label":"bootstrap","name":"/Compute-'"${identity_domian}"'/'"${userid}"'/bootstrap","hostname":"bootstrap","storage_attachments":[{"index":1,"volume":"/Compute-'"${identity_domian}"'/'"${userid}"'/boot_volume"}],"networking":{"eth0":{"seclists":["/Compute-'"${identity_domian}"'/default/default","/Compute-'"${identity_domian}"'/'"${userid}"'/boot_seclist"],"nat":"ipreservation:/Compute-'"${identity_domian}"'/'"${userid}"'/ipres_boot"}},"shape":"oc1m","sshkeys":["'"${selected_ssh_key}"'"]}]}]}'
#instance_json=`echo "$instance_json"|sed '$s/.$//'`

instance_json='{"description":"Instances","name":"/Compute-'"${identity_domian}"'/'"${userid}"'/instances","oplans": ['$instance_json']}'
echo $instance_json > conf/instances.json

}

function masters
{
masters_json='{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/master_orchastration","oplans":[{"label":"instances","obj_type":"orchestration","ha_policy":"monitor","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/instances"}]},{"label":"Volumes","obj_type":"orchestration","ha_policy":"monitor","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/Volumes"}]},{"label":"Seclists","obj_type":"orchestration","ha_policy":"monitor","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/Seclists"}]},{"label":"ipreservations","obj_type":"orchestration","ha_policy":"monitor","objects":[{"name":"/Compute-'"${identity_domian}"'/'"${userid}"'/ipreservations"}]}],"relationships":[{"oplan":"instances","to_oplan":"Volumes","type":"depends"},{"oplan":"instances","to_oplan":"ipreservations","type":"depends"},{"oplan":"instances","to_oplan":"Seclists","type":"depends"}]}'
echo $masters_json > conf/masters.json

}

function addOrchastration
{
echo "Adding Orchestrations"
echo "Adding IP Reservations"
orch_result=`curl -s -i -X POST       -H "Cookie: ${auth_token}"      -H "Content-Type: application/oracle-compute-v3+json"      -H "Accept: application/oracle-compute-v3+json"      -d "@conf/ipreservations.json"        "${endpoint}"/orchestration/`
#echo $orch_result
if [[ $orch_result == *"relationships"* ]]
then
echo "Adding IP Reservations Successful"
else
echo "Adding IP Reservations unsuccessful"
echo $orch_result
fi

echo "Adding Volumes"
orch_result=`curl -s -i -X POST       -H "Cookie: ${auth_token}"      -H "Content-Type: application/oracle-compute-v3+json"      -H "Accept: application/oracle-compute-v3+json"      -d "@conf/volumes.json"        "${endpoint}"/orchestration/`
#echo $orch_result
if [[ $orch_result == *"relationships"* ]]
then
echo "Adding Volumes Successful"
else
echo "Adding Volumes unsuccessful"
echo $orch_result
fi

echo "Adding Security"
orch_result=`curl -s -i -X POST       -H "Cookie: ${auth_token}"      -H "Content-Type: application/oracle-compute-v3+json"      -H "Accept: application/oracle-compute-v3+json"      -d "@conf/security.json"        "${endpoint}"/orchestration/`
#echo $orch_result
if [[ $orch_result == *"relationships"* ]]
then
echo "Adding Security Successful"
else
echo "Adding Security unsuccessful"
echo $orch_result
fi

echo "Adding Instances"
orch_result=`curl -s -i -X POST       -H "Cookie: ${auth_token}"      -H "Content-Type: application/oracle-compute-v3+json"      -H "Accept: application/oracle-compute-v3+json"      -d "@conf/instances.json"        "${endpoint}"/orchestration/`
#echo $orch_result
if [[ $orch_result == *"relationships"* ]]
then
echo "Adding Instances Successful"
else
echo "Adding Instances unsuccessful"
echo $orch_result
fi

echo "Adding Masters"
orch_result=`curl -s -i -X POST       -H "Cookie: ${auth_token}"      -H "Content-Type: application/oracle-compute-v3+json"      -H "Accept: application/oracle-compute-v3+json"      -d "@conf/masters.json"        "${endpoint}"/orchestration/`
#echo $orch_result
if [[ $orch_result == *"relationships"* ]]
then
echo "Adding Masters Successful"
else
echo "Adding Masters unsuccessful"
echo $orch_result
fi
}

function startOrchesrtration
{
echo "Starting Master Orchestration"
start_res=`curl -s -i -X PUT   -H "Cookie: ${auth_token}"   -H "Content-Type: application/oracle-compute-v3+json"      "${endpoint}"/orchestration/Compute-"${identity_domian}"/"${userid}"/master_orchastration?action=START`
if [[ $start_res == *"starting"* ]]
then
echo "Starting Master Orchestration Successful"
else
echo "Starting Master Orchestration unsuccessful"
echo $start_res
fi
}

authenticate
function getInstanceDetails
{
while [[ ! $master_count -gt 0 ]]
do
        echo -n "Enter the number of master nodes to be deployed and press [ENTER]: "
        read master_count
done
while [[ ! $public_count -gt 0 ]]
do
        echo -n "Enter the number of public nodes to be deployed and press [ENTER]: "
        read public_count
done
while [[ ! $private_count -gt 0 ]]
do
        echo -n "Enter the number of private nodes to be deployed and press [ENTER]: "
        read private_count
done

shape

while [[ ! $instance_size -gt 0 ]]
do
        echo -n "Enter the disk size to be assigned to the instances in GB and press [Eg. 10]: "
        read instance_size
done
}
getInstanceDetails
getsshkeys
getImages
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'
echo -e ${YELLOW}Master nodes : $master_count , Public Agent Nodes : $public_count , Private Agent Nodes : $private_count , Instances\' size : $instance_size 
echo SSH Key : $selected_ssh_key
echo Image used : $selected_image
echo -n -e ${GREEN} "Continue? [y/n]: "
echo -e ${NC}
read cont
if [[ ! $cont == "y" ]]
then
exit 0
fi
rm -rf conf
mkdir conf
ipreservation
volumes
security
instances
masters
addOrchastration
startOrchesrtration
echo ""
