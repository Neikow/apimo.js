import {inspect} from "util";

export function logAndReturn<T>(value: T, comment?: unknown): T {
    const obj = inspect(value, {showHidden: false, depth: null, colors: true});
    if (comment) {
        console.log(comment);
    }
    console.log(obj);
    return value;
}