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
