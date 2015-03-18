var converter = require('../lib/arr-to-joi');
var Joi = require('joi');
var chai = require('chai');
chai.should();

describe('Testing conversion between arrays and schemas', function() {

  it('should create a Joi schema', function() {
    var schema = converter({
      name: ['string', ['min', 1], ['max', 80]],
      surname: ['string', ['min', 1], ['max', 80]],
      contact: {
        email: ['string', 'email']
      }
    });

    var result = Joi.validate({
      name: 'John',
      surname: 'Doe',
      contact: {
        email: 'johndoe@gmail.com'
      }
    }, schema);

    result.value.contact.email.should.be.equal('johndoe@gmail.com');
  });

});
