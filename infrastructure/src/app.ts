#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { TranslatorServiceStack } from "./stacks";
import { getConfig } from "../helpers";

const config = getConfig();

const app = new cdk.App();

new TranslatorServiceStack(app, "TranslatorServiceStack", {
  env: {
    account: config.awsAccountID,
    region: config.awsRegion,
  },
});
