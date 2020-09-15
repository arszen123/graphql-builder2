import {IArgument} from "../interfaces";

export class FieldMetadata {
    constructor(
        public readonly name: string,
        public readonly parameters: { [key: string]: IArgument },
    ) {
    }
}
