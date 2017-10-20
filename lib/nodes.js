/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const { Error } = require("oups");

class Nodes {
    constructor() {
		this._items = [];
	};

	first() {
		if (this._items.length == 0) return null;
		if (this._items.length > 1) throw new Error("Mutliple children.");
		return this._items[0];
	};

	push(node) {
		
		if (!node) throw new Error("Node is not defined.");
		if (!node.token == undefined) throw new Error("Token is not defined.");
		
		let existingNode = this.findByToken(node);
		if (!existingNode) {
			if (node.token.includes("*")) this._items.push(node);       //not prioritary
			else if (node.token.includes(":")) this._items.push(node);  //not prioritary. TODO find position of '*' and insert before his position
			else this._items.splice(-1, 0, node);                       //insert like first element
		}
		else {
			if (node.router) { //node could be a leaf
				if (existingNode.router) throw new Error("Multiple end route.", { first: existingNode.router.route, second: node.router.route });
				existingNode.router = node.router;
			}

			let count = node.nodes._items.length;
			for (let i = 0; i < count; i++) {
				existingNode.nodes.push(node.nodes._items[i]);
			}
		}
	};

	findByToken(node) {
		let results = this._items.filter(item => {
			return item.token === node.token;
		});
		if (results.length == 0) return null;
		if (results.length == 1) return results[0];
		throw new Error("Multiple token.", { tokens: results });
	}

	isItForMe(node) {
		let results = this._items.reduce((previous, current) => {
			let r = current.match(node);
			if (!r.match) return previous;
			previous.push({
				params: r.params,
				node: current
			});
			return previous;
		}, []);
		
		if (results.length == 0) return null;
		
		let first = node.nodes.first();
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

	load() {
		const count = this._items.length;
		for (let i = 0; i < count; i++) {
			let node = this._items[i];
			if (node.router) node.router.load();
			node.nodes.load();
		}
	};

	toString() {
		return this.trace();
	}

	trace(indent = 0) {
		let output = "";
	 	let count = this._items.length;
	 	for (let i = 0; i < count; i++) {
	 		let item = this._items[i];
			let spaces = new Array(indent + 1).join(' ');
			let children = item.nodes.trace(indent + 4);
			let sep = children ? "  " : `  🚀 `;
	 		output += `${spaces}${sep}${item.token}
${children}`
	 	};
		return output;
	};
};

exports = module.exports = Nodes;