// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as msRest from 'ms-rest';
import * as msRestAzure from 'ms-rest-azure';
import * as process from 'process';
import * as util from 'util';

import { ResourceManagementClient, ResourceModels } from 'azure-arm-resource';

class State {
  public domain: string = process.env['DOMAIN'];
  public subscriptionId: string = process.env['AZURE_SUBSCRIPTION_ID'];
  public port: number = process.env['MSI_PORT'] ? parseInt(process.env['MSI_PORT']) : 50342; //If not provided then we assume the default port
  public options: msRestAzure.AzureTokenCredentialsOptions;
}

class Helpers {
  static generateRandomId(prefix: string): string {
    return prefix + Math.floor(Math.random() * 10000);
  }

  static validateEnvironmentVariables(): void {
    let envs = [];
    if (!process.env['DOMAIN']) envs.push('DOMAIN');
    if (!process.env['AZURE_SUBSCRIPTION_ID']) envs.push('AZURE_SUBSCRIPTION_ID');
    if (envs.length > 0) {
      throw new Error(`please set/export the following environment variables: ${envs.toString()}`);
    }
  }
}

class MSISample {
  constructor(public state: State) { }
  resourceClient: ResourceManagementClient;
  private resourceGroupName: string;
  async execute(): Promise<void> {
    let credentials: msRestAzure.MSITokenCredentials;
    try {
      credentials = await msRestAzure.withMSI(this.state.domain, { port: this.state.port });
      this.resourceClient = new ResourceManagementClient(credentials, this.state.subscriptionId);
      console.log('\nListing all the resourc groups within a subscription:');
      let finalResult = await this.resourceClient.resourceGroups.list();
      console.dir(finalResult, { depth: null, colors: true });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

async function main(): Promise<void> {
  Helpers.validateEnvironmentVariables();
  let state = new State();
  let driver = new MSISample(state);
  return driver.execute();
}

//Entrypoint
main();