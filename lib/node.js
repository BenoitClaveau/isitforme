/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const { Error } = require("oups");
const Leaf = require("./leaf");
const PathRegex = require("./utils/path-regex");
const Nodes = require("./nodes");

class Node extends Leaf {
    constructor(token, router) {
		super(router)
		this.token = token;
		this.pathRegex = new PathRegex(this.token, false, false);
		this.nodes = new Nodes();
	};

	match(node) {
		if (!node.token == undefined) throw new Error("Token is not defined.", { node: node });
		return this.pathRegex.match(node.token);
	};
};

exports = module.exports = Node;