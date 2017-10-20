# isitforme
Advanced router, uses an highly performant Tree route structure algorithms.

 [![NPM][npm-image]][npm-url]
 [![Build Status][travis-image]][travis-url]
 [![Coverage Status][coveralls-image]][coveralls-url]
 [![NPM Download][npm-image-download]][npm-url]
 [![Dependencies Status][david-dm-image]][david-dm-url]

## What is this?

The "tree" defines a series of hierarchical nodes with children to optimise the search method.

For example, the routes:

```
/api/users
/api/user/:id
/api/user/:id/tasks
/api/user/:id/validate
```

defines a tree that looks like

```
               api
             /     \
          users    user
                 /     \
             validate  :id
                      /    \   
                validate   tasks
```

## Installation

```shell
npm install isitforme --save
```

## Test

To run our tests, clone the isitforme repo and install the dependencies.

```bash
$ git clone https://github.com/BenoitClaveau/isitforme --depth 1
$ cd isitforme
$ npm install
$ cd tests
$ node.exe "../node_modules/mocha/bin/mocha" .
```

[npm-image]: https://img.shields.io/npm/v/isitforme.svg
[npm-image-download]: https://img.shields.io/npm/dm/isitforme.svg
[npm-url]: https://npmjs.org/package/isitforme
[travis-image]: https://travis-ci.org/BenoitClaveau/isitforme.svg?branch=master
[travis-url]: https://travis-ci.org/BenoitClaveau/isitforme
[coveralls-image]: https://coveralls.io/repos/BenoitClaveau/isitforme/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/BenoitClaveau/isitforme?branch=master
[david-dm-image]: https://david-dm.org/BenoitClaveau/isitforme/status.svg
[david-dm-url]: https://david-dm.org/BenoitClaveau/isitforme