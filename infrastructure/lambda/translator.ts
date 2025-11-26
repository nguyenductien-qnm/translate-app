import * as clientTranslate from "@aws-sdk/client-translate";
import * as lambda from "aws-lambda";
import { ITranslateRequest, ITranslateResponse } from "@sff/shared-types";

const translateClient = new clientTranslate.TranslateClient({});

export const index: lambda.APIGatewayProxyHandler = async (
  event: lambda.APIGatewayProxyEvent
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
