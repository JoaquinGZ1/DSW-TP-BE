// Script para listar modelos disponibles de Gemini
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
console.log('🔍 Listando modelos disponibles de Gemini...\n');
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY no está configurada en el .env');
    process.exit(1);
}
try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    // Listar modelos disponibles
    const models = await genAI.listModels();
    console.log('📋 Modelos disponibles:\n');
    for (const model of models) {
        console.log(`✅ ${model.name}`);
        console.log(`   - Display Name: ${model.displayName}`);
        console.log(`   - Soporta generateContent: ${model.supportedGenerationMethods?.includes('generateContent') ? 'Sí' : 'No'}`);
        console.log('');
    }
    // Filtrar modelos que soportan generateContent
    const compatibleModels = models.filter(m => m.supportedGenerationMethods?.includes('generateContent'));
    if (compatibleModels.length > 0) {
        console.log('\n🎯 Modelos compatibles con generateContent:');
        compatibleModels.forEach(m => {
            console.log(`   - ${m.name.replace('models/', '')}`);
        });
        // Probar con el primer modelo compatible
        const modelToUse = compatibleModels[0].name.replace('models/', '');
        console.log(`\n📝 Probando con: ${modelToUse}...`);
        const model = genAI.getGenerativeModel({ model: modelToUse });
        const result = await model.generateContent('Di solo "hola"');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ¡Funciona! Respuesta: ${text}`);
        console.log(`\n🎉 Usa este modelo en tu código: "${modelToUse}"`);
    }
    else {
        console.log('\n❌ No se encontraron modelos compatibles');
    }
}
catch (error) {
    console.error('\n❌ Error:', error.message);
}
//# sourceMappingURL=list-models.js.map