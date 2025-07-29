import { CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

describe("DynamoDB", () => {
    const tableName = "test-table";

    beforeAll(async () => {
        // Create a test table
        await dynamoClient.send(new CreateTableCommand({
            TableName: tableName,
            KeySchema: [
                { AttributeName: "id", KeyType: "HASH"}
            ],
            AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "S"}
            ],
            BillingMode: "PAY_PER_REQUEST"
        }));
    });

    afterAll(async () => {
        // clean up the test table
        try {
            await dynamoClient.send(new DeleteTableCommand({
                TableName: tableName
            }))
        } catch (error) {

        }
    });

    it("can put and get items", async () => {
        const testItem = {
            id: "test-id",
            name: "Test Item",
            value: 42
        };

        // put item
        await dynamoDocClient.send(new PutCommand({
            TableName: tableName,
            Item: testItem
        }));

        // get item 
        const result = await dynamoDocClient.send(new GetCommand({
            TableName: tableName,
            Key: {id: "test-id"}
        }));

        expect(result.Item).toEqual(testItem)
    })

    it("can scan table", async () => {
        // Put multiple items
        await dynamoDocClient.send(new PutCommand({
            TableName: tableName,
            Item: {id: "item1", name: "First Item"}
        }));

        await dynamoDocClient.send(new PutCommand({
            TableName: tableName,
            Item: {id: "item2", name: "Second Item"}
        }));

        // scan table
        const result = await dynamoDocClient.send(new ScanCommand({
            TableName: tableName
        }));

        expect(result.Items).toHaveLength(3);
        expect(result.Items?.some(item => item.id === "item1")).toBe(true);
        expect(result.Items?.some(item => item.id === "item2")).toBe(true);
    })




})