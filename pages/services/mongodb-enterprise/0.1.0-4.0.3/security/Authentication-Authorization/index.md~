---
layout: layout.pug
navigationTitle: Authentication Authorization
title: MongoDB OpsManager Authentication and Authorization
menuWeight: 50
excerpt: Connect to MongoDB Replica Set using Authentication and Authorization
featureMaturity:
model: /services/mongodb-enterprise/data.yml
render: mustache
enterprise: false
---

MongoDB OpsManager provides support to enable Authentication and Authorization of users. This helps to ensure security of the servers by enabling access control. If a deployment uses access control, the Monitoring and Backup Agents must authenticate to the deployment as MongoDB users with appropriate access. With access control enabled, you must create MongoDB users so that clients can access your databases.

If you are using Automation to manage your MongoDB deployments, Ops Manager automatically creates users for the agents when you enable access control. The user created for the Automation Agent has privileges to administrate and manage other users. As such, the first user you create can have any role.

# Steps to configure MongoDB Authentication
1. In the project dashboard of MongoDB OpsManager, Click on the ```Security``` Tab.

[<img src="../../img/OpsManager_Project_Dashboard.png" alt="OpsManager Project Dashboard"/>](../../img/OpsManager_Project_Dashboard.png)

 _Figure 1. - Dashboard view of MongoDB OpsManager Project

2. Under the ```Security``` tab, click on the ```Authentication & TLS/SSL``` option.

[<img src="../../img/Security_Tab.png" alt="Security Tab"/>](../../img/Security_Tab.png)

 _Figure 2. - Authentication & TLS/SSL option under Security

3. Click on the ```Edit Settings``` option. A pop-up dialog will appear as Authentication & TLS/SSL Settings.

4. Enable the ```Username/Password (MONGODB-CR/SCRAM-SHA-1)``` Authentication Mechanism by ticking the check-box against the option.

[<img src="../../img/Authentication_Mechanisms.png" alt="Authentication Mechanisms"/>](../../img/Authentication_Mechanisms.png)

 _Figure 3. - Authentication Mechanisms under Authentication & TLS/SSL Settings

5. Click ```Next``` to continue over the next screen. Keep the Configure TLS/SSL parameter in default state i.e. Disabled (as TLS is not supported in this release).

[<img src="../../img/Authentication_Setting.png" alt="Authentication_Setting"/>](../../img/Authentication_Setting.png)

 _Figure 4. - Authentication & TLS/SSL Settings

6. Click ```Next``` to Configure Ops Manager Agents.

[<img src="../../img/Authentication_Setting_2.png" alt="Authentication_Setting_2"/>](../../img/Authentication_Setting_2.png)

 _Figure 5. - Authentication & TLS/SSL Settings Agents Configuration

7. Click ```Save``` to save the settings and close the dialog box.

8. Review the changes to be deployed and click on ```Confirm and Deploy``` in the pop-up dialog appeared.

[<img src="../../img/Confirm_Deploy.png" alt="Confirm Deploy"/>](../../img/Confirm_Deploy.png)

 _Figure 6. - Confirm Deployment of changes

9. The changes will start deploying and once it complete deployment, we can now connect to the instance by appropriate users created and authorized for authentication.

[<img src="../../img/Authentication_Deploying.png" alt="Authentication Deploying"/>](../../img/Authentication_Deploying.png)

 _Figure 7. - Deployment of Authentication Setting changes

10. Under the Replica Set menu, click on the option ```Connect to this instance```.

[<img src="../../img/Connect_to_cluster.png" alt="Connect to cluster"/>](../../img/Connect_to_cluster.png)

 _Figure 8. - Connect to cluster with Authentication

11. A popup will appear with the command to access the mongo shell. 

[<img src="../../img/Connect_to_cluster_2.png" alt="Connect to cluster_2"/>](../../img/Connect_to_cluster_2.png)

 _Figure 9. - Connect to replica set with Authentication

12. In order to connect to replica set and access the ```mongod``` shell, there is need to connect to the DC/OS MongoDB task.
To enter the DC/OS MongoDB task shell, execute the following command over DC/OS CLI:

```bash
  dcos task exec -ti <dcos-task-id> bash
```

Now, Enter the command to connect with Replica Set in the CLI instance to access the ```mongod``` shell using authentication mechanism.

[<img src="../../img/Final_Connection.png" alt="Final Connection"/>](../../img/Final_Connection.png)

 _Figure 10. - MongoDB shell with Authentication security

