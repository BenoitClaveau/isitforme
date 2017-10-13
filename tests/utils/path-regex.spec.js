/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const PathRegex = require('../../lib/utils/path-regex');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("pathRegex", () => {

    it("match static", done => {
        let pathRegex = new PathRegex("/api", false, false);
        expect(pathRegex.match("/api").match).toEqual(true);
        expect(pathRegex.match("/api/2").match).toEqual(false);
        expect(pathRegex.match("/api/value").match).toEqual(false);
        expect(pathRegex.match("/api/").match).toEqual(true);
        expect(pathRegex.match("/api-1").match).toEqual(false);
        done();
    });
    
    it("match dynamic", done => {
        let pathRegex = new PathRegex("/api/:id", false, false);
        expect(pathRegex.match("/api/1").match).toEqual(true);
        expect(pathRegex.match("/api/2").match).toEqual(true);
        expect(pathRegex.match("/api/value").match).toEqual(true);
        expect(pathRegex.match("/api/").match).toEqual(false);
        expect(pathRegex.match("/api/1/2").match).toEqual(false);
        done();
    });
    
    it("match generic", done => {
        let pathRegex = new PathRegex("/api/*", false, false);
        expect(pathRegex.match("/api/1").match).toEqual(true);
        expect(pathRegex.match("/api/2").match).toEqual(true);
        expect(pathRegex.match("/api/value").match).toEqual(true);
        expect(pathRegex.match("/api/").match).toEqual(true);
        expect(pathRegex.match("/api/1/2").match).toEqual(true);
        done();
    });
    
    it("params", done => {
        let pathRegex = new PathRegex("/api/:id", false, false);
        expect(pathRegex.match("/api/1").params.id).toEqual("1");
        done();
    });
});