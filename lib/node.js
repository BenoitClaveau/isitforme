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
    constructor(isitforme, token, router) {
		if (!isitforme) throw new UndefinedError("Isitforme");

		super(isitforme, router);
		this.token = token;
		this.pathRegex = new PathRegex(this.token, false, false, isitforme.reviver.bind(this));
		this.nodes = new Nodes();
	};

	match(node) {
		if (!node.token == undefined) throw new UndefinedError("Token", { node: node });
		return this.pathRegex.match(node.token);
	};
};

exports = module.exports = Node;