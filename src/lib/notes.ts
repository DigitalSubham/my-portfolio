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
