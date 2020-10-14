import {ClassMetadata} from "./metadata-classes/class-metadata";
import {IEntity} from "./interfaces";
import {GraphQLQuery} from "./query";
import {IArgumentType} from "./types";

declare type ArgumentType = string | number | boolean | IArgumentType<any>;

export class GraphQLBuilder<T> {

    protected _select: string[] = [];
    protected _arguments: { [key: string]: ArgumentType } = {};

    protected constructor(public readonly entity: T | IEntity) {
    }

    public static create<T>(entity: new (...args: any[]) => T) {
        if (!('_metadata' in entity && (entity as { _metadata: any })._metadata instanceof ClassMetadata)) {
            throw new Error('Class is not a GraphQL entity.');
        }
        return new GraphQLBuilder<T>(entity as IEntity);
    }

    public getQuery() {
        return new GraphQLQuery<T>(this);
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

    public setArgument(key: string, value: ArgumentType) {
        this._arguments[key] = value;
        return this;
    }

    public setArguments(value: { [key: string]: ArgumentType }) {
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                this._arguments[key] = value[key];
            }
        }
        return this;
    }

    public getArguments(): { [key: string]: ArgumentType } {
        const res: { [key: string]: ArgumentType } = {};
        for (const key in this._arguments) {
            if (this._arguments.hasOwnProperty(key)) {
                res[key] = this._arguments[key];
            }
        }
        return res;
    }

    public clearArgument() {
        this._arguments = {};
        return this;
    }
}
