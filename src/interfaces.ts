import {ClassMetadata} from "./metadata-classes/class-metadata";

export interface IEntity {
    _metadata: ClassMetadata;
}

export interface IField {
    name?: string;
    arguments?: { [key: string]: IArgument };
}

export interface IArgument {
    required: boolean;
    default?: string | number;
}
