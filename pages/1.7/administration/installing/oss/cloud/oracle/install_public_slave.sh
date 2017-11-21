#!/bin/sh
#set +e
function checkPort
{
port_status=`ssh -t -n -o "StrictHostKeyChecking no" -t -i genconf/ssh_key ${ip} 'sudo netstat -plant|grep "127.0.0.1:53"' 2> /dev/null`
if [[ -z "$port_status" ]]; then
  echo "Stopped"
else
        echo -n "."
        checkPort
fi
}
if [ ! -f public-agents.txt ]; then
    echo "File public-agents.txt not found"
else
echo "in"
input=public-agents.txt

while read ip
do
  echo $ip
        echo "Deleting existing install"
        ssh -t -n -o "StrictHostKeyChecking no" -t -i genconf/ssh_key ${ip} 'sudo systemctl stop dcos-mesos-slave ;sudo systemctl disable dcos-mesos-slave ;sudo -i /opt/mesosphere/bin/pkgpanda uninstall ; sudo rm -rf /etc/mesosphere /opt/mesosphere /var/lib/mesos /var/lib/dcos'
        echo "Checking if DCOS is stopped on " $ip
        checkPort
        scp -o "StrictHostKeyChecking no" -i genconf/ssh_key -r /home/centos/genconf/serve/ ${ip}:/home/centos/
        ssh -t -n -o "StrictHostKeyChecking no" -t -i genconf/ssh_key ${ip} 'sudo mkdir -p  /opt/dcos_install_tmp && sudo cp -r /home/centos/serve/*  /opt/dcos_install_tmp && sudo bash /opt/dcos_install_tmp/dcos_install.sh slave_public'
done < "$input"
fi
