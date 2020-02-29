import {expect} from 'chai'
import knex from '../../database'
import {getTags, updateTags, searchTags} from '../../services/tags'

describe('tags service', () => {
    before( async () => {
        await knex.seed.run({specific: 'initial-seed.js'})
    })
    after( async () => {
        await knex('tag_lines').del()
        await knex('tags').del()
    })

    describe('getTags', () => {
        it('returns proper tags', async () => {
            const result = await getTags('pic2')
            expect(result.id, "id wasn't correct").to.be.equal('pic2')
            expect(result.tags, "tags wasn't correct").to.be.equal('scenic beautiful')
        })

        it('returns an empty string if id not found', async () => {
            const result = await getTags('pic-not-there')
            expect(result.id, "didn't return pic id").to.be.equal('pic-not-there')
            expect(result.tags, "tags were returned").to.be.empty
        })

        it('return an empty string if id is not a string', async () => {
            const result = await getTags(1)
            expect(result.id, "id isn't empty").to.be.empty
            expect(result.id, "id isn't string").to.be.a.string
            expect(result.tags, "tags were returned").to.be.empty

        })
        it('return an empty string if id an empty string', async () => {
            const result = await getTags('')
            expect(result.id, "id isn't empty").to.be.empty
            expect(result.id, "id isn't string").to.be.a.string
            expect(result.tags, "tags were returned").to.be.empty

        })
    })

    describe('searchTags', () => {
        describe('search results are most popular tags', () => {
            it('for an empty query ', async () => {
                const result = await searchTags({query: ''})
                expect(result.results, "results weren't correct").to.have.ordered.members(['beautiful', 'scenic'])
            })

            it('for a query that is just a space', async () => {
                const result = await searchTags({query: ' '})
                expect(result.results, "results weren't correct").to.have.ordered.members(['beautiful', 'scenic'])
            })

            it('for a query with a query has a space on the excluding ones in the query', async () => {
                const result = await searchTags({query: 'scenic '})
                expect(result.results, "results weren't correct").to.have.ordered.members(['scenic beautiful'])
            })
        })
        describe('search results match partial word', () => {
            it( 'if there is only one word in the query', async () => {
                const result = await searchTags({query: 'sce'})
                expect(result.results, "results weren't correct").to.have.ordered.members(['scenery', 'scenic'])
            })

            it('excluding ones in the query', async () => {
                const result = await searchTags({query: 'scenic be'})
                expect(result.results, "results weren't correct").to.have.ordered.members(['scenic beautiful'])
            })
        })
        describe('bad object passed in', () => {
            it('query not defined in object', async () => {
                const result = await searchTags({})
                expect(result.results, "no results").to.have.ordered.members(['beautiful', 'scenic'])
            })
        })
    })

    describe('updateTags', () => {
        afterEach( async () => {
            await knex('tag_lines').del()
            await knex('tags').del()
            await knex.seed.run({specific: 'initial-seed.js'})
        })

        it('updates a tag line', async () => {
            const result = await updateTags({id: 'pic1', tags: 'beautiful snow scenery'})
            const newTag = await knex('tags').where({tag: 'snow'}).select('tag')
            expect(result.id, "id wasn't correct").to.be.equal('pic1')
            expect(result.tags, "tags wasn't correct").to.be.equal('beautiful snow scenery')
            expect(newTag[0].tag, "new tag doesn't exits").to.be.equal('snow')
        })

        it('no id in passed object', async () => {
            const result = await updateTags({ tags: 'beautiful snow scenery'})
            expect(result.id, "id wasn't correct").to.be.equal('')
            expect(result.tags, "tags wasn't correct").to.be.equal('')
        })

        it('no tags in passed object', async () => {
            const result = await updateTags({ id: 'pic1' })
            expect(result.id, "id wasn't correct").to.be.equal('pic1')
            expect(result.tags, "tags wasn't correct").to.be.equal('')
        })

        it('empty string for id in passed object', async () => {
            const result = await updateTags({ id: '', tags: 'beautiful snow scenery' })
            expect(result.id, "id wasn't correct").to.be.equal('')
            expect(result.tags, "tags wasn't correct").to.be.equal('')
        })

        it('empty string for tags in passed object', async () => {
            const result = await updateTags({ id: 'pic1', tags: '' })
            expect(result.id, "id wasn't correct").to.be.equal('pic1')
            expect(result.tags, "tags wasn't correct").to.be.equal('')
        })

    })
})