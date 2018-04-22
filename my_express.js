var https = require('https');
var url = require('url');
var fs = require('fs');

var options = {
  key: fs.readFileSync('privateKey.key'),
  cert: fs.readFileSync('certificate.crt')
};

module.exports = function(){
  var v = {}
  v.getHandlers = {};
  v.postHandlers = {};
  v.putHandlers = {};
  v["GET"] = v.getHandlers;
  v["POST"] = v.postHandlers;
  v["PUT"] = v.putHandlers;
  v.get = function(path, handler){
    v.getHandlers[path] = handler;
  };
  v.post = function(path, handler){
    v.postHandlers[path] = handler;
  }
  v.put = function(path, handler) {
    v.putHandlers[path] = handler;
  };
  v.listen = function(port){
    server = https.createServer(options, function(req, res){
      res.send = function(code, type, text){
        res.writeHead(code, {'Content-Type' : type});
        res.end(text);
      };
      res.redirect = function(path){
        res.writeHead(302, {'Location' : path});
        res.end();
      };
      req.path = url.parse(req.url);
      var handler = v[req.method][req.path.pathname];
      if(handler){
        handler(req, res);
      }
      else{
        res.send(404, 'text/html', "<h1>EROR 404 NOT FOUND</h1>");
      }
    }).listen(port);
    v.server = server;
  };
  return(v);
}
