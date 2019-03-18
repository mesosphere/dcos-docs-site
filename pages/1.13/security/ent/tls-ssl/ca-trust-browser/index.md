---
layout: layout.pug
navigationTitle:  Establishing trust in your DC/OS CA
title: Establishing trust in your DC/OS CA
menuWeight: 200
excerpt: Configuring Chrome and Firefox to trust your DC/OS CA.
beta: true
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


**Prerequisite:** A local copy of the [root certificate of your DC/OS CA](/1.13/security/ent/tls-ssl/get-cert/).

The procedure for adding your DC/OS CA as a trusted root certificate authority varies by operating system and browser. Refer to the section that corresponds to your browser/operating system pair.

- [Google Chrome on OS X](#osx-chrome)

- [Google Chrome on Windows 10](#win-chrome)

- [Mozilla Firefox on OS X or Windows](#osx-win-firefox)

# <a name="osx-chrome"></a>Configuring Google Chrome on OS X to trust your DC/OS CA

- This procedure works best with Chrome 56 or later.

- You may be prompted for your password to allow modifications to your keychain. Provide your password at the prompt.

1. Click the magnifying glass icon in the top right of your desktop to open Spotlight Search. Type **Keychain Access** in the box.

1. In the **Keychain Access** dialog, select **System**.

1. Add the `dcos-ca.crt` file to the **System** keychain using one of the following methods:
     - Dragging and dropping the file
     - **File** -> **Import Items**    

1. Double-click the certificate in the keychain, expand the **Trust** section, and select **Always Trust** in **When using this certificate**.

1. Close the dialog.

1. Open a new Incognito Chrome window and open the DC/OS web interface. The path to the DC/OS web interface in the address bar should be marked **Secure**. You can also try visiting the public IP address of each of your masters to confirm that all show up as **Secure**.

# <a name="win-chrome"></a>Configuring Google Chrome on Windows to trust your DC/OS CA

This procedure works best with Chrome 56 or later, or Windows 10.

1. Open your Chrome browser and type `chrome://settings` in the address bar.

1. Scroll down and click **Show advanced settings**.

1. Scroll down and click **Manage certificates**.

1. Click to open the **Trusted Root Certification Authorities** tab.

1. Click **Import**.

1. Click **Next** on the **Welcome** page of the Certificate Import Wizard.

1. Click **Browse**.

1. Navigate to your `dcos-ca.crt` file, select it, and click **Open**.

1. Click **Next**.

1. Make sure that the **Place all certificates in the following store** option is selected and that the **Certificate Store** is **Trusted Root Certification Authorities**.

1. Click **Next**.

1. Click **Finish**.

1. You should check that the thumbprint matches the thumbprint of your DC/OS CA root certificate, then click **Yes**.

1. Click **OK** on the confirmation message.

1. Click **Close**.

1. Close and restart Chrome, or open a new Incognito session. Visit your cluster URL and the public IP addresses of each master to confirm that the sites now show up as **Secure**.


# <a name="osx-win-firefox"></a>Configuring Mozilla Firefox on OS X or Windows to trust your DC/OS CA

1. Open your Mozilla Firefox browser and type `about:preferences#advanced` in the address bar.

1. Click **Certificates**.

1. Click **View Certificates**.

1. Click **Import**.

1. Locate and select the `dcos-ca.crt` file in the dialog and click **Open**.

1. We recommend clicking **View** to examine the certificate. Ideally, you should confirm that the fingerprints match those of your DC/OS CA's root certificate.

1. After verifying the certificate, select **Trust this CA to identify websites** and click **OK**.

1. Click **OK** again to close the **Certificates** dialog.

1. Type your cluster URL in the address bar and press ENTER. The path to the DC/OS web interface in the address bar should be marked **Secure**. You can also try visiting the public IP address of each of your masters to confirm that all show up as **Secure**.
