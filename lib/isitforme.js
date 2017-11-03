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
	reviver(route, key, value) {
		if (/^\d+$/.test(value)) return new Number(value);
		if (/^(true|false)$/.test(value)) return new Boolean(value);
		if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return new Date(value);
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
		let result = this.nodes.ask(node);
		
		if (!result) return null;
		if (!result.node) return null;

		const pattern = result.node.router.route;
		const params = Object.entries(result.params).reduce((previous, [k, v]) => { 
			previous[k] = this.reviver(pattern, k, v);
			return previous;
		}, {});

		return { 
			router: result.node.router,
			params: params
		};
	};

	createBranch(tokens, router) {
		if (!tokens) throw new UndefinedError("Token");
		if (tokens.length == 0) throw new Error("Token is empty.");
		if (tokens.length == 1) return new Node(tokens.shift(), router);
		const node = new Node(tokens.shift(), null);
		node.nodes.push(this.createBranch(tokens, router));
		return node;
	}

	createNode(tokens) {
		if (!tokens) throw new UndefinedError("Token");
		if (tokens.length == 0) throw new Error("Token is empty.");
		if (tokens.length == 1) return new Node(tokens.shift(), null);
		const node = new Node(tokens.shift(), null);
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