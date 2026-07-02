import { test, expect } from '@playwright/test';

// Valid Test User name
const testUser = {
    userName: "Deepak Test",
    email: `deepak${Date.now()}@test.com`, // Unique email for every run
    password: "Test@123",
    userType: 1,
};

// Test Suite For Test Authentication API
test.describe("Authentication API Tests", () => {

    // Test 1 : Register -> Success 
    test("Register user successfully", async ({ request }) => {
        const response = await request.post("/auth/register", {
            data: testUser,
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.success).toBe(true);
        expect(body.message).toBe("User registered");

        expect(body.data).toBeDefined();
        expect(body.data.email).toBe(testUser.email);
        expect(body.data.userName).toBe(testUser.userName);
        expect(typeof body.data.id).toBe("number");
    });

    // Test 2 : Register validation failure
    test("Register should fail when email is missing", async ({ request }) => {
        const response = await request.post("/auth/register", {
            data: {
                userName: "Deepak",
                password: "Test@123",
                userType: 1,
            },
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
    });

    // Test 3 : Login (Web Client) --> Token should be returned in Set-Cookie header
    test("Login successfully as Web Client", async ({ request }) => {
        const response = await request.post("/auth/login", {
            data: {
                email: testUser.email,
                password: testUser.password,
            },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.success).toBe(true);
        expect(body.message).toBe("Login successful");

        const cookieHeader = response.headers()["set-cookie"];

        expect(cookieHeader).toBeDefined();
        expect(cookieHeader).toContain("accessToken");
    });

   
    // Test 4 : Login (Mobile Client) --> Token should be returned in response body
    test("Login successfully as Mobile Client", async ({ request }) => {
        const response = await request.post("/auth/login", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Android 13; Mobile)",
            },

            data: {
                email: testUser.email,
                password: testUser.password,
            },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.success).toBe(true);

        expect(body.data.accessToken).toBeTruthy();
        expect(typeof body.data.accessToken).toBe("string");
    });

    // Test 5 : Invalid Login
    test("Login should fail with invalid credentials", async ({ request }) => {
        const response = await request.post("/auth/login", {
            data: {
                email: testUser.email,
                password: "WrongPassword123",
            },
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body.success).toBe(false);
        expect(body.message).toBe("Invalid credentials");
    });

    // Test 6 : Unauthorized GET /me
    test("GET /me should fail without authentication", async ({ request }) => {
        const response = await request.get("/auth/me");

        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body.success).toBe(false);
        expect(body.message).toBe("Not authorized");
    });

    // Test 7 : Authorized GET /me
    test("GET /me should return logged in user", async ({ request }) => {
        // Login first
        const loginResponse = await request.post("/auth/login", {
            data: {
                email: testUser.email,
                password: testUser.password,
            },
        });

        expect(loginResponse.status()).toBe(200);

        // Extract cookie
        const cookie = loginResponse.headers()["set-cookie"];

        expect(cookie).toContain("accessToken");

        // Call /me using cookie
        const meResponse = await request.get("/auth/me", {
            headers: {
                Cookie: cookie,
            },
        });

        expect(meResponse.status()).toBe(200);

        const body = await meResponse.json();

        expect(body.success).toBe(true);

        expect(typeof body.data.id).toBe("number");
        expect(body.data.email).toBe(testUser.email);
        expect(body.data.userName).toBe(testUser.userName);
    });

    // Test 8 : Logout
    test("Logout should clear authentication cookie", async ({ request }) => {
        // Login
        const loginResponse = await request.post("/auth/login", {
            data: {
                email: testUser.email,
                password: testUser.password,
            },
        });

        const cookie = loginResponse.headers()["set-cookie"];

        // Logout
        const logoutResponse = await request.post("/auth/logout", {
            headers: {
                Cookie: cookie,
            },
        });

        expect(logoutResponse.status()).toBe(200);

        const body = await logoutResponse.json();

        expect(body.success).toBe(true);
        expect(body.message).toBe("Logged out successfully");

        // Verify cookie is cleared
        const clearedCookie = logoutResponse.headers()["set-cookie"];

        expect(clearedCookie).toBeDefined();

        // Usually cleared cookies contain one of these attributes
        expect(clearedCookie).toMatch(
            /accessToken=.*Expires=|accessToken=.*Max-Age=0/i
        );
    });
});