import {ClassMetadata} from "./metadata-classes/class-metadata";
import {IEntity} from "./interfaces";
import {GraphQLQuery} from "./query";

export class GraphQLBuilder {

    protected _select: string[] = [];

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

    public select(fields: string | string[]) {
        if (typeof fields === 'string') {
            fields = [fields];
        }
        this._select.push(...fields);
        this._select = this._select.filter((value, index, arr) => arr.indexOf(value) === index);
        return this;
    }

    public getSelect(): string[] {
        const res: string[] = [];
        for (const item of this._select) {
            res.push(item);
        }
        return res;
    }

    public clearSelect() {
        this._select = [];
        return this;
    }
}
