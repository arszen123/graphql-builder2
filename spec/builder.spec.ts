import "jasmine";
import {Entity, Field} from "../src/decorators";
import {GraphQLBuilder} from "../src/builder";
import {GraphQLQuery} from "../src/query";

describe('GraphQLBuilder', function () {
    @Entity({
        arguments: {
            id: {
                required: false,
            }
        }
    })
    class Human {
        @Field()
        public name;
        @Field()
        public age;
        @Field({
            arguments: {
                type: {
                    required: true,
                    default: 'full',
                }
            }
        })
        public address;
    }

    class NotEntityHuman {
        private name;
        private birthDate;
    }

    it('create function accepts @Entity decorated classes only', function () {
        expect(() => GraphQLBuilder.create(Human)).toBeTruthy();
        expect(() => GraphQLBuilder.create(NotEntityHuman)).toThrowError('Class is not a GraphQL entity.')
    });
    it('getQuery must return a GraphQLQuery instance', function () {
        const query = GraphQLBuilder.create(Human).getQuery();
        expect(query).toBeDefined();
        expect(query).toBeInstanceOf(GraphQLQuery);
    });

    describe('select', function () {
        const fields = ['name', 'age'];
        describe('with array of values', function () {
            const qb = GraphQLBuilder.create(Human).select(fields);
            it('when getSelect called it must return the array of selected fields', function () {
                expect(qb.getSelect()).toEqual(fields);
            });
        });
        describe('with single string values', function () {
            const qb = GraphQLBuilder.create(Human);
            for (const field of fields) {
                qb.select(field);
            }
            it('when getSelect called it must return the array of selected fields', function () {
                expect(qb.getSelect()).toEqual(fields);
            });
        });
    });

    describe('setArgument', function () {
        it('MUST set the argument', function () {
            const qb = GraphQLBuilder.create(Human)
                .setArgument('id', 10)
                .setArgument('address.type', 'full');
            expect(qb.getArguments()).toEqual({
                'id': 10,
                'address.type': 'full'
            });
        });
    });
    describe('setArguments', function () {
        const args = {
            'id': 10,
            'address.type': 'full'
        };
        it('MUST set the arguments', function () {
            const qb = GraphQLBuilder.create(Human)
                .setArguments(args);
            expect(qb.getArguments()).toEqual(args);
        });
    });
    describe('clearArguments', function () {
        const args = {
            'id': 10,
            'address.type': 'full'
        };
        it('MUST clear the arguments', function () {
            const qb = GraphQLBuilder.create(Human)
                .setArguments(args)
                .clearArgument();
            expect(qb.getArguments()).toEqual({});
        });
    });
});
