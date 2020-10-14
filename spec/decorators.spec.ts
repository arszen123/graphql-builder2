import "jasmine";
import {Entity, Field} from "../src/decorators";
import {ClassMetadata} from "../src/metadata-classes/class-metadata";
import {IEntityArgument, IField} from "../src/interfaces";

describe('@Entity decorator', function () {
    describe('when used by default on a class', function () {
        @Entity()
        class Human {
            public name;
        }

        const metadata = (Human as unknown as { _metadata: ClassMetadata | any })._metadata;
        it('must create a static _metadata property on the class', function () {
            expect(metadata).toBeDefined();
            expect(metadata).toBeInstanceOf(ClassMetadata);
        });
        describe('the created _metadata', function () {
            it('name should be equal the class name', function () {
                expect(metadata.getName()).toEqual(Human.name);
            });
        })
    })
    describe('when used with configuration on a class', function () {
        const config: { name: string, arguments: { [key: string]: IEntityArgument } } = {
            name: 'human',
            arguments: {
                id: {
                    required: false
                }
            }
        };

        @Entity(config)
        class Human {
            public name;
        }

        const metadata = (Human as unknown as { _metadata: ClassMetadata | any })._metadata;
        describe('the created _metadata', function () {
            it('name should be equal the configuration name', function () {
                expect(metadata.getName()).toEqual(config.name);
            });
            it('argument list should be equal to configuration argument list', function () {
                expect(metadata.getArguments()).toEqual(config.arguments);
            });
        })
    })
});

describe('@Field decorator', function () {
    describe('when used by default on class properties', function () {
        @Entity()
        class Human {
            private id;
            @Field()
            private name;
            @Field()
            private birthDate;
        }

        const metadata = (Human as unknown as { _metadata: ClassMetadata | any })._metadata;
        it('the class _metadata property should contain the properties which has the decorator', function () {
            const fields = metadata.getFields();
            expect(fields).toBeDefined();
            expect(Object.keys(fields)).toEqual(['name', 'birthDate']);
        })
    });
    describe('when used with configuration, on class properties', function () {
        const nameConfig: IField = {
            arguments: {
                type: {
                    required: false,
                    default: 'full'
                }
            }
        };
        const birthDateConfig: IField = {
            name: 'birth_date',
        };

        @Entity()
        class Human {
            @Field(nameConfig)
            private name;
            @Field(birthDateConfig)
            private birthDate;
        }

        const metadata = (Human as unknown as { _metadata: ClassMetadata | any })._metadata;
        it('the class _metadata property should contain the properties which has the decorator', function () {
            const fields = metadata.getFields();
            expect(fields).toBeDefined();
            expect(Object.keys(fields)).toEqual(['name', 'birth_date']);
        });
        it('the configured property field must have the provided config', function () {
            const nameField = metadata.getFields().name;
            const bdField = metadata.getFields().birth_date;
            expect(nameField.name).toBeDefined();
            expect(nameField.name).toEqual('name');
            expect(nameField.getArguments()).toBeDefined();
            expect(nameField.getArguments()).toEqual(nameConfig.arguments);

            expect(bdField.name).toBeDefined();
            expect(bdField.name).toEqual(birthDateConfig.name);
            expect(bdField.getArguments()).toBeDefined();
            expect(Object.keys(bdField.getArguments()).length).toEqual(0);
        })
    })
});
