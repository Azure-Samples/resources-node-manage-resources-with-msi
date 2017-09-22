"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const msRestAzure = require("ms-rest-azure");
const process = require("process");
const azure_arm_resource_1 = require("azure-arm-resource");
class State {
    constructor() {
        this.domain = process.env['DOMAIN'];
        this.subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
        this.port = process.env['MSI_PORT'] ? parseInt(process.env['MSI_PORT']) : 50342;
    }
}
class Helpers {
    static generateRandomId(prefix) {
        return prefix + Math.floor(Math.random() * 10000);
    }
    static validateEnvironmentVariables() {
        let envs = [];
        if (!process.env['DOMAIN'])
            envs.push('DOMAIN');
        if (!process.env['AZURE_SUBSCRIPTION_ID'])
            envs.push('AZURE_SUBSCRIPTION_ID');
        if (envs.length > 0) {
            throw new Error(`please set/export the following environment variables: ${envs.toString()}`);
        }
    }
}
class MSISample {
    constructor(state) {
        this.state = state;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let credentials;
            try {
                credentials = yield msRestAzure.loginWithMSI(this.state.domain, { port: this.state.port });
                this.resourceClient = new azure_arm_resource_1.ResourceManagementClient(credentials, this.state.subscriptionId);
                console.log('\nListing all the resourc groups within a subscription:');
                let finalResult = yield this.resourceClient.resourceGroups.list();
                console.dir(finalResult, { depth: null, colors: true });
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        Helpers.validateEnvironmentVariables();
        let state = new State();
        let driver = new MSISample(state);
        return driver.execute();
    });
}
main();
//# sourceMappingURL=index.js.map