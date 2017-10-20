/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const Tree = require('../lib/tree');

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
            expect(error.message).toEqual("Router object is not defined.");
            done();
        }
    });

    it("push router withour route", done => {
        let tree = new Tree();
        try {
            tree.push({}); //no route property
            fail()
        } catch(error) {
            expect(error.message).toEqual("Route property is not defined.");
            done();
        }
    });

    it("root", done => {
        let tree = new Tree();        
        tree.push({ id: 1, route: "/" });
        expect(tree.isItForMe("").router.id).toEqual(1);
        expect(tree.isItForMe("/").router.id).toEqual(1);
        done();
    });
    
    it("parameters priority", done => {
        let tree = new Tree();
    
        tree.push({ id: 2, route: "api/:test/info" });
        tree.push({ id: 3, route: "api/:test" });
        tree.push({ id: 1, route: ":test/:value" });
        
        let item = tree.isItForMe("api/alert");
        expect(item.router.id).toEqual(3);
        expect(item.params.test).toEqual("alert");
        done();
    });
    
    it("parameters priority", done => {
        let tree = new Tree();
        
        tree.push({ id: 2, route: "api/:test/info" });
        tree.push({ id: 1, route: ":test/:value" });
        tree.push({ id: 3, route: "api/:test" });

        let item = tree.isItForMe("api/alert");
        expect(item.router.id).toEqual(3);
        expect(item.params.test).toEqual("alert");
        done();
    });
    
    it("parameters priority", done => {
        let tree = new Tree();
        
        tree.push({ id: 3, route: "api/:test" });
        tree.push({ id: 2, route: "api/:test/info" });
        tree.push({ id: 1, route: ":test/:value" });
        
        let item = tree.isItForMe("api/alert");
        expect(item.router.id).toEqual(3);
        expect(item.params.test).toEqual("alert");
        done();
    });
    
    it("multiple parameters", done => {
        let tree = new Tree();
        
        tree.push({ id: 1, route: ":route/info/:value" });
        tree.push({ id: 2, route: "api/info/:value" });

        let item = tree.isItForMe("data/info/1");
        expect(item.router.id).toEqual(1);
        expect(item.params.route).toEqual("data");
        expect(item.params.value).toEqual("1");
        done();
    });
});
