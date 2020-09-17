import "jasmine";
import {Entity, Field} from "../src/decorators";
import {GraphQLBuilder} from "../src/builder";

describe('GraphQLQuery', function () {
    @Entity()
    class Human {
        @Field()
        public name;
        @Field()
        public age;
    }
    it('MUST return a valid graphql query', function () {
        const query = GraphQLBuilder.create(Human).getQuery();
        const queryString = query.getQuery();
        expect(queryString).toBe(`Human {
  name
  age
}`);
        expect(query.getQuery(true)).toBe(`query {
  Human {
    name
    age
  }
}`)
    })
});


describe('When graphql query created from Entity class with Entity Field (nested object)', function () {
    @Entity()
    class Address {
        @Field()
        public country;
        @Field()
        public street;
        @Field()
        public zipCode;
    }
    @Entity()
    class Human {
        @Field({
            type: Address
        })
        public address;
    }

    it('MUST return the valid graphql query, with nested query', function () {
        const queryString = GraphQLBuilder.create(Human).getQuery().getQuery()
        expect(queryString).toBe(`Human {
  address {
    country
    street
    zipCode
  }
}`)
    });
});

describe('When graphql query created from Entity class and Fields with arguments', function () {
    @Entity()
    class Human {
        @Field({
            arguments: {
                type: {
                    required: true,
                    default: 'full'
                }
            }
        })
        public name;
        @Field()
        public age;
    }
    it('the generated query MUST contain the required arguments', function () {
        const queryString = GraphQLBuilder.create(Human).getQuery().getQuery();
        expect(queryString).toBe(`Human {
  name(type: "full")
  age
}`);
    })
});
