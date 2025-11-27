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

    const lambdaLayerPath = path.join(projectRoot, "packages/lambda-layers");

    const table = new dynamodb.Table(this, "translations", {
      tableName: "translation",
      partitionKey: {
        name: "requestId",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const translateServicePolicy = new iam.PolicyStatement({
      actions: ["translate:TranslateText"],
      resources: ["*"],
    });

    const translateTablePolicy = new iam.PolicyStatement({
      actions: [
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
      ],
      resources: ["*"],
    });

    const resAPI = new apigateway.RestApi(this, "TranslatorApi");

    const utilsLambdaLayerPath = path.resolve(
      path.join(lambdaLayerPath, "utils-lambda-layer")
    );

    const utilsLambdaLayer = new lambda.LayerVersion(this, "utilsLambdaLayer", {
      code: lambda.Code.fromAsset(utilsLambdaLayerPath),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const translateLambda = new lambdaNodejs.NodejsFunction(
      this,
      "TranslateLambda",
      {
        entry: translateLambdaPath,
        handler: "translate",
        runtime: lambda.Runtime.NODEJS_20_X,
        initialPolicy: [translateServicePolicy, translateTablePolicy],
        depsLockFilePath: path.join(projectRoot, "package-lock.json"), // docker need when deploy
        projectRoot: projectRoot, // docker need when deploy
        layers: [utilsLambdaLayer],
        environment: {
          TRANSLATION_TABLE_NAME: table.tableName,
          TRANSLATION_PARTITION_KEY: "requestId",
        },
      }
    );

    resAPI.root.addMethod(
      "POST",
      new apigateway.LambdaIntegration(translateLambda)
    );

    const getTranslationsLambda = new lambdaNodejs.NodejsFunction(
      this,
      "GetTranslationsLambda",
      {
        entry: translateLambdaPath,
        handler: "getTranslations",
        runtime: lambda.Runtime.NODEJS_20_X,
        initialPolicy: [translateTablePolicy],
        depsLockFilePath: path.join(projectRoot, "package-lock.json"), // docker need when deploy
        projectRoot: projectRoot, // docker need when deploy
        layers: [utilsLambdaLayer],
        environment: {
          TRANSLATION_TABLE_NAME: table.tableName,
          TRANSLATION_PARTITION_KEY: "requestId",
        },
      }
    );

    resAPI.root.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getTranslationsLambda)
    );
  }
}
