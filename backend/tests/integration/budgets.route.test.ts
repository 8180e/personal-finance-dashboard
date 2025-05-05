import "../setupDB";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../src/config/env.config";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";
import Budget from "../../src/models/budget.model";

const userId = new mongoose.Types.ObjectId();
const token = jwt.sign({ id: userId }, TOKEN_SECRET);

describe("POST /budgets", () => {
  it("creates a new budget", async () => {
    const budget = { category: "Groceries", amount: 100 };
    const response = await request(app)
      .post("/budgets")
      .send(budget)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: expect.any(String), ...budget });
  });

  it("returns 401 if token is missing", async () => {
    const budget = { category: "Groceries", amount: 100 };
    const response = await request(app).post("/budgets").send(budget);

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is invalid", async () => {
    const budget = { category: "Groceries", amount: 100 };
    const response = await request(app)
      .post("/budgets")
      .send(budget)
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is expired", async () => {
    const budget = { category: "Groceries", amount: 100 };
    const expiredToken = jwt.sign({ id: userId }, TOKEN_SECRET, {
      expiresIn: -1,
    });
    const response = await request(app)
      .post("/budgets")
      .send(budget)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });

  it("returns 400 if category is not a string", async () => {
    const budget = { category: 123, amount: 100 };
    const response = await request(app)
      .post("/budgets")
      .send(budget)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("returns 400 if amount is not a number", async () => {
    const budget = { category: "Groceries", amount: "invalid" };
    const response = await request(app)
      .post("/budgets")
      .send(budget)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("returns 400 if amount is negative", async () => {
    const budget = { category: "Groceries", amount: -100 };
    const response = await request(app)
      .post("/budgets")
      .send(budget)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});

describe("PATCH /budgets/:id", () => {
  it("updates a budget", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);

    const response = await request(app)
      .patch(`/budgets/${id}`)
      .send({ amount: 200 })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("returns 401 if token is missing", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);

    const response = await request(app)
      .patch(`/budgets/${id}`)
      .send({ amount: 200 });

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is invalid", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);

    const response = await request(app)
      .patch(`/budgets/${id}`)
      .send({ amount: 200 })
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is expired", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);
    const expiredToken = jwt.sign({ id: userId }, TOKEN_SECRET, {
      expiresIn: -1,
    });

    const response = await request(app)
      .patch(`/budgets/${id}`)
      .send({ amount: 200 })
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });

  it("returns 400 if amount is not a number", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);

    const response = await request(app)
      .patch(`/budgets/${id}`)
      .send({ amount: "invalid" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("returns 400 if amount is negative", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);

    const response = await request(app)
      .patch(`/budgets/${id}`)
      .send({ amount: -100 })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("returns 404 if budget is not found", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .patch(`/budgets/${invalidId}`)
      .send({ amount: 200 })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("returns 401 if user does not own the budget", async () => {
    const budget = {
      userId: new mongoose.Types.ObjectId(),
      category: "Groceries",
      amount: 100,
    };
    const { id } = await Budget.create(budget);

    const response = await request(app)
      .patch(`/budgets/${id}`)
      .send({ amount: 200 })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
  });
});

describe("DELETE /budgets/:id", () => {
  it("deletes a budget", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);

    const response = await request(app)
      .delete(`/budgets/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("returns 401 if token is missing", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);

    const response = await request(app).delete(`/budgets/${id}`);

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is invalid", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);

    const response = await request(app)
      .delete(`/budgets/${id}`)
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is expired", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    const { id } = await Budget.create(budget);
    const expiredToken = jwt.sign({ id: userId }, TOKEN_SECRET, {
      expiresIn: -1,
    });

    const response = await request(app)
      .delete(`/budgets/${id}`)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });

  it("returns 404 if budget is not found", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/budgets/${invalidId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("returns 401 if user does not own the budget", async () => {
    const budget = {
      userId: new mongoose.Types.ObjectId(),
      category: "Groceries",
      amount: 100,
    };
    const { id } = await Budget.create(budget);

    const response = await request(app)
      .delete(`/budgets/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
  });

  it("returns 400 if id is invalid", async () => {
    const response = await request(app)
      .delete("/budgets/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});

describe("GET /budgets", () => {
  it("returns all budgets", async () => {
    const budget = { userId, category: "Groceries", amount: 100 };
    await Budget.create(budget);

    const response = await request(app)
      .get("/budgets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: expect.any(String), ...budget, userId: undefined },
    ]);
  });

  it("returns 401 if token is missing", async () => {
    const response = await request(app).get("/budgets");

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is invalid", async () => {
    const response = await request(app)
      .get("/budgets")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is expired", async () => {
    const expiredToken = jwt.sign({ id: userId }, TOKEN_SECRET, {
      expiresIn: -1,
    });
    const response = await request(app)
      .get("/budgets")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });
});
