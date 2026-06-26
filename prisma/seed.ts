import { PrismaClient, RoleName, Difficulty, QuestionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ── Roles ────────────────────────────────────────────────────
  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: { name: RoleName.ADMIN },
  });
  const userRole = await prisma.role.upsert({
    where: { name: RoleName.USER },
    update: {},
    create: { name: RoleName.USER },
  });
  console.log('✅ Roles seeded');

  // ── Admin User ───────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@interviewmaster.dev' },
    update: {},
    create: {
      email: 'admin@interviewmaster.dev',
      name: 'Admin User',
      password: adminPassword,
      roleId: adminRole.id,
    },
  });

  const demoPassword = await bcrypt.hash('Demo@123', 12);
  await prisma.user.upsert({
    where: { email: 'demo@interviewmaster.dev' },
    update: {},
    create: {
      email: 'demo@interviewmaster.dev',
      name: 'Demo User',
      password: demoPassword,
      roleId: userRole.id,
    },
  });
  console.log('✅ Users seeded');

  // ── Technologies ─────────────────────────────────────────────
  const techData = [
    { name: 'JavaScript', slug: 'javascript', description: 'Master JavaScript fundamentals, ES6+, async programming, and browser APIs.', icon: 'js', color: '#F7DF1E', sortOrder: 1 },
    { name: 'TypeScript', slug: 'typescript', description: 'Typed superset of JavaScript for scalable applications.', icon: 'ts', color: '#3178C6', sortOrder: 2 },
    { name: 'React', slug: 'react', description: 'Build interactive UIs with React hooks, state management, and component patterns.', icon: 'react', color: '#61DAFB', sortOrder: 3 },
    { name: 'Node.js', slug: 'nodejs', description: 'Server-side JavaScript runtime for building fast, scalable network applications.', icon: 'nodejs', color: '#339933', sortOrder: 4 },
    { name: 'NestJS', slug: 'nestjs', description: 'Progressive Node.js framework for building efficient server-side applications.', icon: 'nestjs', color: '#E0234E', sortOrder: 5 },
    { name: 'PostgreSQL', slug: 'postgresql', description: 'Advanced open-source relational database system.', icon: 'postgres', color: '#4169E1', sortOrder: 6 },
    { name: 'MongoDB', slug: 'mongodb', description: 'NoSQL document-oriented database for modern applications.', icon: 'mongodb', color: '#47A248', sortOrder: 7 },
    { name: 'Python', slug: 'python', description: 'High-level programming language for web, data science, and automation.', icon: 'python', color: '#3776AB', sortOrder: 8 },
    { name: 'System Design', slug: 'system-design', description: 'Design scalable, reliable, and maintainable large-scale systems.', icon: 'design', color: '#6366F1', sortOrder: 9 },
    { name: 'Docker', slug: 'docker', description: 'Container platform for building, sharing, and running applications.', icon: 'docker', color: '#2496ED', sortOrder: 10 },
  ];

  const technologies: Record<string, any> = {};
  for (const tech of techData) {
    const t = await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: {},
      create: tech,
    });
    technologies[tech.slug] = t;
  }
  console.log('✅ Technologies seeded');

  // ── Topics ───────────────────────────────────────────────────
  const topicsData = [
    // JavaScript Topics
    { name: 'Variables & Data Types', slug: 'variables-data-types', technologySlug: 'javascript', sortOrder: 1 },
    { name: 'Functions & Closures', slug: 'functions-closures', technologySlug: 'javascript', sortOrder: 2 },
    { name: 'Promises & Async/Await', slug: 'promises-async-await', technologySlug: 'javascript', sortOrder: 3 },
    { name: 'ES6+ Features', slug: 'es6-features', technologySlug: 'javascript', sortOrder: 4 },
    { name: 'Prototypes & Classes', slug: 'prototypes-classes', technologySlug: 'javascript', sortOrder: 5 },
    { name: 'Event Loop', slug: 'event-loop', technologySlug: 'javascript', sortOrder: 6 },
    // React Topics
    { name: 'React Hooks', slug: 'react-hooks', technologySlug: 'react', sortOrder: 1 },
    { name: 'Component Patterns', slug: 'component-patterns', technologySlug: 'react', sortOrder: 2 },
    { name: 'State Management', slug: 'state-management', technologySlug: 'react', sortOrder: 3 },
    { name: 'Context API', slug: 'context-api', technologySlug: 'react', sortOrder: 4 },
    { name: 'Performance Optimization', slug: 'performance-optimization', technologySlug: 'react', sortOrder: 5 },
    { name: 'Next.js Basics', slug: 'nextjs-basics', technologySlug: 'react', sortOrder: 6 },
    // Node.js Topics
    { name: 'Modules & NPM', slug: 'modules-npm', technologySlug: 'nodejs', sortOrder: 1 },
    { name: 'File System & Streams', slug: 'file-system-streams', technologySlug: 'nodejs', sortOrder: 2 },
    { name: 'HTTP & Express', slug: 'http-express', technologySlug: 'nodejs', sortOrder: 3 },
    { name: 'Authentication & Security', slug: 'auth-security', technologySlug: 'nodejs', sortOrder: 4 },
    { name: 'Databases & ORM', slug: 'databases-orm', technologySlug: 'nodejs', sortOrder: 5 },
    { name: 'Error Handling', slug: 'error-handling', technologySlug: 'nodejs', sortOrder: 6 },
  ];

  const topics: Record<string, any> = {};
  for (const topic of topicsData) {
    const tech = technologies[topic.technologySlug];
    const t = await prisma.topic.upsert({
      where: { technologyId_slug: { technologyId: tech.id, slug: topic.slug } },
      update: {},
      create: {
        name: topic.name,
        slug: topic.slug,
        technologyId: tech.id,
        sortOrder: topic.sortOrder,
      },
    });
    topics[`${topic.technologySlug}:${topic.slug}`] = t;
  }
  console.log('✅ Topics seeded');

  // ── Questions ────────────────────────────────────────────────

  const questionsData = [
    // ── JavaScript: Variables & Data Types ──────────────────
    {
      text: 'What is the output of `typeof null` in JavaScript?',
      difficulty: Difficulty.BEGINNER,
      technologySlug: 'javascript',
      topicSlug: 'variables-data-types',
      explanation: '`typeof null` returns "object" — this is a well-known JavaScript bug that exists for historical reasons.',
      options: [
        { text: '"object"', isCorrect: true },
        { text: '"null"', isCorrect: false },
        { text: '"undefined"', isCorrect: false },
        { text: '"string"', isCorrect: false },
      ],
    },
    {
      text: 'Which of the following is NOT a primitive data type in JavaScript?',
      difficulty: Difficulty.BEGINNER,
      technologySlug: 'javascript',
      topicSlug: 'variables-data-types',
      explanation: 'Array is not a primitive type — it is an object. Primitives are: string, number, boolean, null, undefined, symbol, and bigint.',
      options: [
        { text: 'Array', isCorrect: true },
        { text: 'String', isCorrect: false },
        { text: 'Symbol', isCorrect: false },
        { text: 'BigInt', isCorrect: false },
      ],
    },
    {
      text: 'What is the difference between `let`, `const`, and `var`?',
      difficulty: Difficulty.INTERMEDIATE,
      technologySlug: 'javascript',
      topicSlug: 'variables-data-types',
      explanation: '`var` is function-scoped and hoisted; `let` and `const` are block-scoped. `const` cannot be reassigned after declaration.',
      options: [
        { text: '`var` is function-scoped, `let`/`const` are block-scoped, `const` cannot be reassigned', isCorrect: true },
        { text: 'All three are identical in behavior', isCorrect: false },
        { text: '`let` and `var` are the same; `const` is block-scoped', isCorrect: false },
        { text: '`const` can be reassigned but not redeclared', isCorrect: false },
      ],
    },
    // ── JavaScript: Functions & Closures ─────────────────────
    {
      text: 'What is a closure in JavaScript?',
      difficulty: Difficulty.INTERMEDIATE,
      technologySlug: 'javascript',
      topicSlug: 'functions-closures',
      explanation: 'A closure is a function that retains access to its outer scope even after the outer function has returned.',
      options: [
        { text: 'A function that has access to its outer scope even after the outer function returns', isCorrect: true },
        { text: 'A function that is immediately invoked', isCorrect: false },
        { text: 'A function declared inside a class', isCorrect: false },
        { text: 'A function with no return value', isCorrect: false },
      ],
    },
    {
      text: 'What does the `this` keyword refer to inside an arrow function?',
      difficulty: Difficulty.INTERMEDIATE,
      technologySlug: 'javascript',
      topicSlug: 'functions-closures',
      explanation: 'Arrow functions do not have their own `this` — they inherit `this` from the enclosing lexical scope.',
      options: [
        { text: 'The enclosing lexical scope\'s `this`', isCorrect: true },
        { text: 'The global object (window/global)', isCorrect: false },
        { text: 'The function itself', isCorrect: false },
        { text: 'undefined', isCorrect: false },
      ],
    },
    // ── JavaScript: Promises & Async ─────────────────────────
    {
      text: 'What is the correct way to handle errors in async/await?',
      difficulty: Difficulty.BEGINNER,
      technologySlug: 'javascript',
      topicSlug: 'promises-async-await',
      explanation: 'Errors in async/await should be handled using try/catch blocks, which is the modern and readable approach.',
      options: [
        { text: 'Use try/catch block around the await expression', isCorrect: true },
        { text: 'Use .catch() after the async function call', isCorrect: false },
        { text: 'Use .then(null, handler) pattern', isCorrect: false },
        { text: 'Errors cannot occur in async/await', isCorrect: false },
      ],
    },
    {
      text: 'What does `Promise.all()` do?',
      difficulty: Difficulty.INTERMEDIATE,
      technologySlug: 'javascript',
      topicSlug: 'promises-async-await',
      explanation: '`Promise.all()` takes an array of promises and returns a single promise that resolves when ALL promises resolve, or rejects if ANY one rejects.',
      options: [
        { text: 'Returns a promise that resolves when all input promises resolve', isCorrect: true },
        { text: 'Returns a promise that resolves when any one promise resolves', isCorrect: false },
        { text: 'Executes promises sequentially', isCorrect: false },
        { text: 'Cancels all promises if one fails', isCorrect: false },
      ],
    },
    // ── React: Hooks ─────────────────────────────────────────
    {
      text: 'What is the purpose of `useEffect` in React?',
      difficulty: Difficulty.BEGINNER,
      technologySlug: 'react',
      topicSlug: 'react-hooks',
      explanation: '`useEffect` is used to perform side effects in function components — such as data fetching, subscriptions, or DOM mutations.',
      options: [
        { text: 'To perform side effects like data fetching or subscriptions', isCorrect: true },
        { text: 'To manage local component state', isCorrect: false },
        { text: 'To memoize expensive computations', isCorrect: false },
        { text: 'To create context providers', isCorrect: false },
      ],
    },
    {
      text: 'When does `useEffect` run with an empty dependency array `[]`?',
      difficulty: Difficulty.BEGINNER,
      technologySlug: 'react',
      topicSlug: 'react-hooks',
      explanation: 'An empty dependency array `[]` means the effect runs only once — after the initial render (similar to componentDidMount).',
      options: [
        { text: 'Only once after the initial render', isCorrect: true },
        { text: 'After every render', isCorrect: false },
        { text: 'Before every render', isCorrect: false },
        { text: 'It never runs', isCorrect: false },
      ],
    },
    {
      text: 'What is the difference between `useMemo` and `useCallback`?',
      difficulty: Difficulty.ADVANCED,
      technologySlug: 'react',
      topicSlug: 'react-hooks',
      explanation: '`useMemo` memoizes the result of a computation (a value), while `useCallback` memoizes a function definition to prevent unnecessary re-creation.',
      options: [
        { text: '`useMemo` memoizes a value, `useCallback` memoizes a function', isCorrect: true },
        { text: 'They are identical in behavior', isCorrect: false },
        { text: '`useCallback` memoizes a value, `useMemo` memoizes a function', isCorrect: false },
        { text: 'Both memoize only primitive values', isCorrect: false },
      ],
    },
    // ── React: State Management ──────────────────────────────
    {
      text: 'Which Redux Toolkit API is used to create a slice of state?',
      difficulty: Difficulty.INTERMEDIATE,
      technologySlug: 'react',
      topicSlug: 'state-management',
      explanation: '`createSlice` from Redux Toolkit generates action creators and action types based on the reducers you provide, simplifying Redux setup.',
      options: [
        { text: 'createSlice', isCorrect: true },
        { text: 'createStore', isCorrect: false },
        { text: 'createReducer', isCorrect: false },
        { text: 'createAction', isCorrect: false },
      ],
    },
    {
      text: 'What is the main advantage of Redux Toolkit over plain Redux?',
      difficulty: Difficulty.INTERMEDIATE,
      technologySlug: 'react',
      topicSlug: 'state-management',
      explanation: 'Redux Toolkit provides good defaults and utilities that simplify Redux code — it includes immer for immutable updates, createSlice, createAsyncThunk, and more.',
      options: [
        { text: 'Simplifies Redux setup with opinionated defaults and utilities', isCorrect: true },
        { text: 'Is faster than plain Redux at runtime', isCorrect: false },
        { text: 'Removes the need for a store', isCorrect: false },
        { text: 'Only works with React 18+', isCorrect: false },
      ],
    },
    // ── Node.js: HTTP & Express ──────────────────────────────
    {
      text: 'What does `app.use(express.json())` do in Express?',
      difficulty: Difficulty.BEGINNER,
      technologySlug: 'nodejs',
      topicSlug: 'http-express',
      explanation: '`express.json()` is built-in middleware that parses incoming requests with JSON payloads, making the data available on `req.body`.',
      options: [
        { text: 'Parses incoming JSON request bodies into req.body', isCorrect: true },
        { text: 'Sends JSON responses automatically', isCorrect: false },
        { text: 'Validates JSON data against a schema', isCorrect: false },
        { text: 'Encrypts request/response bodies', isCorrect: false },
      ],
    },
    {
      text: 'What is middleware in Express.js?',
      difficulty: Difficulty.BEGINNER,
      technologySlug: 'nodejs',
      topicSlug: 'http-express',
      explanation: 'Middleware functions have access to req, res, and next. They execute during the request-response cycle and can modify req/res, end the cycle, or call next().',
      options: [
        { text: 'Functions with access to req, res, and next that execute during the request-response cycle', isCorrect: true },
        { text: 'Route handler functions only', isCorrect: false },
        { text: 'Database connection utilities', isCorrect: false },
        { text: 'Error handling functions only', isCorrect: false },
      ],
    },
    // ── Node.js: Authentication & Security ──────────────────
    {
      text: 'What is a JWT (JSON Web Token)?',
      difficulty: Difficulty.BEGINNER,
      technologySlug: 'nodejs',
      topicSlug: 'auth-security',
      explanation: 'A JWT is a compact, URL-safe token for securely transmitting information between parties as a JSON object. It consists of header, payload, and signature.',
      options: [
        { text: 'A compact token with header, payload, and signature for secure data transmission', isCorrect: true },
        { text: 'A database session storage mechanism', isCorrect: false },
        { text: 'A cookie-based authentication system', isCorrect: false },
        { text: 'An OAuth 2.0 implementation', isCorrect: false },
      ],
    },
    {
      text: 'Why should you use refresh tokens alongside access tokens?',
      difficulty: Difficulty.INTERMEDIATE,
      technologySlug: 'nodejs',
      topicSlug: 'auth-security',
      explanation: 'Short-lived access tokens limit exposure if compromised. Refresh tokens allow obtaining new access tokens without re-authentication, balancing security and UX.',
      options: [
        { text: 'Short-lived access tokens reduce risk; refresh tokens allow seamless re-authentication', isCorrect: true },
        { text: 'Refresh tokens are faster than access tokens', isCorrect: false },
        { text: 'Access tokens can only be used once', isCorrect: false },
        { text: 'To avoid HTTPS requirements', isCorrect: false },
      ],
    },
  ];

  for (const q of questionsData) {
    const tech = technologies[q.technologySlug];
    const topic = topics[`${q.technologySlug}:${q.topicSlug}`];

    const question = await prisma.question.create({
      data: {
        text: q.text,
        difficulty: q.difficulty,
        explanation: q.explanation,
        technologyId: tech.id,
        topicId: topic?.id ?? null,
        options: {
          create: q.options.map((opt, idx) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            sortOrder: idx,
          })),
        },
      },
    });
    console.log(`  ✅ Question: "${question.text.substring(0, 50)}..."`);
  }

  // ── Tests ────────────────────────────────────────────────────
  const jsQuestions = await prisma.question.findMany({
    where: { technologyId: technologies['javascript'].id },
    take: 5,
  });
  const reactQuestions = await prisma.question.findMany({
    where: { technologyId: technologies['react'].id },
    take: 5,
  });
  const nodeQuestions = await prisma.question.findMany({
    where: { technologyId: technologies['nodejs'].id },
    take: 5,
  });

  const testsData = [
    { title: 'JavaScript Fundamentals Test', technologySlug: 'javascript', questions: jsQuestions, duration: 30 },
    { title: 'React Core Concepts Test', technologySlug: 'react', questions: reactQuestions, duration: 25 },
    { title: 'Node.js Basics Test', technologySlug: 'nodejs', questions: nodeQuestions, duration: 20 },
  ];

  for (const t of testsData) {
    await prisma.test.create({
      data: {
        title: t.title,
        technologyId: technologies[t.technologySlug].id,
        durationMinutes: t.duration,
        totalQuestions: t.questions.length,
        testQuestions: {
          create: t.questions.map((q, idx) => ({
            questionId: q.id,
            sortOrder: idx,
          })),
        },
      },
    });
  }
  console.log('✅ Tests seeded');

  console.log('\n🎉 Seed completed successfully!');
  console.log('📧 Admin: admin@interviewmaster.dev / Admin@123');
  console.log('📧 Demo:  demo@interviewmaster.dev / Demo@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
