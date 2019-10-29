Access Control
Role-based authorization can be defined centrally within Kommander and be  used to control access to resources on all clusters. The resources are similar to Kubernetes RBAC but with some crucial differences.
Types of Access Control Objects
Groups are used to map any number of groups and user claims from your configured identity providers to a group defined in Kommander.
Roles are named collections of rules defining which verbs can be applied to which resources.
Policies bind a group to a role
Cluster Roles and Policies
Roles and Policies can be defined in the cluster scope which makes them apply to all Konvoy clusters
Project Roles and Policies
Roles and Policies can be defined within a project.