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
        obj._metadata.addField(name, new FieldMetadata(name, prop?.arguments || {}));
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
