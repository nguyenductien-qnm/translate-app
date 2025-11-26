import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const translateAccessPolicy = new iam.PolicyStatement({
      actions: ["translate:TranslateText"],
      resources: ["*"],
    });

    const lambdaFunc = new lambdaNodejs.NodejsFunction(
      this,
      "TranslatorLambda",
      {
        entry: "./lambda/translator.ts",
        handler: "index",
        runtime: lambda.Runtime.NODEJS_20_X,
        initialPolicy: [translateAccessPolicy],
      }
    );

    const resAPI = new apigateway.RestApi(this, "TranslatorApi");

    resAPI.root.addMethod("POST", new apigateway.LambdaIntegration(lambdaFunc));
  }
}
