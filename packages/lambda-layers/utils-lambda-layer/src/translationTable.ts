import * as dynamodb from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall as unMarshall } from "@aws-sdk/util-dynamodb";
import { ITranslateDBObject } from "@sff/shared-types";

export class TranslationTable {
  tableName: string;
  partitionKey: string;
  sortKey: string;
  dynamodbClient: dynamodb.DynamoDBClient;

  constructor({
    tableName,
    partitionKey,
    sortKey,
  }: {
    tableName: string;
    partitionKey: string;
    sortKey: string;
  }) {
    this.tableName = tableName;
    this.partitionKey = partitionKey;
    this.sortKey = sortKey;
    this.dynamodbClient = new dynamodb.DynamoDBClient({});
  }

  async insert(data: ITranslateDBObject) {
    const tableInsertCmd: dynamodb.PutItemCommandInput = {
      TableName: this.tableName,
      Item: marshall(data),
    };

    await this.dynamodbClient.send(new dynamodb.PutItemCommand(tableInsertCmd));
  }

  async query({ username }: { username: string }) {
    const queryCmd: dynamodb.QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "#PARTITION_KEY = :username",
      ExpressionAttributeNames: {
        "#PARTITION_KEY": "username",
      },
      ExpressionAttributeValues: {
        ":username": { S: username },
      },
      ScanIndexForward: true,
    };

    const { Items } = await this.dynamodbClient.send(
      new dynamodb.QueryCommand(queryCmd)
    );

    if (!Items) return [];

    const rtnData = Items.map((i) => unMarshall(i) as ITranslateDBObject);

    return rtnData;
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

  async delete({
    username,
    requestId,
  }: {
    username: string;
    requestId: string;
  }) {
    const deleteCmd: dynamodb.DeleteItemCommandInput = {
      TableName: this.tableName,
      Key: {
        [this.partitionKey]: { S: username },
        [this.sortKey]: { S: requestId },
      },
    };

    await this.dynamodbClient.send(new dynamodb.DeleteItemCommand(deleteCmd));
  }
}
