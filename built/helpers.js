"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleFisherYates = (array) => {
    let i = array.length;
    while (i--) {
        const ri = Math.floor(Math.random() * (i + 1));
        [array[i], array[ri]] = [array[ri], array[i]];
    }
    return array;
};
//# sourceMappingURL=helpers.js.map