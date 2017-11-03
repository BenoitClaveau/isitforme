/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const PathRegex = require('../lib/path-regex');
const expect = require('expect.js');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("pathRegex", () => {

    it("match static", done => {
        let pathRegex = new PathRegex("/api", false, false);
        expect(pathRegex.match("/api").match).to.eql(true);
        expect(pathRegex.match("/api/2").match).to.eql(false);
        expect(pathRegex.match("/api/value").match).to.eql(false);
        expect(pathRegex.match("/api/").match).to.eql(true);
        expect(pathRegex.match("/api-1").match).to.eql(false);
        done();
    });
    
    it("match dynamic", done => {
        let pathRegex = new PathRegex("/api/:id", false, false);
        expect(pathRegex.match("/api/1").match).to.eql(true);
        expect(pathRegex.match("/api/2").match).to.eql(true);
        expect(pathRegex.match("/api/value").match).to.eql(true);
        expect(pathRegex.match("/api/").match).to.eql(false);
        expect(pathRegex.match("/api/1/2").match).to.eql(false);
        done();
    });
    
    it("match generic", done => {
        let pathRegex = new PathRegex("/api/*", false, false);
        expect(pathRegex.match("/api/1").match).to.eql(true);
        expect(pathRegex.match("/api/2").match).to.eql(true);
        expect(pathRegex.match("/api/value").match).to.eql(true);
        expect(pathRegex.match("/api/").match).to.eql(true);
        expect(pathRegex.match("/api/1/2").match).to.eql(true);
        done();
    });
    
    it("params", done => {
        let pathRegex = new PathRegex("/api/:id", false, false, (key, value) => value);
        expect(pathRegex.match("/api/1").params.id).to.eql("1");
        done();
    });
});