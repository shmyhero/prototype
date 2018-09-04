export default function deepCopy (obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        // var out = [], i = 0, len = obj.length;
        // for ( ; i < len; i++ ) {
        //     out[i] = arguments.callee(obj[i]);
        // }
        // return out;

        return obj.slice(0);
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}