import { Construct } from "constructs";
import * as path from "path";
import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectRoot = path.join(__dirname, "../../");
    const lambdaDirPath = path.join(projectRoot, "packages/lambdas");
    const translateLambdaPath = path.join(lambdaDirPath, "translate/index.ts");

    const table = new dynamodb.Table(this, "translations", {
      tableName: "translation",
      partitionKey: {
        name: "requestId",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const translateAccessPolicy = new iam.PolicyStatement({
      actions: ["translate:TranslateText"],
      resources: ["*"],
    });

    const lambdaFunc = new lambdaNodejs.NodejsFunction(
      this,
      "TranslatorLambda",
      {
        entry: translateLambdaPath,
        handler: "index",
        runtime: lambda.Runtime.NODEJS_20_X,
        initialPolicy: [translateAccessPolicy],
        depsLockFilePath: path.join(projectRoot, "package-lock.json"), // docker need when deploy
        projectRoot: projectRoot, // docker need when deploy
        environment: {
          TRANSLATION_TABLE_NAME: table.tableName,
          TRANSLATION_PARTITION_KEY: "requestId",
        },
      }
    );

    const resAPI = new apigateway.RestApi(this, "TranslatorApi");

    table.grantReadWriteData(lambdaFunc);

    resAPI.root.addMethod("POST", new apigateway.LambdaIntegration(lambdaFunc));
  }
}
