---
layout: layout.pug
navigationTitle: Add a Kommander license
title: Add
excerpt: Add licenses for Kommander clusters
menuWeight: 5
beta: false
---

## Enter a Valid License Key

After you download the license, an administrator must add it to Kommander.

In the Kommander UI, do the following:

1.  Select **Global** in the workspace header drop-down.

1.  In the sidebar menu, select **Administration** > **Licensing**.

1.  Select **+ Add License** to enter the Add License form.

1.  On the Add License form page, select D2iQ or AWS Marketplace depending on where you acquired your license.

1.  Paste your license content in the textbox and select **Save**.

If there is an error submitting a license acquired directly from D2iQ, you can add the license directly through `kubectl`.

## Enter a license via kubectl

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

In the above example, your license is named 'my-license'.

You should then be able to return to the license page in the UI to see your valid license display.
