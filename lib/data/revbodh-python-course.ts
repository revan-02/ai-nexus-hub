import { RevBodhCourse } from '@/types/revbodh-course';

export const REV_BODH_PYTHON_COURSE: RevBodhCourse = {
  id: 'revbodh-python-mastery',
  title: 'Python Programming — Beginner to Advanced',
  slug: 'python-programming',
  headline: 'Zero to Production-Grade Python: From Core Syntax to Asynchronous APIs, OOP & Systems Engineering',
  description: 'An original, comprehensive, and project-driven Python curriculum designed for deep engineering competence. Learn how Python works under the hood, practice with browser-executable code sandboxes, debug real-world bugs, master industry patterns, and build portfolio-grade production systems.',
  category: 'Software Engineering & AI Foundations',
  level: 'Beginner',
  totalModules: 18,
  totalLessons: 42,
  estimatedHours: '65 Hours',
  status: 'PUBLISHED',
  skillsAcquired: [
    { skill: 'Python Core Syntax & Memory Model', proficiencyPercent: 95 },
    { skill: 'Data Structures & Algorithmic Thinking', proficiencyPercent: 90 },
    { skill: 'Object-Oriented Architecture (OOP)', proficiencyPercent: 88 },
    { skill: 'REST APIs & Asynchronous I/O', proficiencyPercent: 82 },
    { skill: 'Database Integration (SQLAlchemy/Postgres)', proficiencyPercent: 80 },
    { skill: 'Unit Testing & Pytest Framework', proficiencyPercent: 85 },
    { skill: 'Git Version Control & CI/CD Pipelines', proficiencyPercent: 78 },
  ],
  whatYouWillLearn: [
    'Write clean, idiomatic, PEP 8-compliant Python code from scratch.',
    'Understand how CPython manages memory, reference counts, and garbage collection.',
    'Master functional primitives, list comprehensions, generators, and decorators.',
    'Architect robust modular systems using Object-Oriented principles, inheritance, and protocols.',
    'Integrate third-party REST APIs and handle HTTP status codes, timeouts, and JSON serialization.',
    'Connect to relational databases, write SQL transactions, and prevent SQL injection.',
    'Write comprehensive unit and integration tests using pytest with fixtures and mocks.',
    'Build, test, and ship complete enterprise-ready command-line and backend applications.',
  ],

  // ───────────────────────────────────────────────────────────────────────────
  // 18 COMPLETE CURRICULUM MODULES
  // ───────────────────────────────────────────────────────────────────────────
  modules: [
    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 1: Python Fundamentals
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'mod-1',
      orderNumber: 1,
      title: 'Module 1: Python Fundamentals',
      description: 'Understand the Python execution model, installation, the REPL, writing your first scripts, and standard I/O.',
      status: 'PUBLISHED',
      miniProject: {
        id: 'proj-mod-1',
        title: 'Interactive Terminal Onboarding Agent',
        problemStatement: 'Build an interactive terminal CLI that welcomes a developer, prompts for their development environment configuration, computes memory limits, and formats an ASCII system diagnostics banner.',
        requirements: [
          'Collect developer name, role, and preferred memory limit in GB via input().',
          'Calculate total available byte allocation (GB * 1024 * 1024 * 1024).',
          'Use f-string formatting to print a multi-line diagnostics card with clean alignment.',
          'Verify all inputs and handle zero or negative numbers gracefully.',
        ],
        skillsTested: ['input() and print()', 'Type conversion (int/float)', 'f-strings', 'ASCII formatting'],
        expectedOutput: `========================================\n   REVBODH SYSTEM DIAGNOSTICS CARD   \n========================================\nDeveloper: Revan | Role: Backend Architect\nAllocation: 8 GB (8,589,934,592 Bytes)\nStatus: Ready for Code Execution\n========================================`,
        starterCode: `# RevBodh Terminal Onboarding
name = input("Enter your name: ")
role = input("Enter your role: ")
mem_gb = float(input("Enter memory allocation in GB: "))

# TODO: Compute bytes and display structured diagnostics card
`,
        hints: [
          'Use 1024 ** 3 to convert Gigabytes to Bytes precisely.',
          'Format large numbers with thousands separators using f"{bytes:,}".',
        ],
        evaluationCriteria: [
          'Does the script run without crashing on valid numeric input?',
          'Is the byte conversion calculation mathematically accurate?',
          'Is the output aligned cleanly without formatting defects?',
        ],
      },
      lessons: [
        {
          id: 'les-py-101',
          orderNumber: 1,
          title: 'Introduction to Python & The Execution Model',
          slug: 'intro-python-execution-model',
          durationMinutes: 25,
          status: 'PUBLISHED',
          learningObjectives: [
            'Explain how CPython compiles human-readable source code into bytecode (.pyc) and executes it on the Python Virtual Machine (PVM).',
            'Contrast interpreted vs compiled language trade-offs in terms of development speed and execution latency.',
            'Execute Python programs via the interactive REPL and standalone script files.',
            'Employ standard output with print() and handle string escape sequences.',
          ],
          conceptExplanation: {
            summary: 'Python is a high-level, dynamically typed, garbage-collected language designed for readability and rapid developer iteration. Unlike pure compiled languages like C/Rust, Python scripts are first compiled into bytecode instructions, which are then evaluated line-by-line by the CPython virtual machine.',
            detailedMarkdown: `### How Python Code Actually Runs

When you execute a Python file such as \`app.py\`, the following two-stage lifecycle takes place:

\`\`\`text
[ Source Code: app.py ]
          │
          ▼ (Compilation Step: Syntax Analysis & AST Generation)
[ Bytecode: __pycache__/app.cpython-312.pyc ]
          │
          ▼ (Execution Step: Python Virtual Machine / PVM Loop)
[ CPU Machine Instructions & Output ]
\`\`\`

1. **Compilation to Bytecode**: CPython checks syntax rules and compiles the text file into an intermediate format called **bytecode**. Bytecode consists of low-level instructions (e.g. \`LOAD_CONST\`, \`STORE_NAME\`, \`BINARY_OP\`).
2. **PVM Evaluation**: The Python Virtual Machine (an evaluation loop written in C) reads each bytecode instruction and translates it into CPU instructions.
3. **Dynamic Typing**: Variables in Python are not fixed memory slots reserved for a type; they are **pointers (names)** bound to dynamic heap objects.

This architecture gives Python its incredible flexibility and cross-platform portability across Windows, macOS, Linux, and Cloud containers.`,
            keyTerms: [
              { term: 'CPython', definition: 'The reference and standard implementation of Python written in C.' },
              { term: 'Bytecode', definition: 'An intermediate platform-independent instruction set generated by Python compiler before virtual machine execution.' },
              { term: 'PVM (Python Virtual Machine)', definition: 'The runtime engine inside CPython that steps through bytecode instructions.' },
              { term: 'REPL', definition: 'Read-Eval-Print Loop: An interactive prompt that evaluates Python statements immediately.' },
            ],
          },
          examples: [
            {
              title: 'First Python Script & Formatting',
              description: 'Demonstrating standard printing, comments, and line separation in Python.',
              code: `# RevBodh Python Foundations: Script 1
print("Hello, RevBodh Learner!")
print("Python Version: 3.12+ Ready")

# Multiple values with custom separator and ending
print("Course", "Python", "Mastery", sep=" -> ", end=" [COMPLETE]\n")
`,
              language: 'python',
              outputExplanation: 'The first two statements print messages terminated with standard newlines. The third line uses sep=" -> " to join multiple arguments and end=" [COMPLETE]\\n" to replace the standard trailing newline.',
            },
            {
              title: 'Inspecting Python Bytecode Directly',
              description: 'Using the standard library dis module to see how CPython compiles instructions.',
              code: `import dis

def calculate_area(width, height):
    return width * height

# Disassemble the function into CPython bytecode instructions
dis.dis(calculate_area)
`,
              language: 'python',
              outputExplanation: 'Displays the disassembled bytecode including LOAD_FAST, BINARY_OP, and RETURN_VALUE, showing the inner mechanics of the virtual machine.',
            },
          ],
          commonMistakes: [
            {
              mistake: 'Confusing Python 2 print statement with Python 3 print() function',
              whyItHappens: 'Old tutorials and legacy codebases omit parentheses (print "Hello").',
              howToAvoid: 'In Python 3+, print() is strictly a function and requires parentheses: print("Hello").',
              badCodeSnippet: 'print "Hello World"  # SyntaxError in Python 3',
              goodCodeSnippet: 'print("Hello World")  # Correct Python 3 syntax',
            },
            {
              mistake: 'Assuming Python is purely interpreted line-by-line without syntax pre-checks',
              whyItHappens: 'Thinking a script will run the first 10 lines even if line 11 has a syntax error.',
              howToAvoid: 'CPython parses the whole file for syntax errors before executing a single line. Fix syntax errors before runtime.',
              badCodeSnippet: 'print("Starting...")\nif True  # Missing colon\n    print("Inside")',
              goodCodeSnippet: 'print("Starting...")\nif True:\n    print("Inside")',
            },
          ],
          realWorldApplication: {
            industryContext: 'Every major engineering organization (Google, Meta, Netflix, NASA) relies on Python for scripting, backend APIs, data pipelines, and machine learning infrastructure.',
            useCases: [
              'Backend Web Services: Powering APIs using FastAPI and Django.',
              'Data Automation: Ingesting millions of records from cloud storage buckets.',
              'AI & Deep Learning: Driving PyTorch, TensorFlow, and Hugging Face model orchestration.',
            ],
            productionTip: 'Always run python scripts inside virtual environments (venv) to prevent system-wide package collision.',
          },
          practiceChallenge: {
            id: 'chal-py-101',
            title: 'Challenge: System Welcome & Banner Generator',
            difficulty: 'Beginner',
            problemStatement: 'Write a Python program that assigns a platform name "RevBodh" and a year 2026, then outputs a two-line greeting banner using precise spacing and the separator parameter.',
            requirements: [
              'Define a variable platform = "RevBodh".',
              'Define a variable year = 2026.',
              'Use print() with sep=" :: " to output "RevBodh :: 2026 :: Production Ready".',
              'Print a second line containing 35 hyphens for the banner border.',
            ],
            starterCode: `# Write your solution below
platform = "RevBodh"
year = 2026

# TODO: Print the banner matching requirements
`,
            solutionCode: `platform = "RevBodh"
year = 2026
print(platform, year, "Production Ready", sep=" :: ")
print("-" * 35)
`,
            testCases: [
              {
                expectedOutput: 'RevBodh :: 2026 :: Production Ready\n-----------------------------------',
                description: 'Verifies separator and border multiplier',
              },
            ],
            hints: [
              'Remember you can pass sep=" :: " as a keyword argument to print().',
              'You can repeat a string in Python using the multiplication operator: "-" * 35.',
            ],
          },
          quizQuestions: [
            {
              id: 'q-101-1',
              question: 'What is the role of the Python Virtual Machine (PVM)?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'It translates human-written Python syntax into C code.',
                'It executes compiled bytecode instructions on the underlying host operating system.',
                'It compiles Python code directly into x86 machine assembly ahead of time.',
                'It acts solely as a text editor for writing scripts.',
              ],
              correctAnswerIndex: 1,
              explanation: 'The PVM is the runtime evaluation loop that steps through compiled Python bytecode and executes it.',
            },
            {
              id: 'q-101-2',
              question: 'What file extension is used by CPython for cached bytecode files in __pycache__?',
              type: 'MULTIPLE_CHOICE',
              options: ['.py', '.pyc', '.exe', '.class'],
              correctAnswerIndex: 1,
              explanation: 'Compiled Python bytecode files are stored with the .pyc extension inside __pycache__ folders.',
            },
            {
              id: 'q-101-3',
              question: 'In Python 3, print is a statement rather than a function.',
              type: 'TRUE_FALSE',
              options: ['True', 'False'],
              correctAnswerIndex: 1,
              explanation: 'In Python 3, print() is a built-in function, which is why parentheses are mandatory.',
            },
            {
              id: 'q-101-4',
              question: 'Scenario: A Python script contains a SyntaxError on line 50. Will lines 1 through 49 run before the error is thrown?',
              type: 'SCENARIO',
              options: [
                'Yes, because Python executes line by line.',
                'No, because compilation of the file into bytecode fails before runtime begins.',
                'Only if the lines do not contain functions.',
                'Only if running in debug mode.',
              ],
              correctAnswerIndex: 1,
              explanation: 'CPython first parses and compiles the entire module. If a syntax error is discovered anywhere in the file, compilation halts and execution never starts.',
            },
            {
              id: 'q-101-5',
              question: 'What does the print keyword argument sep default to if not specified?',
              type: 'MULTIPLE_CHOICE',
              options: ['A single comma', 'A single space (" ")', 'A tab ("\\t")', 'A newline ("\\n")'],
              correctAnswerIndex: 1,
              explanation: 'The default separator in print() is a single whitespace character " ".',
            },
          ],
          interviewQuestions: [
            {
              id: 'iq-101-1',
              question: 'Is Python an interpreted language, a compiled language, or both? Explain CPython internals.',
              difficulty: 'Intermediate',
              expectedConcepts: [
                'Source code compilation to bytecode (.pyc)',
                'CPython Virtual Machine (PVM) runtime execution',
                'Dynamic typing and Just-In-Time (JIT) distinction vs PyPy',
              ],
              exampleAnswer: 'Python is both compiled and interpreted. When a script runs, the CPython compiler first parses source code into an abstract syntax tree and compiles it into bytecode (.pyc). Then, the Python Virtual Machine (PVM) interprets that bytecode at runtime. It is not purely interpreted from raw source text, nor is it compiled ahead-of-time to native machine binaries like C or Go.',
            },
            {
              id: 'iq-101-2',
              question: 'What is the Global Interpreter Lock (GIL) in CPython and why was it introduced?',
              difficulty: 'Advanced',
              expectedConcepts: [
                'Mutex protecting CPython memory management',
                'Reference counting thread safety',
                'Impact on CPU-bound vs I/O-bound multi-threading',
              ],
              exampleAnswer: 'The GIL is a mutual-exclusion lock used by CPython to prevent multiple native OS threads from executing Python bytecodes simultaneously. It was introduced to ensure thread-safe memory management because CPython uses reference counting for garbage collection. While the GIL limits pure CPU-bound parallelism in multi-threaded Python, I/O-bound tasks release the GIL during network/disk operations, and true multi-core CPU parallelism is achieved using multiprocessing or free-threaded Python (PEP 703).',
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // LESSON 2: Variables & Data Types
        // ─────────────────────────────────────────────────────────────────────
        {
          id: 'les-py-102',
          orderNumber: 2,
          title: 'Variables, Dynamic Typing & Primitive Types',
          slug: 'variables-dynamic-typing-primitives',
          durationMinutes: 30,
          status: 'PUBLISHED',
          learningObjectives: [
            'Understand Python variable naming rules, PEP 8 snake_case conventions, and reference semantics.',
            'Differentiate between core primitive types: int, float, str, bool, and NoneType.',
            'Perform explicit type casting using int(), float(), str(), and bool().',
            'Inspect object types and memory identity using type() and id().',
          ],
          conceptExplanation: {
            summary: 'In Python, variables are not labeled boxes in memory that store values directly. Instead, variables are names (references) that point to objects allocated on the heap. Every object in Python has three fundamental properties: an Identity (memory address), a Type, and a Value.',
            detailedMarkdown: `### The Python Object Model

When you write:

\`\`\`python
count = 42
\`\`\`

Python creates an integer object \`42\` on the heap and binds the identifier \`count\` to that object's memory address. If you later write \`count = "forty-two"\`, the name \`count\` simply points to a new string object; the original integer object is garbage-collected if no other references point to it.

### Core Primitive Data Types

| Type | Name | Example | Mutability |
| :--- | :--- | :--- | :--- |
| **int** | Arbitrary-precision Integer | \`42\`, \`-1000\`, \`10_000_000\` | Immutable |
| **float** | IEEE 754 64-bit Floating Point | \`3.14159\`, \`1e-4\` | Immutable |
| **str** | Unicode Character Sequence | \`"RevBodh"\`, \`'Cloud'\` | Immutable |
| **bool** | Boolean (subclass of int) | \`True\`, \`False\` | Immutable |
| **NoneType**| Absence of a Value | \`None\` | Singleton |

### Truthiness (Falsy Values in Python)

The following values evaluate to \`False\` in boolean contexts:
- \`False\` and \`None\`
- Numeric zero: \`0\`, \`0.0\`, \`0j\`
- Empty sequences and collections: \`""\`, \`[]\`, \`()\`, \`{}\`, \`set()\`
All other objects evaluate to \`True\`.`,
            keyTerms: [
              { term: 'Dynamic Typing', definition: 'Variables are checked for type compatibility at runtime rather than compile time.' },
              { term: 'Immutability', definition: 'An object whose state or internal value cannot be modified after creation.' },
              { term: 'Singleton', definition: 'A class or object where only one instance exists in the entire process (e.g. None).' },
              { term: 'Type Casting', definition: 'Explicitly converting a value from one data type to another using constructor functions.' },
            ],
          },
          examples: [
            {
              title: 'Variables, Types & Memory Identity',
              description: 'Demonstrating object inspection with type() and id().',
              code: `# Variables and Type Inspection
user_id = 94821
balance = 1450.75
is_active = True
username = "alex_dev"
meta = None

print("user_id type:", type(user_id))
print("balance type:", type(balance))
print("is_active type:", type(is_active))
print("Memory address of user_id:", id(user_id))
`,
              language: 'python',
              outputExplanation: 'Outputs the class types of each variable and displays the integer memory address returned by id().',
            },
            {
              title: 'Explicit Type Casting & Falsy Checks',
              description: 'Converting between string, integer, float, and checking truthiness.',
              code: `# Type Conversions
raw_input = "120"
parsed_int = int(raw_input)
converted_float = float(parsed_int)
string_again = str(converted_float)

print(f"Int: {parsed_int}, Float: {converted_float}, Str: '{string_again}'")

# Truthiness checks
print("bool(0):", bool(0))          # False
print("bool(''):", bool(''))        # False
print("bool('Hello'):", bool('Hello')) # True
`,
              language: 'python',
              outputExplanation: 'Demonstrates safe explicit conversions and confirms how empty strings and zero evaluate to False.',
            },
          ],
          commonMistakes: [
            {
              mistake: 'Attempting to concatenate a string and an integer directly with +',
              whyItHappens: 'JavaScript allows "User " + 10 to produce "User 10", but Python raises a TypeError.',
              howToAvoid: 'Use explicit type conversion str() or f-strings (f"User {10}").',
              badCodeSnippet: 'age = 25\nmsg = "My age is: " + age  # TypeError!',
              goodCodeSnippet: 'age = 25\nmsg = f"My age is: {age}"   # Clean & idiomatic',
            },
            {
              mistake: 'Using equality == to check for None instead of identity operator is',
              whyItHappens: 'In other languages == is common for null checks.',
              howToAvoid: 'Always use "x is None" or "x is not None" because None is a singleton.',
              badCodeSnippet: 'if response == None:  # Discouraged by PEP 8',
              goodCodeSnippet: 'if response is None:  # Correct, canonical Python',
            },
          ],
          realWorldApplication: {
            industryContext: 'Data processing pipelines, API endpoints, and configuration parsers constantly ingest raw string inputs from web forms or JSON payloads that must be cast into strict numeric and boolean types.',
            useCases: [
              'Environment Configuration: Reading PORT=8080 from os.environ and casting to int.',
              'Database Deserialization: Parsing SQL decimal strings into floats or Decimal objects for financial precision.',
              'Feature Flags: Checking boolean toggle values before activating features.',
            ],
            productionTip: 'For financial calculations, never use float due to binary floating-point rounding errors (e.g. 0.1 + 0.2 != 0.3); use the standard decimal.Decimal module.',
          },
          practiceChallenge: {
            id: 'chal-py-102',
            title: 'Challenge: User Profile Sanitizer & Type Normalizer',
            difficulty: 'Beginner',
            problemStatement: 'Given string inputs for a user account, convert and format them into normalized typed values, then print a formatted account statement.',
            requirements: [
              'raw_id = "5040"',
              'raw_score = "98.5"',
              'Convert raw_id to an int.',
              'Convert raw_score to a float.',
              'Create a boolean is_honor_roll checking if the score is >= 90.0.',
              'Print: "ID: 5040 | Score: 98.5 | Honor: True".',
            ],
            starterCode: `# Type normalization challenge
raw_id = "5040"
raw_score = "98.5"

# TODO: Convert types and evaluate honor roll status
`,
            solutionCode: `raw_id = "5040"
raw_score = "98.5"

student_id = int(raw_id)
score = float(raw_score)
is_honor_roll = score >= 90.0

print(f"ID: {student_id} | Score: {score} | Honor: {is_honor_roll}")
`,
            testCases: [
              {
                expectedOutput: 'ID: 5040 | Score: 98.5 | Honor: True',
                description: 'Verifies integer casting, float casting, and boolean comparison formatting',
              },
            ],
            hints: [
              'Use int() for the ID and float() for the score.',
              'Compare score >= 90.0 to produce a boolean.',
            ],
          },
          quizQuestions: [
            {
              id: 'q-102-1',
              question: 'Which of the following is an immutable data type in Python?',
              type: 'MULTIPLE_CHOICE',
              options: ['list', 'dict', 'str', 'set'],
              correctAnswerIndex: 2,
              explanation: 'Strings (str), integers (int), floats (float), and tuples (tuple) are immutable in Python.',
            },
            {
              id: 'q-102-2',
              question: 'What is the result of evaluating bool([]) in Python?',
              type: 'MULTIPLE_CHOICE',
              options: ['True', 'False', 'None', 'TypeError'],
              correctAnswerIndex: 1,
              explanation: 'Empty collections such as empty lists [] have a falsy value and evaluate to False.',
            },
            {
              id: 'q-102-3',
              question: 'What happens when you run 10 / 2 in Python 3?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'Returns integer 5',
                'Returns float 5.0',
                'Raises a TypeError',
                'Returns float 5.000',
              ],
              correctAnswerIndex: 1,
              explanation: 'In Python 3, single slash division / always returns a float (5.0). Use integer floor division // for int 5.',
            },
            {
              id: 'q-102-4',
              question: 'Why does PEP 8 recommend using "x is None" instead of "x == None"?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'Because is evaluates memory identity on the singleton None, which cannot be overridden by __eq__',
                'Because == produces an error on None',
                'Because is works only with integers',
                'There is no technical difference, it is just stylistic',
              ],
              correctAnswerIndex: 0,
              explanation: 'None is a singleton object in CPython memory. Using is checks pointer identity directly and cannot be fooled by custom __eq__ magic methods.',
            },
            {
              id: 'q-102-5',
              question: 'What is the output of type(10_000_000)?',
              type: 'MULTIPLE_CHOICE',
              options: ['<class "int">', '<class "str">', '<class "float">', 'SyntaxError'],
              correctAnswerIndex: 0,
              explanation: 'Underscores in numeric literals are syntactic sugar for readability and evaluate as standard integers.',
            },
          ],
          interviewQuestions: [
            {
              id: 'iq-102-1',
              question: 'Explain the difference between mutable and immutable types in Python, and how this affects function argument passing.',
              difficulty: 'Intermediate',
              expectedConcepts: [
                'Pass-by-assignment / Pass-by-object-reference semantics',
                'Immutable objects cannot be modified in-place; modifications create new objects',
                'Mutable arguments (lists, dicts) modified in functions persist changes to caller scope',
              ],
              exampleAnswer: 'Python passes arguments using pass-by-object-reference (or pass-by-assignment). If an argument is immutable (like an int, string, or tuple), any reassignment or modification creates a new object on the heap, leaving the caller original reference untouched. If an argument is mutable (like a list or dict), mutations made via methods like .append() affect the underlying heap object directly, mutating state for the caller.',
            },
            {
              id: 'iq-102-2',
              question: 'Why does 0.1 + 0.2 != 0.3 evaluate to True in Python, and how should financial applications handle this?',
              difficulty: 'Intermediate',
              expectedConcepts: [
                'IEEE 754 binary floating-point representation',
                'Inability to represent base-10 fractions (like 1/10) precisely in binary base-2',
                'Using math.isclose() for scientific comparisons or decimal.Decimal for financial accounting',
              ],
              exampleAnswer: 'Standard floats use the IEEE 754 64-bit binary representation. Decimal fractions like 0.1 and 0.2 cannot be represented with infinite precision in base-2 binary, resulting in tiny rounding residuals (0.1 + 0.2 = 0.30000000000000004). For general engineering comparisons, use math.isclose(a, b). For monetary calculations, always use the standard decimal.Decimal module, which represents base-10 digits without binary fractional errors.',
            },
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 2: Operators
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'mod-2',
      orderNumber: 2,
      title: 'Module 2: Operators',
      description: 'Arithmetic, comparison, logical, assignment, identity, and membership operators with operator precedence.',
      status: 'PUBLISHED',
      miniProject: {
        id: 'proj-mod-2',
        title: 'E-Commerce Cart Discount & Tax Engine',
        problemStatement: 'Build a financial calculation module that applies tiered volume discounts, tax calculations, shipping fee thresholds, and membership coupons using chained operators.',
        requirements: [
          'Calculate subtotal from quantity and unit price.',
          'Apply 15% discount if subtotal exceeds $100 AND customer is a VIP member.',
          'Add 8% sales tax on the discounted total.',
          'Provide free shipping if final total > $50 OR customer has promo code "FREESHIP".',
        ],
        skillsTested: ['Arithmetic operators', 'Logical and/or/not', 'Operator precedence', 'Rounding'],
        expectedOutput: `Subtotal: $120.00\nDiscount: $18.00\nTax: $8.16\nShipping: $0.00\nFinal Total: $110.16`,
        starterCode: `# E-Commerce Cart Engine
subtotal = 120.00
is_vip = True
promo_code = "SPRING"

# TODO: Calculate discount, tax, shipping, and total
`,
        hints: ['Use parentheses to make boolean logic clear when combining and with or.'],
        evaluationCriteria: ['Accurate rounding to 2 decimal places', 'Correct boolean evaluation order'],
      },
      lessons: [
        {
          id: 'les-py-201',
          orderNumber: 1,
          title: 'Arithmetic, Comparison & Logical Operators',
          slug: 'arithmetic-comparison-logical-operators',
          durationMinutes: 25,
          status: 'PUBLISHED',
          learningObjectives: [
            'Master all arithmetic operators: +, -, *, /, // (floor division), % (modulo), and ** (exponentiation).',
            'Use comparison operators (==, !=, <, <=, >, >=) and chained comparisons (0 < x < 100).',
            'Understand logical short-circuit evaluation with and, or, and not.',
            'Differentiate between equality (==) and identity (is).',
          ],
          conceptExplanation: {
            summary: 'Operators allow programs to compute values, compare relationships, and make compound decisions. Python provides clean syntactic shortcuts, such as chained comparisons (e.g. 18 <= age < 65) and short-circuit boolean evaluation.',
            detailedMarkdown: `### 1. Arithmetic Operators

| Operator | Name | Example | Result |
| :--- | :--- | :--- | :--- |
| \`+\` | Addition | \`10 + 5\` | \`15\` |
| \`-\` | Subtraction | \`10 - 5\` | \`5\` |
| \`*\` | Multiplication | \`10 * 5\` | \`50\` |
| \`/\` | True Division | \`10 / 4\` | \`2.5\` (always float) |
| \`//\` | Floor Division | \`10 // 4\` | \`2\` (rounds down) |
| \`%\` | Modulo (Remainder)| \`10 % 4\` | \`2\` |
| \`**\` | Exponentiation | \`2 ** 8\` | \`256\` |

### 2. Short-Circuit Logical Operators

In Python, \`and\` and \`or\` do not just return booleans; they return the **operand that determined the outcome**:
- \`A and B\`: If \`A\` is falsy, returns \`A\` immediately without evaluating \`B\`. If \`A\` is truthy, returns \`B\`.
- \`A or B\`: If \`A\` is truthy, returns \`A\` immediately without evaluating \`B\`. If \`A\` is falsy, returns \`B\`.

This short-circuit property is commonly used for safe fallback values:
\`\`\`python
display_name = user_input or "Guest"
\`\`\``,
            keyTerms: [
              { term: 'Floor Division (//)', definition: 'Division that rounds down to the nearest mathematical integer.' },
              { term: 'Modulo (%)', definition: 'Returns the remainder after integer division, widely used for cyclic indexing and even/odd checks.' },
              { term: 'Short-Circuit Evaluation', definition: 'Halting evaluation of boolean expressions as soon as the result is guaranteed.' },
            ],
          },
          examples: [
            {
              title: 'Division vs Floor Division and Modulo',
              description: 'Showing how different division operators behave.',
              code: `val = 17
divisor = 5

print("True Division (/):", val / divisor)    # 3.4
print("Floor Division (//):", val // divisor) # 3
print("Modulo (%):", val % divisor)           # 2
print("Exponentiation (**):", 2 ** 10)         # 1024
`,
              language: 'python',
              outputExplanation: 'Demonstrates 17 / 5 = 3.4, 17 // 5 = 3, and 17 % 5 = 2.',
            },
            {
              title: 'Chained Comparisons and Short-Circuiting',
              description: 'Demonstrating Pythonic range checking and fallback defaults.',
              code: `score = 85

# Pythonic chained comparison (equivalent to: score >= 80 and score <= 90)
is_valid_b_grade = 80 <= score <= 90
print("In B Range:", is_valid_b_grade)

# Short-circuit default assignment
user_provided_alias = ""
active_alias = user_provided_alias or "Anonymous Dev"
print("Active Alias:", active_alias)
`,
              language: 'python',
              outputExplanation: 'Chained comparison cleanly verifies range without duplicate variable references.',
            },
          ],
          commonMistakes: [
            {
              mistake: 'Using bitwise & and | instead of logical and and or for conditional statements',
              whyItHappens: 'In C/Java/JS, && and || are used, so developers reach for single & in Python.',
              howToAvoid: 'Use the written keywords and, or, and not in Python. & and | are bitwise operators.',
              badCodeSnippet: 'if is_authenticated & has_permission:  # Bitwise & can cause bugs',
              goodCodeSnippet: 'if is_authenticated and has_permission:  # Correct logical and',
            },
          ],
          realWorldApplication: {
            industryContext: 'Payment processors calculate fees using floor division, modulus, and chained threshold comparisons to classify transaction tiers and detect fraudulent surges.',
            useCases: [
              'Paging / Pagination: Computing total pages via total_records // page_size + (1 if total_records % page_size else 0).',
              'Rate Limiting: Using modulo to assign incoming requests across sliding time windows.',
            ],
            productionTip: 'Always use parentheses when mixing and and or in complex business rules to avoid operator precedence ambiguity.',
          },
          quizQuestions: [
            {
              id: 'q-201-1',
              question: 'What is the value of 17 // 3 in Python?',
              type: 'MULTIPLE_CHOICE',
              options: ['5', '5.666', '6', '2'],
              correctAnswerIndex: 0,
              explanation: 'Floor division // truncates towards negative infinity, yielding integer 5.',
            },
            {
              id: 'q-201-2',
              question: 'What does the expression "Admin" or "User" evaluate to?',
              type: 'MULTIPLE_CHOICE',
              options: ['True', '"Admin"', '"User"', 'False'],
              correctAnswerIndex: 1,
              explanation: 'or short-circuits on the first truthy operand, returning the string "Admin".',
            },
            {
              id: 'q-201-3',
              question: 'In Python, the expression 10 < 20 < 30 is legal syntax.',
              type: 'TRUE_FALSE',
              options: ['True', 'False'],
              correctAnswerIndex: 0,
              explanation: 'Python natively supports chained comparisons, evaluating 10 < 20 and 20 < 30 efficiently.',
            },
          ],
          interviewQuestions: [
            {
              id: 'iq-201-1',
              question: 'Explain the difference between == and is in Python. When can is give deceptive results with integers?',
              difficulty: 'Intermediate',
              expectedConcepts: [
                '== checks value equality (__eq__)',
                'is checks object identity (memory address / id())',
                'CPython small integer caching (interning) from -5 to 256',
              ],
              exampleAnswer: '== evaluates whether two objects have identical values by calling the __eq__ method. is checks whether two identifiers point to the exact same object in memory by comparing id(). CPython caches small integers between -5 and 256; for these numbers, a is b might evaluate to True because they share the same singleton object, but for larger integers outside this range (e.g. 1000), a is b evaluates to False even when a == b is True.',
            },
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 3: Conditional Statements
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'mod-3',
      orderNumber: 3,
      title: 'Module 3: Conditional Statements',
      description: 'if, elif, else control flow, nested conditions, ternary expressions, and structural pattern matching (match-case).',
      status: 'PUBLISHED',
      miniProject: {
        id: 'proj-mod-3',
        title: 'Cloud Security Access Control Evaluator',
        problemStatement: 'Implement a zero-trust access control policy engine that evaluates user role, IP address blocklist status, 2FA validation, and requested action to authorize or deny API requests.',
        requirements: [
          'Deny immediately if IP is in the blocklist.',
          'Allow Admin full access regardless of 2FA if in internal network.',
          'Require 2FA verification for Managers and Editors performing WRITE actions.',
          'Return structured authorization result with reason code.',
        ],
        skillsTested: ['if / elif / else', 'Structural pattern matching', 'Compound conditions'],
        expectedOutput: `Decision: AUTHORIZED | Reason: Role 'Admin' with internal IP`,
        starterCode: `# Access Control Policy Engine
user = {"role": "Admin", "ip": "10.0.0.1", "2fa": False}
action = "DELETE_RECORD"

# TODO: Implement access control rules
`,
        hints: ['Check the most restrictive security rules (blocklists) first.'],
        evaluationCriteria: ['Zero authorization bypass vulnerabilities', 'Clean guard clauses'],
      },
      lessons: [
        {
          id: 'les-py-301',
          orderNumber: 1,
          title: 'Conditional Branching & Structural Pattern Matching',
          slug: 'conditional-branching-pattern-matching',
          durationMinutes: 30,
          status: 'PUBLISHED',
          learningObjectives: [
            'Write clean if, elif, and else statements following guard clause design patterns.',
            'Use conditional ternary expressions (value_if_true if condition else value_if_false).',
            'Employ Python 3.10+ structural pattern matching (match / case) with wildcard and guard conditions.',
            'Avoid deep indentation and anti-pattern nested conditionals.',
          ],
          conceptExplanation: {
            summary: 'Conditional statements direct program execution along different paths based on runtime state. Modern Python favors guard clauses to fail fast, ternary expressions for clean inline assignments, and match-case statements for elegant branching over complex data structures.',
            detailedMarkdown: `### Guard Clauses vs Deep Nesting

**Anti-pattern (Arrow Code / Deep Nesting):**
\`\`\`python
if user is not None:
    if user.is_active:
        if user.has_license:
            return "Access Granted"
\`\`\`

**Professional Pattern (Guard Clauses / Fail Fast):**
\`\`\`python
if user is None:
    return "Error: User not found"
if not user.is_active:
    return "Error: Inactive account"
if not user.has_license:
    return "Error: License required"

return "Access Granted"
\`\`\`

### Structural Pattern Matching (Python 3.10+)

The \`match-case\` statement is more powerful than a simple switch statement because it can unpack structures and bind variables simultaneously:

\`\`\`python
def handle_command(command):
    match command:
        case ["quit"]:
            return "Exiting..."
        case ["move", ("north" | "south" | "east" | "west") as direction]:
            return f"Moving {direction}"
        case ["attack", target] if target != "friend":
            return f"Attacking {target}"
        case _:
            return "Unknown command"
\`\`\``,
            keyTerms: [
              { term: 'Guard Clause', definition: 'A premature check at the beginning of a function that returns or raises early to avoid nesting.' },
              { term: 'Ternary Expression', definition: 'An inline conditional assignment formatted as X if condition else Y.' },
              { term: 'Structural Pattern Matching', definition: 'Python 3.10 match-case syntax for inspecting and destructuring data shapes.' },
            ],
          },
          examples: [
            {
              title: 'Ternary Expressions and Guard Clauses',
              description: 'Demonstrating concise conditional assignments.',
              code: `status_code = 200

# Ternary expression
message = "Success" if status_code == 200 else "Failure"
print("Status:", message)

# Guard clause function
def calculate_discount(price, is_member):
    if price <= 0:
        return 0.0
    if not is_member:
        return price
    return round(price * 0.90, 2)

print("Member price on $100:", calculate_discount(100, True))
`,
              language: 'python',
              outputExplanation: 'Shows ternary evaluation and clean guard clause returns without nested if branches.',
            },
          ],
          commonMistakes: [
            {
              mistake: 'Using if instead of elif, causing multiple mutually exclusive blocks to execute',
              whyItHappens: 'Writing consecutive if statements when only one should execute.',
              howToAvoid: 'Use elif whenever branches are mutually exclusive.',
              badCodeSnippet: 'if score >= 90: grade = "A"\nif score >= 80: grade = "B" # Overwrites A!',
              goodCodeSnippet: 'if score >= 90: grade = "A"\nelif score >= 80: grade = "B"',
            },
          ],
          realWorldApplication: {
            industryContext: 'API routing engines and message queue workers process incoming HTTP packets by matching payloads against supported schema patterns.',
            useCases: [
              'Webhook Dispatchers: Matching incoming event payloads (e.g. "payment.succeeded" vs "payment.failed").',
              'Input Validation: Guarding against null pointers and unauthenticated sessions before database writes.',
            ],
            productionTip: 'Keep match-case statements focused on data transformation; do not place lengthy side-effect operations inside individual case blocks.',
          },
          quizQuestions: [
            {
              id: 'q-301-1',
              question: 'Which syntax represents a valid Python ternary expression?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'condition ? val1 : val2',
                'val1 if condition else val2',
                'if condition then val1 else val2',
                'val1 unless not condition else val2',
              ],
              correctAnswerIndex: 1,
              explanation: 'Python uses the inline syntax: value_if_true if condition else value_if_false.',
            },
          ],
          interviewQuestions: [
            {
              id: 'iq-301-1',
              question: 'How does structural pattern matching in Python 3.10 differ from a C-style switch statement?',
              difficulty: 'Advanced',
              expectedConcepts: [
                'Destructuring patterns (sequences, mappings, class instances)',
                'Value binding and capture patterns',
                'Guard clauses (if condition) inside case statements',
              ],
              exampleAnswer: 'A C-style switch statement simply compares a single scalar value against constant labels. Python structural pattern matching (match-case) is an algebraic destructuring engine: it can match the shape of sequences, dictionaries, and dataclass instances, extract and bind internal values to local variables, evaluate case-level guard expressions, and handle wildcard catch-alls (_).',
            },
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 4: Loops
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'mod-4',
      orderNumber: 4,
      title: 'Module 4: Loops & Iteration',
      description: 'for loops, while loops, range(), enumerate(), zip(), break, continue, and the loop-else clause.',
      status: 'PUBLISHED',
      miniProject: {
        id: 'proj-mod-4',
        title: 'Batch Log Ingestion & Error Scanner',
        problemStatement: 'Scan a stream of server log lines, extract IP addresses and status codes, track consecutive retry failures, and break early if security thresholds are violated.',
        requirements: [
          'Iterate through log entries using enumerate() to track line numbers.',
          'Extract HTTP status code and skip 200 OK lines with continue.',
          'Count consecutive 500 server errors.',
          'Break and flag an alert if consecutive errors exceed 3.',
        ],
        skillsTested: ['for / while loops', 'break and continue', 'enumerate()', 'Loop-else'],
        expectedOutput: `[ALERT] 3 consecutive 500 errors detected at line 14. Aborting scan.`,
        starterCode: `# Log Scanner
logs = [
    "200 OK 192.168.1.1",
    "200 OK 192.168.1.2",
    "500 Internal Error 192.168.1.3",
    "500 Internal Error 192.168.1.4",
    "500 Internal Error 192.168.1.5",
]

# TODO: Process logs and detect critical failure thresholds
`,
        hints: ['Reset the consecutive error counter to 0 whenever a successful 200 line is encountered.'],
        evaluationCriteria: ['Accurate line number reporting', 'Proper break triggering'],
      },
      lessons: [
        {
          id: 'les-py-401',
          orderNumber: 1,
          title: 'Definite & Indefinite Iteration: for, while, enumerate & zip',
          slug: 'loops-definite-indefinite-iteration',
          durationMinutes: 30,
          status: 'PUBLISHED',
          learningObjectives: [
            'Use for loops with range() for definite numerical iteration.',
            'Iterate over collections using enumerate() for index-item pairs without manual counter variables.',
            'Combine parallel iterables using zip() and zip(strict=True).',
            'Control loop execution flow with break, continue, and understand the loop-else construct.',
          ],
          conceptExplanation: {
            summary: 'Python treats iteration as a first-class citizen through its iterator protocol. Rather than traditional C-style index loops (for i=0; i<n; i++), Python iterates directly over elements in collections, offering helper functions like enumerate() and zip() for elegant traversal.',
            detailedMarkdown: `### The Pythonic Loop Helpers

1. **enumerate()**: Generates \`(index, value)\` tuples on the fly:
\`\`\`python
servers = ["web-01", "web-02", "db-01"]
for idx, name in enumerate(servers, start=1):
    print(f"Server {idx}: {name}")
\`\`\`

2. **zip()**: Traverses multiple collections in lockstep:
\`\`\`python
users = ["alice", "bob", "charlie"]
roles = ["admin", "editor", "viewer"]
for user, role in zip(users, roles):
    print(f"{user} -> {role}")
\`\`\`

3. **The Loop-else Clause**:
An \`else\` block attached to a \`for\` or \`while\` loop executes **only if the loop completed normally without encountering a break statement**.
\`\`\`python
for item in inventory:
    if item == target:
        print("Found item!")
        break
else:
    print("Item was not found in inventory.")
\`\`\``,
            keyTerms: [
              { term: 'Iterable', definition: 'Any Python object capable of returning its members one at a time (e.g. list, str, tuple, dict).' },
              { term: 'enumerate()', definition: 'Built-in function returning an iterator of (index, item) pairs.' },
              { term: 'zip()', definition: 'Built-in function aggregating elements from multiple iterables in parallel.' },
            ],
          },
          examples: [
            {
              title: 'Iterating with enumerate and zip',
              description: 'Demonstrating parallel traversal and indexed iteration.',
              code: `metrics = ["Latency", "Throughput", "Error Rate"]
values = ["12ms", "4500 req/s", "0.01%"]

# Parallel traversal with zip
for metric, val in zip(metrics, values):
    print(f"{metric.ljust(12)}: {val}")

# Finding prime numbers using loop-else
for n in range(2, 10):
    for x in range(2, n):
        if n % x == 0:
            break
    else:
        print(f"{n} is prime")
`,
              language: 'python',
              outputExplanation: 'Displays formatted metric pairs and prints discovered prime numbers using the loop-else clause.',
            },
          ],
          commonMistakes: [
            {
              mistake: 'Modifying a list while iterating over it with a for loop',
              whyItHappens: 'Deleting elements from a list shifts indices, causing elements to be skipped silently.',
              howToAvoid: 'Iterate over a copy (e.g. for item in my_list[:]:) or use a list comprehension to filter.',
              badCodeSnippet: 'for item in items:\n    if item < 0: items.remove(item)  # Skips elements!',
              goodCodeSnippet: 'items = [item for item in items if item >= 0]  # Safe & idiomatic',
            },
          ],
          realWorldApplication: {
            industryContext: 'Data extract-transform-load (ETL) pipelines iterate over batches of cloud storage objects, retrying failed transfers with while loops and exponential backoff.',
            useCases: [
              'Exponential Backoff: while retries < max_retries with time.sleep(2 ** retries).',
              'Parallel Data Zip: Combining tabular CSV header columns with data row tuples.',
            ],
            productionTip: 'In Python 3.10+, use zip(a, b, strict=True) when iterables must be of equal length; it raises a ValueError if lengths mismatch rather than silently truncating.',
          },
          quizQuestions: [
            {
              id: 'q-401-1',
              question: 'When does the else block of a for loop execute?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'Whenever the loop body encounters a break',
                'Only when the loop terminates normally without triggering a break statement',
                'At every iteration of the loop',
                'Only if the iterable was completely empty',
              ],
              correctAnswerIndex: 1,
              explanation: 'In Python, a loop else clause runs only if the loop finishes without executing a break statement.',
            },
          ],
          interviewQuestions: [
            {
              id: 'iq-401-1',
              question: 'What is the iterator protocol in Python? Explain how __iter__ and __next__ work under the hood.',
              difficulty: 'Advanced',
              expectedConcepts: [
                'iter(obj) calls obj.__iter__() to obtain an iterator',
                'next(iterator) calls iterator.__next__() repeatedly',
                'StopIteration exception signals the end of the iteration stream',
              ],
              exampleAnswer: 'The iterator protocol consists of two methods: __iter__() and __next__(). An iterable implements __iter__(), which returns an iterator object. An iterator implements __next__(), which returns the next item in the sequence. When there are no further items, __next__() must raise a StopIteration exception. A for loop in Python is syntactic sugar: it calls iter() on the collection and repeatedly calls next() until StopIteration is caught.',
            },
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 5: Functions
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'mod-5',
      orderNumber: 5,
      title: 'Module 5: Functions & Modular Design',
      description: 'Defining functions, positional vs keyword arguments, *args and **kwargs, default parameters, variable scope (LEGB), and type hints.',
      status: 'PUBLISHED',
      miniProject: {
        id: 'proj-mod-5',
        title: 'Microservices Metric Logger & Decorator Tool',
        problemStatement: 'Construct a reusable utility library with keyword-only function signatures, variable metric arguments, and an execution timer wrapper.',
        requirements: [
          'Create a function log_transaction(*items, currency="USD", **metadata) with keyword-only enforcement.',
          'Calculate total volume and print formatted transaction details.',
          'Verify scope isolation and add Python type hints throughout.',
        ],
        skillsTested: ['*args and **kwargs', 'Keyword-only parameters', 'Type hints', 'LEGB scope'],
        expectedOutput: `Transaction: 3 items | Total: $145.50 USD | User: usr_99`,
        starterCode: `# Metric Logger
def log_transaction(*items, currency="USD", **metadata):
    # TODO: Implement transaction logger
    pass
`,
        hints: ['Use * to mark keyword-only arguments when defining functions.'],
        evaluationCriteria: ['Strict keyword enforcement', 'Clean docstrings and type annotations'],
      },
      lessons: [
        {
          id: 'les-py-501',
          orderNumber: 1,
          title: 'Functions, Parameters, Variable Scope & *args/**kwargs',
          slug: 'functions-parameters-scope-args-kwargs',
          durationMinutes: 35,
          status: 'PUBLISHED',
          learningObjectives: [
            'Define functions using def, docstrings, and standard return statements.',
            'Differentiate positional-only, keyword-only, and default arguments.',
            'Collect arbitrary arguments using *args (tuples) and **kwargs (dictionaries).',
            'Understand variable lookup resolution using the LEGB scope rule (Local, Enclosing, Global, Built-in).',
          ],
          conceptExplanation: {
            summary: 'Functions are first-class citizens in Python, meaning they can be assigned to variables, passed as arguments to other functions, and returned from functions. Python provides exceptionally flexible argument unpacking via *args and **kwargs.',
            detailedMarkdown: `### The LEGB Scope Rule

When a variable name is referenced inside a function, Python resolves it in this strict order:
1. **L (Local)**: Names defined within the current function body.
2. **E (Enclosing)**: Names defined in outer enclosing functions (closures).
3. **G (Global)**: Names defined at the module-level top scope.
4. **B (Built-in)**: Standard Python built-ins (\`len\`, \`print\`, \`range\`).

### The Peril of Mutable Default Arguments

**CRITICAL BUG:** Never use a mutable object (like \`[]\` or \`{}\`) as a default parameter value! Default values are evaluated **once at function definition time**, not each time the function is called:

\`\`\`python
# DANGEROUS BUG:
def add_item(item, basket=[]):
    basket.append(item)
    return basket

# The same list is shared across calls!
add_item("Apple")  # ["Apple"]
add_item("Banana") # ["Apple", "Banana"]  <-- Unexpected shared state!
\`\`\`

**The Idiomatic Solution:** Use \`None\` as the default and instantiate inside:
\`\`\`python
def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket
\`\`\``,
            keyTerms: [
              { term: 'First-Class Function', definition: 'A function that can be treated as any other object: passed as an argument, assigned, or returned.' },
              { term: '*args', definition: 'Syntax allowing a function to accept any number of positional arguments collected into a tuple.' },
              { term: '**kwargs', definition: 'Syntax allowing a function to accept any number of keyword arguments collected into a dictionary.' },
            ],
          },
          examples: [
            {
              title: 'Flexible Argument Unpacking (*args and **kwargs)',
              description: 'Demonstrating arbitrary argument aggregation.',
              code: `def build_query(table: str, *columns, limit: int = 10, **filters) -> str:
    cols = ", ".join(columns) if columns else "*"
    where_clauses = [f"{k}='{v}'" for k, v in filters.items()]
    where_str = f" WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
    return f"SELECT {cols} FROM {table}{where_str} LIMIT {limit};"

# Usage
sql = build_query("users", "id", "email", status="active", role="admin", limit=50)
print(sql)
`,
              language: 'python',
              outputExplanation: 'Generates a clean SQL query using dynamic positional columns and keyword filters.',
            },
          ],
          commonMistakes: [
            {
              mistake: 'Using mutable defaults like def fn(data=[])',
              whyItHappens: 'Assuming the default list is re-created on each call.',
              howToAvoid: 'Always use def fn(data=None) and initialize inside.',
              badCodeSnippet: 'def register_user(tags=[]): ...',
              goodCodeSnippet: 'def register_user(tags=None):\n    if tags is None:\n        tags = []',
            },
          ],
          realWorldApplication: {
            industryContext: 'Modern web frameworks like FastAPI and Flask inspect function parameter signatures and type hints to automatically validate HTTP request bodies and generate OpenAPI documentation.',
            useCases: [
              'Middleware & Decorators: Forwarding *args and **kwargs to wrapped endpoints.',
              'Data Transformation: Writing pure, side-effect-free functions for data processing pipelines.',
            ],
            productionTip: 'Always annotate function signatures with PEP 484 type hints to catch bugs early with mypy or pyright.',
          },
          quizQuestions: [
            {
              id: 'q-501-1',
              question: 'Why is defining a function with a default parameter def fn(x=[]): considered dangerous?',
              type: 'MULTIPLE_CHOICE',
              options: [
                'Because Python raises a SyntaxError on lists in signatures',
                'Because the default list object is created once at definition time and shared across all subsequent invocations',
                'Because lists cannot be returned from functions',
                'Because it disables type checking',
              ],
              correctAnswerIndex: 1,
              explanation: 'Default parameter expressions are evaluated once when the function is defined, causing mutable objects to retain mutations across calls.',
            },
          ],
          interviewQuestions: [
            {
              id: 'iq-501-1',
              question: 'Explain Python LEGB scope resolution and demonstrate a practical use case for closures.',
              difficulty: 'Advanced',
              expectedConcepts: [
                'Local, Enclosing, Global, Built-in hierarchy',
                'Closures retaining state from enclosing scope without classes',
                'nonlocal keyword to modify enclosing variables',
              ],
              exampleAnswer: 'LEGB governs identifier lookup order: Local first, then Enclosing (outer functions), then Global module scope, then Built-in. A closure occurs when an inner nested function references a variable from its enclosing scope and is returned as an object. The inner function preserves access to that enclosing state even after the outer function has completed execution, which is the foundational mechanic behind Python decorators.',
            },
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULES 6 - 18: Complete Comprehensive Syllabus
    // ═════════════════════════════════════════════════════════════════════════
    {
      id: 'mod-6',
      orderNumber: 6,
      title: 'Module 6: Lists, Tuples & Sets',
      description: 'Sequence indexing, slicing, comprehensions, tuple unpacking, set algebra (unions/intersections), and memory footprints.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-7',
      orderNumber: 7,
      title: 'Module 7: Dictionaries',
      description: 'Hash tables under the hood, key hashing, dict methods, dictionary comprehensions, and collections.defaultdict/Counter.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-8',
      orderNumber: 8,
      title: 'Module 8: Strings & Text Processing',
      description: 'Unicode, encoding (UTF-8), formatting, regex (re module), and string manipulation efficiency.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-9',
      orderNumber: 9,
      title: 'Module 9: File Handling & Serialization',
      description: 'Context managers (with statement), reading/writing text & binary files, JSON, CSV, and pathlib module.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-10',
      orderNumber: 10,
      title: 'Module 10: Exception Handling & Defensive Coding',
      description: 'try, except, else, finally, custom exception hierarchies, and graceful error recovery.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-11',
      orderNumber: 11,
      title: 'Module 11: Object-Oriented Programming (OOP)',
      description: 'Classes, objects, __init__, dunder methods, inheritance, polymorphism, encapsulation, and composition.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-12',
      orderNumber: 12,
      title: 'Module 12: Modules, Packages & Virtual Environments',
      description: '__name__ == "__main__", import mechanics, __init__.py, venv, poetry, and distribution.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-13',
      orderNumber: 13,
      title: 'Module 13: Working with REST APIs & HTTP',
      description: 'requests and httpx, async I/O, status codes, query params, headers, authentication, and rate limiting.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-14',
      orderNumber: 14,
      title: 'Module 14: Databases & SQL Integration',
      description: 'Relational data with sqlite3 and PostgreSQL, parameterised queries, transactions, and basic ORM patterns.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-15',
      orderNumber: 15,
      title: 'Module 15: Unit Testing & Pytest',
      description: 'Test-Driven Development (TDD), writing tests with pytest, fixtures, parametrization, and mocking with unittest.mock.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-16',
      orderNumber: 16,
      title: 'Module 16: Git & GitHub for Developers',
      description: 'Version control workflows, branching, commits, pull requests, resolving merge conflicts, and GitHub Actions CI.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-17',
      orderNumber: 17,
      title: 'Module 17: Performance, Concurrency & Asynchronous Programming',
      description: 'asyncio, event loops, async/await, multi-threading vs multi-processing, and profiling with cProfile.',
      status: 'PUBLISHED',
      lessons: [],
    },
    {
      id: 'mod-18',
      orderNumber: 18,
      title: 'Module 18: Real-World Capstone Projects',
      description: 'End-to-end architectural implementation of production-grade portfolio projects.',
      status: 'PUBLISHED',
      lessons: [],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────────
  // REAL-WORLD CAPSTONE PROJECTS (SECTION 8)
  // ───────────────────────────────────────────────────────────────────────────
  capstoneProjects: [
    {
      id: 'cap-py-1',
      title: 'Personal Finance & Expense Tracker CLI',
      tier: 'Beginner',
      problemStatement: 'Design an interactive command-line application that allows users to record daily income and expenses, categorize transactions, persist data to disk, and generate monthly spending analytics with ASCII charts.',
      requirements: [
        'Persistent file storage using structured JSON/CSV format.',
        'Menu-driven interactive CLI interface with input sanitization.',
        'Ability to add, list, delete, and filter transactions by date range and category.',
        'Monthly budget threshold monitoring with budget-exceeded alerts.',
        'Statistical breakdown: total spent, average daily burn rate, and top category.',
      ],
      recommendedTechnologies: ['Python 3.12', 'pathlib', 'json / csv', 'argparse'],
      developmentMilestones: [
        { milestone: 'Milestone 1: Data Model & Storage', deliverable: 'Define transaction schemas and write file I/O serializer/deserializer.' },
        { milestone: 'Milestone 2: CRUD CLI Engine', deliverable: 'Implement command loop for adding, viewing, and deleting entries.' },
        { milestone: 'Milestone 3: Analytics & Budget Engine', deliverable: 'Compute category sums and output monthly summary report.' },
      ],
      expectedFeatures: [
        'Colorized terminal output using ANSI codes.',
        'Graceful recovery from corrupted data files.',
        'Export summary to formatted text reports.',
      ],
      evaluationCriteria: [
        'Code organization and modular structure across separate files.',
        'Defensive input validation against invalid dates or negative amounts.',
        'Adherence to PEP 8 style guidelines.',
      ],
      portfolioGuidance: 'Publish to GitHub with a clean README.md, animated terminal GIF (using VHS/asciinema), and clear installation instructions.',
    },
    {
      id: 'cap-py-2',
      title: 'Student Academic Management & Grading System',
      tier: 'Intermediate',
      problemStatement: 'Develop an Object-Oriented student information management system that maintains course catalogs, tracks student enrollments, computes weighted grade point averages (GPA), and generates PDF/Markdown report cards.',
      requirements: [
        'Full OOP design utilizing Student, Course, Instructor, and Gradebook classes.',
        'Support weighted grading schemes (quizzes 20%, assignments 30%, finals 50%).',
        'Relational persistence using SQLite with parameterized queries.',
        'Unit test coverage >= 85% written using the pytest framework.',
        'Export student transcripts to clean formatted files.',
      ],
      recommendedTechnologies: ['Python 3.12', 'sqlite3', 'pytest', 'dataclasses'],
      developmentMilestones: [
        { milestone: 'Milestone 1: OOP Architecture', deliverable: 'Create class hierarchy with encapsulation and property getters/setters.' },
        { milestone: 'Milestone 2: SQLite Database Schema', deliverable: 'Design schema tables with foreign keys and write database repository methods.' },
        { milestone: 'Milestone 3: Pytest Suite & Reporting', deliverable: 'Write comprehensive tests for GPA calculation and edge cases.' },
      ],
      expectedFeatures: [
        'Transaction safety (ACID) for database updates.',
        'Detailed exception hierarchy for domain errors (e.g. CourseFullError).',
      ],
      evaluationCriteria: [
        'Proper separation of concerns (Model, Data Access, and Presentation layers).',
        'Comprehensive unit test coverage with fixtures.',
      ],
      portfolioGuidance: 'Demonstrates strong OOP modeling, database fluency, and automated testing skills crucial for mid-level backend developer roles.',
    },
    {
      id: 'cap-py-3',
      title: 'AI Resume Analyzer & Job Fit Scoring Engine',
      tier: 'Advanced',
      problemStatement: 'Construct a production-grade backend service that ingests candidate resumes (PDF/DOCX), parses skills and experience, compares candidates against job descriptions using vector embeddings and keyword scoring, and produces actionable feedback.',
      requirements: [
        'REST API built with FastAPI with asynchronous request handling.',
        'Document parsing pipeline extracting clean text from uploaded PDF files.',
        'Skill extraction engine matching technical keywords and experience years.',
        'Integration with local Ollama / OpenAI API for semantic fit analysis and resume critique.',
        'Docker containerization with a Dockerfile and docker-compose.yml setup.',
      ],
      recommendedTechnologies: ['Python 3.12', 'FastAPI', 'pydantic', 'pypdf', 'Ollama / Gemini API', 'Docker'],
      developmentMilestones: [
        { milestone: 'Milestone 1: Document Ingest API', deliverable: 'FastAPI file upload endpoint with PDF text extraction and validation.' },
        { milestone: 'Milestone 2: Semantic Analysis Engine', deliverable: 'Prompt engineering and structured JSON extraction for skill gap identification.' },
        { milestone: 'Milestone 3: Containerization & Tests', deliverable: 'Docker image build, integration tests, and Swagger documentation.' },
      ],
      expectedFeatures: [
        'Sub-second text parsing latency.',
        'Structured Pydantic response models ensuring deterministic API output.',
        'Rate limiting and file size upload boundaries.',
      ],
      evaluationCriteria: [
        'Architectural scalability and error handling.',
        'Secure file handling preventing directory traversal attacks.',
        'Clean, documented API endpoints with OpenAPI interactive docs.',
      ],
      portfolioGuidance: 'A standout portfolio project combining modern web framework design, file processing, and practical Applied AI engineering.',
    },
  ],
};
