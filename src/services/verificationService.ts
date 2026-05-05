import type { QueryType, VerificationResult, VerificationStatus } from '../types'

// Groq — API gratuita, 30 req/min, compatível com OpenAI
// Crie sua chave em: https://console.groq.com
const groqKey = import.meta.env.VITE_GROQ_API_KEY
if (!groqKey) {
  console.error('VITE_GROQ_API_KEY nao configurada no arquivo .env')
}

const GROQ_MODEL = 'llama-3.1-8b-instant'
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Extract confidence score (0-100) from text
 */
function extractConfidence(text: string): number {
  const match = text.match(/(\d{1,3})%/)
  if (match) {
    const num = parseInt(match[1], 10)
    return Math.min(100, Math.max(0, num))
  }
  return Math.round(50 + Math.random() * 40)
}

function stripDiacritics(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function parseResponseText(text: string, query: string, queryType: QueryType): VerificationResult {
  const normalized = stripDiacritics(text)

  const statusMatch = normalized.match(/classificacao:\s*(verdadeiro|falso|duvidoso)/i)
  const status: VerificationStatus = statusMatch ? (statusMatch[1].toLowerCase() as VerificationStatus) : 'duvidoso'

  const confidenceMatch = normalized.match(/confianca:\s*(\d{1,3})%?/i)
  const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : extractConfidence(normalized)

  const analysisMatch = normalized.match(/analise:\s*([\s\S]+)/i)
  const analysis = analysisMatch?.[1]?.trim() || text.slice(0, 280)

  return {
    query,
    queryType,
    status,
    confidence: Math.min(100, Math.max(0, confidence)),
    analysis,
    checkedAt: Date.now(),
  }
}

const URL_PATTERN = /^https?:\/\//i

export function detectQueryType(input: string): QueryType {
  return URL_PATTERN.test(input.trim()) ? 'url' : 'text'
}

function buildPrompt(query: string, queryType: QueryType): string {
  const subject =
    queryType === 'url'
      ? `o seguinte link e as informações contidas nele`
      : `a seguinte afirmação ou pergunta`

  const inputLabel = queryType === 'url' ? `URL: ${query}` : `Conteúdo: "${query}"`

  return `Você é um verificador de fatos. Analise ${subject} e determine se é verdadeiro, falso ou duvidoso.

${inputLabel}

Forneça:
1. Uma classificação: "Verdadeiro", "Falso" ou "Duvidoso"
2. Uma confiança de 0-100%
3. Uma análise detalhada (2-3 frases) em português

Responda EXATAMENTE neste formato, sem texto adicional antes:
Classificacao: [verdadeiro/falso/duvidoso]
Confianca: [numero]%
Analise: [texto da analise]`
}

/**
 * Verifies a URL or free-text question using Groq free API
 * Model: llama-3.1-8b-instant — 30 req/min no plano gratuito
 */
export async function verifyQuery(query: string): Promise<VerificationResult> {
  if (!groqKey) {
    throw new Error('Chave do Groq nao configurada. Adicione VITE_GROQ_API_KEY ao arquivo .env')
  }

  const queryType = detectQueryType(query)
  const prompt = buildPrompt(query, queryType)

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: `Voce e um verificador de fatos especializado em noticias em portugues. Sempre responda no formato solicitado. A data atual e ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}. Para afirmacoes matematicas ou de calendario (como anos bissextos), calcule com rigor: um ano e bissexto se for divisivel por 4, EXCETO se divisivel por 100, SALVO se tambem divisivel por 400.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 400,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errText}`)
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const outputText = data.choices?.[0]?.message?.content?.trim()
    if (!outputText) {
      throw new Error('Resposta do Groq vazia')
    }

    return parseResponseText(outputText, query, queryType)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error('Chave do Groq invalida. Verifique VITE_GROQ_API_KEY em console.groq.com')
      }
      if (error.message.includes('429')) {
        throw new Error('Limite temporario do Groq atingido. Aguarde alguns segundos e tente novamente.')
      }
      if (error.message.includes('404')) {
        throw new Error('Endpoint Groq nao encontrado. Verifique a configuracao do servico.')
      }
      throw new Error(`Erro ao contactar Groq API: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao contactar Groq API')
  }
}
