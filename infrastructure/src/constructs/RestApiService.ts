import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Target from "aws-cdk-lib/aws-route53-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export interface IRestApiServiceProps extends cdk.StackProps {
  apiUrl: string;
  certificate: acm.Certificate;
  zone: route53.IHostedZone;
  userPool?: cognito.UserPool;
}

export class RestApiService extends Construct {
  public restApi: apigateway.RestApi;

  public authorizer?: apigateway.CognitoUserPoolsAuthorizer;
  public publicResource: apigateway.Resource;
  public userResource: apigateway.Resource;

  constructor(
    scope: Construct,
    id: string,
    { apiUrl, certificate, zone, userPool }: IRestApiServiceProps
  ) {
    super(scope, id);

    this.restApi = new apigateway.RestApi(this, "ApiGateway", {
      domainName: {
        domainName: apiUrl,
        certificate,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_ORIGINS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowCredentials: true,
      },
    });

    this.publicResource = this.restApi.root.addResource("public");
    this.userResource = this.restApi.root.addResource("user");

    //create authorizer if userPool is passed in
    if (userPool) {
      this.authorizer = new apigateway.CognitoUserPoolsAuthorizer(
        this.restApi,
        "authorizer",
        {
          cognitoUserPools: [userPool],
          authorizerName: "userPoolAuthorizer",
        }
      );
    }

    new route53.ARecord(this, "AppDns", {
      zone,
      recordName: "api",
      target: route53.RecordTarget.fromAlias(
        new route53Target.ApiGateway(this.restApi)
      ),
    });
  }

  addTranslateMethod({
    resource,
    httpMethod,
    lambda,
    isAuth,
  }: {
    resource: apigateway.Resource;
    httpMethod: string;
    lambda: lambda.IFunction;
    isAuth: boolean;
  }) {
    let options: apigateway.MethodOptions = {};
    if (isAuth) {
      if (!this.authorizer) throw new Error("Authorizer is not set");
      options = {
        authorizer: this.authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      };
    }

    resource.addMethod(
      httpMethod,
      new apigateway.LambdaIntegration(lambda),
      options
    );
  }
}
