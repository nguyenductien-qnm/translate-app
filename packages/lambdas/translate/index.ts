import * as lambda from "aws-lambda";
import {
  gateway,
  getTranslation,
  exception,
  TranslationTable,
} from "/opt/nodejs/utils-lambda-layer";

import {
  ITranslateDBObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";

const {
  TRANSLATION_TABLE_NAME,
  TRANSLATION_PARTITION_KEY,
  TRANSLATION_SORT_KEY,
} = process.env;

if (!TRANSLATION_TABLE_NAME)
  throw new exception.MissingParameters("TRANSLATION_TABLE_NAME");

if (!TRANSLATION_PARTITION_KEY)
  throw new exception.MissingParameters("TRANSLATION_PARTITION_KEY");

if (!TRANSLATION_SORT_KEY)
  throw new exception.MissingParameters("TRANSLATION_SORT_KEY");

const translateTable = new TranslationTable({
  tableName: TRANSLATION_TABLE_NAME,
  partitionKey: TRANSLATION_PARTITION_KEY,
  sortKey: TRANSLATION_SORT_KEY,
});

const getUserName = (event: lambda.APIGatewayProxyEvent) => {
  const claims = event.requestContext.authorizer?.claims;
  if (!claims) throw new Error("User not authenticated.");

  const username = claims["cognito:username"];
  if (!username) throw new Error("username doesn't exist.");
  return username;
};

export const publicTranslate: lambda.APIGatewayProxyHandler = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) => {
  try {
    if (!event.body) throw new exception.MissingBodyData();

    const body = JSON.parse(event.body) as ITranslateRequest;

    const { sourceLang, targetLang, sourceText } = body;

    if (!sourceLang) throw new exception.MissingParameters("sourceLang");
    if (!targetLang) throw new exception.MissingParameters("targetLang");
    if (!sourceText) throw new exception.MissingParameters("sourceText");

    const result = await getTranslation(body);

    if (!result.TranslatedText)
      throw new exception.MissingParameters("TranslatedText");

    const responseData: ITranslateResponse = {
      timestamp: new Date().toString(),
      targetText: result.TranslatedText,
    };

    return gateway.createSuccessJsonResponse(responseData);
  } catch (e: any) {
    console.error("error here::::::", e);
    return gateway.createErrorJsonResponse(e);
  }
};

export const userTranslate: lambda.APIGatewayProxyHandler = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) => {
  try {
    const username = getUserName(event);

    if (!event.body) throw new exception.MissingBodyData();

    const body = JSON.parse(event.body) as ITranslateRequest;

    const { sourceLang, targetLang, sourceText } = body;

    if (!sourceLang) throw new exception.MissingParameters("sourceLang");
    if (!targetLang) throw new exception.MissingParameters("targetLang");
    if (!sourceText) throw new exception.MissingParameters("sourceText");

    const result = await getTranslation(body);

    if (!result.TranslatedText)
      throw new exception.MissingParameters("TranslatedText");

    const responseData: ITranslateResponse = {
      timestamp: new Date().toString(),
      targetText: result.TranslatedText,
    };

    const tableOjb: ITranslateDBObject = {
      requestId: context.awsRequestId,
      username,
      ...body,
      ...responseData,
    };

    await translateTable.insert(tableOjb);

    return gateway.createSuccessJsonResponse(responseData);
  } catch (e: any) {
    console.error("error here::::::", e);
    return gateway.createErrorJsonResponse(e);
  }
};

export const getUserTranslations: lambda.APIGatewayProxyHandler = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) => {
  try {
    const username = getUserName(event);

    const rtnData = await translateTable.query({ username });
    return gateway.createSuccessJsonResponse(rtnData);
  } catch (e: any) {
    console.error("error here::::::", e);
    return gateway.createErrorJsonResponse(e);
  }
};

export const userDeleteTranslationsLambda: lambda.APIGatewayProxyHandler =
  async (event: lambda.APIGatewayProxyEvent, context: lambda.Context) => {
    try {
      const username = getUserName(event);

      if (!event.body) throw new exception.MissingBodyData();

      const body = JSON.parse(event.body) as { requestId: string };

      if (!body.requestId) throw new exception.MissingParameters("requestId");

      let requestId = body.requestId;

      await translateTable.delete({ username, requestId });
      return gateway.createSuccessJsonResponse({ success: true });
    } catch (e: any) {
      console.error("error here::::::", e);
      return gateway.createErrorJsonResponse(e);
    }
  };
