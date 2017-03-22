var http = require('http'),
     url = require('url'),
    path = require('path');
      fs = require('fs');

// ADDED THIS FUNCTION HERE -----------------------------------------------------
function handleStaticPages(pathName, res) {
    var ext = path.extname(pathName);
    switch(ext) {
        case '.css':
            res.writeHead(200, {"Content-Type": "text/css"});
            fs.readFile('./' + pathName, 'utf8', function(err, fd) {
                res.end(fd);
            });
            console.log('Routed for Cascading Style Sheet '+ pathName +' Successfully\n');
        break;
        case '.js':
            res.writeHead(200, {"Content-Type": "text/javascript"});
            fs.readFile('./' + pathName, 'utf8', function(err, fd) {
                res.end(fd);
            });
            console.log('Routed for Javascript '+ pathName +' Successfully\n');
        break;
    }
}
// ADDED THIS FUNCTION HERE -----------------------------------------------------

function start(route, handle) {
    function onRequest(req, res) {
        var postData = "",
            pathName = url.parse(req.url).pathname;
        console.log('Request for ' + pathName + ' received.');

        req.addListener('data', function(data) {
            postData += data;
            console.log('Received POST data chunk ' + postData + '.');
        });

        req.addListener('end', function() {
            var pathext = path.extname(pathName);
            if (pathext === '.js' || pathext === '.css') {
            handleStaticPages(pathName, res);
        } else {
            console.log('--> Routing only the view page');
            route(handle, pathName, res, postData);
        }
        });
    }

    http.createServer(onRequest).listen(4000);
    console.log('Server is now listening at: http://127.0.0.1:4000 .');
}

exports.start = start;