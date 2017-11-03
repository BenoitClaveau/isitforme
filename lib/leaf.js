/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const { UndefinedError } = require("oups");

class Leaf {
    constructor(router) {
		this.router = router;
	};
};

exports = module.exports = Leaf;