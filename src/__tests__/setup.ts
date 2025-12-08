import { orm } from '../shared/db/orm.js';
import { MikroORM } from '@mikro-orm/core';

let ormInstance: MikroORM;

beforeAll(async () => {
  ormInstance = await orm.connect();
});

afterAll(async () => {
  // Dar tiempo a que todas las operaciones de DB terminen
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Cerrar ORM
  await orm.close();
}, 30000);

// Crear un nuevo fork del EntityManager para cada test
beforeEach(() => {
  if (ormInstance) {
    // Limpiar el identity map antes de cada test
    ormInstance.em.clear();
  }
});

