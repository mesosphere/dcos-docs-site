---
layout: layout.pug
navigationTitle: Custom Docker Images
excerpt: Customizing the Docker image in which Spark runs
title: Custom Docker Images
menuWeight: 95
featureMaturity:
model: /services/spark/data.yml
render: mustache
---
You can customize the Docker image in which {{ model.techShortName }} runs by extending the standard {{ model.techShortName }} Docker image. In this way, you can install your own libraries, such as a custom Python library.

<p class="message--note"><strong>NOTE: </strong>Customizing the {{ model.techShortName }} image that Mesosphere provides is supported. However, customizations have the potential to adversely affect the integration between {{ model.techShortName }} and DC/OS. In situations where Mesosphere support suspects a customization may be adversely impacting {{ model.techShortName }} with DC/OS, Mesosphere support may request that the customer reproduce the issue with an unmodified {{ model.techShortName }} image. </p>

To customize your Docker image:
1. In your Dockerfile, extend from the standard {{ model.techShortName }} image and add your customizations:

    ```
    FROM mesosphere/{{ model.serviceName }}:2.6.0-2.3.2-hadoop-2.7
    RUN apt-get install -y python-pip
    RUN pip install requests
    ```

1. Build an image from the customized Dockerfile.

        docker build -t username/image:tag .
        docker push username/image:tag

1. Reference the custom Docker image with the `--docker-image` option when running a {{ model.techShortName }} job.

        dcos {{ model.serviceName }} run --docker-image=myusername/myimage:v1 --submit-args="http://external.website/mysparkapp.py 30"
