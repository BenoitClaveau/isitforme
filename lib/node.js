/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const { UndefinedError } = require("oups");
const Leaf = require("./leaf");
const PathRegex = require("./path-regex");
const Nodes = require("./nodes");

class Node extends Leaf {
    constructor(token, router) {
		super(router);
		this.token = token;
		this.pathRegex = new PathRegex(this.token, false, false);
		this.nodes = new Nodes();
	};

	match(node) {
		if (!node.token == undefined) throw new UndefinedError("Token", { node: node });
		return this.pathRegex.match(node.token);
	};
};

exports = module.exports = Node;