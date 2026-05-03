# Fato ou Fake

Aplicação web mobile-first para verificação de informações com apoio de IA. O sistema aceita links e perguntas em texto livre, retornando classificação de confiabilidade como verdadeiro, falso ou duvidoso.

## Visão Geral

Este projeto foi desenvolvido como trabalho escolar com foco em cidadania digital e combate a desinformação.

- Escola: Colégio Lidia Cruz
- Turma: 9 ano
- Equipe:
  - Livia Ornelas
  - Eloah Nonato
  - Amanda de Lima

## Objetivo do Projeto

- Incentivar análise crítica de conteúdos online.
- Demonstrar uso responsável de inteligência artificial em contexto educacional.
- Aplicar boas práticas de desenvolvimento frontend em um produto real.

## Principais Funcionalidades

- Verificação de link ou pergunta em texto livre.
- Classificação semântica: verdadeiro, falso ou duvidoso.
- Índice de confiança percentual.
- Resumo analítico da resposta da IA.
- Histórico local das 3 últimas verificações.
- Interface mobile-first com estilo glassmorphism.
- Experiência PWA instalável.

## Stack Tecnológica

- React 18
- Vite 5
- TypeScript 5
- Tailwind CSS
- Shadcn-style components
- Groq API (modelo `llama-3.1-8b-instant`)
- vite-plugin-pwa (Workbox)

## Arquitetura (Resumo)

```text
src/
  App.tsx
  components/
    ResultCard.tsx
    HistoryPanel.tsx
    Skeleton.tsx
    StatusBadge.tsx
    OfflineBanner.tsx
  services/
    verificationService.ts
    historyService.ts
  types.ts
```

## Requisitos

- Node.js 18+
- npm 9+
- Chave de API Groq gratuita

## Configuração de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_GROQ_API_KEY=sua_chave_groq
```

Gerar chave gratuita:

- Acesse `https://console.groq.com`
- Crie uma API Key em `API Keys`

## Como Executar

Instalar dependências:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

## Scripts Disponíveis

- `npm run dev`: inicia ambiente de desenvolvimento.
- `npm run build`: valida TypeScript e gera build de produção.
- `npm run preview`: inicia preview local da build.

## Fluxo de Uso

1. Digite um link ou uma pergunta no campo principal.
2. Clique em verificar.
3. Aguarde a análise da IA.
4. Consulte o status, confiança e explicação.
5. Reutilize entradas pelo histórico local.

## Boas Práticas Aplicadas

- Componentização e separação de responsabilidades.
- Tipagem estática com TypeScript.
- Tratamento de erro e feedback ao usuário.
- Persistência local controlada.
- Acessibilidade básica com labels e ARIA.

## Melhorias Futuras

- Painel com estatísticas das verificações.
- Exportação de histórico em PDF.
- Integração com fontes jornalísticas verificadas.
- Controle de taxa com fila de requisições.

## Aviso Educacional

As respostas da IA servem como apoio ao estudo e não substituem validação em fontes oficiais e jornalísticas confiáveis.

## Licença

Uso educacional.
