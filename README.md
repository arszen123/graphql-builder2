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

Example:
```typescript
GraphQLBuilder.create(Human) // returns: GraphQLBuilder
    .getQuery() // returns: GraphQLQuery
    .getQuery(true); // returns (GraphQL query string): string 
```
Output:
```graphql schema
query {
  Human {
    name
  }
}
```
