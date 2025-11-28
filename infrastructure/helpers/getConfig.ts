import * as dotenv from "dotenv";
import { IAppConfig } from "./IAppTypes";

export const getConfig = (): IAppConfig => {
  dotenv.config({ path: "../.env" });

  const { AWS_ACCOUNT_ID, AWS_REGION, DOMAIN, WEB_SUBDOMAIN, API_SUBDOMAIN } =
    process.env;

  if (!AWS_ACCOUNT_ID) throw new Error("AWS_ACCOUNT_ID is empty");
  if (!AWS_REGION) throw new Error("AWS_REGION is empty");
  if (!DOMAIN) throw new Error("DOMAIN is empty");
  if (!WEB_SUBDOMAIN) throw new Error("WEB_SUBDOMAIN is empty");
  if (!API_SUBDOMAIN) throw new Error("API_SUBDOMAIN is empty");

  return {
    awsAccountID: AWS_ACCOUNT_ID,
    awsRegion: AWS_REGION,
    domain: DOMAIN,
    webSubdomain: WEB_SUBDOMAIN,
    apiSubdomain: API_SUBDOMAIN,
  };
};
