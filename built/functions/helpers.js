"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let shuffleFisherYates = (array) => {
    let i = array.length;
    while (i--) {
        const ri = Math.floor(Math.random() * (i + 1));
        [array[i], array[ri]] = [array[ri], array[i]];
    }
    return array;
};
exports.shuffleFisherYates = shuffleFisherYates;
let suppressSingles = (array) => {
    for (let i = array.length - 1; i >= 0; i++) {
        let temp = array.pop();
        if (array.includes(temp)) {
            //console.log("it's a duplicate, insert again")
            array.unshift(temp);
        }
        else {
            console.log("unique!");
        }
    }
    console.log(array);
    return array;
};
exports.suppressSingles = suppressSingles;
let suppressLocations = (k = 2, array) => {
    let found = 0;
    let unique = [];
    for (let i = 0; i < array.length; i++) {
        let temp = array[i];
        for (let j = 0; j < array.length; j++) {
            if (temp.lat == array[j].lat &&
                temp.lon == array[j].lon &&
                i != j) {
                found++;
                break;
            }
        }
        if (found < k - 1) {
            unique.push(i);
        }
        found = 0;
    }
    let result = [];
    for (let i = 0; i < array.length; i++) {
        if (!unique.includes(i))
            result.push(array[i]);
    }
    return result;
};
exports.suppressLocations = suppressLocations;
//# sourceMappingURL=helpers.js.map