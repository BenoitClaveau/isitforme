/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const IsItForMe = require('../lib/isitforme');
const expect = require('expect.js');

describe("isitforme", () => {

    it("no route", done => {
        let isitforme = new IsItForMe();
        expect(isitforme.ask("/")).to.be(null);
        done();
    });

    it("push null", done => {
        let isitforme = new IsItForMe();
        try {
            isitforme.push(null); //no router
            fail()
        } catch(error) {
            expect(error.message).to.eql("Router is undefined.");
            done();
        }
    });

    it("push router without route", done => {
        let isitforme = new IsItForMe();
        try {
            isitforme.push({}); //no route property
            fail()
        } catch(error) {
            expect(error.message).to.eql("Route property is undefined.");
            done();
        }
    });

    it("root", done => {
        let isitforme = new IsItForMe();        
        isitforme.push({ route: "/" });
        expect(isitforme.ask("").router.route).to.eql("/");
        expect(isitforme.ask("").params).to.eql({});
        expect(isitforme.ask("/").router.route).to.eql("/");
        expect(isitforme.ask("/").params).to.eql({});
        done();
    });

    it("parameters", done => {
        let isitforme = new IsItForMe();
    
        isitforme.push({ id: 1, route: "api/:test/info" });
        
        expect(isitforme.ask("api/alert/info").router.id).to.eql(1);
        expect(isitforme.ask("api/alert/info").router.route).to.eql("api/:test/info");
        expect(isitforme.ask("api/alert/info").params.test).to.eql("alert");
        expect(isitforme.ask("api/33/info").params.test).to.eql(33);
        done();
    });
    
    it("parameters priority", done => {
        let isitforme = new IsItForMe();
    
        isitforme.push({ id: 2, route: "api/:test/info" });
        isitforme.push({ id: 3, route: "api/:test" });
        isitforme.push({ id: 1, route: ":test/:value" });
        
        expect(isitforme.ask("api/alert").router.id).to.eql(3);
        expect(isitforme.ask("api/alert").router.route).to.eql("api/:test");
        expect(isitforme.ask("api/alert").params.test).to.eql("alert");
        done();
    });
    
    it("parameters priority", done => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 2, route: "api/:test/info" });
        isitforme.push({ id: 1, route: ":test/:value" });
        isitforme.push({ id: 3, route: "api/:test" });

        let item = isitforme.ask("api/alert");
        expect(item.router.id).to.eql(3);
        expect(item.params.test).to.eql("alert");
        done();
    });
    
    it("parameters priority", done => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 3, route: "api/:test" });
        isitforme.push({ id: 2, route: "api/:test/info" });
        isitforme.push({ id: 1, route: ":test/:value" });
        
        let item = isitforme.ask("api/alert");
        expect(item.router.id).to.eql(3);
        expect(item.params.test).to.eql("alert");
        done();
    });
    
    it("multiple parameters", done => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 1, route: ":route/info/:value" });
        isitforme.push({ id: 2, route: "api/info/:value" });

        let item = isitforme.ask("data/info/1");
        expect(item.router.id).to.eql(1);
        expect(item.params.route).to.eql("data");
        expect(item.params.value).to.eql(1);

        item = isitforme.ask("api/info/1");
        expect(item.router.id).to.eql(2);
        expect(item.params.value).to.eql(1);
        done();
    });

    it("reviver", done => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 1, route: "api/info/:value" });

        let item = isitforme.ask("api/info/1");
        expect(item.params.value).to.eql(1);

        item = isitforme.ask("api/info/true");
        expect(item.params.value).to.eql(true);

        item = isitforme.ask("api/info/false");
        expect(item.params.value).to.eql(false);
        
        done();
    });
});
