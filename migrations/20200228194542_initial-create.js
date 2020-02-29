export const up = async (knex) => {
    await knex.schema.dropTableIfExists('tags')
    await knex.schema.createTable('tags', t => {
        t.string('tag').primary()
    })

    await knex.schema.dropTableIfExists('tag_lines')
    await knex.schema.createTable('tag_lines', t => {
        t.increments()
        t.string('pic_id').notNullable().index()
        t.string('tag').notNullable().references('tag').inTable('tags')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })
}

export const down = async (knex) => {
    await knex.schema.dropTableIfExists('tags_lines')
    await knex.schema.dropTableIfExists('tags')
}
