const chai = require('chai');
const sinon = require('sinon');

global.assert = chai.assert;
global.sinon = sinon;
global.sinon.assert.expose(global.assert, {prefix: ''});
