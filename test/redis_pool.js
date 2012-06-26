var assert = require('assert')
  , _ = require('underscore')
  , RedisPool = require('../lib/grainstore/redis_pool')
  , tests = module.exports = {};

// configure redis pool instance to use in tests
var test_opts = {
  max: 10, 
  idleTimeoutMillis: 1, 
  reapIntervalMillis: 1
};

var redis_pool = new RedisPool(test_opts);

suite('redis_pool', function() {

test('truth', function(){
    assert.ok(true,  'it is');
});

test('RedisPool object exists', function(){
  assert.ok(RedisPool);
});

test('RedisPool can create new redis_pool objects with default settings', function(){
  var redis_pool = new RedisPool();
});

test('RedisPool can create new redis_pool objects with specific settings', function(){
  var redis_pool = new RedisPool(_.extend({host:'127.0.0.1', port: '6379'}, test_opts));
});

test('pool object has an aquire function', function(){
  assert.ok(_.functions(redis_pool).indexOf('acquire') >= 0, "redis_pool doesn't include 'acquire'");
});

test('calling aquire returns a redis client object that can get/set', function(){
  redis_pool.acquire(0, function(err, client){
    client.set("key","value");
    client.get("key", function(err,data){      
      assert.equal(data, "value");      
      redis_pool.release(0, client); // needed to exit tests
    })
  });    
});

test('calling aquire on another DB returns a redis client object that can get/set', function(){
  redis_pool.acquire(2, function(err, client){
    client.set("key","value");
    client.get("key", function(err,data){      
      assert.equal(data, "value");      
      redis_pool.release(2, client); // needed to exit tests
    })
  });      
});

});
