import "jasmine";
import {nestObject} from "../src/helper";

describe('nestObject called with array of fields (Nested fields concatenated with dots)', function () {
    it('MUST return a valid object transformation, where keys are the fields name, and the fields value is 1 on the leafs', function () {
        const arr = ['name', 'age', 'friends.name', 'address.country', 'address.city.id', 'address.city.zipCode'];
        const res = nestObject(arr);
        expect(res).toEqual({
            name: 1,
            age: 1,
            friends: {
                name: 1,
            },
            address: {
                country: 1,
                city: {
                    id: 1,
                    zipCode: 1
                }
            }
        })
    });
});
describe('nestObject called with object (Nested fields concatenated with dots)', function () {
    it('MUST return a valid object transformation, where keys are the fields name, and the fields value is the original object values', function () {
        const arr = {
            'name': 'Test Test',
            'age': 10,
            'friends.name': 'Test Friend',
            'address.country': 'Hungary',
            'address.city.id': 10,
            'address.city.zipCode': 2020
        };
        const res = nestObject(arr);
        expect(res).toEqual({
            name: 'Test Test',
            age: 10,
            friends: {
                name: 'Test Friend',
            },
            address: {
                country: 'Hungary',
                city: {
                    id: 10,
                    zipCode: 2020
                }
            }
        })
    });
});
