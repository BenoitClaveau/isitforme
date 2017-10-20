/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const PathRegex = require('../../lib/utils/path-regex');
const expect = require('expect.js');

require("process").on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

describe("pathRegex", () => {

    it("match static", done => {
        let pathRegex = new PathRegex("/api", false, false);
        expect(pathRegex.match("/api").match).to.be(true);
        expect(pathRegex.match("/api/2").match).to.be(false);
        expect(pathRegex.match("/api/value").match).to.be(false);
        expect(pathRegex.match("/api/").match).to.be(true);
        expect(pathRegex.match("/api-1").match).to.be(false);
        done();
    });
    
    it("match dynamic", done => {
        let pathRegex = new PathRegex("/api/:id", false, false);
        expect(pathRegex.match("/api/1").match).to.be(true);
        expect(pathRegex.match("/api/2").match).to.be(true);
        expect(pathRegex.match("/api/value").match).to.be(true);
        expect(pathRegex.match("/api/").match).to.be(false);
        expect(pathRegex.match("/api/1/2").match).to.be(false);
        done();
    });
    
    it("match generic", done => {
        let pathRegex = new PathRegex("/api/*", false, false);
        expect(pathRegex.match("/api/1").match).to.be(true);
        expect(pathRegex.match("/api/2").match).to.be(true);
        expect(pathRegex.match("/api/value").match).to.be(true);
        expect(pathRegex.match("/api/").match).to.be(true);
        expect(pathRegex.match("/api/1/2").match).to.be(true);
        done();
    });
    
    it("params", done => {
        let pathRegex = new PathRegex("/api/:id", false, false);
        expect(pathRegex.match("/api/1").params.id).to.be("1");
        done();
    });
});