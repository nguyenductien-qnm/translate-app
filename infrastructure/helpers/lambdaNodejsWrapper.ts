import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import path from "path";
import { lambdasDirPath } from "./appPaths";
import fs from "fs";

export type ILambdaWrapperProps = {
  lambdaRelPath: string;
  handler: string;
  initialPolicy: Array<iam.PolicyStatement>;
  lambdaLayers: Array<lambda.ILayerVersion>;
  environment: Record<string, string>;
};

const bundling: lambdaNodejs.BundlingOptions = {
  minify: true,
  externalModules: ["/opt/nodejs/utils-lambda-layer"],
};

export const createLambdaNodejs = (
  scope: Construct,
  lambdaName: string,
  {
    lambdaRelPath,
    handler,
    initialPolicy,
    lambdaLayers,
    environment,
  }: ILambdaWrapperProps
) => {
  const lambdaPath = path.join(lambdasDirPath, lambdaRelPath);

  if (!fs.existsSync(lambdaPath)) throw new Error("Lambda doesn't exist.");

  return new lambdaNodejs.NodejsFunction(scope, lambdaName, {
    entry: path.join(lambdasDirPath, lambdaRelPath),
    handler,
    runtime: lambda.Runtime.NODEJS_20_X,
    initialPolicy,
    layers: lambdaLayers,
    environment,
    bundling,
  });
};
