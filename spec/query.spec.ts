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
    @Entity({
        arguments: {
            id: {default: 1, required: false}
        }
    })
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

    it('the generated query MUST contain the arguments with default value', function () {
        const queryString = GraphQLBuilder.create(Human).getQuery().getQuery();
        expect(queryString).toBe(`Human (id: 1) {
  name(type: "full")
  age
}`);
    })
});


describe('GraphQLBuilder with selected fields', function () {
    @Entity()
    class Human {
        @Field()
        public name;
        @Field()
        public age;
        @Field()
        public address;
    }

    const fields = ['name', 'age'];
    const qb = GraphQLBuilder.create(Human).select(fields);
    it('the produced graphql query must contain only the selected fields', function () {
        expect(qb.getQuery().getQuery()).toBe(`Human {
  name
  age
}`);
    })
});

describe('When graphql query created from Entity class and Fields with arguments', function () {
    @Entity({
        arguments: {
            id: {default: 1, required: false}
        }
    })
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

    it('the generated query MUST contain the arguments with default value', function () {
        const queryString = GraphQLBuilder.create(Human)
            .setArgument('id', 10)
            .setArgument('name.type', 'first')
            .getQuery()
            .getQuery();
        expect(queryString).toBe(`Human (id: 10) {
  name(type: "first")
  age
}`);
    })
});

describe('Entity param name conflicts with a field in a query', function () {
    @Entity({
        arguments: {
            id: {
                required: true,
                alias: 'entityId',
            }
        }
    })
    class Human {
        @Field({
            arguments: {
                type: {
                    required: false,
                    default: 'primary',
                }
            }
        })
        public id;
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

    it('it MUST work well...', function () {
        const queryString = GraphQLBuilder.create(Human)
            .setArgument('entityId', 10)
            .setArgument('id.type', 'foreign')
            .setArgument('name.type', 'first')
            .getQuery()
            .getQuery();
        expect(queryString).toBe(`Human (id: 10) {
  id(type: "foreign")
  name(type: "first")
  age
}`);
    })
});

describe('GraphQLQuery.execute', function () {
    @Entity()
    class Dog {
        @Field()
        public name;

        public bark() {
            return this.name + ': BARK!';
        }
    }

    @Entity()
    class Human {
        @Field()
        public id;
        @Field()
        public name;
        @Field()
        public age;
        @Field({type: Dog})
        public dogs?: Dog[];
    }

    const dogData = {
        name: 'Flash',
    };

    const humanData = {
        id: 1,
        name: 'Don Joe',
        age: '20',
        dogs: [dogData],
    };

    it('it MUST work well...', async function () {
        const result = await GraphQLBuilder.create(Dog)
            .getQuery()
            .execute(query => new Promise<any>((resolve, reject) => resolve(dogData)));
        expect(result).toBeInstanceOf(Dog);
        const dog = (result as Dog);
        expect(dog.name).toBeDefined();
        expect(dog.name).toEqual(dogData.name);
        expect(dog.bark()).toEqual(dogData.name + ': BARK!');
    })

    it('it MUST work well too...', async function () {
        const result = await GraphQLBuilder.create(Human)
            .getQuery()
            .execute(query => new Promise<any>((resolve, reject) => resolve(humanData)));
        expect(result).toBeInstanceOf(Human);
        const human = (result as Human);
        expect(human.dogs).toBeDefined();
        const dogs = (human.dogs as Dog[])
        expect(dogs.length).toBe(1);
        const dog = dogs[0];
        expect(dog).toBeDefined();
        expect(dog.name).toBe(humanData.dogs[0].name);
    })
});
