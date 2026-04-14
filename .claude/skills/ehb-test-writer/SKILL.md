---
name: ehb-test-writer
description: Write unit, integration, and E2E tests with Jest, Vitest, Supertest, and Playwright
---

# EHB Test Writer

Write comprehensive tests covering unit, integration, and end-to-end scenarios with 80%+ coverage.

## Test Structure

```
services/api/stl-replit/
├── __tests__/
│   ├── unit/
│   │   ├── services/
│   │   │   ├── productService.test.js
│   │   │   └── stlService.test.js
│   │   ├── utils/
│   │   │   └── errors.test.js
│   │   └── middleware/
│   │       └── auth.test.js
│   ├── integration/
│   │   ├── routes/
│   │   │   ├── productRoutes.test.js
│   │   │   └── authRoutes.test.js
│   │   └── services/
│   │       └── productService.integration.test.js
│   └── fixtures/
│       ├── users.json
│       ├── products.json
│       └── factories.js

apps/web/
├── __tests__/
│   ├── unit/
│   │   └── components/
│   │       └── FeatureCard.test.tsx
│   ├── integration/
│   │   └── pages/
│   │       └── feature.test.tsx
│   └── fixtures/
│       └── mockData.ts
```

## Jest Configuration

```javascript
// jest.config.js (API)
export default {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "services/**/*.js",
    "!services/**/*.test.js",
    "!services/config/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  testTimeout: 10000,
};
```

```javascript
// vitest.config.ts (Frontend)
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
```

## Unit Tests: Service Layer

### Service Test Template

```javascript
// __tests__/unit/services/productService.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as productService from "../../../services/productService";
import Product from "../../../models/Product";
import { AppError } from "../../../utils/errors";

// Mock the model
vi.mock("../../../models/Product");

describe("ProductService", () => {
  const mockUserId = "507f1f77bcf86cd799439001";
  const mockProduct = {
    _id: "507f1f77bcf86cd799439011",
    userId: mockUserId,
    name: "Test Product",
    description: "Test description",
    price: 99.99,
    category: "electronics",
    stock: 10,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      const mockSave = vi.fn().mockResolvedValue(mockProduct);
      Product.mockImplementation(() => ({
        ...mockProduct,
        save: mockSave,
      }));

      const result = await productService.createProduct({
        userId: mockUserId,
        name: "Test Product",
        price: 99.99,
        category: "electronics",
      });

      expect(result).toEqual(mockProduct);
      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw error if product with same name exists", async () => {
      Product.findOne.mockResolvedValue(mockProduct);

      await expect(
        productService.createProduct({
          userId: mockUserId,
          name: "Test Product",
          price: 99.99,
          category: "electronics",
        })
      ).rejects.toThrow(AppError);
    });

    it("should throw error for invalid price", async () => {
      await expect(
        productService.createProduct({
          userId: mockUserId,
          name: "Test Product",
          price: -10, // Invalid
          category: "electronics",
        })
      ).rejects.toThrow();
    });
  });

  describe("getProductById", () => {
    it("should return product if found", async () => {
      Product.findOne.mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockProduct),
      });

      const result = await productService.getProductById(
        mockProduct._id,
        mockUserId
      );

      expect(result).toEqual(mockProduct);
      expect(Product.findOne).toHaveBeenCalledWith({
        _id: mockProduct._id,
        userId: mockUserId,
        isDeleted: false,
      });
    });

    it("should throw 404 if product not found", async () => {
      Product.findOne.mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      });

      await expect(
        productService.getProductById("invalid-id", mockUserId)
      ).rejects.toThrow(AppError);
    });

    it("should throw 404 if product is soft-deleted", async () => {
      Product.findOne.mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      });

      await expect(
        productService.getProductById(mockProduct._id, mockUserId)
      ).rejects.toThrow("Product not found");
    });
  });

  describe("updateProduct", () => {
    it("should update product with allowed fields", async () => {
      const updatedProduct = { ...mockProduct, name: "Updated Name" };
      const mockProductDoc = {
        ...mockProduct,
        save: vi.fn().mockResolvedValue(updatedProduct),
      };

      Product.findOne.mockResolvedValue(mockProductDoc);

      const result = await productService.updateProduct(
        mockProduct._id,
        mockUserId,
        { name: "Updated Name" }
      );

      expect(result.name).toBe("Updated Name");
      expect(mockProductDoc.save).toHaveBeenCalled();
    });

    it("should not allow updating forbidden fields", async () => {
      const mockProductDoc = {
        ...mockProduct,
        save: vi.fn(),
      };

      Product.findOne.mockResolvedValue(mockProductDoc);

      await productService.updateProduct(mockProduct._id, mockUserId, {
        userId: "different-user", // Should be ignored
      });

      expect(mockProductDoc.userId).toBe(mockUserId);
    });

    it("should throw 404 if product not found", async () => {
      Product.findOne.mockResolvedValue(null);

      await expect(
        productService.updateProduct(mockProduct._id, mockUserId, {})
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteProduct", () => {
    it("should soft-delete product", async () => {
      const mockProductDoc = {
        ...mockProduct,
        isDeleted: false,
        save: vi.fn(),
      };

      Product.findOne.mockResolvedValue(mockProductDoc);

      await productService.deleteProduct(mockProduct._id, mockUserId);

      expect(mockProductDoc.isDeleted).toBe(true);
      expect(mockProductDoc.deletedAt).toBeDefined();
      expect(mockProductDoc.save).toHaveBeenCalled();
    });
  });

  describe("listProducts", () => {
    it("should list products with pagination", async () => {
      const products = [mockProduct, { ...mockProduct, _id: "id2" }];

      Product.find.mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(products),
      });

      Product.countDocuments.mockResolvedValue(2);

      const result = await productService.listProducts(mockUserId, {
        page: 1,
        limit: 20,
      });

      expect(result.products).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.total).toBe(2);
    });

    it("should filter by category", async () => {
      Product.find.mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([mockProduct]),
      });

      Product.countDocuments.mockResolvedValue(1);

      await productService.listProducts(mockUserId, { category: "electronics" });

      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({ category: "electronics" })
      );
    });

    it("should filter by price range", async () => {
      Product.find.mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([mockProduct]),
      });

      Product.countDocuments.mockResolvedValue(1);

      await productService.listProducts(mockUserId, {
        minPrice: 50,
        maxPrice: 150,
      });

      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({
          price: expect.objectContaining({
            $gte: 50,
            $lte: 150,
          }),
        })
      );
    });
  });
});
```

