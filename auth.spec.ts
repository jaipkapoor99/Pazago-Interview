describe("auth configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.NEXTAUTH_SECRET;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws when Google credentials are missing", async () => {
    process.env.NEXTAUTH_SECRET = "secret";

    await expect(import("./auth")).rejects.toThrow(
      "Google OAuth credentials are missing in environment variables."
    );
  });

  it("throws when NEXTAUTH_SECRET is missing", async () => {
    process.env.GOOGLE_CLIENT_ID = "id";
    process.env.GOOGLE_CLIENT_SECRET = "secret";

    await expect(import("./auth")).rejects.toThrow("NEXTAUTH_SECRET is not set.");
  });

  it("exports auth options when environment is configured", async () => {
    process.env.GOOGLE_CLIENT_ID = "id";
    process.env.GOOGLE_CLIENT_SECRET = "secret";
    process.env.NEXTAUTH_SECRET = "next-secret";

    const authModule = await import("./auth");

    expect(authModule.authOptions.providers).toHaveLength(1);
    expect(authModule.authOptions.secret).toBe("next-secret");
  });
});
