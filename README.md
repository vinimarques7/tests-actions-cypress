# 🚀 DevOps Journey: Full Cycle CI/CD com IA Mentoring

> **Autor:** Vinícius Marques  
> **Repositório:** `tests-actions-cypress`  
> **Objetivo:** Registro técnico e evolutivo de uma jornada do zero ao CI/CD completo, utilizando IA como mentor de aprendizado.

---

## 📖 Sobre este repositório

Este repositório não é apenas um projeto técnico — é uma **jornada documentada em código**. Cada arquivo, pipeline e configuração representa um conceito aprendido e aplicado na prática, partindo do absoluto zero em automação até a construção de uma aplicação monitorada, containerizada e com deploy automatizado.

O projeto nasceu de um desafio proposto pelo senior: **migrar pipelines de testes legados de Python para TypeScript e depois substituí-los pelo Cypress**. A partir disso, o repositório evoluiu naturalmente para cobrir o ciclo completo de CI/CD.

### 🧠 Metodologia: IA Mentoring

Este projeto foi guiado pela técnica de **IA Mentoring**. Utilizei o [Claude.AI](https://claude.ai) para simular um ambiente de mentoria real de estágio, com foco em **80% de prática e 20% de teoria**.

A diferença desta abordagem para simplesmente pedir código à IA está em quatro pilares:

1. **Decomposição antes da execução** — Antes de codificar, eu descrevia a lógica esperada para a IA. O objetivo era validar o raciocínio arquitetural antes de avançar para a implementação sintática.
2. **Assimilação de Padrões** — Foco no entendimento de padrões de algoritmos e ferramentas (design patterns e workflows). O estudo foi binário: teoria para compreender o "porquê" e prática para dominar o "como".
3. **Inversão de Fluxo (Explicação do Estudante)** — Ao receber um código ou conceito, eu obrigatoriamente devolvia uma explicação com minhas próprias palavras. A IA atuava como mentora, corrigindo desvios conceituais e confirmando meus acertos antes de eu transcrever o código para o VS Code.
4. **Previsibilidade e Validação Contínua** — A cada git push, eu detinha o controle total sobre o comportamento do pipeline. Não havia "magia" no CI/CD; havia o entendimento claro de cada trigger, job e step configurado. Sempre verificando o Actions para verificar o retorno do pipeline.

> **A filosofia deste repositório é simples: aprender fazendo. Cada erro resolvido, cada pipeline passando no GitHub Actions e cada conceito entendido está registrado na história de commits.**

---

## 📚 Pré-requisitos de Aprendizado

Antes de seguir este tutorial, recomendo fortemente completar estes cursos interativos gratuitos do GitHub Skills — eles fornecem a base necessária para entender o que será feito aqui:

- 👉 [Hello GitHub Actions](https://github.com/skills/hello-github-actions) — introdução à estrutura de workflows
- 👉 [Test with Actions](https://github.com/skills/test-with-actions) — como rodar testes automatizados no CI

Cada curso leva entre 20 e 40 minutos e você aprende diretamente em um repositório real.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Papel no Fluxo | Por que foi escolhida |
|---|---|---|
| **WSL 2 (Ubuntu)** | Sistema Operacional | O Windows é o escritório; o Linux é a fábrica. O WSL 2 roda um Kernel Linux nativo, garantindo paridade total com o servidor de produção e eliminando o erro "funciona na minha máquina". |
| **Node.js & Yarn** | Runtime & Gestão de Pacotes | Node executa TypeScript no servidor. Yarn é mais rápido e determinístico que npm para gerenciar dependências. |
| **TypeScript** | Linguagem | Adiciona tipagem estática ao JavaScript. No desafio da função `soma.ts`, o TypeScript impede erros de lógica antes mesmo da execução — somar uma string com um número é impossível. |
| **Python & pytest** | Ponto de Partida (Legado) | A fase inicial do desafio. Aprender CI em Python primeiro prova que a lógica de automação é agnóstica de linguagem. |
| **Docker Engine** | Containerização | Isolamos o `monitor-app` em um container. Se o servidor destino tiver Docker, ele não precisa de Node ou Yarn instalado — o container transporta todas as dependências e o SO mínimo. |
| **GitHub Actions** | Orquestração CI/CD | Nossa "esteira de montagem". Automatiza o ciclo completo: Push → Teste → Build → Publicação de Imagem → Deploy. |
| **Cypress** | Testes E2E | Diferente do teste unitário, o Cypress simula a jornada real do usuário. É a última linha de defesa antes da produção. |
| **GHCR** | Registry de Imagens | O "almoxarifado" de imagens Docker. Integrado ao GitHub, usa o mesmo token de autenticação e fica no mesmo lugar que o código. |
| **Railway** | Deploy em Nuvem | Plataforma PaaS que gerencia toda a infraestrutura. Você entrega a imagem e ele cuida do resto. Ideal para aprendizado. |

---

## 📂 Estrutura de Pastas

```
.
├── .github/
│   └── workflows/              # O Cérebro: Automações YAML
│       ├── python-ci.yml       # Fase 1: Legado — aprendizado de sintaxe YAML
│       ├── typescript-ci.yml   # Fase 2: Migração de stack e lógica de tipos
│       ├── cypress-ci.yml      # Fase 3: Qualidade e testes E2E
│       └── docker-ci.yml       # Fase 4: Entrega Contínua — Build & Push para GHCR
├── cypress/
│   └── e2e/
│       └── soma.cy.ts          # Testes E2E com Cypress
├── soma.py                     # Função legada em Python
├── test_soma.py                # Testes unitários em Python
├── soma.ts                     # Função migrada para TypeScript
├── soma.test.ts                # Testes unitários em TypeScript (sem framework)
├── monitor.ts                  # Aplicação principal — monitor de URLs
├── Dockerfile                  # A "receita" do container
├── tsconfig.json               # Configuração do TypeScript
├── package.json                # Dependências e scripts do projeto
└── yarn.lock                   # Lockfile de dependências
```

---

> **Por que não usar Docker Desktop?** O Docker Desktop tem uma camada de virtualização extra no Windows que pode causar lentidão e conflitos com o WSL 2. A Engine pura roda diretamente no Linux, mais rápida e estável. Mas fica a seu critério

---

### Passo 2: Criando o Repositório

Crie um repositório no GitHub com o nome de sua escolha. Em seguida, clone e abra no VSCode:

```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO
cd NOME_DO_REPOSITORIO
code .
```

> O comando `code .` abre o VSCode conectado ao WSL automaticamente.

---

### Passo 3: Entendendo o YAML antes de escrever

Antes de criar qualquer workflow, é fundamental entender a linguagem de configuração que o GitHub Actions usa.

**YAML é baseado em hierarquia por indentação — sempre 2 espaços, nunca tabs.**

```yaml
# Chave: valor simples
nome: Meu Workflow

# Hierarquia — filho fica 2 espaços à frente do pai
jobs:
  meu-job:
    runs-on: ubuntu-latest

# Lista com traço
branches:
  - main
  - develop
```

**Estrutura padrão de qualquer workflow do GitHub Actions:**

```yaml
name: # Nome que aparece na aba Actions

on: # Gatilho — quando o workflow dispara

jobs:
  nome-do-job:          # Identificador do job
    runs-on: ubuntu-latest  # Máquina virtual onde roda

    steps:
      - name: Nome do step   # Descrição do passo
        uses: action@versao  # Usa uma action pronta do marketplace
        # OU
        run: comando          # Executa um comando de terminal
```

**Os componentes principais:**
- **`name`** — nome do workflow visível na aba Actions
- **`on`** — define o gatilho (`push`, `pull_request`, `schedule`)
- **`jobs`** — agrupa os trabalhos a executar
- **`runs-on`** — SO da máquina virtual. Sempre usamos `ubuntu-latest`
- **`steps`** — lista de passos sequenciais dentro de um job
- **`uses`** — chama uma action reutilizável do marketplace
- **`run`** — executa um comando diretamente no terminal

---

### Passo 4: Fase 1 — Pipeline Python com pytest

O primeiro pipeline. Começa com Python porque a lógica é simples, permitindo focar 100% na estrutura do workflow.

**Crie a estrutura de arquivos:**
```bash
mkdir -p .github/workflows
touch .github/workflows/python-ci.yml
touch soma.py
touch test_soma.py
```

**`soma.py`** — função que será testada:
```python
def soma(a, b):
    return a + b
```

**`test_soma.py`** — testes da função:
```python
from soma import soma

def test_soma():
    assert soma(2, 3) == 5
    assert soma(0, 0) == 0
    assert soma(-1, 1) == 0
```

**`.github/workflows/python-ci.yml`** — o pipeline:
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

**O que cada step faz:**
- **`actions/checkout@v4`** — baixa o código do repositório para a máquina virtual do Actions
- **`actions/setup-python@v5`** — instala o Python na versão especificada
- **`pip install pytest`** — instala o framework de testes
- **`pytest`** — detecta automaticamente todos os arquivos que começam com `test_` e os executa

**Suba e veja o pipeline rodar:**
```bash
git add .
git commit -m "feat: add python ci pipeline"
git push origin main
```

Acesse a aba **Actions** no GitHub e veja o workflow executar automaticamente.

---

### Passo 5: Fase 2 — Migrando para TypeScript

Mesma lógica do pipeline anterior, linguagem diferente. Isso demonstra que o GitHub Actions é **agnóstico de linguagem** — a estrutura do workflow é sempre a mesma.

**Inicialize o projeto Node.js:**
```bash
yarn init -y
yarn add -D typescript ts-node @types/node
yarn tsc --init
```

> **Importante:** No `tsconfig.json` gerado, localize a linha `"verbatimModuleSyntax"` e mude para `false`. Isso evita conflito entre os sistemas de módulos CommonJS e ESModule.

**`soma.ts`** — função tipada:
```typescript
export function soma(a: number, b: number): number {
  return a + b;
}
```

> **Por que TypeScript?** O `: number` nos parâmetros garante que a função só aceita números. Tentar passar uma string causa erro antes mesmo de executar o código.

**`soma.test.ts`** — testes sem framework externo:
```typescript
import { soma } from './soma';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

assert(soma(2, 3) === 5, 'Erro: 2 + 3 deveria ser 5');
assert(soma(0, 0) === 0, 'Erro: 0 + 0 deveria ser 0');
assert(soma(-1, 1) === 0, 'Erro: -1 + 1 deveria ser 0');

console.log('Todos os testes passaram!');
```

> **Por que `assert` manual?** Para não adicionar dependências desnecessárias neste momento. O Cypress, que vem a seguir, já tem seu próprio sistema de assertions.

**Teste localmente antes de subir:**
```bash
npx ts-node soma.test.ts
```

**`.github/workflows/typescript-ci.yml`** — o pipeline:
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

> **Diferença do pipeline Python:** Trocamos `actions/setup-python` por `actions/setup-node`, e `pip install pytest` por `yarn install`. A estrutura é idêntica.

```bash
git add .
git commit -m "feat: add typescript ci pipeline"
git push origin main
```

---

### Passo 6: Fase 3 — Testes E2E com Cypress

Cypress é um framework de testes end-to-end — ele substitui os testes manuais escritos anteriormente por uma solução profissional e padronizada, usada em empresas do mundo todo.

**O que diferencia testes unitários de E2E:**
- **Unitário** — testa uma função isolada. Ex: `soma(2, 3) === 5`
- **E2E** — simula o fluxo completo de um usuário. Ex: abre o browser, clica em login, preenche formulário, verifica redirecionamento

**Instale o Cypress:**
```bash
yarn add -D cypress
```

**Dependências de sistema necessárias no WSL 2:**

O Cypress precisa de bibliotecas gráficas para renderizar o navegador no Linux. Sem elas, você verá o erro `libnspr4.so: cannot open shared object file`.

```bash
sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2t64
```

**Inicialize o Cypress e crie a estrutura:**
```bash
yarn cypress open
```

Na interface que abrir, selecione **E2E Testing** → **Continue** → escolha o browser → **Start E2E Testing** → **Create new spec** e nomeie como `cypress/e2e/soma.cy.ts`.

Feche o Cypress com `Ctrl + C` no terminal.

**`cypress/e2e/soma.cy.ts`** — substitua o conteúdo gerado por:
```typescript
import { soma } from '../../soma';

describe('Teste da função soma', () => {
  it('deve somar 2 + 3 e retornar 5', () => {
    expect(soma(2, 3)).to.equal(5);
  });

  it('deve somar 0 + 0 e retornar 0', () => {
    expect(soma(0, 0)).to.equal(0);
  });

  it('deve somar -1 + 1 e retornar 0', () => {
    expect(soma(-1, 1)).to.equal(0);
  });
});
```

**Padrão de escrita dos testes:**
- **`describe`** — agrupa testes por contexto (nome da função ou módulo)
- **`it`** — define um caso de teste. Sempre começa com "deve" (ou "should" em inglês)
- **`expect().to.equal()`** — o assert do Cypress. Muito mais legível que escrever na mão

**Teste localmente em modo headless (sem interface gráfica):**
```bash
yarn cypress run
```

> **`cypress run` vs `cypress open`:**
> - `cypress open` — abre a interface visual, ideal para desenvolvimento
> - `cypress run` — roda no terminal sem abrir o browser, ideal para CI/CD

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

### Passo 7: A Aplicação — monitor.ts

Antes de containerizar, criamos a aplicação que será empacotada no Docker. Um script TypeScript que verifica se URLs estão online ou offline — uso real no dia a dia de DevOps.

**`monitor.ts`:**
```typescript
interface Site {
  nome: string;
  url: string;
}

const sites: Site[] = [
  { nome: 'Google', url: 'https://www.google.com' },
  { nome: 'GitHub', url: 'https://www.github.com' },
  { nome: 'Site Offline', url: 'https://www.sitequenaoexiste123456.com' },
];

async function verificarSite(site: Site): Promise<void> {
  try {
    await fetch(site.url);
    console.log(`✅ ${site.nome} está online`);
  } catch {
    console.log(`❌ ${site.nome} está offline`);
  }
}

async function monitorar(): Promise<void> {
  console.log('🔍 Verificando sites...\n');

  for (const site of sites) {
    await verificarSite(site);
  }

  console.log('\n✅ Monitoramento concluído!');
}

monitorar();
```

**Conceitos TypeScript aplicados aqui:**
- **`interface`** — define a estrutura de um objeto. Todo `Site` deve ter `nome` e `url` do tipo `string`
- **`Site[]`** — array tipado. A lista só aceita objetos que seguem a interface `Site`
- **`async/await`** — funções que podem demorar para terminar (como requisições HTTP) sem travar o programa
- **`Promise<void>`** — promessa de que algo vai acontecer no futuro. `void` significa que não retorna valor
- **`try/catch`** — tenta executar o código. Se algo falhar, cai no `catch` em vez de travar
- **Template strings** (acento grave) — permite inserir variáveis no texto com `${}`

**Teste localmente:**
```bash
npx ts-node monitor.ts
```

---

### Passo 8: Fase 4 — Docker e Containerização

Docker empacota a aplicação junto com tudo que ela precisa para rodar — SO, dependências e configurações — dentro de um container. O comportamento é sempre o mesmo em qualquer ambiente.

**Os três conceitos fundamentais:**
| Conceito | Analogia | Descrição |
|---|---|---|
| **Dockerfile** | Receita de bolo | O arquivo com as instruções de como montar o container |
| **Image** | Bolo pronto | O resultado do build — empacotado e pronto para distribuir |
| **Container** | Fatia servida | A image rodando — a instância viva da aplicação |

**Crie o `Dockerfile` na raiz do projeto:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["npx", "ts-node", "monitor.ts"]
```

**Explicação linha por linha:**
- **`FROM node:20-alpine`** — usa a image oficial do Node 20 na versão `alpine` (versão mínima do Linux, mais leve)
- **`WORKDIR /app`** — define o diretório de trabalho dentro do container
- **`COPY package.json yarn.lock ./`** — copia os arquivos de dependências **antes** do código
- **`RUN yarn install`** — instala as dependências dentro do container
- **`COPY . .`** — copia todo o restante do código
- **`CMD`** — comando executado quando o container inicia

> **Por que copiar `package.json` antes do `COPY . .`?**
> O Docker tem um sistema de **cache por camadas** — cada linha do Dockerfile é uma camada armazenada em cache. Se você mudar só o código do `monitor.ts`, o Docker percebe que `package.json` não mudou e **pula o `yarn install`**, tornando o build muito mais rápido.

**Comandos úteis do Docker:**
```bash
# Builda a image com o nome monitor-app
docker build -t monitor-app .

# Roda a image em um container
docker run monitor-app

# Lista as images locais
docker images

# Lista todos os containers (incluindo parados)
docker ps -a

# Remove um container
docker rm CONTAINER_ID

# Remove uma image
docker rmi monitor-app
```

**`.github/workflows/docker-ci.yml`** — pipeline de build:
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

### Passo 9: Secrets — Credenciais Seguras no CI

Secrets são variáveis sensíveis armazenadas de forma criptografada no repositório. Elas nunca aparecem no código — o GitHub Actions as injeta automaticamente no pipeline na hora da execução.

**Por que secrets são essenciais:**
Sem secrets, você precisaria colocar seu token diretamente no YAML — qualquer pessoa com acesso ao repositório poderia ver suas credenciais. Com secrets, o valor é criptografado e nunca exposto.

**Como criar um Personal Access Token (PAT) no GitHub:**
1. Acesse **github.com/settings/tokens**
2. Clique em **Generate new token (classic)**
3. Preencha:
   - **Note:** `ghcr-token`
   - **Expiration:** 90 days
   - **Scopes:** marque `write:packages`
4. Clique em **Generate token** e **copie imediatamente** — ele só aparece uma vez

**Como adicionar secrets no repositório:**
1. Acesse **Settings → Secrets and variables → Actions**
2. Clique em **New repository secret**
3. Crie dois secrets:
   - `GHCR_USERNAME` — seu nome de usuário do GitHub
   - `GHCR_TOKEN` — o token gerado no passo anterior

**Como usar secrets no workflow:**
```yaml
username: ${{ secrets.GHCR_USERNAME }}
password: ${{ secrets.GHCR_TOKEN }}
```

---

### Passo 10: GHCR — Publicando a Imagem

O GHCR (GitHub Container Registry) é o "almoxarifado" de imagens Docker integrado ao GitHub. Após configurar os secrets, o pipeline do Passo 8 já está pronto para publicar automaticamente.

```bash
git add .
git commit -m "feat: add docker ci pipeline with ghcr push"
git push origin main
```

Após o push, acesse seu perfil no GitHub → **Packages** para ver a imagem publicada.

**Para tornar a imagem pública** (necessário para o deploy no Railway sem configuração extra):
- Vá em **Packages → monitor-app → Package settings**
- Altere a visibilidade para **Public**

---

### Passo 11: Versionamento com SemVer

O `latest` é conveniente mas perigoso em produção — ele sempre muda. Com tags versionadas, você tem controle total sobre qual versão está rodando em cada ambiente.

**O padrão SemVer:**
```
v1.2.3
  │ │ └── PATCH — correção de bug (não quebra nada)
  │ └──── MINOR — nova funcionalidade (não quebra nada)
  └────── MAJOR — mudança que quebra compatibilidade
```

**Como criar e publicar uma tag:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

**O `docker/metadata-action` detecta automaticamente:**
- Push na `main` → publica como `latest`
- Tag `v1.0.1` → publica como `v1.0.1` e `latest`

> **Regra de ouro:** Em produção, sempre use tags específicas (`v1.0.1`), nunca `latest`. Tags são imutáveis — `v1.0.1` sempre será a mesma imagem. `latest` muda a cada push.

---

### Passo 12: Deploy no Railway

Deploy é o processo de pegar a imagem publicada no GHCR e colocá-la para rodar em um servidor na nuvem.

**O ciclo completo:**
```
Push na main ou tag de versão
           ↓
GitHub Actions dispara automaticamente
           ↓
Roda todos os testes (Python, TypeScript, Cypress)
           ↓
Builda a imagem Docker
           ↓
Publica no GHCR com a tag correta
           ↓
Railway faz o deploy da imagem
           ↓
Aplicação rodando na nuvem
```

**Como fazer o deploy no Railway:**
1. Acesse [railway.app](https://railway.app) e crie uma conta com **Login with GitHub**
2. Clique em **New Project → Docker Image**
3. Digite o endereço da sua imagem: `ghcr.io/SEU_USUARIO/monitor-app:latest`
4. O Railway fará o deploy automaticamente

> **Railway é PaaS vs VPS:** No Railway você não gerencia o servidor — só entrega a imagem e ele cuida de rodar, escalar e manter disponível. Em uma VPS você teria acesso e responsabilidade total sobre o servidor.

---

## 🐛 Memorial Técnico — Erros e Soluções

Esta seção documenta os principais obstáculos encontrados durante o projeto. Erros são parte do aprendizado — documentá-los é o que transforma um iniciante em um profissional.

### Erro: `actoins/setup-node` — Typo no YAML

**Problema:** Um erro de digitação no nome da action travou o pipeline com `Unable to resolve action`.

**Lição:** No DevOps, a sintaxe é lei. O YAML é implacável com erros.

**Solução:**
```bash
git commit -m "fix: actoins in typescript-ci.yml to actions"
```
Usar o prefixo `fix:` mantém o histórico de commits profissional e semântico.

---

### Erro: `libnspr4.so: cannot open shared object file` — Cypress no WSL

**Problema:** O Cypress falhou ao iniciar porque o Ubuntu do WSL é minimalista e não possui drivers gráficos por padrão.

**Lição:** Ferramentas visuais precisam de bibliotecas de sistema específicas no Linux.

**Solução:**
```bash
sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2t64
```

---

### Erro: `verbatimModuleSyntax` — Conflito de módulos no TypeScript

**Problema:** O `tsconfig.json` gerado automaticamente tinha `verbatimModuleSyntax: true`, que conflita com o sistema de módulos CommonJS do Node.js ao usar `export`.

**Lição:** O TypeScript tem configurações que afetam como o código é interpretado. Entender o `tsconfig.json` é essencial.

**Solução:** No `tsconfig.json`, mudar:
```json
"verbatimModuleSyntax": false
```

---

### Erro: Deploy falhou no Railway — Imagem privada

**Problema:** O Railway não conseguiu acessar a imagem no GHCR porque ela estava como privada.

**Lição:** Registries privados exigem credenciais para acesso externo.

**Solução:** Tornar a imagem pública nas configurações do Package no GitHub, ou configurar as credenciais do GHCR como variáveis no Railway.

---

## 🎤 Roteiro de Demonstração

Para quem quiser apresentar este projeto, aqui está um roteiro de 4 minutos:

**Minuto 1 — A Base**
> "Comecei estabelecendo um ambiente Linux dentro do Windows com WSL 2. Isso elimina o problema clássico de 'funciona na minha máquina' — meu ambiente de desenvolvimento é idêntico ao servidor de produção."

**Minuto 2 — A Jornada pelos Pipelines**
> "Criei quatro pipelines progressivos: Python com pytest, TypeScript com ts-node, Cypress para testes E2E, e Docker para containerização. Isso prova que a lógica de CI/CD é agnóstica de linguagem — a estrutura do workflow é sempre a mesma."

**Minuto 3 — A Aplicação e o Container**
> Rode `docker run monitor-app` ao vivo.
> "O `monitor-app` verifica se URLs estão online ou offline. Ele roda dentro de um container Docker — se o servidor tiver Docker instalado, ele não precisa de Node ou Yarn. O container transporta tudo."

**Minuto 4 — O Ciclo Completo**
> Mostre a aba Actions no GitHub e o Package publicado no GHCR.
> "O ciclo completo: push na main → testes rodam automaticamente → imagem é buildada e publicada no GHCR → Railway faz o deploy. Saímos de um script simples para uma infraestrutura automatizada de ponta a ponta."

---

## 📖 Referências

- [GitHub Actions Documentation](https://docs.github.com/pt/actions)
- [GitHub Skills — Hello GitHub Actions](https://github.com/skills/hello-github-actions)
- [GitHub Skills — Test with Actions](https://github.com/skills/test-with-actions)
- [Docker Documentation](https://docs.docker.com)
- [Cypress Documentation](https://docs.cypress.io)
- [Railway Documentation](https://docs.railway.app)
- [Semantic Versioning](https://semver.org/lang/pt-BR/)

---

*Este repositório foi construído como laboratório de aprendizado durante estágio em DevOps, com mentoria via Claude.AI (Anthropic). Cada commit conta uma história.*
