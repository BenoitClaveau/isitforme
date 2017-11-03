/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const { Error, UndefinedError } = require("oups");
const Node = require("./node");
const Nodes = require("./nodes");

class IsItForMe {

    constructor() {
		this.nodes = new Nodes();
	};

	/**
	 * Could be overriden
	 */
	reviver(key, value) {
		if (/^\d+$/.test(value)) return new Number(value);
		if (/^(true|false)$/.test(value)) return new Boolean(value);
		return value;
	}

	/**
	 * 
	 * router: { route: "ex: api/test/:id", olther data... } 
	 */
	push(router) {
		if (!router) throw new UndefinedError("Router");
		if ("route" in router == false) throw new UndefinedError("Route property");
		router.route = router.route || '';
		let tokens = router.route.split("/");
		if (tokens[0] === '' && tokens.length > 1) tokens.splice(0, 1);
		let branch = this.createBranch(tokens, router);
		this.nodes.push(branch);
	};

	ask(route = "") {
		let tokens = route.split("/");
		if (tokens[0] === '' && tokens.length > 1) tokens.splice(0,1);
		
		let node = this.createNode(tokens);
		let params = {};
		let result = this.nodes.ask(node, params);
		
		if (!result) return null;
		if (!result.node) return null;
		return { 
			router: result.node.router,
			params: result.params
		};
	};

	createBranch(tokens, router) {
		if (!tokens) throw new UndefinedError("Token");
		if (tokens.length == 0) throw new Error("Token is empty.");
		if (tokens.length == 1) return new Node(this, tokens.shift(), router);
		const node = new Node(this, tokens.shift(), null);
		node.nodes.push(this.createBranch(tokens, router));
		return node;
	}

	createNode(tokens) {
		if (!tokens) throw new UndefinedError("Token");
		if (tokens.length == 0) throw new Error("Token is empty.");
		if (tokens.length == 1) return new Node(this, tokens.shift(), null);
		const node = new Node(this, tokens.shift(), null);
		node.nodes.push(this.createNode(tokens));
		return node;
	}

	load() {
		this.nodes.load();
	};

	toString() {
		return `${this.nodes}`;
	}
};

exports = module.exports = IsItForMe;