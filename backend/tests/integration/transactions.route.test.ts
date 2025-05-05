import "../setupDB";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { TOKEN_SECRET } from "../../src/config/env.config";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";
import Transaction from "../../src/models/transaction.model";

const userId = new mongoose.Types.ObjectId();
const token = jwt.sign({ id: userId }, TOKEN_SECRET);

describe("POST /transactions", () => {
  it("creates a new transaction", async () => {
    const transaction = { amount: 100, type: "EXPENSE", category: "Groceries" };
    const response = await request(app)
      .post("/transactions")
      .send(transaction)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      ...transaction,
    });
  });

  it("returns 401 if token is missing", async () => {
    const transaction = {
      amount: 100,
      type: "EXPENSE",
      category: "Groceries",
    };
    const response = await request(app).post("/transactions").send(transaction);

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is invalid", async () => {
    const transaction = { amount: 100, type: "EXPENSE", category: "Groceries" };
    const response = await request(app)
      .post("/transactions")
      .send(transaction)
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is expired", async () => {
    const expiredToken = jwt.sign({ id: userId }, TOKEN_SECRET, {
      expiresIn: -1,
    });
    const transaction = { amount: 100, type: "EXPENSE", category: "Groceries" };
    const response = await request(app)
      .post("/transactions")
      .send(transaction)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });

  it("returns 400 if type is not INCOME or EXPENSE", async () => {
    const transaction = { amount: 100, type: "INVALID", category: "Groceries" };
    const response = await request(app)
      .post("/transactions")
      .send(transaction)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("returns 400 if amount is negative", async () => {
    const transaction = {
      amount: -100,
      type: "EXPENSE",
      category: "Groceries",
    };
    const response = await request(app)
      .post("/transactions")
      .send(transaction)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("returns 400 if amount is not a number", async () => {
    const transaction = {
      amount: "invalid",
      type: "EXPENSE",
      category: "Groceries",
    };
    const response = await request(app)
      .post("/transactions")
      .send(transaction)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("returns 400 if category is not a string", async () => {
    const transaction = { amount: 100, type: "EXPENSE", category: 123 };
    const response = await request(app)
      .post("/transactions")
      .send(transaction)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});

describe("GET /transactions", () => {
  it("returns an empty array if there are no transactions", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("returns all transactions", async () => {
    const transaction = {
      amount: 100,
      type: "EXPENSE",
      category: "Groceries",
    };

    await Transaction.create({ ...transaction, userId });

    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: expect.any(String), createdAt: expect.any(String), ...transaction },
    ]);
  });

  it("returns 401 if token is invalid", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is missing", async () => {
    const response = await request(app).get("/transactions");

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is expired", async () => {
    const expiredToken = jwt.sign({ id: userId }, TOKEN_SECRET, {
      expiresIn: -1,
    });
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });
});

describe("DELETE /transactions/:id", () => {
  it("deletes a transaction", async () => {
    const transaction = {
      amount: 100,
      type: "EXPENSE",
      category: "Groceries",
    };

    const createdTransaction = await Transaction.create({
      ...transaction,
      userId,
    });

    const response = await request(app)
      .delete(`/transactions/${createdTransaction.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("returns 401 if token is invalid", async () => {
    const transaction = {
      amount: 100,
      type: "EXPENSE",
      category: "Groceries",
    };

    const createdTransaction = await Transaction.create({
      ...transaction,
      userId,
    });

    const response = await request(app)
      .delete(`/transactions/${createdTransaction.id}`)
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is missing", async () => {
    const transaction = {
      amount: 100,
      type: "EXPENSE",
      category: "Groceries",
    };

    const createdTransaction = await Transaction.create({
      ...transaction,
      userId,
    });

    const response = await request(app).delete(
      `/transactions/${createdTransaction.id}`
    );

    expect(response.status).toBe(401);
  });

  it("returns 401 if token is expired", async () => {
    const transaction = {
      amount: 100,
      type: "EXPENSE",
      category: "Groceries",
    };

    const createdTransaction = await Transaction.create({
      ...transaction,
      userId,
    });

    const expiredToken = jwt.sign({ id: userId }, TOKEN_SECRET, {
      expiresIn: -1,
    });
    const response = await request(app)
      .delete(`/transactions/${createdTransaction.id}`)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });

  it("returns 404 if transaction is not found", async () => {
    const transactionId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("returns 400 if transaction id is invalid", async () => {
    const response = await request(app)
      .delete("/transactions/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("returns 401 if user is not the owner of the transaction", async () => {
    const transaction = {
      amount: 100,
      type: "EXPENSE",
      category: "Groceries",
    };

    const createdTransaction = await Transaction.create({
      ...transaction,
      userId: new mongoose.Types.ObjectId(),
    });

    const response = await request(app)
      .delete(`/transactions/${createdTransaction.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
  });
});
