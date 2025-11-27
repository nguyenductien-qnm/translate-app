import * as clientTranslate from "@aws-sdk/client-translate";
import * as lambda from "aws-lambda";
import * as dynamodb from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  ITranslateDBObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";

const { TRANSLATION_TABLE_NAME, TRANSLATION_PARTITION_KEY } = process.env;

console.log("{ TRANSLATION_TABLE_NAME, TRANSLATION_PARTITION_KEY }", {
  TRANSLATION_TABLE_NAME,
  TRANSLATION_PARTITION_KEY,
});

if (!TRANSLATION_TABLE_NAME)
  throw new Error("TRANSLATION_TABLE_NAME is empty.");

if (!TRANSLATION_PARTITION_KEY)
  throw new Error("TRANSLATION_PARTITION_KEY is empty.");

const translateClient = new clientTranslate.TranslateClient({});
const dynamodbClient = new dynamodb.DynamoDBClient({});

export const index: lambda.APIGatewayProxyHandler = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) => {
  try {
    if (!event.body) throw new Error("Body is empty");

    const body = JSON.parse(event.body) as ITranslateRequest;

    const { sourceLang, targetLang, sourceText } = body;

    if (!body.sourceLang) throw new Error("sourceLang is missing.");
    if (!body.targetLang) throw new Error("targetLang is missing.");
    if (!body.sourceText) throw new Error("sourceText is missing.");

    const translateCmd = new clientTranslate.TranslateTextCommand({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: sourceText,
    });

    const result = await translateClient.send(translateCmd);

    if (!result.TranslatedText) throw new Error("Translation is empty.");

    const responseData: ITranslateResponse = {
      timestamp: new Date().toString(),
      targetText: result.TranslatedText,
    };

    const tableOjb: ITranslateDBObject = {
      requestId: context.awsRequestId,
      ...body,
      ...responseData,
    };

    const tableInsertCmd: dynamodb.PutItemCommandInput = {
      TableName: TRANSLATION_TABLE_NAME,
      Item: marshall(tableOjb),
    };

    await dynamodbClient.send(new dynamodb.PutItemCommand(tableInsertCmd));

    return {
      statusCode: 200,
      body: JSON.stringify(responseData),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(e.toString()),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  }
};
