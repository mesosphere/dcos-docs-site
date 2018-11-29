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

<p class="message--note"><strong>NOTE: </strong>Customizing the {{ model.techShortName }} image that Mesosphere provides is supported. However, customizations have the potential to adversely affect the integration between {{ model.techShortName }} and DC/OS. In situations where Mesosphere support suspects a customization may be adversely impacting {{ model.techShortName }} with DC/OS, Mesosphere support may request that the customer reproduce the issue with an unmodified {{ model.techShortName }} image. </p>

You can customize the Docker image in which {{ model.techShortName }} runs by extending the standard {{ model.techShortName }} Docker image. In this way, you can install your own libraries, such as a custom Python library.

1. In your Dockerfile, extend from the standard {{ model.techShortName }} image and add your customizations:

    ```
    FROM mesosphere/{{ model.serviceName }}:1.0.4-2.0.1
    RUN apt-get install -y python-pip
    RUN pip install requests
    ```

1. Then, build an image from your Dockerfile.

        docker build -t username/image:tag .
        docker push username/image:tag

1. Reference your custom Docker image with the `--docker-image` option when running a {{ model.techShortName }} job.

        dcos {{ model.serviceName }} run --docker-image=myusername/myimage:v1 --submit-args="http://external.website/mysparkapp.py 30"
