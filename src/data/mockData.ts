import type { ReviewResult, ReviewListItem, Severity } from "../api/reviewApi";

export const heroDiffLines = [
  { n: 42, type: "ctx", code: "function getUserOrders(userId) {" },
  { n: 43, type: "ctx", code: "  const query = `SELECT * FROM orders" },
  { n: 44, type: "del", code: "    WHERE user_id = ${userId}`;" },
  { n: 45, type: "add", code: "    WHERE user_id = ?`;" },
  { n: 46, type: "ctx", code: "  return db.execute(query, [userId]);" },
  { n: 47, type: "ctx", code: "}" },
];

export const heroAnnotations = [
  {
    id: "a1",
    line: 44,
    severity: "security" as Severity,
    title: "SQL injection",
    body: "userId is interpolated directly into the query. A malicious input can append OR 1=1 and dump every order in the table.",
  },
  {
    id: "a2",
    line: 45,
    severity: "bug" as Severity,
    title: "Parameterized query",
    body: "Good — the placeholder ? is now bound as a parameter, so the value is never parsed as SQL.",
  },
];

export const heroCode = heroDiffLines.map((l) => l.code).join("\n");

export const mockReviewResult: ReviewResult = {
  id: "rev_8f3a2c",
  createdAt: "2026-08-04T14:22:00Z",
  language: "javascript",
  fileName: "auth.service.ts",
  summary:
    "Authentication service has a SQL injection vulnerability in the login query and stores passwords with a weak hash. Two security issues and one style improvement.",
  score: 42,
  code: `function authenticate(email, password) {
  const query = "SELECT * FROM users WHERE email = '" + email + "'";
  const user = db.query(query).first();

  if (!user) return null;

  const valid = md5(password) === user.password_hash;
  if (!valid) return null;

  return {
    id: user.id,
    token: createToken(user.id),
  };
}

function md5(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}`,
  issues: [
    {
      id: "iss_1",
      severity: "security",
      lineStart: 2,
      lineEnd: 2,
      title: "SQL injection in login query",
      explanation:
        "The email is concatenated directly into the SQL string. An attacker can submit a crafted email like admin@x.com' OR '1'='1 to bypass authentication and log in as any user.",
      beforeCode:
        'const query = "SELECT * FROM users WHERE email = \'" + email + "\'";',
      afterCode:
        'const query = "SELECT * FROM users WHERE email = ?";\nconst user = db.query(query, [email]).first();',
    },
    {
      id: "iss_2",
      severity: "security",
      lineStart: 8,
      lineEnd: 8,
      title: "MD5 is not a password hash",
      explanation:
        "MD5 is a fast, broken hash. An attacker with the database can crack billions of guesses per second on a GPU. Use a slow, salted password hash like bcrypt, scrypt, or Argon2.",
      beforeCode: "const valid = md5(password) === user.password_hash;",
      afterCode:
        "const valid = await bcrypt.compare(password, user.password_hash);",
    },
    {
      id: "iss_3",
      severity: "bug",
      lineStart: 5,
      lineEnd: 5,
      title: "Missing await on async query",
      explanation:
        "db.query returns a Promise. Calling .first() on it before awaiting means user is a Promise object, which is always truthy — so the !user check never fires and the function proceeds with an invalid object.",
      beforeCode: "const user = db.query(query).first();",
      afterCode: "const user = (await db.query(query)).first();",
    },
    {
      id: "iss_4",
      severity: "style",
      lineStart: 14,
      lineEnd: 16,
      title: "Prefer a named constant for the hash algorithm",
      explanation:
        'Hardcoding "md5" as a string makes it easy to miss when auditing. Even if you switch to bcrypt, extract the algorithm choice into a constant so it is grep-able.',
      beforeCode:
        'function md5(input) {\n  return crypto.createHash("md5").update(input).digest("hex");\n}',
      afterCode:
        'const HASH_ALGO = "bcrypt";\n// remove md5 helper entirely once bcrypt is in place',
    },
  ],
};

export const mockHistory: ReviewListItem[] = [
  {
    id: "rev_8f3a2c",
    createdAt: "2026-08-04T14:22:00Z",
    language: "javascript",
    fileName: "auth.service.ts",
    issueCount: 4,
    score: 42,
    summary: "SQL injection and weak password hashing in auth service.",
  },
  {
    id: "rev_2b91d0",
    createdAt: "2026-08-03T09:10:00Z",
    language: "python",
    fileName: "payments.py",
    issueCount: 2,
    score: 71,
    summary:
      "Missing input validation on webhook payload and a float comparison.",
  },
  {
    id: "rev_5e7c44",
    createdAt: "2026-08-01T18:45:00Z",
    language: "typescript",
    fileName: "useCart.ts",
    issueCount: 1,
    score: 88,
    summary: "Stale closure in useEffect dependency array.",
  },
  {
    id: "rev_1a09fe",
    createdAt: "2026-07-28T11:02:00Z",
    language: "go",
    fileName: "main.go",
    issueCount: 0,
    score: 96,
    summary: "Clean implementation. No issues found.",
  },
  {
    id: "rev_9d2f31",
    createdAt: "2026-07-25T16:30:00Z",
    language: "javascript",
    fileName: "upload.handler.js",
    issueCount: 3,
    score: 55,
    summary: "Unrestricted file upload and missing MIME type check.",
  },
  {
    id: "rev_4c8b12",
    createdAt: "2026-07-20T08:15:00Z",
    language: "rust",
    fileName: "parser.rs",
    issueCount: 1,
    score: 90,
    summary: "Potential integer overflow in length calculation.",
  },
];

export const mockDashboardReviews = mockHistory.slice(0, 4);

export const usageStats = {
  reviewsThisMonth: 38,
  issuesFound: 127,
  securityIssues: 19,
  avgScore: 74,
};

export const testimonials = [
  {
    id: "t1",
    quote:
      "Caught a SQL injection in our login flow that had been in production for six months. Paid for itself in one review.",
    name: "Maya Okonkwo",
    role: "Staff Engineer, Lattice",
    snippet: "WHERE email = ' + email",
    severity: "security" as Severity,
  },
  {
    id: "t2",
    quote:
      "The line-anchored comments feel exactly like a PR review. My team actually reads the suggestions instead of ignoring a wall of text.",
    name: "Dev Patel",
    role: "Tech Lead, Mercator",
    snippet: "const user = db.query(query).first();",
    severity: "bug" as Severity,
  },
  {
    id: "t3",
    quote:
      "We run it on every PR before requesting human review. Cuts our review cycle roughly in half.",
    name: "Sara Lindqvist",
    role: "Eng Manager, Fathom",
    snippet: "useEffect(() => {}, [])",
    severity: "style" as Severity,
  },
];
