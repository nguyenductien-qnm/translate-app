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

const { TRANSLATION_TABLE_NAME, TRANSLATION_PARTITION_KEY } = process.env;

if (!TRANSLATION_TABLE_NAME)
  throw new exception.MissingParameters("TRANSLATION_TABLE_NAME");

if (!TRANSLATION_PARTITION_KEY)
  throw new exception.MissingParameters("TRANSLATION_PARTITION_KEY");

const translateTable = new TranslationTable({
  tableName: TRANSLATION_TABLE_NAME,
  partitionKey: TRANSLATION_PARTITION_KEY,
});

export const translate: lambda.APIGatewayProxyHandler = async (
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

    const tableOjb: ITranslateDBObject = {
      requestId: context.awsRequestId,
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

export const getTranslations: lambda.APIGatewayProxyHandler = async () => {
  try {
    const rtnData = await translateTable.getAll();
    return gateway.createSuccessJsonResponse(rtnData);
  } catch (e: any) {
    console.error("error here::::::", e);
    return gateway.createErrorJsonResponse(e);
  }
};
