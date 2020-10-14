# GraphQL query builder in TypeScript

### Decorators:

Entity (Class decorator):
```typescript
@Entity({
    name?: string // default: class name
})
```
Field (Property decorator):
```typescript
@Field({
    name?: string // default: property name
})
```
Example usage:
```typescript
@Entity()
class Human {
    @Field()
    public name;
}
```
- - -

### GraphQLBuilder

Example 1:
```typescript
import {Entity, Field} from "./src/decorators";
import {GraphQLBuilder} from "./src/builder"

@Entity()
class Human {
    @Field()
    public name;
}

GraphQLBuilder.create(Human) // returns: GraphQLBuilder
    .getQuery() // returns: GraphQLQuery
    .getQuery(true); // returns (GraphQL query string): string 
```
Output 1:
```graphql schema
query {
  Human {
    name
  }
}
```

- - -

Example 2:
```typescript
import {Entity, Field} from "./src/decorators";
import {GraphQLBuilder} from "./src/builder"

@Entity()
class Human {
    @Field()
    public name;
    @Field()
    public age;
    @Field()
    public country;
}

GraphQLBuilder.create(Human)
    .select('name')
    .select('age')
    //.select(['name', 'age']) // short
    .getQuery()
    .getQuery(true); 
```
Output 1:
```graphql schema
query {
  Human {
    name
    age
  }
}
```

### TODO

1. ~~Refactor test cases~~
2. ~~Specify types (Type safety)~~
3. ~~Create build script~~
4. Add support for class extension
