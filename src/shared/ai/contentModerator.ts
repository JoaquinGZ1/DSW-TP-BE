import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export interface ModerationResult {
  isInappropriate: boolean;
  reason?: string;
  detectedIssues?: string[];
}

/**
 * Modera el contenido de un evento usando OpenAI
 * @param name Nombre del evento
 * @param description Descripción del evento
 * @returns Resultado de la moderación
 */
export async function moderateEventContent(
  name: string,
  description: string
): Promise<ModerationResult> {
  try {
    // Validar que tengamos API key configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY no está configurada');
      // En caso de error de configuración, permitir la creación (failsafe)
      return { isInappropriate: false };
    }

    // Construir el prompt para el modelo de IA
    const prompt = `Analiza el siguiente contenido de un evento y determina si contiene lenguaje inapropiado, ofensivo, discriminatorio, violento, sexual explícito, o cualquier otro contenido inadecuado.

Nombre del evento: "${name}"
Descripción del evento: "${description}"

Responde ÚNICAMENTE con un JSON en el siguiente formato:
{
  "isInappropriate": true/false,
  "reason": "breve explicación si es inapropiado",
  "detectedIssues": ["lista", "de", "problemas", "detectados"]
}

Si el contenido es apropiado, devuelve isInappropriate: false y omite reason y detectedIssues.
Si el contenido es inapropiado, devuelve isInappropriate: true e incluye la razón y los problemas detectados.`;

    // Llamar a la API de OpenAI usando el AI SDK
    const { text } = await generateText({
      model: openai('gpt-4o-mini'), // Modelo rápido y económico
      prompt: prompt,
      temperature: 0.3, // Baja temperatura para respuestas más consistentes
    });

    // Parsear la respuesta
    let result: ModerationResult;
    try {
      // Intentar extraer el JSON de la respuesta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        // Si no se encuentra JSON, intentar parsear directamente
        result = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('Error al parsear respuesta de IA:', parseError);
      console.log('Respuesta recibida:', text);
      // En caso de error de parseo, permitir la creación (failsafe)
      return { isInappropriate: false };
    }

    return result;
  } catch (error: any) {
    console.error('Error en moderación de contenido:', error.message);
    // En caso de error, permitir la creación (failsafe)
    return { isInappropriate: false };
  }
}

/**
 * Valida que el contenido del evento sea apropiado
 * Lanza un error si el contenido es inapropiado
 */
export async function validateEventContent(
  name: string,
  description: string
): Promise<void> {
  const moderationResult = await moderateEventContent(name, description);

  if (moderationResult.isInappropriate) {
    // Construir un mensaje detallado con la información disponible
    let errorMessage = moderationResult.reason || 'Contenido inapropiado detectado';
    
    // Agregar problemas específicos si están disponibles
    if (moderationResult.detectedIssues && moderationResult.detectedIssues.length > 0) {
      errorMessage += `. Problemas detectados: ${moderationResult.detectedIssues.join(', ')}`;
    }

    throw new Error(errorMessage);
  }
}
