import * as dynamodb from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall as unMarshall } from "@aws-sdk/util-dynamodb";
import { ITranslateDBObject } from "@sff/shared-types";

export class TranslationTable {
  tableName: string;
  partitionKey: string;
  dynamodbClient: dynamodb.DynamoDBClient;

  constructor({
    tableName,
    partitionKey,
  }: {
    tableName: string;
    partitionKey: string;
  }) {
    this.tableName = tableName;
    this.partitionKey = partitionKey;
    this.dynamodbClient = new dynamodb.DynamoDBClient({});
  }

  async insert(data: ITranslateDBObject) {
    const tableInsertCmd: dynamodb.PutItemCommandInput = {
      TableName: this.tableName,
      Item: marshall(data),
    };

    await this.dynamodbClient.send(new dynamodb.PutItemCommand(tableInsertCmd));
  }

  async getAll() {
    const scanCmd: dynamodb.ScanCommandInput = {
      TableName: this.tableName,
    };

    const { Items } = await this.dynamodbClient.send(
      new dynamodb.ScanCommand(scanCmd)
    );

    if (!Items) return [];

    const rtnData = Items.map((i) => unMarshall(i) as ITranslateDBObject);

    return rtnData;
  }
}
