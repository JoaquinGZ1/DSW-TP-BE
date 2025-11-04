# 🤖 Implementación de Moderación con IA

## Tecnología Utilizada

**OpenAI GPT-4o-mini** - Modelo de lenguaje de OpenAI para análisis de contenido.
**Librería**: `ai` (AI SDK de Vercel) + `@ai-sdk/openai` - SDK para integrar OpenAI en Node.js.

## ¿Cómo Funciona?

### 1. Obtener API Key de OpenAI

1. Crear cuenta en [OpenAI Platform](https://platform.openai.com/)
2. Ir a [API Keys](https://platform.openai.com/api-keys)
3. Crear nueva API key
4. Copiar la clave (solo se muestra una vez)
5. **Importante**: Agregar método de pago (costo muy bajo: ~$0.0001 por evento)

### 2. Configuración (Backend)

**Archivo**: `.env`

```env
OPENAI_API_KEY=sk-tu_clave_de_openai_aqui
```

**Instalar dependencias**:

```bash
pnpm install ai @ai-sdk/openai zod
```

### 3. Servicio de Moderación

**Archivo**: `src/shared/ai/contentModerator.ts`

```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export interface ModerationResult {
  isInappropriate: boolean
  reason?: string
  detectedIssues?: string[]
}

export async function moderateEventContent(
  name: string,
  description: string
): Promise<ModerationResult> {
  // Construir prompt para la IA
  const prompt = `Analiza el siguiente contenido de un evento y determina si contiene lenguaje inapropiado, ofensivo, discriminatorio, violento, sexual explícito, o cualquier otro contenido inadecuado.

Nombre del evento: "${name}"
Descripción del evento: "${description}"

Responde ÚNICAMENTE con un JSON en el siguiente formato:
{
  "isInappropriate": true/false,
  "reason": "breve explicación si es inapropiado",
  "detectedIssues": ["lista", "de", "problemas", "detectados"]
}`

  // Llamar a OpenAI
  const { text } = await generateText({
    model: openai('gpt-4o-mini'), // Modelo económico
    prompt: prompt,
    temperature: 0.3, // Baja temperatura = respuestas consistentes
  })

  // Parsear respuesta JSON
  const result: ModerationResult = JSON.parse(text)
  return result
}

export async function validateEventContent(
  name: string,
  description: string
): Promise<void> {
  const result = await moderateEventContent(name, description)

  if (result.isInappropriate) {
    let errorMessage = result.reason || 'Contenido inapropiado detectado'

    if (result.detectedIssues && result.detectedIssues.length > 0) {
      errorMessage += `. Problemas detectados: ${result.detectedIssues.join(
        ', '
      )}`
    }

    throw new Error(errorMessage)
  }
}
```

### 4. Integración en Controller

**Archivo**: `src/evento/evento.controller.ts`

```typescript
import { validateEventContent } from '../shared/ai/contentModerator.js'

async function add(req: Request, res: Response) {
  const eventoData = req.body

  // 🤖 MODERACIÓN CON IA
  try {
    await validateEventContent(eventoData.name, eventoData.description)
  } catch (moderationError: any) {
    return res.status(400).json({
      success: false,
      message: '🚫 No se puede crear el evento',
      reason: 'Contenido inapropiado detectado',
      details: moderationError.message,
    })
  }

  // Si pasa la moderación, crear el evento
  const evento = em.create(Evento, eventoData)
  await em.persistAndFlush(evento)

  res.status(201).json(evento)
}
```

### 5. Manejo en Frontend

**Archivo**: `src/pages/EventoCreate.js`

```javascript
try {
  const response = await axios.post(
    'http://localhost:4000/api/eventos',
    formData
  )
  alert('✅ Evento creado exitosamente')
  navigate('/EventosOrganizador')
} catch (error) {
  if (error.response && error.response.status === 400) {
    const errorData = error.response.data

    let errorMessage = '🚫 No se puede crear el evento\n\n'

    if (errorData.reason) {
      errorMessage += `${errorData.reason}\n\n`
    }

    if (errorData.details) {
      errorMessage += `Detalles: ${errorData.details}`
    }

    alert(errorMessage)
    return // No navegar, mantener formulario
  }

  alert(`Error: ${error.message}`)
}
```

## Flujo Completo

```
Organizador envía formulario
        ↓
Backend recibe petición POST /api/eventos
        ↓
Extrae nombre y descripción
        ↓
Llama a moderateEventContent()
        ↓
Envía prompt a OpenAI GPT-4o-mini
        ↓
IA analiza el contenido
        ↓
Devuelve JSON con resultado
        ↓
¿Es inapropiado?
    ↙        ↘
  SÍ          NO
   ↓           ↓
Lanza error    Continúa
con detalles   creación
   ↓           ↓
Controller     Evento
devuelve 400   creado
   ↓           ↓
Frontend       Frontend
muestra        muestra
mensaje        éxito
```

## Ejemplo de Respuestas de la IA

### Contenido Apropiado

```json
{
  "isInappropriate": false
}
```

### Contenido Inapropiado

```json
{
  "isInappropriate": true,
  "reason": "El evento contiene lenguaje ofensivo y discriminatorio",
  "detectedIssues": ["insultos", "lenguaje vulgar", "contenido discriminatorio"]
}
```

## Qué Detecta la IA

### ❌ Rechaza:

- Insultos y lenguaje ofensivo
- Discriminación (racial, género, religión, etc.)
- Violencia explícita
- Contenido sexual inadecuado
- Lenguaje vulgar excesivo

### ✅ Permite:

- Lenguaje técnico (ej: "killer feature", "evento explosivo")
- Términos del dominio de eventos
- Descripciones objetivas
- Referencias a películas/juegos (ej: "Tributo a Breaking Bad")

## Configuración del Modelo

```typescript
const { text } = await generateText({
  model: openai('gpt-4o-mini'), // Modelo rápido y económico
  prompt: prompt,
  temperature: 0.3, // 0.0-1.0: más bajo = más consistente
})
```

### Modelos disponibles:

- `gpt-4o-mini` - Recomendado (rápido, económico, preciso)
- `gpt-4o` - Más potente pero más costoso
- `gpt-3.5-turbo` - Económico pero menos preciso

## Costos Aproximados

**GPT-4o-mini**:

- Input: $0.150 por 1M tokens
- Output: $0.600 por 1M tokens
- **Por evento**: ~$0.0001 (1 centavo de dólar cada 100 eventos)

## Failsafe (Seguridad)

Si hay un error en la IA (API caída, error de configuración, etc.), **el sistema permite la creación del evento** para no bloquear completamente la funcionalidad:

```typescript
try {
  // Llamar a IA
  const result = await moderateEventContent(name, description)
  return result
} catch (error) {
  console.error('Error en moderación:', error)
  // FAILSAFE: Permitir creación si hay error técnico
  return { isInappropriate: false }
}
```

## Testing

**Archivo**: `src/test-moderacion-ia.ts`

```bash
npx ts-node src/test-moderacion-ia.ts
```

Ejecuta 4 casos de prueba:

1. ✅ Evento apropiado
2. ❌ Evento con insultos
3. ❌ Evento discriminatorio
4. ✅ Evento técnico (permite "killer")

## Características

- ✅ Análisis automático de contenido
- ✅ Respuesta en menos de 1 segundo
- ✅ Mensajes detallados con razones
- ✅ Lista de problemas detectados
- ✅ Failsafe si la API falla
- ✅ Costo muy bajo por operación
- ✅ No bloquea términos técnicos legítimos

## Variables de Entorno Requeridas

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Sin esta variable, el sistema funcionará pero NO moderará contenido** (failsafe activo).
