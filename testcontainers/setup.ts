import { createClient, RedisClientType } from "redis";
import { GenericContainer, StartedTestContainer } from "testcontainers";

// declare global types
declare global {
  var redisContainer: StartedTestContainer;
  var redisClient: RedisClientType;
}

let container: StartedTestContainer
let client: RedisClientType

beforeAll(async () => {
  console.log('🚀 Starting Redis container...')

  container = await new GenericContainer("redis")
      .withExposedPorts(6379)
      .start();

  client = createClient({ 
    url: `redis://${container.getHost()}:${container.getMappedPort(6379)}` 
  });

  await client.connect();

  // make it globally available
  global.redisClient = client;
  global.redisContainer = container;

  console.log('✅ Redis container started and client connected')
});

afterAll(async () => {
  console.log('Cleaning up test containers...')

  if (client) {
    await client.quit();
  }

  if (container) {
    await container.stop();
  }

  console.log('✅ Redis cleanup complete')
})

