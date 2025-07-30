import { createClient, RedisClientType } from "redis";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import * as AWS from "aws-sdk";

// declare global types
declare global {
  var redisContainer: StartedTestContainer;
  var redisClient: RedisClientType;
  var dynamoContainer: StartedTestContainer;
  var dynamoClient: DynamoDBClient;
  var dynamoDocClient: DynamoDBDocumentClient;
  var awsDynamoClient: AWS.DynamoDB; // and SDK v2 client for dynamo-easy
}

let container: StartedTestContainer
let client: RedisClientType
let dynamoContainer: StartedTestContainer;
let dynamoClient: DynamoDBClient;
let dynamoDocClient: DynamoDBDocumentClient;
let awsDynamoClient: AWS.DynamoDB;

beforeAll(async () => {
  console.log('🚀 Starting Redis container...')

  container = await new GenericContainer("redis")
      .withExposedPorts(6379)
      .start();

  client = createClient({ 
    url: `redis://${container.getHost()}:${container.getMappedPort(6379)}` 
  });

  await client.connect();

  console.log('Starting DynamoDB container...');
  dynamoContainer = await new GenericContainer("amazon/dynamodb-local:latest")
    .withExposedPorts(8000)
    .withCommand(["-jar", "DynamoDBLocal.jar", "-inMemory", "-sharedDb"])
    .start();

  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'test',
    secretAccessKey: 'test',
  })

  awsDynamoClient = new AWS.DynamoDB({
    endpoint: `http://${dynamoContainer.getHost()}:${dynamoContainer.getMappedPort(8000)}`,
    region: 'us-east-1',
    accessKeyId: 'test',
    secretAccessKey: 'test',
  })
    dynamoClient = new DynamoDBClient({
      endpoint: `http://${dynamoContainer.getHost()}:${dynamoContainer.getMappedPort(8000)}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
      },
    });

    dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

  // make it globally available
  global.redisClient = client;
  global.redisContainer = container;
  global.dynamoClient = dynamoClient;
  global.dynamoDocClient = dynamoDocClient;
  global.dynamoContainer = dynamoContainer;
  global.awsDynamoClient = awsDynamoClient;

  console.log('✅ All containers started and clients connected')
});

afterAll(async () => {
  console.log('Cleaning up test containers...')

  if (client) {
    await client.quit();
  }

  if (container) {
    await container.stop();
  }

  if (dynamoClient) {
    dynamoClient.destroy();
  }

  if (dynamoContainer) {
    await dynamoContainer.stop();
  }

  console.log('✅ Cleanup complete')
})

