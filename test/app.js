// test

var express = require('express');
var assert = require('chai').assert;
var hippie = require('hippie');
var conf = require('../conf/conf');

var app = require('../app.js');

var apiBaseURL = 'http://127.0.0.1:' + conf.server.port + '/';
var staticBaseURL = 'http://127.0.0.1:' + conf.server.port + '/static/';

describe('app', function() {
    before(function() {
        app.app.use('/static', express.static('./static'));
    });
    
    describe('#get /', function() {
        it('should respond with status code 400 for a bad request', function(done) {
            hippie()
            .json()
            .get(apiBaseURL)
            .expectStatus(400)
            .end(function(error, response, body) {
                done();
            });
        });
        
        it('should respond with status code 500 for a server error', function(done) {
            hippie()
            .json()
            .get(apiBaseURL + '?url=' + encodeURIComponent(JSON.stringify(
                staticBaseURL + 'not_an_image.jpg'
            )))
            .expectStatus(500)
            .end(function(error, response, body) {
                done();
            });
        });
        
        it('should return a hash for a valid image URL', function(done) {
            hippie()
            .json()
            .get(apiBaseURL + '?url=' + encodeURIComponent(JSON.stringify(
                staticBaseURL + 'latrobe.jpg'
            )))
            .expectStatus(200)
            .end(function(error, response, body) {
                assert.notOk(error);
                assert.ok(body.hashes);
                done();
            });
        });
        
        it('should return identical hashes for identical image URLs', function(done) {
            hippie()
            .json()
            .get(apiBaseURL + '?url=' + encodeURIComponent(JSON.stringify([
                staticBaseURL + 'latrobe.jpg',
                staticBaseURL + 'latrobe.jpg'
            ])))
            .expectStatus(200)
            .end(function(error, response, body) {
                assert.ok(body.hashes[0] === body.hashes[1]);
                done();
            });
        });
    });
    
    after(function() {
        app.server.close();
    });
});