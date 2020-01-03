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
//# sourceMappingURL=helpers.js.map