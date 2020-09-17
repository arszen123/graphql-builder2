export abstract class IArgumentType<T> {
    public constructor(protected readonly value: T) {
    }

    abstract getValueForQuery(): string;
}

export class ArgumentTypeString extends IArgumentType<string> {
    getValueForQuery(): string {
        return `"${this.value}"`;
    }
}

export class ArgumentTypeNumber extends IArgumentType<number | bigint> {
    getValueForQuery(): string {
        return `${this.value}`;
    }
}

export class ArgumentTypeBoolean extends IArgumentType<boolean> {
    getValueForQuery(): string {
        return `${this.value}`;
    }
}

export function wrapPrimitiveType(value: any) {
    const type = typeof value;
    switch (type) {
        case 'string':
            return new ArgumentTypeString(value);
        case 'number':
            return new ArgumentTypeNumber(value);
        case 'boolean':
            return new ArgumentTypeBoolean(value);
    }
    throw new Error(`Can't wrap type ${type}!`);
}
