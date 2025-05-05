import "../setupDB";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";
import User from "../../src/models/user.model";
import bcrypt from "bcryptjs";

describe("POST /auth/sign-up", () => {
  it("creates a new user", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    const response = await request(app).post("/auth/sign-up").send(user);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ token: expect.any(String) });
  });

  it("returns 409 if user already exists", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };

    await User.create(user);

    const response = await request(app).post("/auth/sign-up").send(user);

    expect(response.status).toBe(409);
  });

  it("returns 400 if email is invalid", async () => {
    const user = {
      name: "John Doe",
      email: "invalid-email",
      password: "password",
    };

    const response = await request(app).post("/auth/sign-up").send(user);

    expect(response.status).toBe(400);
  });

  it("returns 400 if password is too short", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "pass",
    };

    const response = await request(app).post("/auth/sign-up").send(user);

    expect(response.status).toBe(400);
  });

  it("returns 400 if name is missing", async () => {
    const user = {
      email: "johndoe@example.com",
      password: "password",
    };

    const response = await request(app).post("/auth/sign-up").send(user);

    expect(response.status).toBe(400);
  });
});

describe("POST /auth/sign-in", () => {
  it("signs in an existing user", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };

    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    });

    const response = await request(app).post("/auth/sign-in").send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });
  });

  it("returns 404 if user is not found", async () => {
    const response = await request(app).post("/auth/sign-in").send({
      email: "johndoe@example.com",
      password: "password",
    });

    expect(response.status).toBe(404);
  });

  it("returns 401 if password is incorrect", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };

    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    });

    const response = await request(app).post("/auth/sign-in").send({
      email: user.email,
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
  });
});
