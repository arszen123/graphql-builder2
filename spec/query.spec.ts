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
