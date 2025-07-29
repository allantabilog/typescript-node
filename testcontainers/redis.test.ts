
describe("Redis", () => {
  it("works", async () => {
    await redisClient.set("key", "val");
    console.log("Redis test: lookup key/value:")
    expect(await redisClient.get("key")).toBe("val");
  });
});