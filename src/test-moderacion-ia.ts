// Script de prueba para la moderación de contenido con IA
// Ejecutar con: node dist/test-moderacion-ia.js

import 'dotenv/config';
import { moderateEventContent } from './shared/ai/contentModerator.js';

console.log('🧪 Iniciando pruebas de moderación de contenido con IA\n');
console.log('🔍 Verificando configuración...');
console.log('API Key configurada:', process.env.OPENAI_API_KEY ? '✅ Sí' : '❌ No');
if (process.env.OPENAI_API_KEY) {
  console.log('Primeros caracteres:', process.env.OPENAI_API_KEY.substring(0, 10) + '...\n');
} else {
  console.log('⚠️ Por favor configura OPENAI_API_KEY en el archivo .env\n');
}

// Prueba 1: Contenido apropiado
console.log('📝 Prueba 1: Contenido apropiado');
const test1 = await moderateEventContent(
  'Concierto de Rock',
  'Un increíble concierto de rock con las mejores bandas locales. Música en vivo, buena comida y diversión para toda la familia.'
);
console.log('Resultado:', test1);
console.log('✅ Esperado: isInappropriate = false\n');

// Prueba 2: Contenido inapropiado (lenguaje ofensivo)
console.log('📝 Prueba 2: Contenido con lenguaje ofensivo');
const test2 = await moderateEventContent(
  'Evento polémico',
  'Este evento es para insultar y discriminar a ciertos grupos de personas. Utilizaremos lenguaje vulgar y ofensivo.'
);
console.log('Resultado:', test2);
console.log('⚠️ Esperado: isInappropriate = true\n');

// Prueba 3: Contenido con violencia
console.log('📝 Prueba 3: Contenido violento');
const test3 = await moderateEventContent(
  'Evento de lucha extrema',
  'Pelea a muerte sin reglas. Violencia extrema garantizada. Sangre y destrucción aseguradas.'
);
console.log('Resultado:', test3);
console.log('⚠️ Esperado: isInappropriate = true\n');

// Prueba 4: Contenido apropiado pero con términos técnicos
console.log('📝 Prueba 4: Contenido técnico apropiado');
const test4 = await moderateEventContent(
  'Conferencia de Ciberseguridad',
  'Aprende sobre técnicas de hacking ético, pentesting y seguridad informática. Conferencias de expertos en el campo.'
);
console.log('Resultado:', test4);
console.log('✅ Esperado: isInappropriate = false\n');

console.log('🏁 Pruebas completadas');
