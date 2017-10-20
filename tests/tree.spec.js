/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Tree = require('../lib/tree');
const expect = require('expect.js');

describe("tree", () => {

    it("no route", done => {
        let tree = new Tree();
        expect(tree.isItForMe("/")).toBeNull();
        done();
    });

    it("push null", done => {
        let tree = new Tree();
        try {
            tree.push(null); //no router
            fail()
        } catch(error) {
            expect(error.message).to.be("Router object is not defined.");
            done();
        }
    });

    it("push router without route", done => {
        let tree = new Tree();
        try {
            tree.push({}); //no route property
            fail()
        } catch(error) {
            expect(error.message).to.be("Route property is not defined.");
            done();
        }
    });

    it("root", done => {
        let tree = new Tree();        
        tree.push({ route: "/" });
        expect(tree.isItForMe("").router.route).to.be("/");
        expect(tree.isItForMe("").params).to.eql({});
        expect(tree.isItForMe("/").router.route).to.be("/");
        expect(tree.isItForMe("/").params).to.eql({});
        done();
    });

    it("parameters", done => {
        let tree = new Tree();
    
        tree.push({ id: 1, route: "api/:test/info" });
        
        expect(tree.isItForMe("api/alert/info").router.id).to.be(1);
        expect(tree.isItForMe("api/alert/info").router.route).to.be("api/:test/info");
        expect(tree.isItForMe("api/alert/info").params.test).to.be("alert");
        expect(tree.isItForMe("api/33/info").params.test).to.be(33);
        done();
    });
    
    it("parameters priority", done => {
        let tree = new Tree();
    
        tree.push({ id: 2, route: "api/:test/info" });
        tree.push({ id: 3, route: "api/:test" });
        tree.push({ id: 1, route: ":test/:value" });
        
        expect(tree.isItForMe("api/alert").router.id).to.be(3);
        expect(tree.isItForMe("api/alert").router.route).to.be("api/:test");
        expect(tree.isItForMe("api/alert").params.test).to.be("alert");
        done();
    });
    
    it("parameters priority", done => {
        let tree = new Tree();
        
        tree.push({ id: 2, route: "api/:test/info" });
        tree.push({ id: 1, route: ":test/:value" });
        tree.push({ id: 3, route: "api/:test" });

        let item = tree.isItForMe("api/alert");
        expect(item.router.id).to.be(3);
        expect(item.params.test).to.be("alert");
        done();
    });
    
    it("parameters priority", done => {
        let tree = new Tree();
        
        tree.push({ id: 3, route: "api/:test" });
        tree.push({ id: 2, route: "api/:test/info" });
        tree.push({ id: 1, route: ":test/:value" });
        
        let item = tree.isItForMe("api/alert");
        expect(item.router.id).to.be(3);
        expect(item.params.test).to.be("alert");
        done();
    });
    
    it("multiple parameters", done => {
        let tree = new Tree();
        
        tree.push({ id: 1, route: ":route/info/:value" });
        tree.push({ id: 2, route: "api/info/:value" });

        let item = tree.isItForMe("data/info/1");
        expect(item.router.id).to.be(1);
        expect(item.params.route).to.be("data");
        expect(item.params.value).to.be("1");
        done();
    });
});
