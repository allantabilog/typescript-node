import { createClient, RedisClientType } from "redis";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// declare global types
declare global {
  var redisContainer: StartedTestContainer;
  var redisClient: RedisClientType;
  var dynamoContainer: StartedTestContainer;
  var dynamoClient: DynamoDBClient;
  var dynamoDocClient: DynamoDBDocumentClient;
}

let container: StartedTestContainer
let client: RedisClientType
let dynamoContainer: StartedTestContainer;
let dynamoClient: DynamoDBClient;
let dynamoDocClient: DynamoDBDocumentClient;

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

