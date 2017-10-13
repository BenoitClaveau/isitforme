/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const { WebError } = require("qwebs");
const Node = require("./node");
const Nodes = require("./nodes");

class Tree {
    constructor() {
		this.nodes = new Nodes();
	};

	/**
	 * 
	 * router: { route: "ex: api/test/:id", olther data... } 
	 */
	push(router) {
		if (!router) throw new WebError({ message: "Router object is not defined." });
		if ("route" in router == false) throw new WebError({ message: "Route property is not defined." });
		router.route = router.route || '';
		let tokens = router.route.split("/");
		if (tokens[0] === '' && tokens.length > 1) tokens.splice(0, 1);
		let branch = this.createBranch(tokens, router);
		this.nodes.push(branch);
	};

	findOne(route) {
		route = route || '';

		let tokens = route.split("/");
		if (tokens[0] === '' && tokens.length > 1) tokens.splice(0,1);
		
		let node = this.createNode(tokens);
		let params = {};
		let result = this.nodes.findOne(node, params);
		
		if (!result) return null;
		if (!result.node) return null;
		return { 
			router: result.node.router,
			params: result.params
		};
	};

	createBranch(tokens, router) {
		if (!tokens) throw new WebError({ message: "Token is not defined." });
		if (tokens.length == 0) throw new WebError({ message: "Token is empty." });
		if (tokens.length == 1) return new Node(tokens.shift(), router);
		let node = new Node(tokens.shift(), null);
		node.nodes.push(this.createBranch(tokens, router));
		return node;
	}

	createNode(tokens) {
		if (!tokens) throw new WebError({ message: "Token is not defined." });
		if (tokens.length == 0) throw new WebError({ message: "Token is empty." });
		if (tokens.length == 1) return new Node(tokens.shift(), null);
		
		let node = new Node(tokens.shift(), null);
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

exports = module.exports = Tree;