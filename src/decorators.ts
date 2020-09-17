import {IEntity, IArgument, IField} from "./interfaces";
import {ClassMetadata} from "./metadata-classes/class-metadata";
import {FieldMetadata} from "./metadata-classes/field-metadata";

export function Entity(prop?: {
    name?: string // default: class name
    arguments?: {
        [key: string]: IArgument
    }
}) {
    return function (
        constructor: any
    ) {
        defineMetadataIfNotExists(constructor);
        const metadata: ClassMetadata = constructor._metadata;
        metadata.setName(prop?.name || constructor.name);
        metadata.setArgument(prop?.arguments || {});
    }
}

export function Field(prop?: IField) {
    return function <T>(
        target: object,
        propertyKey: string
    ) {
        defineMetadataIfNotExists(target.constructor);
        const obj = target.constructor as unknown as IEntity;
        const name = prop?.name || propertyKey;
        const type = prop?.type;
        assertFieldType(type);
        obj._metadata.addField(name, new FieldMetadata(name, prop?.arguments || {}, type as IEntity));
    }
}

function defineMetadataIfNotExists(target: object) {
    if (!target.hasOwnProperty('_metadata')) {
        // @ts-ignore
        const className = target.constructor.name;
        Object.defineProperty(target, '_metadata', {
            value: new ClassMetadata(className),
            writable: false,
        });
    }
}

/**
 * Check whether type is a valid Entity class or not.
 * @param type
 */
function assertFieldType(type: any) {
    if (typeof type !== 'undefined' && !('_metadata' in type && type._metadata instanceof ClassMetadata)) {
        throw new Error(`Field '${name}' is not a GraphQL entity.`);
    }
}
