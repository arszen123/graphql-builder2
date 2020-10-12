import {ClassMetadata} from "./metadata-classes/class-metadata";

export interface IEntity {
    /**
     * Stores the class definitions.
     */
    _metadata: ClassMetadata;
}

export interface IField {
    /**
     * The field name.
     * @default The property name
     */
    name?: string;
    arguments?: { [key: string]: IArgument };
    /**
     * The field Entity type. Currently only supported classes with @Entity decorator.
     */
    type?: object | {_metadata: ClassMetadata} | IEntity;
}

export interface IArgument {
    required: boolean;
    default?: string | number;
}

export interface IEntityArgument extends IArgument{
    /**
     * Alias to refer to an entity argument.
     * Use when an entity argument name conflicts with a field name.
     */
    alias?: string;
}
