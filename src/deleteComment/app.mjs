import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

  console.log('Event:', JSON.stringify(event, null, 2));
  const command = new DeleteCommand({
    TableName: "Comments",
    Key: {
      commentId: event.pathParameters.id,
    },
  });
  
  try {
     const response = await docClient.send(command);
     console.log("Delete response:", response);
     return {
       statusCode: 200,
       headers: {
         'Access-Control-Allow-Origin': '*',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ message: 'Comment deleted successfully' }),
     };
   } catch (error) {
     console.error("Error deleting comment:", error);
     return {
       statusCode: 500,
       headers: {
         'Access-Control-Allow-Origin': '*',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ message: 'Error deleting comment' }),
    };
  }
};