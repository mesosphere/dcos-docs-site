---
layout: layout.pug
title: Debugging from the DC/OS Web Interface
menuWeight: 0
excerpt: Using the DC/OS web interface for debugging
beta: true
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


You can debug your service or pod from the DC/OS web interface.

## Service and Pod Health and Status Summaries

If you have added a Marathon health check to your service or pod, the **Services Health** box on the DC/OS dashboard will report the health of your service or pod.

The **Services** > **Services** page lists each service or pod, the resources it has requested, and its status. Possible statuses are `Deploying`, `Waiting`, or `Running`. If you have set up a Marathon health check, you can also see the health of your service or pod: a green dot for healthy and a red dot for unhealthy. If you have not set up a health check, the dot will be gray.

![Mesosphere DC/OS Enterprise services](/1.13/img/services-ee.png)

Figure 1. DC/OS Services > Services page

## Debugging Page

To reveal a detailed debugging page, click the name of a service or pod and then the `Debug` tab. There, you will see sections for **Last Changes**, **Last Task Failure**, **Task Statistics**, **Recent Resource Offers**. You will also see a **Summary** of resource offers and what percentage of those offers matched your pod or service's requirements, as well as a **Details** section that lists the host where your service or pod is running and which resource offers were successful and unsuccessful for each deployment. You can use the information on this page to learn where and how you need to modify your service or pod definition.

![Debug Screen](/1.13/img/debug-ui.png)

Figure 2. Debugging page
