---
navigationTitle: S3
excerpt: Using S3 with DC/OS Data Science Engine
title: S3
menuWeight: 4
model: /mesosphere/dcos/services/data-science-engine/data.yml
enterprise: true

---

# Configuring {{ model.techName }} to work with S3

To set up S3 connectivity, you must be on a cluster in permissive or strict mode. If a service account has not been created, follow the steps described in the [Security](/mesosphere/dcos/services/data-science-engine/2.0.0/security/) section to create one. 

After your service account is created, follow these steps to create AWS credentials secrets and configure {{ model.techName }} to use them for authenticating with S3:

1. Upload your credentials to the DC/OS secret store:

    ```bash
    dcos security secrets create <secret_path_for_key_id> -v <AWS_ACCESS_KEY_ID>
    dcos security secrets create <secret_path_for_secret_key> -v <AWS_SECRET_ACCESS_KEY>
    ```

1. Grant read access to the secrets to the previously created service account:

    ```bash
    dcos security org users grant <SERVICE_ACCOUNT> dcos:secrets:list:default:<secret_path_for_key_id> read
    dcos security org users grant <SERVICE_ACCOUNT> dcos:secrets:list:default:<secret_path_for_secret_key> read
    ```

1. After uploading your credentials, {{ model.techName }} service can get the credentials via service options:

    ```json
    {
      "service": {
          "service_account": "<service-account-id>",
          "service_account_secret": "<service-account-secret>",
      },
      "s3": {
        "aws_access_key_id": "<secret_path_for_key_id>",
        "aws_secret_access_key": "<secret_path_for_secret_key>"
      }
    }
    ```
    <p class="message--note"><strong>NOTE: </strong> It is mandatory to provide values for <tt>service_account</tt> and <tt>service_account_secret</tt> in the service configuration, in order to access any secrets.</p>

1. To make Spark integration, use credentials-based access to S3. Change Spark's credentials provider to `com.amazonaws.auth.EnvironmentVariableCredentialsProvider` in the service options:

    ```json
    {
      "service": {
          "service_account": "<service-account-id>",
          "service_account_secret": "<service-account-secret>",
      },
      "spark": {
        "spark_hadoop_fs_s3a_aws_credentials_provider": "com.amazonaws.auth.EnvironmentVariableCredentialsProvider"
      },
      "s3": {
        "aws_access_key_id": "<secret_path_for_key_id>",
        "aws_secret_access_key": "<secret_path_for_secret_key>"
      }
    }
    ```

    <p class="message--note"><strong>NOTE: </strong> The provided <tt>aws_access_key_id</tt> and <tt>aws_secret_access_key</tt> are the names of secrets, so in order to access them, a service account and service account secret must be specified in the {{ model.techName }} configuration.</p>

# Example of Using S3 with Spark

Here is an example of running `Spark Job` using `S3` as a storage backend.

1. Launch **Python3 Notebook** from the Notebook UI. Put the following code in a code cell.

    ```python
    from pyspark.sql import SparkSession
    
    spark = SparkSession.builder.appName("S3 Read Write Example").getOrCreate()

    s3_path = "<S3_BUCKET_NAME>/jupyter/test"
    spark.range(10).write.parquet('s3a://{}'.format(s3_path))
    result = spark.read.parquet('s3a://{}'.format(s3_path))
    print("COUNT={}".format(result.count()))

    spark.stop()
    ```

    The expected output would be:

    ```text
    COUNT=10
    ```

1. Verify that the file has been saved. Go to the **Terminal** from the Notebook UI and run following command.

    ```bash
    aws s3 ls s3://<S3_BUCKET_NAME>/jupyter/test --recursive
    ```

    The expected output would be:

    ```log
    2020-06-09 15:31:01          0 jupyter/test/_SUCCESS
    2020-06-09 15:30:56        443 jupyter/test/part-00000-4a5040f9-a967-400a-b49b-9474f18be733-c000.snappy.parquet
    2020-06-09 15:30:59        445 jupyter/test/part-00001-4a5040f9-a967-400a-b49b-9474f18be733-c000.snappy.parquet
    ```
