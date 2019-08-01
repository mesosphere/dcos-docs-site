---
layout: layout.pug
navigationTitle: Pipelines
excerpt: Using Spinnaker pipelines
title: Pipelines
menuWeight: 7
model: /mesosphere/dcos/services/spinnaker/data.yml
render: mustache
---

# Concepts

The following two concept pictures are from Will Gorman's [Mesoscon presentation](
http://events.linuxfoundation.org/sites/events/files/slides/Continuous%20Delivery%20for%20DC%3AOS%20%20with%20Spinnaker.pdf). They introduce the key concepts that we will use in this section.

**Pipelines** are the key deployment management construct (continuous delivery workflows) in {{ model.techName }}. They consist of a sequence of actions, known as **stages**. You can pass parameters from stage to stage along the pipeline. You can start a pipeline manually, or you can configure it to be started by automatic triggering events, such as a Jenkins job completing, a new Docker image appearing in your registry, a CRON schedule, or a stage in another pipeline. You can configure the pipeline to send notifications to interested parties at various points during pipeline execution (such as on pipeline start/complete/fail), by email, SMS or HipChat. The following picture shows a sample pipeline.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe-c01.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe-c01.png)

Figure 1. Sample {{ model.techName }} pipeline

A **Stage** in {{ model.techName }} is an action that forms a building block for a pipeline. You can sequence stages in a pipeline in any order, though some stage sequences may be more common than others. {{ model.techName }} provides a number of stages such as **Deploy**, **Resize**, **Disable**, **Manual Judgment**, and many more.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe-c02.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe-c02.png)

Figure 2. {{ model.techName }} stages 


# Creating Pipelines

This section contains instructions for

* [Creating a pipeline with a deployment stage](#creating-a-pipeline-with-a-deployment-stage)
* [Creating a pipeline with resize stages](#creating-a-pipeline-with-resize-stages)
* [Creating a rolling blue-green pipeline](#creating-a-rolling-blue-green-pipeline)

## Creating a pipeline with a deployment stage

1. Go to the **myapp > Pipelines** view and select the **Create** button.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe01.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe01.png)

Figure 3. **myapp** Pipelines view

2. In the following dialog, specify `deployment` for the **Pipeline Name**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe02.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe02.png)

Figure 4. Naming a pipeline

3. In the pipeline editor select **Add stage**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe03.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe03.png)

Figure 5. Adding a stage to a pipeline

4. There are various stage types available. Select the `Deploy` stage.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe04.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe04.png)

Figure 6. Selecting a stage

5. Specify the **Stage Name**, and then select **Add server group**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe041.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe041.png)

Figure 7. Adding the server group

6. The following is the same dialog we worked with when we [created server groups by hand](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/overview/servergroups/#creating-a-server-group). Enter the same values here; the only difference is that we want ten instances in the server group.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe05.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe05.png)

Figure 8. Configuring the deployment cluster

7. Save your configuration before leaving the pipeline editor by selecting **Back to Executions**. (See the figure for the tooltip next to **deployment**.)

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe06.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe06.png)

Figure 9. Save your configuration

8. The new **deployment** pipeline is now listed. To run it, select **Start Manual Execution**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe07.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe07.png)

Figure 10. Start Manual Execution button

9. The pipeline will display status **RUNNING**. When the status changes to **SUCCESS**, switch over to the **myapp > Clusters** view.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe08.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe08.png)

Figure 11. MyApp Clusters view

10. The **myapp > Clusters** view shows the created server group.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe09.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe09.png)

Figure 12. New server group

## Creating a pipeline with resize stages

In this section we will create a pipeline that showcases the **Resize Server Group** stage type. We target the server group that we created in the previous section.

1. The first resize stage does a **Scale Down** by 5 instances.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe10.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe10.png)

Figure 13. Scaling down

2. The second resize stage does a **Scale Up** by 5 instances, so that we get our server group back to the 10 instances we started with.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe11.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe11.png)

Figure 14. Scaling up

There is a **Manual Judgment** stage in between the two just to halt the pipeline so that you can easily observe the behavior when running the pipeline.


## Creating a rolling blue-green pipeline

In this section we will create a **rolling blue-green pipeline** that will roll in a new version of the server group that we created with the **deployment** pipeline earlier. For information about a load balancer setup, see the [Edge-LB](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/quick-start-guide/edgelb/) documentation for that.

1. The first stage, **green1**, is a **Deploy** stage, with which we deploy the first two new instances of our new server group version. `V000` used `nginx:1.11` as its image, the new one uses `nginx:1:12`.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe12.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe12.png)

Figure 15. Stage green1

2. Stage **blue1** scales down the old version by 20%.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe13.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe13.png)

Figure 16. Stage blue1

3. Next follows the **judge** stage, which is of type **Manual Judgment**. From here there are two paths: **continue** or **rollback**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe14.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe14.png)

Figure 17. Manual Judgment configuration

4. The **rollback** stage is of type **Check Precondition Configuration**. It checks whether the judge asked for **rollback**; if `true`, the rest of that pipeline branch is executed.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe15.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe15.png)

Figure 18. Check Precondition Configuration screen

5. Stage **rblue1** scales the old version up by 25%, so that we get back to ten instances in that server group.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe16.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe16.png)

Figure 19. Rblue1 stage scales up by 25%

Stage **rgreen2** scales down the new version by 100%, so this will delete the two new instances that had been created.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe17.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe17.png)

Figure 20. Rgreen2 scales

### Stage **rgreen**

Stage **rgreen** is of type **Destroy Server Group Configuration**. It deletes the (at this point) empty new server group.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe18.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe18.png)

Figure 21. Rgreen stage type

### Stage **continue**

The **continue** stage is of type **Check Precondition Configuration**. It checks whether the judge asked for **continue**, if true the rest of that pipeline branch is executed.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe19.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe19.png)

Figure 22. Check Precondition Configuration stage

### Stage **green2**

Stage **green2** scales up the new version by 400%, which gets the new version to 10 instances.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe20.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe20.png)

Figure 23. Stage **green2** scaling up new version

Stage **blue2** scales down the old version by 100%, which gets the old version to zero instances.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe21.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe21.png)

Figure 24. Stage **blue2** scaling down old version 

## Manual Execution

We are finished with the definition of our pipeline, so let us **Start Manual Execution**. The pipeline will run up to the **judge** step.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe22.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe22.png)

1. Checking the **myapp > Clusters** view, we now have the expected two versions. `V000` has 8 instances and `V001` has 2 instances. Now is the time to check the monitors to see how well the new instances are behaving, so that we can give the right input on the **judge** step.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe23.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe23.png)

Figure 25. Checking versions

2. If we are not satisfied with the new instances, then we go to the **judge** step and select **rollback**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe24.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe24.png)

Figure 26. Select **rollback**

The **rollback** path of the pipeline completes.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe25.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe25.png)

Figure 27. Status shows **SUCCEEDED**.

Checking the **myapp > Clusters** view, we are back to where we started.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe26.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe26.png)

Figure 28. **myapp > Clusters** view

3. If you are happy with the new instances, then go to the **judge** step and select **continue**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe27.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe27.png)

Figure 29. Select **Continue** 

The **continue** path of the pipeline completes.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe28.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe28.png)

Figure 30. Pipeline completing

Checking the **myapp > Clusters** view, we have a new server group version that has the same size that the old one had when the pipeline started. The old version is down to zero instances.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/pipe29.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/pipe29.png)

Figure 31. New server group version
