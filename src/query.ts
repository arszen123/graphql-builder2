import {GraphQLBuilder} from "./builder";
import {ClassMetadata} from "./metadata-classes/class-metadata";
import {FieldMetadata} from "./metadata-classes/field-metadata";

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
        this.query = this._buildQuery();
    }

    protected _buildQuery(): string {
        const className = this.metadata.getName();
        const fieldsArray = this._buildFields(this.metadata.getFields());
        const lineBreak = '\n';
        const fields = fieldsArray.map(v => GraphQLQuery.indention + v).join(lineBreak);
        return `${className} {${lineBreak}${fields}${lineBreak}}`;
    }

    protected _buildFields(properties: {[key:string]: FieldMetadata}): string[] {
        const res: string[] = [];
        for (const propertiesKey in properties) {
            if (properties.hasOwnProperty(propertiesKey)) {
                res.push(properties[propertiesKey].name);
            }
        }
        return res
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
