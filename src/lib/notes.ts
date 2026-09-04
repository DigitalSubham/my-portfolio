export type Note = {
  slug: string;
  title: string;
  /** Shown as the H1 on the note page. Can be longer than the SEO title. */
  heading: string;
  /** 150-160 chars, used for meta description and OG description. */
  description: string;
  /** One-line summary used on cards. */
  excerpt: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  track: string;
  topicCount: number;
  /** Anchor list rendered as the in-page table of contents. */
  outline: { id: string; label: string }[];
  /** Rendered as FAQPage structured data on the note page. */
  faqs: { question: string; answer: string }[];
};

export const notes: Note[] = [
  {
    slug: "javascript-language-fundamentals",
    title: "JavaScript Language Fundamentals Explained Simply",
    heading: "JavaScript language fundamentals, in plain English",
    description:
      "var vs let vs const, hoisting, the temporal dead zone, coercion, shallow copies and more - 14 JavaScript fundamentals explained simply with diagrams and interview answers.",
    excerpt:
      "The 14 fundamentals every JavaScript interview starts with, explained in plain English with diagrams, gotchas and the answer to say out loud.",
    keywords: [
      "javascript fundamentals",
      "temporal dead zone",
      "javascript hoisting explained",
      "var let const difference",
      "shallow copy vs deep copy javascript",
      "javascript interview questions",
      "why 0.1 + 0.2 is not 0.3",
      "nullish coalescing vs or operator",
    ],
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    readingMinutes: 24,
    track: "JavaScript",
    topicCount: 14,
    outline: [
      { id: "var-let-and-const", label: "var, let and const" },
      { id: "hoisting", label: "Hoisting" },
      { id: "primitives-and-objects", label: "Primitives and objects" },
      { id: "equality-truthy-and-falsy", label: "Equality, truthy and falsy" },
      { id: "typeof-and-instanceof", label: "typeof and instanceof" },
      { id: "destructuring", label: "Destructuring" },
      { id: "spread-rest-and-copying", label: "Spread, rest and copying" },
      { id: "optional-chaining-and-nullish-coalescing", label: "Optional chaining and ??" },
      { id: "template-literals", label: "Template literals" },
      { id: "strict-mode", label: "Strict mode" },
      { id: "floating-point-precision", label: "Floating point precision" },
      { id: "json-stringify-and-parse", label: "JSON stringify and parse" },
      { id: "symbols", label: "Symbols" },
      { id: "labels-and-switch", label: "Labels and switch" },
      { id: "ten-questions", label: "Ten questions" },
      { id: "six-exercises", label: "Six exercises" },
    ],
    faqs: [
      {
        question: "What is the temporal dead zone in JavaScript?",
        answer:
          "The temporal dead zone is the period between the start of a block and the line that declares a let or const variable. The variable already exists during this period but cannot be read, so accessing it throws a ReferenceError. It exists so that const can never be observed holding undefined.",
      },
      {
        question: "What is the difference between var, let and const?",
        answer:
          "var is function scoped and starts as undefined, so reading it early returns undefined. let and const are block scoped and stay locked until their declaration line runs, so reading them early throws a ReferenceError. const also prevents reassigning the variable, though you can still change the contents of an object it points to.",
      },
      {
        question: "Why does 0.1 + 0.2 not equal 0.3 in JavaScript?",
        answer:
          "Every JavaScript number is stored as a 64-bit binary floating point value. Numbers like 0.1 cannot be represented exactly in base 2, so the closest storable value is used. Adding two of those approximations makes the error visible, giving 0.30000000000000004. Compare floats with a tolerance such as Number.EPSILON, and store money as whole paise or cents instead.",
      },
      {
        question: "What is the difference between ?? and || in JavaScript?",
        answer:
          "The || operator falls back whenever the left side is any falsy value, including 0, an empty string and false. The ?? operator falls back only when the left side is null or undefined. For user settings and API data, ?? is usually correct because it preserves a deliberate 0 or empty string.",
      },
      {
        question: "Is JavaScript pass by value or pass by reference?",
        answer:
          "JavaScript is always pass by value. For objects, the value being copied is the reference itself. That is why changing a property inside a function is visible to the caller, while reassigning the whole parameter is not.",
      },
    ],
  },
  {
    slug: "javascript-scope-closures-and-this",
    title: "JavaScript Closures and this, Explained Simply",
    heading: "Scope, closures and this",
    description:
      "Closures, the scope chain, the four rules of this, arrow functions, call apply bind, currying and memoize - explained in plain English with diagrams and interview answers.",
    excerpt:
      "The ten topics that open more interview rounds than anything else in JavaScript, including the loop and setTimeout puzzle and writing your own bind.",
    keywords: [
      "javascript closures explained",
      "what is a closure in javascript",
      "this keyword javascript",
      "call apply bind difference",
      "arrow function vs regular function",
      "javascript scope chain",
      "setTimeout loop var let",
      "currying in javascript",
      "implement bind javascript",
    ],
    publishedAt: "2026-09-01",
    updatedAt: "2026-09-01",
    readingMinutes: 22,
    track: "JavaScript",
    topicCount: 10,
    outline: [
      { id: "lexical-scope-and-the-scope-chain", label: "Lexical scope and the scope chain" },
      { id: "closures", label: "Closures" },
      { id: "the-loop-and-settimeout-puzzle", label: "The loop and setTimeout puzzle" },
      { id: "this", label: "this" },
      { id: "call-apply-and-bind", label: "call, apply and bind" },
      { id: "arrow-functions-vs-regular-functions", label: "Arrow vs regular functions" },
      { id: "closures-you-actually-write", label: "Closures you actually write" },
      { id: "currying-and-partial-application", label: "Currying" },
      { id: "iife-and-the-module-pattern", label: "IIFE and the module pattern" },
      { id: "composition-and-pipe", label: "Composition and pipe" },
      { id: "ten-questions", label: "Ten questions" },
      { id: "six-exercises", label: "Six exercises" },
    ],
    faqs: [
      {
        question: "What is a closure in JavaScript?",
        answer:
          "A closure is a function bundled with the scope it was created in. When an inner function references a variable from an outer function, that variable survives after the outer function returns, because the inner function still holds a reference to it. Each call to the outer function creates a fresh, independent set of those variables.",
      },
      {
        question: "Why does a for loop with var and setTimeout print 3 3 3?",
        answer:
          "var is function scoped, so the whole loop shares one variable. All three callbacks close over that same variable, and by the time the timers fire the loop has finished with the value 3. Using let creates a fresh binding on every iteration, giving 0 1 2. You can also fix it with an IIFE or by passing the value as a third argument to setTimeout.",
      },
      {
        question: "How is this determined in JavaScript?",
        answer:
          "In a normal function it is decided at call time by four rules in priority order: new binding, explicit binding with call apply or bind, implicit binding from the object before the dot, and the default binding which is undefined in strict mode. Arrow functions do not follow these rules at all - they take this lexically from where they were written.",
      },
      {
        question: "What is the difference between call, apply and bind?",
        answer:
          "call and apply both invoke the function immediately with a chosen this, the only difference being that call takes arguments individually and apply takes them as an array. bind does not invoke anything - it returns a new function with this permanently fixed, optionally with some arguments pre-filled.",
      },
      {
        question: "When should you not use an arrow function?",
        answer:
          "Do not use an arrow function as an object method or a prototype method that needs this, because it will capture the surrounding scope instead of the instance. Do not use one as a constructor, since arrows cannot be called with new. Arrows are the right choice for callbacks inside a method, where you want to keep the enclosing this.",
      },
    ],
  },
  {
    slug: "javascript-prototypes-and-classes",
    title: "JavaScript Prototypes and Classes, Explained Simply",
    heading: "Objects, prototypes and classes",
    description:
      "The prototype chain, what new really does, ES6 classes, property descriptors, freeze, mixins and Proxy - explained in plain English with a diagram and interview answers.",
    excerpt:
      "JavaScript has no classes underneath, only objects pointing at objects. The ten topics that explain what class actually does.",
    keywords: [
      "javascript prototype chain",
      "prototype vs __proto__",
      "what does new do in javascript",
      "es6 classes vs prototypes",
      "prototypal inheritance javascript",
      "object create javascript",
      "object freeze seal",
      "javascript proxy reflect",
    ],
    publishedAt: "2026-09-01",
    updatedAt: "2026-09-01",
    readingMinutes: 20,
    track: "JavaScript",
    topicCount: 10,
    outline: [
      { id: "the-prototype-chain", label: "The prototype chain" },
      { id: "new-and-how-to-implement-it", label: "new, and implementing it" },
      { id: "classes", label: "Classes" },
      { id: "prototypal-versus-classical-inheritance", label: "Prototypal vs classical" },
      { id: "objectcreate-and-friends", label: "Object.create and friends" },
      { id: "property-descriptors", label: "Property descriptors" },
      { id: "freeze-seal-and-preventextensions", label: "freeze, seal, preventExtensions" },
      { id: "getters-setters-and-the-object-statics", label: "Getters and Object statics" },
      { id: "mixins-and-composition", label: "Mixins and composition" },
      { id: "proxy-and-reflect", label: "Proxy and Reflect" },
      { id: "ten-questions", label: "Ten questions" },
      { id: "six-exercises", label: "Six exercises" },
    ],
    faqs: [
      {
        question: "What is the difference between prototype and __proto__?",
        answer:
          "prototype is a property that exists only on functions. It holds the object that will become the prototype of instances created with new. __proto__ exists on every object and is the actual link to that object's prototype. So for an instance rex of Dog, rex.__proto__ equals Dog.prototype. Use Object.getPrototypeOf rather than __proto__ in real code.",
      },
      {
        question: "What does the new keyword actually do in JavaScript?",
        answer:
          "It performs four steps: creates an empty object, sets that object's prototype to the constructor function's prototype property, calls the constructor with this bound to the new object, and returns the object. If the constructor explicitly returns an object, that object is returned instead; a returned primitive is ignored.",
      },
      {
        question: "Are ES6 classes just syntactic sugar over prototypes?",
        answer:
          "Mostly, but not entirely. Methods still live on the prototype and inheritance is still a prototype link. However class bodies are always in strict mode, the binding sits in the temporal dead zone, calling a class without new throws, methods are non-enumerable, and private fields marked with a hash are enforced by the engine rather than being a naming convention.",
      },
      {
        question: "Why use Object.create(null) instead of an object literal?",
        answer:
          "Object.create(null) creates an object with no prototype, so it inherits nothing - no toString, no constructor, no __proto__. That matters for lookup tables keyed by user input, where a key named __proto__ or constructor would otherwise collide with inherited members. This collision is the basis of prototype pollution bugs. A Map is often the better choice.",
      },
      {
        question: "What is the difference between Object.freeze, seal and preventExtensions?",
        answer:
          "preventExtensions blocks adding new properties. seal also blocks deleting existing ones. freeze also blocks changing their values. All three are only one level deep, so a frozen object's nested objects remain fully mutable unless you freeze them recursively.",
      },
    ],
  },
  {
    slug: "javascript-async-and-the-event-loop",
    title: "JavaScript Async and the Event Loop, Explained Simply",
    heading: "Asynchronous JavaScript and the event loop",
    description:
      "Promises, async await, the event loop, microtasks vs macrotasks, debounce, race conditions and writing your own Promise - explained in plain English with a diagram.",
    excerpt:
      "The largest and most-tested group in JavaScript. Seventeen topics from callbacks to the event loop, with the output-prediction puzzles interviewers actually use.",
    keywords: [
      "javascript event loop explained",
      "microtask vs macrotask",
      "promise vs async await",
      "promise all vs allsettled",
      "implement promise from scratch",
      "debounce vs throttle",
      "javascript race condition fetch",
      "abortcontroller javascript",
      "node event loop phases",
    ],
    publishedAt: "2026-09-01",
    updatedAt: "2026-09-01",
    readingMinutes: 28,
    track: "JavaScript",
    topicCount: 17,
    outline: [
      { id: "synchronous-and-asynchronous", label: "Sync and async" },
      { id: "callbacks", label: "Callbacks" },
      { id: "promises", label: "Promises" },
      { id: "all-allsettled-race-and-any", label: "all, allSettled, race, any" },
      { id: "async-and-await", label: "async and await" },
      { id: "sequential-versus-parallel-awaits", label: "Sequential vs parallel awaits" },
      { id: "the-event-loop", label: "The event loop" },
      { id: "microtasks-versus-macrotasks", label: "Microtasks vs macrotasks" },
      { id: "nodes-event-loop-phases", label: "Node's event loop phases" },
      { id: "debounce-and-throttle", label: "Debounce and throttle" },
      { id: "implement-your-own-promise", label: "Implement your own Promise" },
      { id: "implement-promiseall", label: "Implement Promise.all" },
      { id: "retry-with-exponential-backoff", label: "Retry with backoff" },
      { id: "limiting-concurrency", label: "Limiting concurrency" },
      { id: "promisify-abortcontroller-and-timers", label: "promisify and AbortController" },
      { id: "race-conditions", label: "Race conditions" },
      { id: "async-iterators-and-generators", label: "Async iterators" },
      { id: "ten-questions", label: "Ten questions" },
      { id: "seven-exercises", label: "Seven exercises" },
    ],
    faqs: [
      {
        question: "What is the difference between microtasks and macrotasks?",
        answer:
          "Microtasks include promise callbacks, await continuations and queueMicrotask. Macrotasks include setTimeout, setInterval, I/O callbacks and DOM events. The event loop empties the entire microtask queue before taking a single macrotask, which is why a resolved promise callback always runs before a setTimeout of zero.",
      },
      {
        question: "Why is awaiting several API calls one after another slow?",
        answer:
          "Each await pauses until that call finishes, so three independent 100ms calls take 300ms in total. If none of them needs the previous result, start them together with Promise.all and the total becomes the slowest single call, roughly 100ms. Only await sequentially when the next call genuinely depends on the previous one.",
      },
      {
        question: "When should you use Promise.allSettled instead of Promise.all?",
        answer:
          "Use Promise.all when the result is worthless unless every call succeeds, because it rejects as soon as any one fails. Use Promise.allSettled when partial success is acceptable, since it waits for every promise to settle and reports each outcome separately rather than discarding successful results because of one failure.",
      },
      {
        question: "What is the difference between debounce and throttle?",
        answer:
          "Debounce waits until activity stops and then runs once, which suits search-as-you-type where you only want a request after the user pauses. Throttle runs at most once per interval regardless of how much activity there is, which suits scroll and resize handlers where you need regular updates during the activity itself.",
      },
      {
        question: "How do you fix a race condition when fetching data?",
        answer:
          "A race condition happens when a slower earlier request resolves after a faster later one and overwrites it. Fix it either by tracking a request id and discarding any response that is not the latest, or by aborting the previous request with an AbortController before starting a new one. In React, do this in the effect cleanup function.",
      },
    ],
  },
  {
    slug: "javascript-arrays-and-collections",
    title: "JavaScript Arrays, Map, Set and Iterators Explained",
    heading: "Arrays, iteration and collections",
    description:
      "Which array methods mutate, rebuilding map filter and reduce, sort gotchas, Map vs object, WeakMap, the iterator protocol and generators - in plain English.",
    excerpt:
      "Eleven topics on arrays and collections, including rebuilding map, filter and reduce from scratch and why sort breaks on numbers.",
    keywords: [
      "javascript array methods",
      "which array methods mutate",
      "implement map filter reduce javascript",
      "javascript sort comparator",
      "map vs object javascript",
      "weakmap javascript",
      "javascript iterator protocol",
      "javascript generators explained",
    ],
    publishedAt: "2026-09-04",
    updatedAt: "2026-09-04",
    readingMinutes: 22,
    track: "JavaScript",
    topicCount: 11,
    outline: [
      { id: "every-array-method-and-what-it-gives-back", label: "Every array method" },
      { id: "rebuild-map-filter-reduce-and-foreach", label: "Rebuild map, filter, reduce" },
      { id: "reduce-properly", label: "reduce, properly" },
      { id: "sort", label: "sort" },
      { id: "map-and-set", label: "Map and Set" },
      { id: "weakmap-and-weakset", label: "WeakMap and WeakSet" },
      { id: "flat-flatmap-and-your-own-flatten", label: "flat, flatMap, flatten" },
      { id: "array-likes-and-iterables", label: "Array-likes and iterables" },
      { id: "the-iterator-protocol", label: "The iterator protocol" },
      { id: "generators", label: "Generators" },
      { id: "typed-arrays-briefly", label: "Typed arrays" },
      { id: "ten-questions", label: "Ten questions" },
      { id: "six-exercises", label: "Six exercises" },
    ],
    faqs: [
      {
        question: "Which JavaScript array methods change the original array?",
        answer:
          "push, pop, shift, unshift, splice, sort, reverse and fill all mutate. sort and reverse are the dangerous pair because they look like they return a new array, but they return the same array already reordered. Use toSorted and toReversed, or spread the array first.",
      },
      {
        question: "Why does [10, 9, 1].sort() return [1, 10, 9]?",
        answer:
          "With no comparator, sort converts every element to a string and sorts alphabetically, so \"1\" comes before \"10\" which comes before \"9\". Pass a comparator such as (a, b) => a - b for numbers. Never return a boolean from a comparator, because it collapses three possible outcomes into two.",
      },
      {
        question: "When should you use a Map instead of a plain object in JavaScript?",
        answer:
          "Use a Map when keys are not strings, when entries are added and removed frequently, when you need a reliable size, when strict insertion order matters, or when you want no inherited keys. Plain objects remain better for fixed, string-keyed, JSON-shaped data, because Maps do not survive JSON.stringify.",
      },
      {
        question: "What is the difference between a WeakMap and a Map?",
        answer:
          "A WeakMap holds its keys weakly, so an entry does not prevent its key object from being garbage collected. When the key becomes unreachable the entry disappears. That is why a WeakMap cannot be iterated and has no size. It is the right tool for metadata or caches keyed by DOM nodes.",
      },
      {
        question: "What makes an object work with for...of in JavaScript?",
        answer:
          "A method at the key Symbol.iterator that returns an iterator - an object with a next method returning a value and done pair. The loop calls next repeatedly and stops when done is true. A generator method is the shortest way to provide it, since generators already implement the protocol.",
      },
    ],
  },
  {
    slug: "javascript-modules-and-tooling",
    title: "CommonJS vs ES Modules, npm and Bundlers Explained",
    heading: "Modules, tooling and the ecosystem",
    description:
      "CommonJS vs ES modules, live bindings, npm ci vs install, semver, bundlers, tree shaking, Babel and source maps - the tooling questions interviews actually ask.",
    excerpt:
      "The group people skip and then get caught by. What actually happens when you run npm install, and why your package broke after an upgrade.",
    keywords: [
      "commonjs vs es modules",
      "npm ci vs npm install",
      "semver caret vs tilde",
      "tree shaking javascript",
      "vite vs webpack",
      "peer dependencies explained",
      "transpiling vs polyfilling",
      "package.json exports field",
    ],
    publishedAt: "2026-09-04",
    updatedAt: "2026-09-04",
    readingMinutes: 19,
    track: "JavaScript",
    topicCount: 10,
    outline: [
      { id: "commonjs-and-es-modules", label: "CommonJS and ES modules" },
      { id: "dynamic-import-and-top-level-await", label: "Dynamic import" },
      { id: "npm-lockfiles-and-the-ecosystem", label: "npm and lockfiles" },
      { id: "semver", label: "Semver" },
      { id: "bundlers", label: "Bundlers" },
      { id: "tree-shaking", label: "Tree shaking" },
      { id: "babel-transpiling-and-polyfilling", label: "Babel and polyfills" },
      { id: "source-maps", label: "Source maps" },
      { id: "monorepos", label: "Monorepos" },
      { id: "publishing-a-package", label: "Publishing a package" },
      { id: "ten-questions", label: "Ten questions" },
      { id: "six-exercises", label: "Six exercises" },
    ],
    faqs: [
      {
        question: "What is the difference between CommonJS and ES modules?",
        answer:
          "CommonJS resolves imports while the program runs, so a require can be conditional. ES modules are parsed and linked before any code executes. Everything else follows from that: ESM enables tree shaking and top-level await, and gives live bindings instead of copies, while requiring imports to sit at the top level.",
      },
      {
        question: "What is the difference between npm install and npm ci?",
        answer:
          "npm install re-resolves version ranges and may update the lockfile. npm ci deletes node_modules, installs exactly what the lockfile specifies, and fails if the lockfile and package.json disagree. Always use npm ci in CI and Docker builds, because it is faster and guarantees an identical dependency tree.",
      },
      {
        question: "What does the caret in ^1.2.3 allow?",
        answer:
          "It allows any patch and minor update below the next major version, so anything from 1.2.3 up to but excluding 2.0.0. Below version 1.0.0 the rule tightens: ^0.2.3 only allows patch updates, because in 0.x the minor number is treated as potentially breaking.",
      },
      {
        question: "Why does tree shaking sometimes not remove unused code?",
        answer:
          "Three common reasons: the module uses CommonJS, so the bundler cannot statically determine what is used; the module has side effects at import time, so it must be kept; or a barrel file re-exports everything and pulls in more than you imported. The sideEffects field in package.json tells bundlers when it is safe to be aggressive.",
      },
      {
        question: "What is the difference between transpiling and polyfilling?",
        answer:
          "Transpiling rewrites new syntax into older syntax, such as turning optional chaining into a conditional. Polyfilling adds missing runtime functions such as Array.prototype.flat. They are not interchangeable, because syntax cannot be polyfilled - old parsers fail before execution - and a missing method cannot be transpiled.",
      },
    ],
  },
  {
    slug: "javascript-memory-and-gotchas",
    title: "JavaScript Memory Leaks, Deep Clone and Event Delegation",
    heading: "Memory, gotchas and puzzles",
    description:
      "Garbage collection, the four real memory leaks, deep clone and deep equal from scratch, event delegation, regex traps and time zones - explained with diagrams.",
    excerpt:
      "The topics that separate someone who writes JavaScript from someone who debugs it, including the output-prediction puzzles screening rounds open with.",
    keywords: [
      "javascript memory leak",
      "garbage collection javascript",
      "deep clone javascript",
      "deep equal javascript",
      "event delegation javascript",
      "event bubbling vs capturing",
      "javascript output prediction questions",
      "javascript date timezone best practice",
    ],
    publishedAt: "2026-09-04",
    updatedAt: "2026-09-04",
    readingMinutes: 24,
    track: "JavaScript",
    topicCount: 9,
    outline: [
      { id: "garbage-collection", label: "Garbage collection" },
      { id: "the-four-real-memory-leaks", label: "The four real memory leaks" },
      { id: "deep-clone", label: "Deep clone" },
      { id: "deep-equal", label: "Deep equal" },
      { id: "events-bubbling-capturing-and-delegation", label: "Events and delegation" },
      { id: "output-prediction-puzzles", label: "Output-prediction puzzles" },
      { id: "regex", label: "Regex" },
      { id: "dates-and-time-zones", label: "Dates and time zones" },
      { id: "intl", label: "Intl" },
      { id: "ten-questions", label: "Ten questions" },
      { id: "six-exercises", label: "Six exercises" },
    ],
    faqs: [
      {
        question: "How does garbage collection work in JavaScript?",
        answer:
          "The engine marks everything reachable from the roots - the global object and the call stack - and sweeps away the rest. Because it is based on reachability rather than reference counting, two objects that reference each other are collected fine as long as nothing else points at them. V8 adds a generational split, scanning a small young space often and an old space rarely.",
      },
      {
        question: "What are the most common memory leaks in a JavaScript app?",
        answer:
          "Accidental globals from undeclared assignment, timers that are never cleared, detached DOM nodes still held by a cache or closure, and event listeners that are never removed. All four are the same problem: something still holds a reference you forgot about.",
      },
      {
        question: "Why does removeEventListener sometimes not remove the listener?",
        answer:
          "It matches by function identity. Passing a fresh arrow function, or calling bind again, creates a different function object that never matches the one that was added. Store the handler reference once and use that same reference for both adding and removing.",
      },
      {
        question: "What is event delegation and why use it?",
        answer:
          "Attaching one listener to a parent element and using event.target.closest to work out which child was involved, relying on the fact that events bubble upward. It uses one listener instead of many, automatically covers elements added later, and leaves nothing to clean up when children are removed.",
      },
      {
        question: "How should dates and time zones be handled in a web application?",
        answer:
          "Store UTC in the database, using timestamptz in Postgres, and transmit ISO 8601 strings. Convert to the user's zone only when displaying and back to UTC on input. Distinguish a calendar date such as a birthday from an instant such as a meeting start, and never add 24 hours in milliseconds to mean tomorrow, because daylight saving breaks it.",
      },
    ],
  },
  {
    slug: "typescript-for-interviews",
    title: "TypeScript Explained Simply for Interviews",
    heading: "TypeScript, from any to conditional types",
    description:
      "any vs unknown, structural typing, discriminated unions, generics, utility types, narrowing, exhaustiveness, and typing React and Express - in plain English.",
    excerpt:
      "Fifteen topics covering what interviewers actually ask about TypeScript, including why a typed API response guarantees nothing at runtime.",
    keywords: [
      "typescript any vs unknown",
      "typescript interface vs type",
      "discriminated union typescript",
      "typescript generics explained",
      "typescript utility types",
      "type guard typescript",
      "exhaustiveness check never typescript",
      "typing express request user",
      "typescript enums vs const object",
    ],
    publishedAt: "2026-09-04",
    updatedAt: "2026-09-04",
    readingMinutes: 26,
    track: "TypeScript",
    topicCount: 15,
    outline: [
      { id: "why-typescript-and-structural-typing", label: "Structural typing" },
      { id: "any-unknown-never-and-void", label: "any, unknown, never, void" },
      { id: "interfaces-and-type-aliases", label: "Interfaces vs type aliases" },
      { id: "unions-intersections-and-discriminated-unions", label: "Discriminated unions" },
      { id: "generics", label: "Generics" },
      { id: "utility-types", label: "Utility types" },
      { id: "narrowing-type-guards-and-predicates", label: "Narrowing and type guards" },
      { id: "exhaustiveness-with-never", label: "Exhaustiveness with never" },
      { id: "typing-react", label: "Typing React" },
      { id: "typing-express", label: "Typing Express" },
      { id: "keyof-typeof-indexed-access-and-as-const", label: "keyof, typeof, as const" },
      { id: "enums-versus-const-objects", label: "Enums vs const objects" },
      { id: "tsconfig-the-settings-that-matter", label: "tsconfig settings" },
      { id: "conditional-and-mapped-types", label: "Conditional and mapped types" },
      { id: "declaration-merging-and-dts-files", label: "Declaration merging" },
      { id: "ten-questions", label: "Ten questions" },
      { id: "seven-exercises", label: "Seven exercises" },
    ],
    faqs: [
      {
        question: "What is the difference between any and unknown in TypeScript?",
        answer:
          "any disables type checking for that value, so every operation is permitted and mistakes surface only at runtime. unknown accepts any value but permits nothing until you narrow it with a check. Use unknown for API responses, JSON.parse output and caught errors, because it forces the check you should be doing anyway.",
      },
      {
        question: "What is structural typing in TypeScript?",
        answer:
          "TypeScript compares the shape of types rather than their names, so two differently named types with identical properties are interchangeable. Java and C# are nominal, requiring the declared name to match. TypeScript is structural because JavaScript objects are simply collections of properties. For nominal behaviour you add a brand property.",
      },
      {
        question: "When must you use a type alias instead of an interface?",
        answer:
          "Only a type alias can express unions, tuples, primitives, mapped types and conditional types. Only an interface supports declaration merging, which is how you extend types you do not own such as Window or Express.Request. For plain object shapes either works, so consistency matters more than the choice.",
      },
      {
        question: "How do you make TypeScript fail when a new union member is added?",
        answer:
          "Handle every case in a switch, then in the default branch assign the value to a variable typed never. If every case is covered the value is never and it compiles. Add a new union member and the assignment becomes a compile error pointing straight at the switch that needs updating.",
      },
      {
        question: "Does typing an API response as User guarantee the data is a User?",
        answer:
          "No. Types are erased at compile time and there is no TypeScript at runtime, so annotating a fetch result is an assertion you made rather than a check the compiler performs. At any boundary - API, form, config or database - validate at runtime with a schema library such as Zod and infer the type from the schema, so the type and the check share one definition.",
      },
    ],
  },
];

export const notesBySlug = new Map(notes.map((note) => [note.slug, note]));

export function getNote(slug: string): Note | undefined {
  return notesBySlug.get(slug);
}

export function getAdjacentNotes(slug: string) {
  const index = notes.findIndex((note) => note.slug === slug);
  return {
    previous: index > 0 ? notes[index - 1] : null,
    next: index >= 0 && index < notes.length - 1 ? notes[index + 1] : null,
  };
}
