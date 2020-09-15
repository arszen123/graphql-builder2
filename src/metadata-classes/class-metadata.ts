import {FieldMetadata} from "./field-metadata";
import {IArgument} from "../interfaces";

export class ClassMetadata {
    protected fields: { [key: string]: FieldMetadata } = {};
    protected parameters: { [key: string]: IArgument } = {};

    constructor(
        protected name: string
    ) {
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getFields(): { [key: string]: FieldMetadata } {
        return this.fields;
    }

    public addField(key: string, field: FieldMetadata) {
        this.fields[key] = field;
    }

    public getArguments() {
        return this.parameters;
    }

    public setArgument(params: { [key: string]: IArgument }) {
        this.parameters = params;
    }
}
