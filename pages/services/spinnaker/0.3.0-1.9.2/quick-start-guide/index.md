---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring and installing Spinnaker with default values
title: Quick Start
menuWeight: 12
model: /services/spinnaker/data.yml
render: mustache
---

This section is a quick guide on how to configure and use {{ model.techName }} with DC/OS. 

# Prerequisites

* A running DC/OS 1.10 or 1.11 cluster

# Overview

DC/OS {{ model.techName }} is an automated service that makes it easy to deploy and manage [{{ model.techName }}](https://www.spinnaker.io/) on [DC/OS](https://mesosphere.com/product/).

{{ model.techName }} is an open source, multi-cloud continuous delivery platform for releasing software changes with high velocity and confidence. Created at Netflix, it has been battle-tested in production by hundreds of teams over millions of deployments. It combines a powerful and flexible pipeline management system with integrations to the major cloud providers. The {{ model.techName }} service is a micro service composition. You can read a good overview on the micro services involved  [here](https://www.spinnaker.io/reference/architecture/).

<p class="message--important"><strong>IMPORTANT: </strong>The DC/OS {{ model.techName }} service currently only works with <strong>DC/OS Enterprise</strong>.</p>


# Installing with Defaults

This section provides a quick and easy procedure for configuring and installing {{ model.techName }}. You can find different custom configurations in the [Configuration section](/services/spinnaker/0.3.0-1.9.2/configuration/) of these documents.  

## From the CLI
The `DC/OS {{ model.techName }} service` uses `minio`, an s3-compatible backing store for the {{ model.techName }} `front50` service. 
1.  To get started, create the following `minio.json` file.

```
{
  "labels": {
    "DCOS_PACKAGE_OPTIONS": "eyJzZXJ2aWNlIjp7Im5hbWUiOiJtaW5pbyIsInRscyI6ZmFsc2V9LCJyZXNvdXJjZSI6eyJjcHVzIjoxLCJtZW0iOjEwMjR9LCJzdG9yYWdlIjp7InZvbHVtZS1zaXplIjoxMDI0fSwiY3JlZGVudGlhbHMiOnsiYWNjZXNzLWtleSI6Im1pbmlvIiwic2VjcmV0LWtleSI6Im1pbmlvMTIzIn0sIm5ldHdvcmtpbmciOnsicG9ydCI6OTAwMCwicHVibGljLWFjY2VzcyI6dHJ1ZX19",
    "DCOS_PACKAGE_SOURCE": "https://universe.mesosphere.com/repo",
    "HAPROXY_GROUP": "external",
    "DCOS_PACKAGE_METADATA": "eyJwYWNrYWdpbmdWZXJzaW9uIjoiMy4wIiwibmFtZSI6Im1pbmlvIiwidmVyc2lvbiI6IjAuMC4xMS1SRUxFQVNFLjIwMTctMTEtMjJUMTktNTUtNDZaIiwibWFpbnRhaW5lciI6ImRldkBtaW5pby5pbyIsImRlc2NyaXB0aW9uIjoiTWluaW8gaXMgYW4gb2JqZWN0IHN0b3JhZ2Ugc2VydmVyIGZvciBjbG91ZCBuYXRpdmUgYXBwbGljYXRpb25zLiBUbyBkZXBsb3kgYXQgc2NhbGUsIHVzZSBEQy9PUyB0byBvcmNoZXN0cmF0ZSBNaW5pbyBjb250YWluZXJzIG9uZSBwZXIgdGVuYW50LiIsInRhZ3MiOlsiZGF0YSIsInN0b3JhZ2UiLCJmaWxlc3lzdGVtIl0sInNlbGVjdGVkIjpmYWxzZSwic2NtIjoiaHR0cHM6Ly9naXRodWIuY29tL21pbmlvL21pbmlvLmdpdCIsIndlYnNpdGUiOiJodHRwczovL3d3dy5taW5pby5pbyIsImZyYW1ld29yayI6ZmFsc2UsInByZUluc3RhbGxOb3RlcyI6IlRoaXMgaXMgYSBjb21tdW5pdHkgcGFja2FnZS4gQ29tbXVuaXR5IHBhY2thZ2VzIGFyZSB1bnZlcmlmaWVkIGFuZCB1bnJldmlld2VkIGNvbnRlbnQgZnJvbSB0aGUgY29tbXVuaXR5LiBMYXVuY2ggYXMgbWFueSBNaW5pbyBpbnN0YW5jZXMgYXMgcmVxdWlyZWQgcmVmZXJyaW5nIHRvIHRoZSBkb2N1bWVudGF0aW9uIGhlcmUgaHR0cHM6Ly9naXRodWIuY29tL2Rjb3MvZXhhbXBsZXMvYmxvYi9tYXN0ZXIvbWluaW8vMS45L1JFQURNRS5tZCIsInBvc3RJbnN0YWxsTm90ZXMiOiJNaW5pbyBpcyBjb21wYXRpYmxlIHdpdGggQVdTIFMzIEFQSXMuIExlYXJuIG1vcmUgYWJvdXQgTWluaW8gb24gZG9jcy5taW5pby5pbyAuIE1pbmlvIGhhcyBhbiBhY3RpdmUgY29tbXVuaXR5IG9uIFNsYWNrIHNsYWNrLm1pbmlvLmlvLiIsInBvc3RVbmluc3RhbGxOb3RlcyI6Ik1pbmlvIERDL09TIHNlcnZpY2UgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHVuaW5zdGFsbGVkIGFuZCB3aWxsIG5vIGxvbmdlciBydW4uIiwibGljZW5zZXMiOlt7Im5hbWUiOiJBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCIsInVybCI6Imh0dHBzOi8vZ2l0aHViLmNvbS9taW5pby9taW5pby9ibG9iL21hc3Rlci9MSUNFTlNFIn1dLCJpbWFnZXMiOnsiaWNvbi1zbWFsbCI6Imh0dHBzOi8vZG93bmxvYWRzLm1lc29zcGhlcmUuY29tL2Fzc2V0cy91bml2ZXJzZS8wMDAvbWluaW8taWNvbi1zbWFsbC5wbmciLCJpY29uLW1lZGl1bSI6Imh0dHBzOi8vZG93bmxvYWRzLm1lc29zcGhlcmUuY29tL2Fzc2V0cy91bml2ZXJzZS8wMDAvbWluaW8taWNvbi1tZWRpdW0ucG5nIiwiaWNvbi1sYXJnZSI6Imh0dHBzOi8vZG93bmxvYWRzLm1lc29zcGhlcmUuY29tL2Fzc2V0cy91bml2ZXJzZS8wMDAvbWluaW8taWNvbi1sYXJnZS5wbmciLCJzY3JlZW5zaG90cyI6WyJodHRwczovL21pbmlvLmlvL2ltZy9icm93c2VyLzEucG5nIiwiaHR0cHM6Ly9taW5pby5pby9pbWcvYnJvd3Nlci8yLnBuZyIsImh0dHBzOi8vbWluaW8uaW8vaW1nL2Jyb3dzZXIvMy5wbmciLCJodHRwczovL21pbmlvLmlvL2ltZy9icm93c2VyLzQucG5nIiwiaHR0cHM6Ly9taW5pby5pby9pbWcvYnJvd3Nlci81LnBuZyIsImh0dHBzOi8vbWluaW8uaW8vaW1nL2Jyb3dzZXIvNi5wbmciXX19",
    "DCOS_PACKAGE_DEFINITION": "eyJtZXRhZGF0YSI6eyJDb250ZW50LVR5cGUiOiJhcHBsaWNhdGlvbi92bmQuZGNvcy51bml2ZXJzZS5wYWNrYWdlK2pzb247Y2hhcnNldD11dGYtODt2ZXJzaW9uPXYzIiwiQ29udGVudC1FbmNvZGluZyI6Imd6aXAifSwiZGF0YSI6Ikg0c0lBQUFBQUFBQUFLMVlXWmZhT2hMK0t6ck1QQWF3VFVpR1BBMTBZNWJRSkd4bXVTY1BzaTFBSU5tK2xneHg1L1IvbjVKc2FFT1RUbWR1SHVqMlVxcmxxNi9LS3Ywb1JkamI0dzBOTmc2SkJRMkQwcWRTcldLVTNwVUN6QW5jY0JyUUVHNFA1OWRHeGFpWVpubmNIclNiazNiRk1zeVBaYmkzcktuWktOZnI1ZmNmVmlBZkUwYXdJR2V0cHZHdXhERU5KUHhJREdwOGN2aXZWbDdSK24waXZKaEdNclB4b0Y0Z0toQU9VT2p1aUNlUmtHR01Od1FKRW9NdmFCM0d5R05oNHFNQVMzb2dDRWNSb3g1V0NrUUZUVVBrazRpRktjS3cxTU9NdkVPSklPaitydnBsZ21TSXd0amJFaUZqTEFuS3JIbGg3cHhBWVVCUUJFWWtDWEFnSytDZXhCdFIrdlJYeWNjU3cyM3VERnl0S1NNaUZaTHcwamQ0RGxGN2t2aWxUMnZNQklFSEhvZHd0bEpHNGxPMXVxRnltN2dWTCtSVkhYcjJ0d0tQUWRPUnVJSktVaEEvSG8rVkFrVHJHRkp5RE9QOVdYc1VrMTRnSkdac0dFb0NEcGFtV3dCTjRRYmhjSjRFVktZb1N6R3BvTHZyUnlBWEU1UUVBQ2hkVStJRDNEN2N4dVJBeVJGdUZTUWtrR2dkaHh6SkxYbFdXa0VEbkFUZUZtR0JPQTdTSEVPcXZBazhwVmlnbVB5ZDBCalV4R1JONGhnNHBvQlhhdnpRU3pnbzF0bENXd0pPM0lESTkwSlJKZDh4andEaXFzdEN0OG94SUIzbjRKbVZSblhjYnQ0L3RDdmNCM3lpVU1nck9NNDhBbjBSV0hNWlFVZXdnSnJ6Q1pyVVVQTnJEOGd5SURnT0VBL0JEZXlHaWN5REFkZkFVWEZPQWFya0w3WllFeE43bW5qUFFNT0NDUU5ra1ZCL3orc3F1Vyt6Z043eUxxT2tvalgxaU5idEVoSWdrWGlBbzFnbmpLV1FrM3hwbnFNalpRd0ZJV0poc0FHZXhrbWdqQUQvU1NDVTZyOStuT3EzQ2FrR3hBZlpLNVRYSTdKMGpTY3greVU3TDRBZjlPN2F3MG03OUFSY2g3ZjNrS0h4VmFHWHpNcC9TcXJXb2JTMjZzR1Awc0ZxUnRGREFnR0FLMU1DK2NTYTUwRG1UZSt1U2ZGOFJML1Eva2RTR3pJdldFVkxhNWE0M0phcmhkbm8wZU5ua05uMCtQRG9MeDdvbDBCKzlMano2TmFjVk1rdGF5M1RxNW1OUVRQVDVjNGQyZHRGb0t2UFBLdGhlbnpJQnR4azd1SlpCcy9yajM3SFRwYVc4OWpiaGQrZjE5cnZweDNiZFBrd0hIY2NzVnl3NldvK1BMaDhyT1FlaDd2bThlSHU1SStkcm1yZ0R4UFp2Zm9GMm4vbTBaNjRvL216dTU0Y3BSZjNoNlhWU0ZhY0JlZlkxSTgyR09tMkRsNHdvbHJXTnZJMS9aMXIxWTNsbkNXclJRL2lMOW9iMTczT1RHSFhuaHJEd2RqcDBUd1dIWS9QRzhLZm04eExleDk2ZG1IZFhldmpzeituWDlGT2Y3UmNqRU9JR2VJMEk1ZXp3NnBqRzh0Sk1ZN3pPdWxhWTZabFdYOXhFZFBaenhiZ01veTgycGk1Z2NyMVRmc0dXYlF5UFVILzROWkd4VmpPTVhrVys3Q2E5RFpLQi9ERmNHdjk3UXA0Y0lwMXNCaEdoRHVOOWVoNmJhdFJ0TG1lSFA4UkhqZHplUHB4RS9CU2VXblNHYkRoWmh3ZEo0VllnSWRPNHQ5QmZycmlCbTZuL0lJOGJ4eEE3aGIrajNnUmFkd2VwczBYT2k1dzZCb1g2L1A2dS9CTHhRVzFBVEU2NlF4eWpwVnZ3Tm5WWW5zRXJJM2I4VzRQa052L256T2JQK1BqNnptNTdlUHY1UEdDUDJkY1czNng1bGFkeGc1YlRxcDYwR1hjL1FqNlN3RGNCVi83Vi8zSmZ2UXN4L0RTZXJIV2s1T3VRZTdyWUQ0R2Z5VjRZazdHcysvMnlCbmE2NFZ4elM4S3VCaSsxVWl4cXZ0OWZ6S1pqYnZqRjNubzYzeE81L2JSNjRDOTYxNzJjL3h2NUtDUktnNS9tUmI2NDAvdzF4emFoY2NiTlpIWHQ1UDZuTzFXVHRZTFZiOC94Mk9CbjJsZCt3MXh2ODcxeTd4a3VydjlDSFNMMWR4bksvRFg3L2JOMWVUS1g3NDZxSnpNdW81dzIwd3VRUlp5YVhpQnc4NzRkVFBiNXg3Q3QydzUvMjdnOWpDRTcwWDh4bjU3aEpvMlhBdStMNXEvL2Z1cFlRNUhzM3I3TmhkQmJtNXVYWjcxVDVDM3dLYVo4YWwzOEJmRGRHQUJ4MmdEZkxDRjM5bnVjTWZaNGJUK0NQVngxZTlPT3YxME9ZZFlvUmZoZVdNL3N4ekZ2NzMyLzc2ZDNzd2xaNUIzbFNOYlhNby8zTW9wOVR0TXJ1WU4wN2VIVE5kYTkwSFYwMDkwbTF2U2hqamhPN3FzT1FaZXJOaVlBOGU2VHJwYTZIV1BMMnZ3bkdlNm10Y3RWZHN2T0xzMys5TTkrN293N1B1UjRVeG5zQlVZTzN0ZDE2UW1kN0NmMk1OYUF3TnVVSVBicFFYZjhkcURoTnFyMzZpdlozM20wQjZaZmR1eFg5WDNDSndBLzBkbmZUcUdjNS9yaStXOHoxeUZ5K25iM3BVZmUxYWQrVjBmdUNpaHhyekU2enJVN2JEZFlHN3YxTDVGN1hseUxPaWtiWTltKzhaeTdqUzY4TitaS1Q1eDU3M0tFK3lqeEpsUG9IZndHM3FuTTNzeWNzYTlxVkZmend6MlpXeDh0eGZ3ZjJhT1c5UDlFSzdCYnNaZFhSOVpIMitkOTFuK29oVjQzTjZ2bktFQi93Mm91L3BsWCt4TDJJdEY3c0tSazQ2emRidmpjR1RaUitCazVIYzFua1ZPNmYwWm5wdW1PMnRZOEUyK1h5NWFrQ3RtRUZVRDkvbTNEMm9UZVBHNTlLUm1VQkVtc1VmVUhoUUxRYVJRVjBsTTRYOEErK3AzcGZQTXAxN0FabitmWGVtTmJ6bTdQdzI2cDFrNDJ4Vi9lblg4ZlhvQzY1U3JDVXVwbzJDbUxEaHMzd3U3YlQ4OEJpekVQc3dYNEthSTFCU2s5OTZacDFYWThxdVptMVFOdzhoc2xwLzFWS0pnQTV0cy9ZQVRueWI4RDJqT0ZCVlZNeHh2eUIvUXJQWGtpbUhNaC9GR2JFT3BCK3FUNnRPd1ZLVjhVM1hqOEFnREVVeDQyWnBYaGF5M0NOWGVJdlQrTFVMMXR3aDkwRUxmZ0FVZW94blpualRiMW5TakdQRnZBWk1ReHptMG9HVW5WR3IxdzBvWWI2clo1Yi9VNUJpSEVZa2x6YWlVajRucVVxYVJ5azEyUFBMaUJHV1N6NVBQeS9XUnlYbXkxVlBuQy9YWjBQampTdGNRbnFKd0RhTTdUTktuUWZVMDZxdkRrY3dUSWRXTXJ6MVo0NFRKOCtrUmhDNlplS20zSFdBMWtBdmlKYkdhbzRNQUlsSG5OOGhOMFRQbkNpTzR2cXR1dzJOWmh1VnNYUm5yT1ZrOXlCaVhIUkNWMVpoZkJyTVZOTjJxY1pySXpQODFKY3pYQnhGeFVuRGVEVU9ZWTRPaTkvcVE1VW4za2V3Z1EvRlZJNVRGOCsycXhieWVrSEV1K1pzWjhhTGtCbkozWDJkSWJERllWNUZBUXdnOWRaQUYxejlQVDVCd0Y5cGJJVUJURC9HVXErNWhWT29RRGlmOHBiRUh3c000L1VlR0RPdDl3WmE2dmNaVng1azVvSEE5SGJEOW11ZjVzZUR2b1hvSVdjSkpXZERIb29tQzR4Y21RRXJSUDFzRUFZUDIxblY0MS9FVUxlZytBTTlKSUNuT0N1SDFvTzZlaFRYc2lkeXFXdzI5UHI3S3dzdVkvaUs0dkNEMkpDMVlLaFJuMFZKVHk2TFBJSHV6YnFIR1lpTGZwbXVpWlcvck1xMWE2UnFpZ3A4WGhoUmNBWkhxcEZPWmVkbU96dTkrbWZWcm1DK0Jpc0pZdmxUL0ZaNHFIY2N0OVlwSWE3SUxoQStZTXRXM1hpTjhBejZBRUVXVXVJeDZlWWY2V2Y4VEtCTkRtWmhLZURHOWlLNS8zYXFVd0RXOE9ycHZlaXVpamloeDRPY2ZvdjhCZzRqTi9mVVhBQUE9In0=",
    "DCOS_PACKAGE_VERSION": "0.0.11-RELEASE.2017-11-22T19-55-46Z",
    "DCOS_PACKAGE_NAME": "minio",
    "MARATHON_SINGLE_INSTANCE_APP": "true"
  },
  "id": "/minio",
  "args": [
    "server",
    "-C",
    "/config",
    "/export"
  ],
  "backoffFactor": 1.15,
  "backoffSeconds": 1,
  "container": {
    "portMappings": [
      {
        "containerPort": 9000,
        "hostPort": 0,
        "protocol": "tcp",
        "servicePort": 9000,
        "labels": {
           "VIP_0": "minio:9000"
        }
      }
    ],
    "type": "DOCKER",
    "volumes": [
      {
        "persistent": {
          "type": "root",
          "size": 1024,
          "constraints": []
        },
        "mode": "RW",
        "containerPath": "miniodata"
      },
      {
        "persistent": {
          "type": "root",
          "size": 10,
          "constraints": []
        },
        "mode": "RW",
        "containerPath": "minioconfig"
      },
      {
        "containerPath": "/export",
        "hostPath": "miniodata",
        "mode": "RW"
      },
      {
        "containerPath": "/config",
        "hostPath": "minioconfig",
        "mode": "RW"
      }
    ],
    "docker": {
      "image": "minio/minio:RELEASE.2017-11-22T19-55-46Z",
      "forcePullImage": true,
      "privileged": true,
      "parameters": []
    }
  },
  "cpus": 1,
  "disk": 0,
  "env": {
    "MINIO_ACCESS_KEY": "minio",
    "MINIO_SECRET_KEY": "minio123"
  },
  "healthChecks": [
    {
      "gracePeriodSeconds": 120,
      "intervalSeconds": 30,
      "maxConsecutiveFailures": 3,
      "timeoutSeconds": 20,
      "delaySeconds": 15,
      "protocol": "COMMAND",
      "command": {
        "value": "/usr/bin/healthcheck.sh"
      }
    }
  ],
  "instances": 1,
  "maxLaunchDelaySeconds": 36000,
  "mem": 1024,
  "gpus": 0,
  "networks": [
    {
      "mode": "container/bridge"
    }
  ],
  "residency": {
    "relaunchEscalationTimeoutSeconds": 3600,
    "taskLostBehavior": "WAIT_FOREVER"
  },
  "requirePorts": false,
  "upgradeStrategy": {
    "maximumOverCapacity": 0,
    "minimumHealthCapacity": 0
  },
  "killSelection": "YOUNGEST_FIRST",
  "unreachableStrategy": "disabled",
  "fetch": [],
  "constraints": []
}
```
2. Run the following two commands:

```
dcos package install marathon-lb --yes
dcos marathon app add minio.json
```
3.  `marathon-lb` will make the `minio` web interface accessible via the DC/OS public agent. In your browser enter the following address. 
```
http://<public-agent-ip>:9000
```
The `minio` credentials are minio / minio123.

The DC/OS {{ model.techName }} service allows you to deliver to the `DC/OS cluster` the service runs itself in. The {{ model.techName }} `deck` and `gate` services will be made available via a proxy or Edge-LB running on the DC/OS cluster's public agent. **Note down the hostname/ip of the public agent `<public-agent-ip>` in your DC/OS cluster.**

## From the web interface

1. In the DC/OS catalog/universe, select {{ model.techName }}, which will show you the following package description. 

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst01.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst01.png)

Figure 1. {{ model.techName }} package

2. Select **Review & Run**.

3. In the service section fill in the proxy hostname with the hostname of the public agent noted down earlier.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst02.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst02.png)

Figure 2. Service section

4. If `minio` and `DC/OS` default credentials are available, then you are ready to select **Review & Run**. Otherwise the next two steps show how to configure your specific credentials.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst03.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst03.png)

Figure 3. Default credentials available

5. Configure the `minio` credentials as shown on the following screen.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst04.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst04.png)

Figure 4. `Minio` credentials

6. Configure the `DC/OS` credentials as shown on the following screen.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/inst05.png" alt="{{ model.techName }} Quick Start"/>](/services/spinnaker/0.3.0-1.9.2/img/inst05.png)

Figure 5. DC/OS credentials

7. Once the service is running, launch a simple `proxy` to get access to the {{ model.techName }} `deck` and `gate` service. You can use the [proxy.json](misc/proxy.json). 

```
dcos marathon app add proxy.json
```
7. Go to the [Using {{ model.techName }}](#using-spinnaker) section to learn how to access the {{ model.techName }} web interface, and to get an overview of the {{ model.techName }} concepts with samples.


# Using {{ model.techName }}

Go to your browser and enter the following url to get to the {{ model.techName }} user interface.

```
http://<public-agent-ip>:9001
```
