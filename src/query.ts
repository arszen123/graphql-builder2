import {GraphQLBuilder} from "./builder";
import {ClassMetadata} from "./metadata-classes/class-metadata";
import {FieldMetadata} from "./metadata-classes/field-metadata";
import {IArgument} from "./interfaces";
import {wrapPrimitiveType} from "./types";

export class GraphQLQuery {
    public static executor = (query: string) => new Promise((res, rej) => res({}));
    public static indention = '  ';
    private query;
    protected metadata: ClassMetadata;
    public constructor(protected readonly builder: GraphQLBuilder) {
        this.metadata = this.builder.entity._metadata;
        this._build();
    }

    protected _build() {
        this.query = this._buildQuery(this.metadata);
    }

    protected _buildQuery(metadata: ClassMetadata, name?: string): string {
        const className = name || metadata.getName();
        const fieldsArray = this._buildFields(metadata.getFields());
        const lineBreak = '\n';
        const fields = fieldsArray.map(v => GraphQLQuery.indention + v).join(lineBreak);
        let argumentList = this._buildArguments(metadata.getArguments());
        if (argumentList !== '') {
            argumentList += ' ';
        }
        return `${className} ${argumentList}{${lineBreak}${fields}${lineBreak}}`;
    }

    protected _buildFields(properties: {[key:string]: FieldMetadata}): string[] {
        const res: string[] = [];
        for (const propertiesKey in properties) {
            if (properties.hasOwnProperty(propertiesKey)) {
                const prop = properties[propertiesKey];
                if (prop.isEntity()) {
                    const nestedEntity = this._buildQuery(prop.type._metadata, prop.name);
                    for (const line of nestedEntity.split('\n')) {
                        res.push(line);
                    }
                    continue;
                }
                const argumentList = this._buildArguments(prop.getArguments());
                res.push(prop.name + argumentList);
            }
        }
        return res
    }

    protected _buildArguments(args: { [key: string]: IArgument }): string {
        const res: string[] = [];
        for (const argName in args) {
            if (!args.hasOwnProperty(argName)) {
                continue;
            }
            const arg = args[argName];
            const argValue = arg.default;
            if (arg.required && typeof argValue === 'undefined') {
                throw new Error(`Argument '${argName}' is required, but the value is not provided!`);
            }
            const queryArgValue = this._createArgumentValue(argValue);
            res.push(`${argName}: ${queryArgValue}`);
        }
        if (res.length === 0) {
            return '';
        }
        return '(' + res.join(', ') + ')';
    }

    protected _createArgumentValue(value: any) {
        return wrapPrimitiveType(value).getValueForQuery();
    }

    public getQuery(withQuery = false): string {
        let res = this.query;
        if (withQuery) {
            res = res.split('\n').map(v => GraphQLQuery.indention + v).join('\n');
            res = `query {\n${res}\n}`
        }
        return res;
    }

    public async execute(callback?: (query: string) => Promise<any>) {
        let cb = GraphQLQuery.executor;
        if (typeof callback !== 'undefined') {
            cb = callback;
        }

        return await cb(this.getQuery());
    }
}
