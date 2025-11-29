import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { getConfig } from "../../helpers";
import {
  RestApiService,
  TranslationService,
  StaticWebsiteDeployment,
  CertificateWrapper,
  UserAuthSupportService,
} from "../constructs";

const config = getConfig();

export class TranslatorServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domain = config.domain;
    const webUrl = `${config.webSubdomain}.${domain}`;
    const apiUrl = `${config.apiSubdomain}.${domain}`;

    const { certificate, zone } = new CertificateWrapper(
      this,
      "CertificateWrapper",
      {
        domain,
        webUrl,
        apiUrl,
      }
    );

    //UserAuth Support

    const userAuth = new UserAuthSupportService(this, "userAuthSupport");

    const restApi = new RestApiService(this, "RestApiService", {
      apiUrl,
      certificate,
      zone,
      userPool: userAuth.userPool,
    });

    new TranslationService(this, "TranslationService", {
      restApi,
    });

    new StaticWebsiteDeployment(this, "StaticWebsiteDeployment", {
      domain,
      certificate,
      webUrl,
      zone,
    });
  }
}
