#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { InfrastructureStack } from "../lib/infrastructure-stack";

const app = new cdk.App();
new InfrastructureStack(app, "InfrastructureStack", {});