## Unit Tests: Utilities & Helpers

```javascript
// __tests__/unit/utils/errors.test.js
import { describe, it, expect } from "vitest";
import { AppError } from "../../../utils/errors";

describe("AppError", () => {
  it("should create error with message and status code", () => {
    const error = new AppError("Not found", 404);

    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  it("should have default status code 500", () => {
    const error = new AppError("Server error");

    expect(error.statusCode).toBe(500);
  });

  it("should be instanceof Error", () => {
    const error = new AppError("Test error", 400);

    expect(error).toBeInstanceOf(Error);
  });
});
```

## Integration Tests: API Routes

### Route Integration Test Template

```javascript
// __tests__/integration/routes/productRoutes.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../server";
import Product from "../../../models/Product";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

describe("Product Routes Integration", () => {
  let server;
  let testToken;
  let testUserId;
  let productId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI);
    server = app.listen(5001);

    // Create test user
    const testUser = await User.create({
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed",
    });

    testUserId = testUser._id;

    // Generate test token
    testToken = jwt.sign(
      { id: testUserId, email: "test@example.com", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await Product.deleteMany({});
  });

  describe("POST /api/v1/product", () => {
    it("should create product with valid data", async () => {
      const response = await request(server)
        .post("/api/v1/product")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          name: "Test Product",
          description: "Test description",
          price: 99.99,
          category: "electronics",
          stock: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.name).toBe("Test Product");
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(server)
        .post("/api/v1/product")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          name: "T", // Too short
          price: -50, // Invalid
          category: "invalid",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return 401 without auth token", async () => {
      const response = await request(server)
        .post("/api/v1/product")
        .send({
          name: "Test Product",
          price: 99.99,
          category: "electronics",
        });

      expect(response.status).toBe(401);
    });

    it("should return 429 if rate limited", async () => {
      // Send 11 requests (limit is 10/hour)
      const requests = Array.from({ length: 11 }).map(() =>
        request(server)
          .post("/api/v1/product")
          .set("Authorization", `Bearer ${testToken}`)
          .send({
            name: "Test Product",
            price: 99.99,
            category: "electronics",
          })
      );

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];

      expect(lastResponse.status).toBe(429);
    });
  });

  describe("GET /api/v1/product", () => {
    beforeEach(async () => {
      // Create test products
      await Product.create([
        {
          userId: testUserId,
          name: "Product 1",
          price: 50,
          category: "electronics",
        },
        {
          userId: testUserId,
          name: "Product 2",
          price: 150,
          category: "clothing",
        },
        {
          userId: testUserId,
          name: "Product 3",
          price: 300,
          category: "electronics",
        },
      ]);
    });

    it("should list products with pagination", async () => {
      const response = await request(server)
        .get("/api/v1/product?page=1&limit=2")
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(3);
      expect(response.body.pagination.page).toBe(1);
    });

    it("should filter by category", async () => {
      const response = await request(server)
        .get("/api/v1/product?category=electronics")
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((p) => p.category === "electronics")).toBe(
        true
      );
    });

    it("should filter by price range", async () => {
      const response = await request(server)
        .get("/api/v1/product?minPrice=100&maxPrice=250")
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].price).toBe(150);
    });
  });

  describe("GET /api/v1/product/:id", () => {
    beforeEach(async () => {
      const product = await Product.create({
        userId: testUserId,
        name: "Test Product",
        price: 99.99,
        category: "electronics",
      });

      productId = product._id;
    });

    it("should return product by ID", async () => {
      const response = await request(server)
        .get(`/api/v1/product/${productId}`)
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(productId.toString());
    });

    it("should return 404 for non-existent product", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(server)
        .get(`/api/v1/product/${fakeId}`)
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/v1/product/:id", () => {
    beforeEach(async () => {
      const product = await Product.create({
        userId: testUserId,
        name: "Original Name",
        price: 99.99,
        category: "electronics",
      });

      productId = product._id;
    });

    it("should update product", async () => {
      const response = await request(server)
        .patch(`/api/v1/product/${productId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          name: "Updated Name",
          price: 149.99,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe("Updated Name");
      expect(response.body.data.price).toBe(149.99);
    });
  });

  describe("DELETE /api/v1/product/:id", () => {
    beforeEach(async () => {
      const product = await Product.create({
        userId: testUserId,
        name: "Test Product",
        price: 99.99,
        category: "electronics",
      });

      productId = product._id;
    });

    it("should soft-delete product", async () => {
      const response = await request(server)
        .delete(`/api/v1/product/${productId}`)
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);

      // Verify soft delete
      const product = await Product.findOne({
        _id: productId,
        isDeleted: false,
      });

      expect(product).toBeNull();
    });
  });
});
```

## Middleware Tests

```javascript
// __tests__/unit/middleware/auth.test.js
import { describe, it, expect, vi } from "vitest";
import { authenticate, authorize } from "../../../middleware/auth";
import jwt from "jsonwebtoken";
import { AppError } from "../../../utils/errors";

