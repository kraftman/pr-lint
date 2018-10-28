'use strict';
const chai = require('chai');
chai.should();
const homeHandler = require('./home-handler.js');
describe('Home handler tests', () => {
  it('returns Unknown by default', () => {
    const result = homeHandler();
    result.should.contain('Unknown');
  })
  it('returns the name if provided', () => {
    const name = 'chris';
    const result = homeHandler(name);
    result.should.contain(name);

  })
})