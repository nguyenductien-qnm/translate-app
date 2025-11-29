import * as path from "path";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { RestApiService } from "./RestApiService";
import {
  createLambdaNodejs,
  lambdaLayersDirPath,
  lambdasDirPath,
} from "../../helpers";

export interface ITranslationServiceProps extends cdk.StackProps {
  restApi: RestApiService;
}

export class TranslationService extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { restApi }: ITranslationServiceProps
  ) {
    super(scope, id);

    const translateLambdaPath = path.resolve(
      path.join(lambdasDirPath, "translate/index.ts")
    );

    const utilsLambdaLayerPath = path.resolve(
      path.join(lambdaLayersDirPath, "utils-lambda-layer")
    );

    // dynamodb constructor
    const table = new dynamodb.Table(this, "translations", {
      tableName: "translation",
      partitionKey: {
        name: "username",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "requestId",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // translate access policy
    const translateServicePolicy = new iam.PolicyStatement({
      actions: ["translate:TranslateText"],
      resources: ["*"],
    });

    // translate table access policy
    const translateTablePolicy = new iam.PolicyStatement({
      actions: [
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
      ],
      resources: ["*"],
    });

    // lambda layer
    const utilsLambdaLayer = new lambda.LayerVersion(this, "utilsLambdaLayer", {
      code: lambda.Code.fromAsset(utilsLambdaLayerPath),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const environment = {
      TRANSLATION_TABLE_NAME: table.tableName,
      TRANSLATION_PARTITION_KEY: "username",
      TRANSLATION_SORT_KEY: "requestId",
    };

    // the translate lambda
    const translateLambda = createLambdaNodejs(this, "TranslateLambda", {
      lambdaRelPath: "translate/index.ts",
      handler: "userTranslate",
      initialPolicy: [translateServicePolicy, translateTablePolicy],
      lambdaLayers: [utilsLambdaLayer],
      environment,
    });

    // adding lambda to restApi
    restApi.addTranslateMethod({
      resource: restApi.userResource,
      httpMethod: "POST",
      lambda: translateLambda,
      isAuth: true,
    });

    // the get translate lambda
    const getTranslationsLambda = createLambdaNodejs(
      this,
      "GetTranslationsLambda",
      {
        lambdaRelPath: "translate/index.ts",
        handler: "getUserTranslations",
        initialPolicy: [translateTablePolicy],
        lambdaLayers: [utilsLambdaLayer],
        environment,
      }
    );

    // adding the get translate to the restApi
    restApi.addTranslateMethod({
      resource: restApi.userResource,
      httpMethod: "GET",
      lambda: getTranslationsLambda,
      isAuth: true,
    });

    const publicTranslationsLambda = createLambdaNodejs(
      this,
      "publicTranslationsLambda",
      {
        lambdaRelPath: "translate/index.ts",
        handler: "publicTranslate",
        initialPolicy: [translateServicePolicy],
        lambdaLayers: [utilsLambdaLayer],
        environment,
      }
    );

    // adding the get translate to the restApi
    restApi.addTranslateMethod({
      resource: restApi.publicResource,
      httpMethod: "POST",
      lambda: publicTranslationsLambda,
      isAuth: false,
    });

    const userDeleteTranslationsLambda = createLambdaNodejs(
      this,
      "userDeleteTranslationsLambda",
      {
        lambdaRelPath: "translate/index.ts",
        handler: "userDeleteTranslationsLambda",
        initialPolicy: [translateTablePolicy],
        lambdaLayers: [utilsLambdaLayer],
        environment,
      }
    );

    // adding the get translate to the restApi
    restApi.addTranslateMethod({
      resource: restApi.userResource,
      httpMethod: "DELETE",
      lambda: userDeleteTranslationsLambda,
      isAuth: true,
    });
  }
}
