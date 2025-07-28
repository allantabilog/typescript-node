import { createClient, RedisClientType } from "redis";
import { GenericContainer, StartedTestContainer } from "testcontainers";

describe("Redis", () => {
  let container: StartedTestContainer;
  let redisClient: RedisClientType;

  beforeAll(async () => {
    container = await new GenericContainer("redis")
      .withExposedPorts(6379)
      .start();

    redisClient = createClient({ 
      url: `redis://${container.getHost()}:${container.getMappedPort(6379)}` 
    });

    await redisClient.connect();
  });

  afterAll(async () => {
    await redisClient.disconnect();
    await container.stop();
  });

  it("works", async () => {
    await redisClient.set("key", "val");
    expect(await redisClient.get("key")).toBe("val");
  });
});