import "jasmine";
import {Entity, Field} from "../src/decorators";
import {ClassMetadata} from "../src/metadata-classes/class-metadata";

describe('Class with @Entity decorator', function () {
    @Entity()
    class Human {
        private name;
    }

    it('must have static property \'_metadata\'', function () {
        const metadata = (Human as unknown as { _metadata: any })._metadata;
        expect(metadata).toBeDefined();
        expect(metadata).toBeInstanceOf(ClassMetadata);
    })
});

describe('Class with @Entity decorator and fields with @Field decorator', function () {
    @Entity()
    class Human {
        @Field()
        private name;
        @Field()
        private birthDate;
    }

    it('must have static property \'_metadata\'', function () {
        const metadata = (Human as unknown as { _metadata: any })._metadata;
        expect(metadata).toBeDefined();
        expect(metadata).toBeInstanceOf(ClassMetadata);
    });

    it('must have static property \'_metadata\' that contains the class fields definition', function () {
        const metadata = (Human as unknown as { _metadata: ClassMetadata })._metadata;
        expect(metadata.getFields()).toBeDefined();
        expect(Object.keys(metadata.getFields()).length).toEqual(2);
    })
});
