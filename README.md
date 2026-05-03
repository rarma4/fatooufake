# 🔍 Fato ou Fake - Fact-Checking MVP

  Um aplicativo mobile-first para verificação de fatos usando IA (Gemini). Analise links e descubra se as informações são verdadeiras, falsas ou duvidosas.

## ✨ Características

- ✅ **Verificação em Tempo Real**: Integração com Gemini API
- 📱 **Mobile-First**: Design responsivo com simulação de smartphone
- 🎨 **Glassmorphism Design**: Interface moderna com animações suaves
- 💾 **Histórico Local**: Salva últimas 3 pesquisas em localStorage
- 🌐 **PWA**: Instalável como app nativo com suporte offline
- ♿ **Acessibilidade**: ARIA labels e semântica completa
- 🔒 **TypeScript**: Type-safe em 100%

## 🚀 Quick Start

### 1. Clone e Configure

```bash
npm install
```

### 2. Configure a Chave de API

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_GEMINI_API_KEY=sua_chave_de_api_aqui
```

Para obter uma chave gratis, acesse: https://aistudio.google.com/apikey

### 3. Inicie o Servidor

```bash
npm run dev
```

Abra http://localhost:5173 no navegador.

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos de saída estarão em `dist/` com o service worker PWA incluído.

## 📁 Estrutura do Projeto

```
src/
├── App.tsx                          # Componente principal
├── index.css                        # Estilos globais + classes utilitárias
├── types.ts                         # Tipos TypeScript
├── env.d.ts                         # Declaração de variáveis de ambiente
├── services/
│   ├── verificationService.ts       # Integracao com Gemini API
│   └── historyService.ts            # Gerenciamento de histórico
└── components/
    ├── ResultCard.tsx               # Card de resultado
    ├── StatusBadge.tsx              # Badge de classificação
    ├── Skeleton.tsx                 # Loader animado
    ├── HistoryPanel.tsx             # Painel de histórico
    └── OfflineBanner.tsx            # Aviso de sem internet
```

## 🎯 Como Funciona

1. **Input**: Cole uma URL no campo "Link para verificar"
2. **Validação**: Regex valida se é uma URL válida
3. **Analise**: A API Gemini analisa o conteudo da pagina
4. **Resultado**: Exibe classificação (Verdadeiro/Falso/Duvidoso) + confiança
5. **Histórico**: Salva automaticamente as 3 últimas pesquisas

## 🔧 Stack Técnico

- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS + animações customizadas
- **IA**: Google Gemini API (REST)
- **PWA**: vite-plugin-pwa + Workbox
- **Linguagem**: TypeScript 5
- **Acessibilidade**: ARIA, semântica HTML

## 📝 Exemplo de Uso

```typescript
import { verifyLink } from './services/verificationService'

const result = await verifyLink('https://exemplo.com/noticia')
// {
//   url: 'https://exemplo.com/noticia',
//   status: 'verdadeiro' | 'falso' | 'duvidoso',
//   confidence: 85,
//   analysis: 'Análise detalhada...',
//   checkedAt: 1472567812
// }
```

## 🌍 Ambiente de Desenvolvimento

Variáveis disponíveis em `import.meta.env`:

| Variável | Descrição |
|----------|-----------|
| `VITE_GEMINI_API_KEY` | Chave da API Gemini |

## 🤝 Melhorias Futuras

- [ ] Integração com APIs de fact-checking (Lupa, Aos Fatos)
- [ ] Análise de imagens e vídeos
- [ ] Compartilhamento de resultados
- [ ] Estatísticas e gráficos de tendências
- [ ] Multilíngue (EN, ES, FR)
- [ ] Dark mode (ja disponível!)

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para combate a desinformação**