describe("Auth Middleware", () => {
  const mockRequest = (token) => ({
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
    user: undefined,
  });

  const mockResponse = () => ({});
  const mockNext = vi.fn();

  describe("authenticate", () => {
    it("should attach user to request with valid token", () => {
      const token = jwt.sign(
        { id: "123", email: "test@example.com", role: "user" },
        process.env.JWT_SECRET
      );

      const req = mockRequest(token);
      const res = mockResponse();

      authenticate(req, res, mockNext);

      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe("123");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should call next with error for missing token", () => {
      const req = mockRequest(null);
      const res = mockResponse();

      authenticate(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    it("should call next with error for invalid token", () => {
      const req = mockRequest("invalid-token");
      const res = mockResponse();

      authenticate(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("authorize", () => {
    it("should allow authorized roles", () => {
      const req = mockRequest(null);
      req.user = { role: "admin" };
      const res = mockResponse();

      const middleware = authorize("admin", "moderator");
      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it("should deny unauthorized roles", () => {
      const req = mockRequest(null);
      req.user = { role: "user" };
      const res = mockResponse();

      const middleware = authorize("admin", "moderator");
      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
```

## Frontend Component Tests (React/Vitest)

```typescript
// __tests__/unit/components/FeatureCard.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FeatureCard } from "@/components/feature/FeatureCard";

describe("FeatureCard", () => {
  const mockProps = {
    id: "123",
    title: "Feature Title",
    description: "Feature description",
    onSelect: vi.fn(),
  };

  it("should render card with title and description", () => {
    render(<FeatureCard {...mockProps} />);

    expect(screen.getByText("Feature Title")).toBeInTheDocument();
    expect(screen.getByText("Feature description")).toBeInTheDocument();
  });

  it("should call onSelect when clicked", () => {
    render(<FeatureCard {...mockProps} />);

    const card = screen.getByText("Feature Title").closest("div");
    fireEvent.click(card!);

    expect(mockProps.onSelect).toHaveBeenCalledWith("123");
  });

  it("should toggle expanded state on click", () => {
    render(<FeatureCard {...mockProps} />);

    const card = screen.getByText("Feature Title").closest("div");

    // Initially collapsed
    expect(screen.queryByText("Expanded content")).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(card!);
    // Expanded content would be visible

    // Click to collapse
    fireEvent.click(card!);
    // Expanded content hidden
  });

  it("should render with icon if provided", () => {
    const { container } = render(
      <FeatureCard {...mockProps} icon={<span data-testid="icon">Icon</span>} />
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should apply correct styling classes", () => {
    const { container } = render(<FeatureCard {...mockProps} />);

    const card = container.querySelector("div");
    expect(card).toHaveClass("bg-ehb-card");
    expect(card).toHaveClass("border-white/8");
  });
});
```

## STL Formula Test Protection

**CRITICAL: The STL formula has 58 gold-master regression tests.**

```javascript
// __tests__/unit/services/stlService.test.js
// DO NOT MODIFY WITHOUT RUNNING ALL 58 TESTS

import { describe, it, expect } from "vitest";
import * as stlService from "../../../services/stlService";

describe("STLService - PROTECTED (58 gold-master tests)", () => {
  // These 58 tests protect the core STL formula
  // Any change that breaks even one test must be rolled back

  it("test 1: STL L0 base case", () => {
    const result = stlService.calculateSTLLevel({
      verificationScore: 0,
      performanceScore: 0,
      trustScore: 0,
    });

    expect(result).toBe(0);
  });

  it("test 2: STL L1 threshold", () => {
    const result = stlService.calculateSTLLevel({
      verificationScore: 20,
      performanceScore: 20,
      trustScore: 20,
    });

    expect(result).toBe(1);
  });

  // ... 56 more tests protecting the formula ...

  // To run only STL tests:
  // npm run test:stl
});
```

## Test Fixtures & Factories

```javascript
// __tests__/fixtures/factories.js
import { faker } from "@faker-js/faker";

export function createMockUser(overrides = {}) {
  return {
    _id: faker.database.mongodbObjectId(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    passwordHash: "hashed_password",
    createdAt: faker.date.past(),
    ...overrides,
  };
}

export function createMockProduct(overrides = {}) {
  return {
    _id: faker.database.mongodbObjectId(),
    userId: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    category: faker.helpers.arrayElement(["electronics", "clothing", "food"]),
    stock: faker.number.int({ min: 0, max: 1000 }),
    isDeleted: false,
    deletedAt: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

// Usage in tests:
// const user = createMockUser({ email: "custom@example.com" });
// const product = createMockProduct({ userId: user._id });
```

## Setup & Teardown

```javascript
// __tests__/setup.js (for API tests)
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_TEST_URI);
});

afterAll(async () => {
  // Disconnect after all tests
  await mongoose.connection.close();
});

// Global test timeout
jest.setTimeout(10000);
```

```typescript
// vitest.setup.ts (for frontend tests)
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock fetch
global.fetch = vi.fn();
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test -- productService.test.js

# Run in watch mode
npm test -- --watch

# Run STL formula tests (must all pass)
npm run test:stl

# Run integration tests only
npm test -- __tests__/integration

# Run with specific reporter
npm test -- --reporter=verbose
```

## Coverage Thresholds

```json
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    },
    "each": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  }
}
```

## E2E Tests (Playwright)

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

```typescript
// e2e/feature.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Feature Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feature");
  });

  test("should display features list", async ({ page }) => {
    const features = page.locator('[data-testid="feature-card"]');
    await expect(features.first()).toBeVisible();
  });

  test("should create new feature", async ({ page }) => {
    await page.click('button:has-text("Create Feature")');
    await page.fill('input[placeholder="Feature name"]', "New Feature");
    await page.click('button:has-text("Save")');

    await expect(
      page.locator("text=New Feature created successfully")
    ).toBeVisible();
  });
});
```

## CI Integration (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:7
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - run: npm run test -- --coverage

      - run: npm run test:stl

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Checklist Before Committing

- [ ] Unit tests cover 80%+ of functions
- [ ] Integration tests cover major flows
- [ ] Mock external dependencies properly
- [ ] Setup/teardown runs before/after tests
- [ ] Test data using factories not hardcoded
- [ ] Async operations properly awaited
- [ ] Error cases tested
- [ ] Edge cases covered
- [ ] STL formula tests all pass (if modified)
- [ ] Coverage thresholds met
- [ ] Tests run in CI pipeline
- [ ] No flaky tests (consistent results)
- [ ] Test names describe what they test
- [ ] No console.log in tests
- [ ] Commit message: `test(module): description`
