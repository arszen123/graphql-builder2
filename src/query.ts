import {GraphQLBuilder} from "./builder";
import {ClassMetadata} from "./metadata-classes/class-metadata";
import {FieldMetadata} from "./metadata-classes/field-metadata";
import {IArgument, IEntity, IEntityArgument} from "./interfaces";
import {wrapPrimitiveType} from "./types";
import {nestObject} from "./helper";

export class GraphQLQuery<T> {
    public static executor = (query: string) => new Promise<any>((res, rej) => res({}));
    public static indention = '  ';
    private query;
    protected metadata: ClassMetadata;
    private readonly entity: T|IEntity;

    public constructor(protected readonly builder: GraphQLBuilder<T>) {
        this.metadata = (this.builder.entity as IEntity)._metadata;
        this.entity = this.builder.entity;
        this._build();
    }

    protected _build() {
        let selectedFields: any = nestObject(this.builder.getSelect());
        const args: any = nestObject(this.builder.getArguments());
        if (Object.keys(selectedFields).length === 0) {
            selectedFields = undefined;
        }
        this.query = this._buildQuery(this.metadata, selectedFields, args);
    }

    protected _buildQuery(metadata: ClassMetadata, selectedFields: { [key: string]: any }, args: { [key: string]: object }, name?: string): string {
        const className = name || metadata.getName();
        const fieldsArray = this._buildFields(metadata.getFields(), selectedFields, args || {});
        const lineBreak = '\n';
        const fields = fieldsArray.map(v => GraphQLQuery.indention + v).join(lineBreak);
        let argumentList = this._buildArguments(metadata.getArguments(), args || {});
        if (argumentList !== '') {
            argumentList += ' ';
        }
        return `${className} ${argumentList}{${lineBreak}${fields}${lineBreak}}`;
    }

    protected _buildFields(properties: { [key: string]: FieldMetadata }, selectedFields: { [key: string]: any } | undefined, argsValue: { [key: string]: object }): string[] {
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
            const args  = argsValue[prop.name] as {[key: string]: object};
            if (prop.isEntity()) {
                let nestedEntitySelectedFields;
                if (selectedField !== 1) {
                    nestedEntitySelectedFields = selectedFields;
                }
                const nestedEntity = this._buildQuery(prop.type._metadata, nestedEntitySelectedFields, args, prop.name);
                for (const line of nestedEntity.split('\n')) {
                    res.push(line);
                }
                continue;
            }
            const argumentList = this._buildArguments(prop.getArguments(), args || {});
            res.push(prop.name + argumentList);
        }
        return res
    }

    protected _buildArguments(argumentList: { [key: string]: IArgument }, argsValue: { [key: string]: any }): string {
        const res: string[] = [];
        for (const argName in argumentList) {
            if (!argumentList.hasOwnProperty(argName)) {
                continue;
            }
            const arg = argumentList[argName];
            const argValue = argsValue[(arg as IEntityArgument).alias || argName] || arg.default;
            const isUndefinedValue = typeof argValue === 'undefined';
            if (arg.required && isUndefinedValue) {
                throw new Error(`Argument '${argName}' is required, but the value is not provided!`);
            }
            if (isUndefinedValue) {
                continue;
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

    public async execute(callback?: (query: string) => Promise<any>): Promise<T> {
        let cb = GraphQLQuery.executor;
        if (typeof callback !== 'undefined') {
            cb = callback;
        }

        const data = await cb(this.getQuery());
        const entityClass = (this.entity as unknown as new (...args:any[]) => any);
        const entity = new entityClass();
        return (this._fillEntity(entity, this.metadata, data) as T);
    }

    /**
     * Build the response entity recursively.
     */
    private _fillEntity(entity: object, metadata: ClassMetadata, data: any): any {
        const fields = metadata.getFields();
        for (const fieldName in fields) {
            if (!fields.hasOwnProperty(fieldName)) {
                continue;
            }
            const field = fields[fieldName];
            if (field.isEntity()) {
                const subEntityClass = (field.type as unknown as new (...args:any[]) => any);
                const subEntity = new subEntityClass();
                if (Array.isArray(data[fieldName])) {
                    const subEntities: any = [];
                    for (const subEntityData of data[fieldName]) {
                        subEntities.push(this._fillEntity(subEntity, field.type._metadata, subEntityData));
                    }
                    entity[fieldName] = subEntities;
                    continue;
                }
                entity[fieldName] = this._fillEntity(subEntity, field.type._metadata, data[fieldName]);
                continue;
            }
            entity[fieldName] = data[fieldName];
        }
        return entity;
    }
}
