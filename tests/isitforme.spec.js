/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const IsItForMe = require('../lib/isitforme');
const expect = require('expect.js');

describe("isitforme", () => {

    it("no route", () => {
        let isitforme = new IsItForMe();
        expect(isitforme.ask("/")).to.be(null);
    });

    it("push null", () => {
        let isitforme = new IsItForMe();
        try {
            isitforme.push(null); //no router
            fail()
        } catch(error) {
            expect(error.message).to.eql("Router is undefined.");
        }
    });

    it("push router without route", () => {
        let isitforme = new IsItForMe();
        try {
            isitforme.push({}); //no route property
            fail()
        } catch(error) {
            expect(error.message).to.eql("Route property is undefined.");
        }
    });

    it("root", () => {
        let isitforme = new IsItForMe();        
        isitforme.push({ route: "/" });
        expect(isitforme.ask("").router.route).to.eql("/");
        expect(isitforme.ask("").params).to.eql({});
        expect(isitforme.ask("/").router.route).to.eql("/");
        expect(isitforme.ask("/").params).to.eql({});
    });

    it("parameters", () => {
        let isitforme = new IsItForMe();
    
        isitforme.push({ id: 1, route: "api/:test/info" });
        
        expect(isitforme.ask("api/alert/info").router.id).to.eql(1);
        expect(isitforme.ask("api/alert/info").router.route).to.eql("api/:test/info");
        expect(isitforme.ask("api/alert/info").params.test).to.eql("alert");
        expect(isitforme.ask("api/33/info").params.test).to.eql(33);        
    });
    
    it("parameters priority", () => {
        let isitforme = new IsItForMe();
    
        isitforme.push({ id: 2, route: "api/:test/info" });
        isitforme.push({ id: 3, route: "api/:test" });
        isitforme.push({ id: 1, route: ":test/:value" });
        
        expect(isitforme.ask("api/alert").router.id).to.eql(3);
        expect(isitforme.ask("api/alert").router.route).to.eql("api/:test");
        expect(isitforme.ask("api/alert").params.test).to.eql("alert");     
    });
    
    it("parameters priority", () => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 2, route: "api/:test/info" });
        isitforme.push({ id: 1, route: ":test/:value" });
        isitforme.push({ id: 3, route: "api/:test" });

        let item = isitforme.ask("api/alert");
        expect(item.router.id).to.eql(3);
        expect(item.params.test).to.eql("alert");      
    });
    
    it("parameters priority", () => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 3, route: "api/:test" });
        isitforme.push({ id: 2, route: "api/:test/info" });
        isitforme.push({ id: 1, route: ":test/:value" });
        
        let item = isitforme.ask("api/alert");
        expect(item.router.id).to.eql(3);
        expect(item.params.test).to.eql("alert");     
    });
    
    it("multiple parameters", () => {
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
    });

    it("reviver", () => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 1, route: "api/info/:value" });

        let item = isitforme.ask("api/info/1");
        expect(item.params.value).to.eql(1);

        item = isitforme.ask("api/info/true");
        expect(item.params.value).to.eql(true);

        item = isitforme.ask("api/info/false");
        expect(item.params.value).to.eql(false);
    });

    it("tree", () => {
        let isitforme = new IsItForMe();
        
        isitforme.push({ id: 1, route: "api/info" });
        isitforme.push({ id: 2, route: "api/version" });
        isitforme.push({ id: 3, route: "api/version/user" });

        expect(isitforme.nodes.length).to.eql(1);
        expect(isitforme.nodes[0].token).to.eql("api");
        expect(isitforme.nodes[0].nodes.length).to.eql(2);
        expect(isitforme.nodes[0].nodes[0].token).to.eql("version");
        expect(isitforme.nodes[0].nodes[0].nodes.length).to.eql(1);
        expect(isitforme.nodes[0].nodes[0].nodes[0].token).to.eql("user");
        expect(isitforme.nodes[0].nodes[1].token).to.eql("info");
    });
});
