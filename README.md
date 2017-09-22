---
services: resources
platforms: nodejs
author: amarzavery
---

# Manage resources using Managed Service Identity using node.js

This sample demonstrates how to manage Azure resources via Managed Service Identity using the node.js SDK with typescript.

**On this page**

- [Create an Azure VM with MSI extension](#pre-requisite)
- [Run this sample](#run)
- [What is index.js doing?](#example)
    - [Create an MSI Token Provider](#msi)
    - [Create a resource client](#resource-client)

<a id="pre-requisite"></a>
## Create an Azure VM with MSI extension

[Azure Compute VM with MSI](https://github.com/Azure-Samples/compute-node-msi-vm)

<a id="run"></a>
## Run this sample

1. If you don't already have it, [get the latest LTS version of node.js](https://nodejs.org).

1. Clone the repository.

    ```
    git clone https://github.com/Azure-Samples/compute-node-msi-vm.git
    ```

1. Install the dependencies.

    ```
    cd compute-node-msi-vm
    npm install
    ```

1. Set the following environment variables.

    ```
    export AZURE_TENANT_ID={your tenant id}
    export AZURE_SUBSCRIPTION_ID={your subscription id}
    ```

    > [AZURE.NOTE] On Windows, use `set` instead of `export`.

1. Run the sample.

    ```
    node dist/lib/index.js
    ```

<a id="example"></a>
## What does example.rb doing?
<a id="msi"></a>
### Create an MSI Token Provider
Initialize `subscription_id`, `tenant_id` and `port` from environment variables.
```typescript
public domain: string = process.env['DOMAIN'];
public subscriptionId: string = process.env['AZURE_SUBSCRIPTION_ID'];
public port: number = process.env['MSI_PORT'] ? parseInt(process.env['MSI_PORT']) : 50342; //If not provided then we assume the default port
```

Now, we will create token credential using `the msi login`. 
```javascript
// Create Managed Service Identity as the token provider
credentials = await msRestAzure.loginWithMSI(this.state.domain, { port: this.state.port });
```

<a id="resource-client"></a>
### Create a resource client and list resource groups
Now, we will create a resource management client using Managed Service Identity token provider.

```javascript
this.resourceClient = new ResourceManagementClient(credentials, this.state.subscriptionId);
let finalResult = await this.resourceClient.resourceGroups.list();
```
