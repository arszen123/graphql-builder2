import {ClassMetadata} from "./metadata-classes/class-metadata";
import {IEntity} from "./interfaces";
import {GraphQLQuery} from "./query";

export class GraphQLBuilder {

    protected constructor(public readonly entity: IEntity) {
    }

    public static create(entity: object) {
        if (!('_metadata' in entity && (entity as { _metadata: any })._metadata instanceof ClassMetadata)) {
            throw new Error('Class is not a GraphQL entity.');
        }
        return new GraphQLBuilder(entity as IEntity);
    }

    public getQuery() {
        return new GraphQLQuery(this);
    }
}
