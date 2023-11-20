const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const expectedEndpoints = require("../endpoints");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: responds with an error message with invalid request endpoint", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body.endpoints).toEqual(expectedEndpoints);
        //
        const apiEndpoint = body.endpoints["GET /api"];
        expect(apiEndpoint).toBeDefined();
        expect(typeof apiEndpoint).toBe("object");
        expect(apiEndpoint).toHaveProperty("description");
        expect(typeof apiEndpoint.description).toBe("string");
        //
        const topicsEndpoint = body.endpoints["GET /api/topics"];
        expect(topicsEndpoint).toBeDefined();
        expect(typeof topicsEndpoint).toBe("object");
        expect(topicsEndpoint).toHaveProperty("description");
        expect(typeof topicsEndpoint.description).toBe("string");
        expect(topicsEndpoint).toHaveProperty("queries");
        expect(Array.isArray(topicsEndpoint.queries)).toBe(true);
        expect(topicsEndpoint.queries).toEqual([]);
        expect(topicsEndpoint).toHaveProperty("exampleResponse");
        expect(typeof topicsEndpoint.exampleResponse).toBe("object");
        expect(topicsEndpoint).toHaveProperty("exampleResponse");
        expect(Object.keys(topicsEndpoint.exampleResponse)).toEqual(["topics"]);
        //
        const articlesEndpoint = body.endpoints["GET /api/articles"];
        expect(articlesEndpoint).toBeDefined();
        expect(typeof articlesEndpoint).toBe("object");
        expect(articlesEndpoint).toHaveProperty("description");
        expect(typeof articlesEndpoint.description).toBe("string");
        expect(articlesEndpoint).toHaveProperty("queries");
        expect(Array.isArray(articlesEndpoint.queries)).toBe(true);
        expect(articlesEndpoint.queries).toEqual([
          "author",
          "topic",
          "sort_by",
          "order",
        ]);
        expect(articlesEndpoint).toHaveProperty("exampleResponse");
        expect(typeof articlesEndpoint.exampleResponse).toBe("object");
        expect(Object.keys(articlesEndpoint.exampleResponse)).toEqual([
          "articles",
        ]);
      });
  });
  test("404: responds with an error message with invalid request endpoint", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
