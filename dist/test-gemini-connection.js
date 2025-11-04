// Script simple para probar la conexión con Gemini
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
console.log('🔍 Verificando conexión con Gemini API...\n');
console.log('API Key:', process.env.GOOGLE_GENERATIVE_AI_API_KEY ? '✅ Configurada' : '❌ No configurada');
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY no está configurada en el .env');
    process.exit(1);
}
try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    // Lista de modelos actualizados de Gemini (según documentación oficial)
    const modelsToTry = [
        'models/gemini-1.5-flash',
        'models/gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'models/gemini-pro',
        'gemini-pro',
    ];
    let modelFound = false;
    for (const modelName of modelsToTry) {
        console.log(`\n📝 Probando ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Di solo "hola"');
            const response = await result.response;
            const text = response.text();
            console.log(`✅ ¡${modelName} funciona! Respuesta:`, text);
            console.log(`\n🎉 La API de Gemini está funcionando correctamente con el modelo: ${modelName}`);
            modelFound = true;
            break;
        }
        catch (error) {
            console.log(`❌ ${modelName} no disponible:`, error.message.split('\n')[0]);
        }
    }
    if (!modelFound) {
        console.error('\n❌ Ningún modelo de Gemini está disponible con esta API key');
    }
}
catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPosibles causas:');
    console.error('1. La API key no es válida o expiró');
    console.error('2. El proyecto no tiene habilitada la Generative Language API');
    console.error('3. La API key tiene restricciones configuradas');
    console.error('\nSolución: Crea una nueva API key en https://aistudio.google.com/app/apikey');
    console.error('Asegúrate de seleccionar "Create API key in NEW project"');
}
//# sourceMappingURL=test-gemini-connection.js.map