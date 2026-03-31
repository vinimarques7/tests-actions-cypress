# 🚀 DevOps Journey: Full Cycle CI/CD with AI Mentoring

> **Author:** Vinícius Marques
> **Repository:** `devops-cicd-journey`
> **Goal:** Technical and evolutionary record of a journey from zero to full CI/CD, using AI as a learning mentor.

---

> 📄 [Portuguese version available here](./README.pt-br.md)

---

## 📖 About this repository

This repository is not just a technical project — it is a **journey documented in code**. Every file, pipeline, and configuration represents a concept learned and applied in practice, starting from absolute zero in automation and evolving into a monitored, containerized application with automated deployment.

The project was born from a challenge proposed by the tech lead: **migrate legacy test pipelines from Python to TypeScript and then replace them with Cypress**. From there, the repository naturally evolved to cover the complete CI/CD cycle.

### 🧠 Methodology: AI Mentoring

This project was guided by the **AI Mentoring** technique. I used [Claude.AI](https://claude.ai) to simulate a real internship mentoring environment, focusing on **80% practice and 20% theory**.

The difference between this approach and simply asking an AI for code lies in four pillars:

1. **Decomposition before execution** — Before writing any code, I described the expected logic to the AI. The goal was to validate architectural reasoning before moving on to syntactic implementation.
2. **Pattern Assimilation** — Focus on understanding patterns of algorithms and tools (design patterns and workflows). The study was binary: theory to understand the "why" and practice to master the "how".
3. **Flow Inversion (Student Explanation)** — Upon receiving code or a concept, I would always return an explanation in my own words. The AI acted as a mentor, correcting conceptual deviations and confirming my understanding before I transcribed the code into VS Code.
4. **Predictability and Continuous Validation** — At every `git push`, I had full control over the pipeline's behavior. There was no "magic" in CI/CD — just a clear understanding of each configured trigger, job, and step. Always checking the Actions tab to verify the pipeline result.

> **The philosophy of this repository is simple: learn by doing. Every resolved error, every pipeline passing on GitHub Actions, and every concept understood is recorded in the commit history.**

---

## 📚 Learning Prerequisites

Before following this tutorial, I strongly recommend completing these free interactive courses from GitHub Skills — they provide the necessary foundation to understand what will be done here:

- 👉 [Hello GitHub Actions](https://github.com/skills/hello-github-actions) — introduction to workflow structure
- 👉 [Test with Actions](https://github.com/skills/test-with-actions) — how to run automated tests in CI

Each course takes between 20 and 40 minutes and you learn directly in a real repository.

---

## 🛠️ Tech Stack

| Technology | Role in the Flow | Why it was chosen |
|---|---|---|
| **WSL 2 (Ubuntu)** | Operating System | Windows is the office; Linux is the factory. WSL 2 runs a native Linux Kernel, ensuring full parity with the production server and eliminating the "works on my machine" error. |
| **Node.js & Yarn** | Runtime & Package Manager | Node runs TypeScript on the server. Yarn is faster and more deterministic than npm for managing dependencies. |
| **TypeScript** | Language | Adds static typing to JavaScript. In the `soma.ts` function challenge, TypeScript prevents logic errors before execution — summing a string with a number is impossible. |
| **Python & pytest** | Starting Point (Legacy) | The initial phase of the challenge. Learning CI in Python first proves that automation logic is language-agnostic. |
| **Docker Engine** | Containerization | We isolated the `monitor-app` in a container. If the target server has Docker, it doesn't need Node or Yarn installed — the container transports all dependencies and the minimal OS. |
| **GitHub Actions** | CI/CD Orchestration | Our "assembly line". Automates the full cycle: Push → Test → Build → Image Publish → Deploy. |
| **Cypress** | E2E Testing | Unlike unit tests, Cypress simulates the real user journey. It is the last line of defense before production. |
| **GHCR** | Image Registry | The Docker image "warehouse". Integrated with GitHub, it uses the same authentication token and lives in the same place as the code. |
| **Railway** | Cloud Deploy | PaaS platform that manages all infrastructure. You deliver the image and it takes care of the rest. Ideal for learning. |

---

## 📂 Folder Structure

```
.
├── .github/
│   └── workflows/              # The Brain: YAML Automations
│       ├── python-ci.yml       # Phase 1: Legacy — learning YAML syntax
│       ├── typescript-ci.yml   # Phase 2: Stack migration and type logic
│       ├── cypress-ci.yml      # Phase 3: Quality and E2E tests
│       └── docker-ci.yml       # Phase 4: Continuous Delivery — Build & Push to GHCR
├── cypress/
│   └── e2e/
│       └── soma.cy.ts          # E2E tests with Cypress
├── soma.py                     # Legacy function in Python
├── test_soma.py                # Unit tests in Python
├── soma.ts                     # Function migrated to TypeScript
├── soma.test.ts                # Unit tests in TypeScript (no framework)
├── monitor.ts                  # Main application — URL monitor
├── Dockerfile                  # The container "recipe"
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and project scripts
└── .gitignore                  # Files ignored by Git
```

---

## Let's get started!!

### Step 1: Creating the Repository

Create a repository on GitHub with a name of your choice. Then clone and open it in VSCode:

```bash
git clone https://github.com/YOUR_USER/REPOSITORY_NAME
cd REPOSITORY_NAME
code .
```

> The `code .` command opens VSCode connected to WSL automatically.

---

### Step 2: Understanding YAML Before Writing

Before creating any workflow, it is essential to understand the configuration language GitHub Actions uses.

**YAML is based on indentation hierarchy — always 2 spaces, never tabs.**

```yaml
# Key: simple value
name: My Workflow

# Hierarchy — child is 2 spaces ahead of parent
jobs:
  my-job:
    runs-on: ubuntu-latest

# List with dash
branches:
  - main
  - develop
```

**Standard structure of any GitHub Actions workflow:**

```yaml
name: # Name shown in the Actions tab

on: # Trigger — when the workflow fires

jobs:
  job-name:                   # Job identifier
    runs-on: ubuntu-latest    # Virtual machine to run on

    steps:
      - name: Step name       # Step description
        uses: action@version  # Uses a ready-made marketplace action
        # OR
        run: command          # Runs a terminal command
```

**Main components:**
- **`name`** — workflow name visible in the Actions tab
- **`on`** — defines the trigger (`push`, `pull_request`, `schedule`)
- **`jobs`** — groups the work to be executed
- **`runs-on`** — VM operating system. We always use `ubuntu-latest`
- **`steps`** — sequential list of steps within a job
- **`uses`** — calls a reusable action from the marketplace
- **`run`** — executes a command directly in the terminal

---

### Step 3: Phase 1 — Python Pipeline with pytest

The first pipeline. Starts with Python because the logic is simple, allowing 100% focus on the workflow structure.

**Create the file structure:**
```bash
mkdir -p .github/workflows
touch .github/workflows/python-ci.yml
touch soma.py
touch test_soma.py
```

**`soma.py`** — function to be tested:
```python
def soma(a, b):
    return a + b
```

**`test_soma.py`** — function tests:
```python
from soma import soma

def test_soma():
    assert soma(2, 3) == 5
    assert soma(0, 0) == 0
    assert soma(-1, 1) == 0
```

**`.github/workflows/python-ci.yml`** — the pipeline:
```yaml
name: Python CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.x'

      - name: Install dependencies
        run: pip install pytest

      - name: Run tests
        run: pytest
```

**What each step does:**
- **`actions/checkout@v4`** — downloads the repository code to the Actions virtual machine
- **`actions/setup-python@v5`** — installs Python in the specified version
- **`pip install pytest`** — installs the testing framework
- **`pytest`** — automatically detects all files starting with `test_` and runs them

**Push and watch the pipeline run:**
```bash
git add .
git commit -m "feat: add python ci pipeline"
git push origin main
```

Go to the **Actions** tab on GitHub and watch the workflow execute automatically.

---

### Step 4: Phase 2 — Migrating to TypeScript

Same logic as the previous pipeline, different language. This demonstrates that GitHub Actions is **language-agnostic** — the workflow structure is always the same.

**Initialize the Node.js project:**
```bash
yarn init -y
yarn add -D typescript ts-node @types/node
yarn tsc --init
```

> **Important:** In the generated `tsconfig.json`, find the line `"verbatimModuleSyntax"` and change it to `false`. This prevents conflict between the CommonJS and ESModule module systems.

**`soma.ts`** — typed function:
```typescript
export function soma(a: number, b: number): number {
  return a + b;
}
```

> **Why TypeScript?** The `: number` on the parameters ensures the function only accepts numbers. Trying to pass a string causes an error before the code even executes.

**`soma.test.ts`** — tests without external framework:
```typescript
import { soma } from './soma';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

assert(soma(2, 3) === 5, 'Error: 2 + 3 should be 5');
assert(soma(0, 0) === 0, 'Error: 0 + 0 should be 0');
assert(soma(-1, 1) === 0, 'Error: -1 + 1 should be 0');

console.log('All tests passed!');
```

> **Why manual `assert`?** To avoid adding unnecessary dependencies at this stage. Cypress, which comes next, already has its own assertion system.

**Test locally before pushing:**
```bash
npx ts-node soma.test.ts
```

**`.github/workflows/typescript-ci.yml`** — the pipeline:
```yaml
name: TypeScript CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: yarn install

      - name: Run tests
        run: npx ts-node soma.test.ts
```

> **Difference from the Python pipeline:** We swapped `actions/setup-python` for `actions/setup-node`, and `pip install pytest` for `yarn install`. The structure is identical.

```bash
git add .
git commit -m "feat: add typescript ci pipeline"
git push origin main
```

---

### Step 5: Phase 3 — E2E Tests with Cypress

Cypress is an end-to-end testing framework — it replaces the manually written tests with a professional, standardized solution used by companies worldwide.

**What differentiates unit tests from E2E:**
- **Unit** — tests an isolated function. Ex: `soma(2, 3) === 5`
- **E2E** — simulates a complete user flow. Ex: opens browser, clicks login, fills form, verifies redirect

**Install Cypress:**
```bash
yarn add -D cypress
```

**System dependencies required on WSL 2:**

Cypress needs graphics libraries to render the browser on Linux. Without them, you will see the error `libnspr4.so: cannot open shared object file`.

```bash
sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2t64
```

**Initialize Cypress and create the structure:**
```bash
yarn cypress open
```

In the interface that opens, select **E2E Testing** → **Continue** → choose browser → **Start E2E Testing** → **Create new spec** and name it `cypress/e2e/soma.cy.ts`.

Close Cypress with `Ctrl + C` in the terminal.

**`cypress/e2e/soma.cy.ts`** — replace the generated content with:
```typescript
import { soma } from '../../soma';

describe('soma function tests', () => {
  it('should return 5 when summing 2 + 3', () => {
    expect(soma(2, 3)).to.equal(5);
  });

  it('should return 0 when summing 0 + 0', () => {
    expect(soma(0, 0)).to.equal(0);
  });

  it('should return 0 when summing -1 + 1', () => {
    expect(soma(-1, 1)).to.equal(0);
  });
});
```

**Test writing pattern:**
- **`describe`** — groups tests by context (function or module name)
- **`it`** — defines a test case. Always starts with "should"
- **`expect().to.equal()`** — Cypress assertion. Much more readable than writing by hand

**Test locally in headless mode:**
```bash
yarn cypress run
```

> **`cypress run` vs `cypress open`:**
> - `cypress open` — opens the visual interface, ideal for development
> - `cypress run` — runs in the terminal without opening the browser, ideal for CI/CD

**`.github/workflows/cypress-ci.yml`**:
```yaml
name: Cypress CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: yarn install

      - name: Run Cypress tests
        run: yarn cypress run
```

```bash
git add .
git commit -m "feat: add cypress ci pipeline"
git push origin main
```

---

### Step 6: The Application — monitor.ts

Before containerizing, we created the application that will be packaged in Docker. A TypeScript script that checks if URLs are online or offline — real-world use in DevOps day-to-day.

**`monitor.ts`:**
```typescript
interface Site {
  name: string;
  url: string;
}

const sites: Site[] = [
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'GitHub', url: 'https://www.github.com' },
  { name: 'Offline Site', url: 'https://www.sitethatdoesnotexist123456.com' },
];

async function checkSite(site: Site): Promise<void> {
  try {
    await fetch(site.url);
    console.log(`✅ ${site.name} is online`);
  } catch {
    console.log(`❌ ${site.name} is offline`);
  }
}

async function monitor(): Promise<void> {
  console.log('🔍 Checking sites...\n');

  for (const site of sites) {
    await checkSite(site);
  }

  console.log('\n✅ Monitoring complete!');
}

monitor();
```

**TypeScript concepts applied here:**
- **`interface`** — defines the structure of an object. Every `Site` must have `name` and `url` of type `string`
- **`Site[]`** — typed array. The list only accepts objects that follow the `Site` interface
- **`async/await`** — functions that may take time to complete without blocking the program
- **`Promise<void>`** — promise that something will happen in the future. `void` means no return value
- **`try/catch`** — tries to execute the code. If something fails, falls into `catch` instead of crashing
- **Template strings** (backtick) — allows inserting variables into text with `${}`

**Test locally:**
```bash
npx ts-node monitor.ts
```

---

### Step 7: Phase 4 — Docker and Containerization

Docker packages the application along with everything it needs to run — OS, dependencies, and configurations — inside a container. The behavior is always the same in any environment.

**The three fundamental concepts:**
| Concept | Analogy | Description |
|---|---|---|
| **Dockerfile** | Cake recipe | The file with instructions on how to build the container |
| **Image** | Finished cake | The build result — packaged and ready to distribute |
| **Container** | Served slice | The image running — the live instance of the application |

**Create the `Dockerfile` at the project root:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["npx", "ts-node", "monitor.ts"]
```

**Line-by-line explanation:**
- **`FROM node:20-alpine`** — uses the official Node 20 image in the `alpine` version (minimal Linux, lighter)
- **`WORKDIR /app`** — sets the working directory inside the container
- **`COPY package.json yarn.lock ./`** — copies dependency files **before** the code
- **`RUN yarn install`** — installs dependencies inside the container
- **`COPY . .`** — copies all remaining code
- **`CMD`** — command executed when the container starts

> **Why copy `package.json` before `COPY . .`?**
> Docker has a **layer caching system** — each Dockerfile line is a cached layer. If you only change `monitor.ts`, Docker sees that `package.json` hasn't changed and **skips `yarn install`**, making the build much faster.

**Useful Docker commands:**
```bash
docker build -t monitor-app .   # Build the image
docker run monitor-app          # Run the container
docker images                   # List local images
docker ps -a                    # List all containers
docker rm CONTAINER_ID          # Remove a container
docker rmi monitor-app          # Remove an image
```

**`.github/workflows/docker-ci.yml`** — build pipeline:
```yaml
name: Docker CI

on:
  push:
    branches:
      - main
    tags:
      - 'v*'
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ secrets.GHCR_USERNAME }}
          password: ${{ secrets.GHCR_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ secrets.GHCR_USERNAME }}/monitor-app

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

---

### Step 8: Secrets — Secure Credentials in CI

Secrets are sensitive variables stored in encrypted form in the repository. They never appear in the code — GitHub Actions automatically injects them into the pipeline at execution time.

**How to create a Personal Access Token (PAT) on GitHub:**
1. Go to **github.com/settings/tokens**
2. Click **Generate new token (classic)**
3. Fill in:
   - **Note:** `ghcr-token`
   - **Expiration:** 90 days
   - **Scopes:** check `write:packages`
4. Click **Generate token** and **copy immediately** — it only appears once

**How to add secrets to the repository:**
1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Create two secrets:
   - `GHCR_USERNAME` — your GitHub username
   - `GHCR_TOKEN` — the token generated above

**How to use secrets in the workflow:**
```yaml
username: ${{ secrets.GHCR_USERNAME }}
password: ${{ secrets.GHCR_TOKEN }}
```

---

### Step 9: GHCR — Publishing the Image

GHCR (GitHub Container Registry) is the Docker image warehouse integrated with GitHub. After configuring the secrets, the pipeline from Step 7 is already ready to publish automatically.

```bash
git add .
git commit -m "feat: add docker ci pipeline with ghcr push"
git push origin main
```

After pushing, go to your GitHub profile → **Packages** to see the published image.

**To make the image public** (required for Railway deployment without extra configuration):
- Go to **Packages → monitor-app → Package settings**
- Change visibility to **Public**

---

### Step 10: Versioning with SemVer

`latest` is convenient but dangerous in production — it always changes. With versioned tags, you have full control over which version is running in each environment.

**The SemVer pattern:**
```
v1.2.3
  │ │ └── PATCH — bug fix (nothing breaks)
  │ └──── MINOR — new feature (nothing breaks)
  └────── MAJOR — breaking change
```

**How to create and publish a tag:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

**The `docker/metadata-action` detects automatically:**
- Push to `main` → publishes as `latest`
- Tag `v1.0.1` → publishes as `v1.0.1` and `latest`

> **Golden rule:** In production, always use specific tags (`v1.0.1`), never `latest`. Tags are immutable — `v1.0.1` will always be the same image. `latest` changes with every push.

---

### Step 11: Deploy on Railway

Deploy is the process of taking the image published in GHCR and putting it to run on a cloud server.

**The complete cycle:**
```
Push to main or version tag
           ↓
GitHub Actions fires automatically
           ↓
Runs all tests (Python, TypeScript, Cypress)
           ↓
Builds the Docker image
           ↓
Publishes to GHCR with correct tag
           ↓
Railway deploys the image
           ↓
Application running in the cloud
```

**How to deploy on Railway:**
1. Go to [railway.app](https://railway.app) and create an account with **Login with GitHub**
2. Click **New Project → Docker Image**
3. Enter your image address: `ghcr.io/YOUR_USER/monitor-app:latest`
4. Railway will deploy automatically

> **Railway PaaS vs VPS:** On Railway you don't manage the server — just deliver the image and it handles running, scaling, and keeping it available. On a VPS you would have full access and responsibility over the server.

---

## 🐛 Technical Memorial — Errors and Solutions

### Error: `actoins/setup-node` — Typo in YAML

**Problem:** A typo in the action name crashed the pipeline with `Unable to resolve action`.

**Lesson:** In DevOps, syntax is law. YAML is unforgiving with errors.

**Solution:**
```bash
git commit -m "fix: actoins in typescript-ci.yml to actions"
```

---

### Error: `libnspr4.so: cannot open shared object file` — Cypress on WSL

**Problem:** Cypress failed to start because WSL's Ubuntu doesn't have graphics drivers by default.

**Lesson:** Visual tools need specific system libraries on Linux.

**Solution:**
```bash
sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2t64
```

---

### Error: `verbatimModuleSyntax` — Module conflict in TypeScript

**Problem:** The auto-generated `tsconfig.json` had `verbatimModuleSyntax: true`, conflicting with Node.js's CommonJS module system.

**Lesson:** Understanding `tsconfig.json` is essential.

**Solution:** In `tsconfig.json`, change:
```json
"verbatimModuleSyntax": false
```

---

### Error: Railway deployment failed — Private image

**Problem:** Railway couldn't access the image on GHCR because it was set to private.

**Lesson:** Private registries require credentials for external access.

**Solution:** Make the image public in GitHub Package settings.

---

## 🎤 Demo Script

**Minute 1 — The Foundation**
> "I started by establishing a Linux environment inside Windows with WSL 2. This eliminates the classic 'works on my machine' problem — my development environment is identical to the production server."

**Minute 2 — The Pipeline Journey**
> "I created four progressive pipelines: Python with pytest, TypeScript with ts-node, Cypress for E2E tests, and Docker for containerization. This proves that CI/CD logic is language-agnostic — the workflow structure is always the same."

**Minute 3 — The Application and the Container**
> Run `docker run monitor-app` live.
> "The `monitor-app` checks if URLs are online or offline. It runs inside a Docker container — if the server has Docker installed, it doesn't need Node or Yarn. The container transports everything."

**Minute 4 — The Full Cycle**
> Show the Actions tab on GitHub and the published Package on GHCR.
> "The complete cycle: push to main → tests run automatically → image is built and published to GHCR → Railway deploys. We went from a simple script to an end-to-end automated infrastructure."

---

## 📖 References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Skills — Hello GitHub Actions](https://github.com/skills/hello-github-actions)
- [GitHub Skills — Test with Actions](https://github.com/skills/test-with-actions)
- [Docker Documentation](https://docs.docker.com)
- [Cypress Documentation](https://docs.cypress.io)
- [Railway Documentation](https://docs.railway.app)
- [Semantic Versioning](https://semver.org)

---

📄 [Versão em Português](./README.md)

---

*This repository was built as a learning lab during a DevOps internship, mentored via Claude.AI (Anthropic). Every commit tells a story.*
