require('dotenv').config();
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Read and sanitize provided keys
const rawOpenAIKey = process.env.OPENAI_API_KEY;
const openaiKey = rawOpenAIKey ? rawOpenAIKey.replace(/^\s+|\s+$/g, '').replace(/^['\"]|['\"]$/g, '') : null;
const rawGeminiKey = process.env.GEMINI_API_KEY;
const geminiKey = rawGeminiKey ? rawGeminiKey.replace(/^\s+|\s+$/g, '').replace(/^['\"]|['\"]$/g, '') : null;

// If a Google-style key is present in OPENAI_API_KEY, treat it as Gemini key.
// Also strip any accidental "sk-" prefix (e.g. "sk-AIzaSy..." → "AIzaSy...").
const rawEffective = geminiKey || (openaiKey && openaiKey.includes('AIza') ? openaiKey : null);
const effectiveGeminiKey = rawEffective ? rawEffective.replace(/^sk-/, '') : null;

if (effectiveGeminiKey) {
  // Initialize Google Generative AI client and return an adapter that matches the OpenAI chat.completions interface used in controllers.
  const genAI = new GoogleGenerativeAI(effectiveGeminiKey);
  const geminiModelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const model = genAI.getGenerativeModel({ model: geminiModelName });

  // Adapter: provide `chat.completions.create` to map to Gemini `generateContent`
  const adapter = {
    chat: {
      completions: {
        create: async (params) => {
          // Build a single prompt string from the messages array
          let promptText = '';
          if (Array.isArray(params.messages)) {
            // Combine system and user messages into one prompt
            promptText = params.messages
              .map(m => (m.role === 'system' ? `SYSTEM: ${m.content}` : m.content))
              .join('\n\n');
          } else if (params.prompt) {
            promptText = params.prompt;
          } else if (params.input) {
            promptText = params.input;
          }

          // Use the correct generateContent method (v0.24.x SDK)
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: params.temperature ?? 0.7,
              maxOutputTokens: params.max_tokens ?? 1024,
            },
          });

          // Extract text using the SDK helper (works across all response shapes)
          let text = '';
          try {
            text = result.response.text();
          } catch (e) {
            // Fallback: try to dig into candidates manually
            try {
              text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } catch (_) {
              text = '';
            }
          }

          // Return an OpenAI-compatible response object that controllers expect
          return {
            id: null,
            object: 'chat.completion',
            created: Date.now(),
            model: geminiModelName,
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: text,
                },
              },
            ],
          };
        },
      },
    },
  };

  module.exports = adapter;
} else if (openaiKey) {
  // Use official OpenAI client
  if (!openaiKey.startsWith('sk-')) {
    console.warn('Warning: OPENAI_API_KEY does not start with "sk-". Ensure you provided a valid OpenAI API key.');
  }
  const openai = new OpenAI({ apiKey: openaiKey });
  module.exports = openai;
} else {
  throw new Error('Missing API key. Set OPENAI_API_KEY (for OpenAI) or GEMINI_API_KEY / a Google API key in server/.env');
}
