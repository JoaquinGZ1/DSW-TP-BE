import { MikroORM } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { MySqlDriver } from '@mikro-orm/mysql';

console.log('🔍 Database Configuration:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: process.env.DB_NAME || 'sge',
  driver: MySqlDriver,
  user: process.env.DB_USER || 'dsw',
  password: process.env.DB_PASSWORD || 'dsw',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});


export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()
  
  // In production (Railway), automatically create/update schema
  if (process.env.NODE_ENV === 'production') {
    console.log('🔨 Creating/updating database schema...');
    await generator.updateSchema();
    console.log('✅ Database schema ready');
  } else {
    // In development, use updateSchema
    await generator.updateSchema();
  }
}