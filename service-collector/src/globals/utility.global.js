"use strict";
global._nValidURL = function (str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}
global._nAddHttpPrefix = function (str) {
    if (!str.match(/^[a-zA-Z]+:\/\//))
    {
        str = 'http://' + str;
    }
    return str;
}
global._nGetUrlObject = function (str) {
    if(_nValidURL(str)) {
        return new URL(_nAddHttpPrefix(str));
    }
    return null;
}
