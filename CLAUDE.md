# Marketing — Secretar.AI

Repositorio centralizado de marketing: skills de IA, conteudos de lancamento e marca pessoal do fundador.

## Produto

**Secretar.AI** — plataforma de gestao inteligente para clinicas de estetica. IA conversacional 24/7 via WhatsApp, agenda, CRM, prontuario digital, campanhas em massa, automacoes zero-code.

- **Lancamento:** 30 de Maio de 2026
- **ICP:** Donas de clinicas de estetica, 28-50 anos
- **Headline:** "Sua clinica no piloto automatico. IA que atende, agenda e fideliza seus clientes pelo WhatsApp."
- **Contexto completo:** `projetos/laçamentos/secretar-ai-30maio/product-context.md`

## Fundador

**Pedro Scardua** — desenvolvedor e idealizador da Secretar.AI. Autodidata desde os 9 anos, background em marketing digital e desenvolvimento. De Vitoria-ES para Sao Paulo. Rosto e voz da marca.

## Tom de Voz

- **Profissional mas acessivel:** Nao e corporativo demais, nem informal demais
- **Confiante:** Autoridade em estetica + tecnologia
- **Empatico:** Entende as dores reais do dia-a-dia da clinica
- **Direto:** Vai ao ponto, sem enrolacao
- **Aspiracional:** Mostra o futuro da clinica com tecnologia

## Estrutura do Repositorio

```
marketing/
├── CLAUDE.md                          # Este arquivo
├── .agents/                           # Skills de IA para criacao de conteudo
│   ├── copywriting/                   # Copy para landing pages, CTAs, headlines
│   ├── marketing-psychology/          # Vieses cognitivos, persuasao, social proof
│   ├── marketing-ideas/               # Brainstorm de estrategias para SaaS
│   ├── product-marketing-context/     # Documento de contexto (ICP, posicionamento)
│   ├── ai-social-media-content/       # Conteudo para Instagram, TikTok, YouTube, X
│   ├── social-media-carousel/         # Carrosseis para Instagram, LinkedIn, X
│   ├── seo-content-brief/             # Briefs SEO com keywords e intencao de busca
│   ├── seo-content-writer/            # Artigos/blog posts otimizados para SEO
│   ├── email-marketing/               # Sequencias, A/B testing, deliverability
│   ├── marketing-automation/          # Workflows, lead scoring
│   └── ai-marketing-videos/           # Videos com IA (Veo, Seedance, FLUX)
│
├── projetos/
│   └── laçamentos/
│       └── secretar-ai-30maio/        # LANCAMENTO 30/MAIO/2026
│           ├── product-context.md     # ICP, proposta de valor, keywords, concorrentes
│           ├── plano-lancamento-30dias.md  # Cronograma dia-a-dia, 4 fases, metricas
│           │
│           ├── instagram/             # 30 conteudos (posts, carrosseis, reels, stories)
│           ├── whatsapp-grupo/        # 30 dias de mensagens para grupo VIP
│           ├── email-marketing/       # 14 emails com A/B test e segmentacao
│           ├── disparos-whatsapp/     # 9 campanhas com versoes A/B
│           ├── site/                  # Copy landing page (12 secoes + extras)
│           ├── blog/                  # 9 artigos SEO com briefs completos
│           ├── youtube/               # 7 roteiros completos
│           │
│           └── pedro-scardua/         # CONTEUDOS DO FUNDADOR
│               ├── 00-checklist-geral.md      # Tudo que Pedro precisa produzir
│               ├── 01-videos-youtube.md       # 7 roteiros completos
│               ├── 02-reels-instagram.md      # 6 reels + 3 videos curtos
│               ├── 03-audios-whatsapp.md      # 8 audios (grupo VIP + stories)
│               ├── 04-textos-escritos.md      # Carta, LinkedIn, IG, Twitter, bios
│               ├── 05-fotos-e-imagem.md       # Guia 4 sessoes de foto
│               ├── 06-cronograma-producao.md  # Dia-a-dia, lotes, equipamento
│               └── abril-pre-lancamento/      # MARCA PESSOAL ABRIL
│                   ├── 00-estrategia-abril.md # Pilares e calendario
│                   ├── 01-instagram-feed.md   # 13 posts com legendas
│                   ├── 02-reels.md            # 7 reels com roteiros
│                   ├── 03-stories.md          # 61 stories em 25 dias
│                   ├── 04-linkedin.md         # 3 posts profundos
│                   └── 05-twitter.md          # 18 tweets + reativos
│
└── carousel-clinica-escravizando/     # Assets de carrossel existente
```

