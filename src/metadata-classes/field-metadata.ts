import {IArgument, IEntity} from "../interfaces";

export class FieldMetadata {
    constructor(
        public readonly name: string,
        protected readonly parameters: { [key: string]: IArgument },
        public readonly type: IEntity,
    ) {
    }

    public getArguments(): {[key: string]: IArgument} {
        return this.parameters;
    }

    public isEntity():boolean {
        return typeof this.type !== 'undefined' && typeof this.type._metadata !== 'undefined';
    }
}
