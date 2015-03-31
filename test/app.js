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

        it('should return a hash for a valid image URL', function(done) {
            hippie()
            .json()
            .get(apiBaseURL + '?url=' + encodeURIComponent(JSON.stringify(
                staticBaseURL + 'latrobe.jpg'
            )))
            .expectStatus(200)
            .end(function(error, response, results) {
                assert.notOk(error);
                assert.ok(typeof results[0].hash === 'string');
                done();
            });
        });

        it('should return an error string for a invalid image URL', function(done) {
            hippie()
            .json()
            .get(apiBaseURL + '?url=' + encodeURIComponent(JSON.stringify(
                staticBaseURL + 'non-existent-image.jpg'
            )))
            .expectStatus(200)
            .end(function(error, response, results) {
                assert.notOk(error);
                assert.ok(results[0].error);
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
            .end(function(error, response, results) {
                assert.ok(typeof results[0].hash === 'string');
                assert.ok(typeof results[1].hash === 'string');
                assert.ok(results[0].hash === results[1].hash);
                done();
            });
        });
        
        it('should return different hashes for URLs to different images', function(done) {
            hippie()
            .json()
            .get(apiBaseURL + '?url=' + encodeURIComponent(JSON.stringify([
                staticBaseURL + 'latrobe.jpg',
                staticBaseURL + 'england.jpg'
            ])))
            .expectStatus(200)
            .end(function(error, response, results) {
                assert.ok(typeof results[0].hash === 'string');
                assert.ok(typeof results[1].hash === 'string');
                assert.ok(results[0].hash != results[1].hash);
                done();
            });
        });
    });

    after(function() {
        app.server.close();
    });
});