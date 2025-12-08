import { Entity, Property, OneToMany, Collection, Cascade, ManyToMany } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Evento } from '../evento/evento.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Entity()
export class Categoria extends BaseEntity {
    @Property({ nullable: false, unique: true })
    name!: string;
    
    @Property ({ nullable: true })
    description?: string;

    @OneToMany(() => Evento, (evento) => evento.eventoCategoria, {
      cascade: [Cascade.ALL],
    })
    eventos = new Collection<Evento>(this);

    @ManyToMany(() => Usuario, (usuario) => usuario.categoriasSeguidas, {
      cascade: [Cascade.ALL],
    })
    usuariosSeguidos = new Collection<Usuario>(this);
}