## Skills de IA (como usar)

Skills ficam em `.agents/`. Cada uma tem `SKILL.md` com instrucoes e opcionalmente `references/` e `evals/`.

### Workflow recomendado

1. **Contexto primeiro:** Use `product-marketing-context` para definir/atualizar o contexto do produto. O documento gerado (`product-context.md`) alimenta todas as outras skills.
2. **Ideacao:** `marketing-ideas` para brainstorm + `marketing-psychology` para fundamentar decisoes com vieses e principios comportamentais.
3. **Execucao por canal:**
   - Copy: `copywriting` (landing pages, CTAs, headlines)
   - Social: `ai-social-media-content` + `social-media-carousel`
   - SEO: `seo-content-brief` → `seo-content-writer`
   - Email: `email-marketing`
   - Video: `ai-marketing-videos`
   - Automacao: `marketing-automation`

## Cronograma do Lancamento

### 4 Fases

| Fase | Periodo | Foco |
|------|---------|------|
| **AWARENESS** | 01-10 maio | Dores do mercado, posicionamento |
| **CONSIDERACAO** | 11-20 maio | Demos, features, social proof |
| **CONVERSAO** | 21-29 maio | Oferta, urgencia, contagem regressiva |
| **LANCAMENTO** | 30 maio | Abertura oficial, primeiras vendas |

### Pre-lancamento (Abril)
Marca pessoal do Pedro Scardua: bastidores de dev, historia pessoal, opinioes sobre IA/tech, teasers sutis. Nenhuma venda — so construcao de autoridade e curiosidade.

## Regras para Criacao de Conteudo

### Geral
- Sempre consultar `product-context.md` antes de criar qualquer conteudo
- Manter consistencia de tom de voz entre todos os canais
- Dados e estatisticas devem ser verificaveis ou claramente identificados como estimativas
- CTAs devem ser claros e unicos por peca (um CTA por post/email/mensagem)
- Conteudo do fundador deve ser pessoal e genuino — NAO corporativo

### Por canal
- **Instagram:** Emojis moderados, hashtags 5-10 por post, legendas escaneáveis
- **WhatsApp Grupo:** Mensagens curtas (max 4 paragrafos), tom proximo, enquetes para engajar
- **Email:** Subject max 50 chars, um CTA por email, personalizar com {{NOME}}
- **Disparos WhatsApp:** Max 1000 chars, tom conversacional, nao parecer spam
- **Blog:** SEO-first, H2 a cada 300 palavras, paragrafos curtos, links internos entre artigos
- **YouTube:** Hook nos primeiros 5s, thumbnails com rosto + texto grande, timestamps na descricao
- **Site:** Headline impactante, beneficios > features, social proof visivel

### Design Studio
O projeto tem um servico de design automatizado em `apps/design-studio` que pode ser usado para gerar imagens de carrosseis e posts via JSON spec. Consultar `apps/design-studio/CLAUDE.md` para detalhes da API.

## Keywords Principais

**Primarias:** clinica estetica software, sistema clinica estetica, gestao clinica estetica, whatsapp clinica, IA clinica estetica
**Secundarias:** recepcionista virtual, atendimento automatico whatsapp, prontuario eletronico estetica, CRM clinica estetica, agenda online estetica

## Concorrentes

- Clinicorp (gestao de clinicas, sem IA)
- Belle Software (estetica, sem WhatsApp integrado)
- Z-Api + ferramentas separadas (WhatsApp API, sem gestao)
- Google Agenda + planilhas (solucao manual)

## Diferenciais para Comunicacao

1. **Unica com IA conversacional real** — agentes inteligentes com memoria, nao chatbot basico
2. **WhatsApp como core** — nao e um add-on, e o hub central
3. **Tudo em um** — substitui 5-7 ferramentas
4. **Feita para estetica** — prontuario com face mapping, evolucoes especificas
5. **Zero codigo** — automacoes e IA sem conhecimento tecnico
