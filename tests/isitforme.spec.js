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
        expect(isitforme.ask("/")).toBeNull();
        done();
    });

    it("push null", done => {
        let isitforme = new IsItForMe();
        try {
            isitforme.push(null); //no router
            fail()
        } catch(error) {
            expect(error.message).to.be("Router object is not defined.");
            done();
        }
    });

    it("push router without route", done => {
        let isitforme = new IsItForMe();
        try {
            isitforme.push({}); //no route property
            fail()
        } catch(error) {
            expect(error.message).to.be("Route property is not defined.");
            done();
        }
    });

    it("root", done => {
        let isitforme = new IsItForMe();        
        isitforme.push({ route: "/" });
        expect(isitforme.ask("").router.route).to.be("/");
        expect(isitforme.ask("").params).to.eql({});
        expect(isitforme.ask("/").router.route).to.be("/");
        expect(isitforme.ask("/").params).to.eql({});
        done();
    });

    it("parameters", done => {
        let isitforme = new IsItForMe();
    
        isitforme.push({ id: 1, route: "api/:test/info" });
        
        expect(isitforme.ask("api/alert/info").router.id).to.be(1);
        expect(isitforme.ask("api/alert/info").router.route).to.be("api/:test/info");
        expect(isitforme.ask("api/alert/info").params.test).to.be("alert");
        expect(isitforme.ask("api/33/info").params.test).to.be(33);
        done();
    });
    
    it("parameters priority", done => {
        let isitforme = new IsItForMe();
    
        isitforme.push({ id: 2, route: "api/:test/info" });
        isitforme.push({ id: 3, route: "api/:test" });
        isitforme.push({ id: 1, route: ":test/:value" });
        
        expect(isitforme.ask("api/alert").router.id).to.be(3);
        expect(isitforme.ask("api/alert").router.route).to.be("api/:test");
        expect(isitforme.ask("api/alert").params.test).to.be("alert");
        done();
    });
    
    it("parameters priority", done => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 2, route: "api/:test/info" });
        isitforme.push({ id: 1, route: ":test/:value" });
        isitforme.push({ id: 3, route: "api/:test" });

        let item = isitforme.ask("api/alert");
        expect(item.router.id).to.be(3);
        expect(item.params.test).to.be("alert");
        done();
    });
    
    it("parameters priority", done => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 3, route: "api/:test" });
        isitforme.push({ id: 2, route: "api/:test/info" });
        isitforme.push({ id: 1, route: ":test/:value" });
        
        let item = isitforme.ask("api/alert");
        expect(item.router.id).to.be(3);
        expect(item.params.test).to.be("alert");
        done();
    });
    
    it("multiple parameters", done => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 1, route: ":route/info/:value" });
        isitforme.push({ id: 2, route: "api/info/:value" });

        let item = isitforme.ask("data/info/1");
        expect(item.router.id).to.be(1);
        expect(item.params.route).to.be("data");
        expect(item.params.value).to.be("1");
        done();
    });
});
