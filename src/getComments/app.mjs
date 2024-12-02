import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB client and document client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  let items = [];
  let lastEvaluatedKey = null;

  try {
    do {
      const params = {
        TableName: "Comments", // Replace with your DynamoDB table name
      };
      
      // Include ExclusiveStartKey only if lastEvaluatedKey is defined
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }

      const command = new ScanCommand(params);
      const response = await docClient.send(command);

      items = items.concat(response.Items || []);
      lastEvaluatedKey = response.LastEvaluatedKey; // Get the last evaluated key

    } while (lastEvaluatedKey); // Continue scanning if there is a last evaluated key

    // Return all items as a response
    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    console.error("Error scanning DynamoDB table:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
