import "jasmine";
import {Entity, Field} from "../src/decorators";
import {GraphQLBuilder} from "../src/builder";
import {GraphQLQuery} from "../src/query";

describe('GraphQLBuilder', function () {
    @Entity()
    class Human {
        @Field()
        private name;
        @Field()
        private birthDate;
    }

    class NotEntityHuman {
        private name;
        private birthDate;
    }

    it('create function accepts class with \'_metadata\' only', function () {
        expect(() => GraphQLBuilder.create(Human)).toBeTruthy();
        expect(() => GraphQLBuilder.create(NotEntityHuman)).toThrowError('Class is not a GraphQL entity.')
    });
    it('getQuery must return a GraphQLQuery instance', function () {
        const query = GraphQLBuilder.create(Human).getQuery();
        expect(query).toBeDefined();
        expect(query).toBeInstanceOf(GraphQLQuery);
    })
});


describe('GraphQLBuilder with selected fields', function () {
    const fields = ['name', 'age'];

    @Entity()
    class Human {
        @Field()
        public name;
        @Field()
        public age;
        @Field()
        public address;
    }
    it('when getSelect called it must return the previously selected fields', function () {
        const qb = GraphQLBuilder.create(Human).select(fields);
        expect(qb.getSelect()).toEqual(fields);
    });
    it('when getSelect called it must return the previously selected fields', function () {
        const qb = GraphQLBuilder.create(Human);
        for (const field of fields) {
            qb.select(field);
        }
        expect(qb.getSelect()).toEqual(fields);
    });
});
