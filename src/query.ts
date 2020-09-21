import {GraphQLBuilder} from "./builder";
import {ClassMetadata} from "./metadata-classes/class-metadata";
import {FieldMetadata} from "./metadata-classes/field-metadata";
import {IArgument} from "./interfaces";
import {wrapPrimitiveType} from "./types";
import {transformSelect} from "./helper";

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
        let selectedFields: any = transformSelect(this.builder.getSelect());
        if (Object.keys(selectedFields).length === 0) {
            selectedFields = undefined;
        }
        this.query = this._buildQuery(this.metadata, selectedFields);
    }

    protected _buildQuery(metadata: ClassMetadata, selectedFields?: { [key: string]: any }, name?: string): string {
        const className = name || metadata.getName();
        const fieldsArray = this._buildFields(metadata.getFields(), selectedFields);
        const lineBreak = '\n';
        const fields = fieldsArray.map(v => GraphQLQuery.indention + v).join(lineBreak);
        let argumentList = this._buildArguments(metadata.getArguments());
        if (argumentList !== '') {
            argumentList += ' ';
        }
        return `${className} ${argumentList}{${lineBreak}${fields}${lineBreak}}`;
    }

    protected _buildFields(properties: { [key: string]: FieldMetadata }, selectedFields?: { [key: string]: any }): string[] {
        const res: string[] = [];
        // Skip ts "Object is possibly 'undefined'" error.
        const getSelectedFieldFn = (fieldName): 1 | { [key: string]: any } | undefined => {
            if (typeof selectedFields !== 'undefined') {
                return selectedFields[fieldName];
            }
            return 1;
        };
        for (const propertiesKey in properties) {
            if (!properties.hasOwnProperty(propertiesKey)) {
                continue;
            }
            const prop = properties[propertiesKey];
            const selectedField = getSelectedFieldFn(prop.name);
            if (typeof selectedField === 'undefined') {
                continue;
            }
            if (prop.isEntity()) {
                let nestedEntitySelectedFields;
                if (selectedField !== 1) {
                    nestedEntitySelectedFields = selectedFields;
                }
                const nestedEntity = this._buildQuery(prop.type._metadata, nestedEntitySelectedFields, prop.name);
                for (const line of nestedEntity.split('\n')) {
                    res.push(line);
                }
                continue;
            }
            const argumentList = this._buildArguments(prop.getArguments());
            res.push(prop.name + argumentList);
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
