import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    // Get the comment ID from the URL parameters
    const commentId = event.pathParameters.id;
    
    // Parse the request body
    const bodyString = event.body;
    const body = JSON.parse(bodyString);

    // Now body is a string, so parse it again
    const parsedBody = JSON.parse(body);


    // Prepare the update command
    const command = new UpdateCommand({
        TableName: "Comments", // Change to your table name
        Key: {
            commentId: commentId // Assuming your partition key is 'commentId'
        },
        UpdateExpression: "set commentText = :text",
       
        ExpressionAttributeValues: {
            ":text": parsedBody.commentText,
        },
        ReturnValues: "ALL_NEW",
    });

    try {
        const response = await docClient.send(command);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response.Attributes), // Return the updated comment
        };
    } catch (error) {
        console.error("Error updating comment:", error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: "Could not update comment" }),
        };
    }
};
