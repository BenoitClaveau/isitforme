/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const { Error } = require("oups");

class Nodes extends Array {
    constructor() {
		super();
	};

	get first() {
		if (this.length == 0) return null;
		if (this.length > 1) throw new Error("Mutliple children.");
		return this[0];
	};

	push(node) {
		
		if (!node) throw new Error("Node is not defined.");
		if (!node.token == undefined) throw new Error("Token is not defined.");
		
		let existingNode = this.findByToken(node);
		if (!existingNode) {
			if (node.token.includes("*")) super.push(node);       //not prioritary
			else if (node.token.includes(":")) super.push(node);  //not prioritary. TODO find position of '*' and insert before his position
			else this.splice(-1, 0, node);                       //insert like first element
		}
		else {
			if (node.router) { //node could be a leaf
				if (existingNode.router) throw new Error("Multiple route ${first}.", { first: existingNode.router.route, second: node.router.route });
				existingNode.router = node.router;
			}
			for (let item of node.nodes) {
				existingNode.nodes.push(item);
			}
		}
	};

	findByToken(node) {
		let results = this.filter(item => {
			return item.token === node.token;
		});
		if (results.length == 0) return null;
		if (results.length == 1) return results[0];
		throw new Error("Multiple token.", { tokens: results });
	}

	ask(node) {
		let results = this.reduce((previous, current) => {
			let r = current.match(node);
			if (!r.match) return previous;
			previous.push({
				params: r.params,
				node: current
			});
			return previous;
		}, []);
		
		if (results.length == 0) return null;
		
		let first = node.nodes.first;
		let count = results.length;
		for (let i = 0; i < count; i++) {
			let result = results[i];
			if (!first) {
				if (result.node.router) return result;
				else continue;
			}
			else {
				let item = result.node.nodes.ask(first);
				if (item) {
					Object.assign(item.params, result.params);
					return item;
				}
			}
		}
		
		return null;
	};

	get routers() {
		return this.reduce((previous, current) => {
			if (current.router) previous.push(current.router);
			else previous = previous.concat(current.router);
			return previous;
		}, [])
	};

	toString() {
		return this.trace();
	}

	trace(indent = 0) {
		let output = "";
	 	let count = this.length;
	 	for (let i = 0; i < count; i++) {
	 		let item = this[i];
			let spaces = new Array(indent + 1).join(' ');
			let children = item.nodes.trace(indent + 4);
			let sep = children ? "  " : `  ? `;
	 		output += `${spaces}${sep}${item.token}
${children}`
	 	};
		return output;
	};
};

exports = module.exports = Nodes;