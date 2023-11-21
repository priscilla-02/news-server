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
      });
  });
});

describe("GET /api", () => {
  test("404: responds with an error message with invalid paths", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an article object with all these properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(Array.isArray(article)).toBe(true);
        expect(article).toHaveLength(13);
        article.forEach((eachArticle) => {
          expect(eachArticle).toHaveProperty("author");
          expect(eachArticle).toHaveProperty("title");
          expect(eachArticle).toHaveProperty("article_id");
          expect(eachArticle).toHaveProperty("topic");
          expect(eachArticle).toHaveProperty("created_at");
          expect(eachArticle).toHaveProperty("votes");
          expect(eachArticle).toHaveProperty("article_img_url");
          expect(eachArticle).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("404: responds with an error message with invalid paths", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
