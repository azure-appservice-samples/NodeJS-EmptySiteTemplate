var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');
var errors = require('../errors');
var Promise = require('bluebird');

module.exports = function(config) {

  function Ticket(attributes) {
    Resource.call(this, attributes);
  }
  util.inherits(Ticket, Resource);

  Ticket.retrieve = function(ticketId) {
    if (!ticketId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'ticket_id is required',
          400
        ));
    }
    return request('get', 'tickets/' + ticketId, {}, config)
      .then(function(json) {
        return new Ticket(json.ticket);
      });
  };


  Ticket.create = function(params) {
    return request('post', 'tickets', params, config)
      .then(function(json) {
        return new Ticket(json.ticket);
      });
  };

  Ticket.update = function(ticketId, params) {
    if (!ticketId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'ticket_id is required',
          400
        ));
    }

    return request('post', 'tickets/' + ticketId, params, config)
      .then(function(json) {
        return new Ticket(json.ticket);
      });
  };

  Ticket.list = function(params) {
    return request('get', 'tickets', params, config)
      .then(function(json) {
        json.tickets = (json.tickets || []).map(function(ticket) {
          return new Ticket(ticket);
        });
        return json;
      });
  };

  Ticket.createComment = function(ticketId, params) {
    if (!ticketId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'ticket_id is required',
          400
        ));
    }

    return request('post', 'ticket/' + ticketId + '/comments', params, config)
      .then(function(json) {
        return json.comment;
      });
  };

  Ticket.comments = function(ticketId) {
    if (!ticketId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'ticket_id is required',
          400
        ));
    }

    return request('get', 'ticket/' + ticketId + '/comments', {}, config)
      .then(function(json) {
        return json;
      });
  };

  return Ticket;
};
