---
layout: layout.pug
navigationTitle: Licensing
title: License
excerpt: Work with, obtain, and manage licenses for Kommander clusters
menuWeight: 6
beta: false
---

## Purchase a License

You can evaluate Kommander running two clusters, the Kommander host cluster and one additional cluster, for free. If you want to add more clusters, you need a valid license.

To obtain a valid Kommander license, contact your sales representative at <sales@d2iq.com>. After purchase, download the license file from the [support website][support-downloads] using your [login credentials][support-creds] to a place accessible by Kommander.

## Enter a Valid License Key

After you have downloaded the license, an administrator must add it to Kommander.

In the Kommander UI, do the following:

1. Select **Global** in the workspace header drop-down.
1. In the side menu, select **Administration** > **Licensing**.
1. Select **+ Add License**.
1. Paste your license content in the textbox and select **Add**.

If there is an error submitting the license, you can add the license directly through `kubectl`.

## Entering a valid license via kubectl

You can add a license directly using `kubectl`.

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

## Delete a license

To delete a license from Kommander, you have to delete the `Secret` and `License` objects. In this example, the secret is named "my-license-secret".

1.  Validate that the secret exists in the `kommander` namespace:

    ```bash
    kubectl describe secret -n kommander my-license-secret
    ```

    Expected output:

    ```bash
    Name:         my-license-secret
    Namespace:    kommander
    Labels:       kommanderType=license
    Annotations:  <none>

    Type:         Opaque

    Data
    ====
    jwt:  455 bytes
    ```

1.  Delete the secret from the `kommander` namespace:

    ```bash
    kubectl delete secret -n kommander my-license-secret
    ```

    Expected output:

    ```bash
    secret "my-license-secret" deleted
    ```

1.  We do the same with the `License` object. Validate that it exists in the `kommander` namespace:

    ```bash
    kubectl describe license -n kommander my-license
    ```

    Expected output:

    ```bash
    Name:         my-license
    Namespace:    kommander
    Labels:       <none>
    Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                    {"apiVersion":"kommander.mesosphere.io/v1beta1","kind":"License","metadata":{"annotations":{},"name":"my-license", "namespace":"kommand...
    API Version:  kommander.mesosphere.io/v1beta1
    Kind:         License
    Metadata:
      Creation Timestamp:  2020-03-25T14:57:31Z
      Generate Name:       license-
      Generation:          1
      Resource Version:    17895
      Self Link:           /apis/kommander.mesosphere.io/v1beta1/namespaces/kommander/licenses/my-license
      UID:                 35ee9254-4094-40eb-a2d8-4687c5d212d9
    Spec:
      License Ref:
        Name:  my-license-secret
    Status:
      Cluster Capacity:  500
      Customer Id:       mesosphere-developer
      End Date:          2020-10-02T14:00:09Z
      License Id:        mesosphere-developer
      Start Date:        2019-10-02T14:00:09Z
      Valid:             true
      Version:           1.0
    Events:
      Type    Reason                Age                  From              Message
      ----    ------                ----                 ----              -------
      Normal  LicenseUpdateSuccess  7m7s (x2 over 7m7s)  LicenseSignature  License updated successfully
    ```

1.  Delete the license from the `kommander` namespace:

    ```bash
    kubectl delete license -n kommander my-license
    ```

    Expected output:

    ```bash
    license.kommander.mesosphere.io "my-license" deleted
    ```

You have now successfully deleted a license.

[support-downloads]: https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads
[support-creds]: https://support.d2iq.com/hc/en-us
