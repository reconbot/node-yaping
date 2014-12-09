var util   = require('util');
var spawn = require('child_process').spawn;
var dns = require('dns');

var ping = function(host, cb){

  if(!host || typeof host !== 'string'){
    cb(new Error('No host'));
    return;
  }

  var data = {};
  var stdout = '';
  var stderr = '';
  var error;

  var cp = spawn('ping', ['-n', '-W 2000', '-c 1', host]);

  cp.stdout.on('data', function (data) {
    stdout += data;
  });

  cp.stderr.on('data', function (data) {
    stderr += data;
  });

  cp.on('exit',function(code){
    data.code = code;


    if(code > 0 && code !== 2) {
      error = new Error(stderr);
      data.stdout = stdout;
      data.stderr = stderr;
      return cb(error,data);
    }

    var stdoutLines = stdout.split("\n");
    var ipRe = /\(([\d\.]+)\)/;
    var matches;

    if((matches = stdoutLines[0].match(ipRe)) && (data.ip = matches[1]) && !data.ip){
      error = new Error("ping had malformed stdout: " + stdout);
      return cb(error,data);
    }

    if(code === 2){
      error = new Error('Request timeout');
      return cb(error,data);
    }

    data.msg = stdoutLines[1];
    if(!data.msg){
      error = new Error("ping had malformed stdout: " + stdout);
      return cb(error,data);
    }

    var re = /(\d+) bytes from (.+): icmp_(?:r|s)eq=(\d+) ttl=(\d+) time=([\d.]+) ms/;
    var parts = data.msg.match(re);

    if(!parts.length){
      error = new Error("ping had malformed stdout: " + stdout);
      return cb(error,data);
    }

    data.bytes = Number(parts[1]);
    data.ttl = Number(parts[4]);
    data.time = Number(parts[5]);

    cb(error, data);

  });
};

var pingWithLookup = function(host,cb){

  if(!cb){
    cb = function(){};
  }

  dns.lookup(host,4,function(err, address){
    if(err){
      return cb(err, address);
    }
    ping(address, cb);
  });
};

module.exports = exports = pingWithLookup;
