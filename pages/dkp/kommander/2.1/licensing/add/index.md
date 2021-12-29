---
layout: layout.pug
navigationTitle: Add a Kommander license
title: Add a license to Kommander
excerpt: Add licenses for Kommander clusters
menuWeight: 5
beta: false
---

## Prerequisites

For licenses purchased via the [AWS Marketplace](https://aws.amazon.com/marketplace/), an AWS administrator must attach the [AWS managed policy](https://docs.aws.amazon.com/license-manager/latest/userguide/security-iam-awsmanpol.html#security-iam-AWSLicenseManagerConsumptionPolicy) `AWSLicenseManagerConsumptionPolicy` to the `AWSIAMRoleControlPlane` role created when [configuring AWS IAM policies for Konvoy](/dkp/konvoy/latest/choose-infrastructure/aws/iam-policies/).

Without this policy attached to the role, Kommander cannot verify the license information provided in the steps below.

## Obtain a license token or AWS license ARN

For licenses purchased directly from D2iQ, obtain the license token via the customer support portal. Input this token in the last step below.

For licenses purchased via the AWS marketplace, find the license in the "Granted Licenses" table of AWS License Manager inside the AWS console. If necessary, modify the table view preferences to show "License ARN." Copy this value for use in the last step below.

## Enter license information

An administrator must add licenses to Kommander.

In the Kommander UI, do the following:

1.  Select **Global** in the workspace header drop-down.

1.  In the sidebar menu, select **Administration** > **Licensing**.

1.  Select **+ Add License** to enter the Add License form.

1.  On the Add License form page, select D2iQ or AWS Marketplace depending on where you acquired your license.

1.  Paste your license token or AWS ARN in the text box and select **Save**.

If there is an error submitting a license acquired directly from D2iQ, you can add the license directly through `kubectl`.

## Enter a D2iQ license via kubectl

You can add a license acquired from D2iQ directly using `kubectl`.

1.  Create a secret, replacing `MY_LICENSE` in the below command with your D2iQ-provided Kommander license:

    ```bash
    kubectl create secret generic my-license-secret --from-literal=jwt=MY_LICENSE -n kommander
    kubectl label secret my-license-secret kommanderType=license -n kommander
    ```

1.  Create a license object:

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: kommander.mesosphere.io/v1beta1
    kind: License
    metadata:
      name: my-license
      namespace: kommander
    spec:
      licenseRef:
        name: my-license-secret
    EOF
    ```

Return to the license page in the UI to see your valid license display.
