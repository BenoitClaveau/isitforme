"use strict";

const { UndefinedError } = require("oups");

class PathRegexp {
    constructor(path, sensitive, strict, reviver) {
        if (path == null) throw new UndefinedError("Path");
        if (!reviver) throw new UndefinedError("Reviver");

        if (path == "[object RegExp]") return path;
        if (Array.isArray(path)) path = "(" + path.join("|") + ")";
        let keys = [];
        
        path = path
            .concat(strict ? "" : "/?")
            .replace(/\/\(/g, "(?:/")
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, (_, slash, format, key, capture, optional, star) => {
                keys.push({ name: key, optional: !!optional });
                slash = slash || "";
                return ""
                + (optional ? "" : slash)
                + "(?:"
                + (optional ? slash : "")
                + (format || "") + (capture || (format && "([^/.]+?)" || "([^/]+?)")) + ")"
                + (optional || "")
                + (star ? "(/*)?" : "");
            })
            .replace(/([\/.])/g, "\\$1")
            .replace(/\*/g, "(.*)");
            
        this.keys = keys;
        this.regexp = new RegExp("^" + path + "$", sensitive ? "" : "i");
        this.reviver = reviver;
    };

    match(path) {
        let result = {
            match: false,
            params: {}
        };
        
        let m = this.regexp.exec(path);
        if (!m) {
            if (path == "" && this.regexp.exec(" ")) /*if path == "" this.regexp.exec("") return false. We test it with this.regexp.exec(" ")*/
                m = ["dummy", ""];
            else 
                return result;
        }

        result.match = true;
        
        const count = m.length;
        for (let i = 1; i < count; i++) {
            let key = this.keys[i - 1];
            if (key) result.params[key.name] = this.reviver(key.name, m[i]);
            else {
                key = Object.keys(result.params).length;
                result.params[key] = this.reviver(key, m[i]);
            }
        }
        return result;
    };
};

exports = module.exports = PathRegexp;