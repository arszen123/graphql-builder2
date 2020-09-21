import "jasmine";
import {transformSelect} from "../src/helper";

describe('transformSelect called with array of fields (Nested fields concatenated with dots)', function () {
    it('MUST return a valid object transformation, where keys are the fields name, and the fields value is 1 on the leafs', function () {
        const arr = ['name', 'age', 'friends.name', 'address.country', 'address.city.id', 'address.city.zipCode'];
        const res = transformSelect(arr);
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
