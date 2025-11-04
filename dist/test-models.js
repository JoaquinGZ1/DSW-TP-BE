// Script para listar modelos disponibles
import 'dotenv/config';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
console.log('🔍 Verificando API Key:', process.env.GOOGLE_GENERATIVE_AI_API_KEY ? '✅ Configurada' : '❌ No configurada');
// Probar con diferentes nombres de modelos
const modelos = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
];
for (const modelo of modelos) {
    console.log(`\n📝 Probando modelo: ${modelo}`);
    try {
        const { text } = await generateText({
            model: google(modelo),
            prompt: 'Di "hola" en una palabra',
        });
        console.log(`✅ ${modelo} funciona! Respuesta:`, text);
        break; // Si funciona, salir del loop
    }
    catch (error) {
        console.log(`❌ ${modelo} no funciona:`, error.message);
    }
}
//# sourceMappingURL=test-models.js.map