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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of all comments for the provided article_id with all these properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).not.toBe(0);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: responds with an empty array when no comment exists for the aritcle_id requested", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(0);
        expect(comments).toEqual([]);
      });
  });
  test("404: responds with an error message when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: responds with an error message when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/a/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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
        expect(article).toBeSortedBy("created_at", { descending: true });
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
  test("200: responds with articles sorted by votes in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(Array.isArray(article)).toBe(true);
        expect(article).toHaveLength(13);
        expect(article).toBeSortedBy("votes", {
          ascending: true,
          coerce: true,
        });
      });
  });
  test("200: responds with articles sorted by comment_count in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(Array.isArray(article)).toBe(true);
        expect(article).toHaveLength(13);
        expect(article).toBeSortedBy("comment_count", {
          descending: true,
          coerce: true,
        });
      });
  });
  test("400: responds with an error message with an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=AlmostWeekend")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This is not a valid sort_by query");
      });
  });
  test("400: responds with an error message with an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=AlmostWeekend")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This is not a valid order query");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object with all the properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article).toBe("object");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("200: responds with an article object that includes comment_count for the article selected", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(3);
        expect(article).toHaveProperty("comment_count");
        expect(article.comment_count).toBe("2");
      });
  });
  test("404: responds with an error message with article_id not found", () => {
    return request(app)
      .get("/api/articles/1000")

      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
  test("400: responds with an error message with invalid request", () => {
    return request(app)
      .get("/api/articles/christmas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with an updated article with the current vote incremented by the inc_vote given", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 110,
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: responds with an updated article with the current vote decreased by the inc_vote given", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 90,
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: responds with an error message with no inc_vote is given", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid inc_votes");
      });
  });
  test("400: responds with an error message with invalid inc_vote is given", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_vote: "virus" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid inc_votes");
      });
  });
  test("400: responds with an error message with invalid article_id", () => {
    return request(app)
      .patch("/api/articles/christmas")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: responds with an error message with the article requested does not exist", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with an article object with all the properties", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is so confusing.",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          article_id: 3,
          author: "butter_bridge",
          body: "This article is so confusing.",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("404: responds with error message when the givrn article_id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is so confusing.",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("404: responds with error message when the article_id is not valid", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is so confusing.",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: responds with error message when the given username does not exist", () => {
    const newComment = {
      username: "Hello_I_am_New",
      body: "This article is so confusing.",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This user does not exist");
      });
  });
  test("400: responds with error message when the username input is missing", () => {
    const newComment = {
      body: "This article is so confusing.",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing username or body");
      });
  });
  test("400: responds with error message when the body input is missing", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing username or body");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of objects with all these properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("204: deletes the comment by comment_id and returns no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: repsonds with error message with invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("400: repsonds with error message with invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/KFCTurkeyBurger")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles?topic=", () => {
  test("200: responds with an array of filtered articles the topic required", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveLength(12);
        article.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("404: responds with error message when no articles exists with the topic required", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article for this topic exist");
      });
  });
  test("404: responds with error message with no topic found", () => {
    return request(app)
      .get("/api/articles?topic=WhyNotWeekendYet")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article for this topic exist");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with the user by username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("avatar_url");
        expect(user).toHaveProperty("name");
        expect(user.username).toBe("butter_bridge");
      });
  });

  test("404: responds with an error message when user not found", () => {
    return request(app)
      .get("/api/users/imposter")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
});
