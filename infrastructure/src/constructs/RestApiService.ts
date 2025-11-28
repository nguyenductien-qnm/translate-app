import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Target from "aws-cdk-lib/aws-route53-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface IRestApiServiceProps extends cdk.StackProps {
  apiUrl: string;
  certificate: acm.Certificate;
  zone: route53.IHostedZone;
}

export class RestApiService extends Construct {
  public restApi: apigateway.RestApi;

  constructor(
    scope: Construct,
    id: string,
    { apiUrl, certificate, zone }: IRestApiServiceProps
  ) {
    super(scope, id);

    this.restApi = new apigateway.RestApi(this, "ApiGateway", {
      domainName: {
        domainName: apiUrl,
        certificate,
      },
    });

    new route53.ARecord(this, "AppDns", {
      zone,
      recordName: "api",
      target: route53.RecordTarget.fromAlias(
        new route53Target.ApiGateway(this.restApi)
      ),
    });
  }

  addTranslateMethod({
    httpMethod,
    lambda,
  }: {
    httpMethod: string;
    lambda: lambda.IFunction;
  }) {
    this.restApi.root.addMethod(
      httpMethod,
      new apigateway.LambdaIntegration(lambda)
    );
  }
}
