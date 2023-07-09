"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAndReturn = void 0;
const util_1 = require("util");
function logAndReturn(value, comment) {
    const obj = (0, util_1.inspect)(value, { showHidden: false, depth: null, colors: true });
    if (comment) {
        console.log(comment);
    }
    console.log(obj);
    return value;
}
exports.logAndReturn = logAndReturn;
