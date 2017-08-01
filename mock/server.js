'use strict';

let path = require('path');
let http = require('http');
let fs = require('fs');
let url=require('url');
let mine=require('./mine').types;
let port = 3000;

function mockServer(){
    var server = http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname;
        if(pathname=="/"){

            response.writeHead(200, {
                'Content-Type':'application/json;charset=UTF-8'
            });
            response.write("{'status':0,'msg':'error',data:[]}", "binary");
            response.end();

        }else{
            var realPath = path.join(__dirname, pathname);
            var ext = path.extname(realPath);
            ext = ext ? ext.slice(1) : 'unknown';

            fs.exists(realPath, function (exists) {
                if (!exists) {

                    response.writeHead(404, {
                        'Content-Type': 'text/plain;charset=UTF-8'
                    });

                    response.write("请求地址" + pathname + "还未配置json文件");
                    response.end();

                } else {

                    var stat = fs.lstatSync(realPath);

                    if(stat.isDirectory())
                    {
                        realPath = path.join(realPath, 'index.json');
                    }

                    fs.exists(realPath,function(exists){
                        if (!exists) {
                            
                            response.writeHead(404, {
                                'Content-Type': 'text/plain;charset=UTF-8'
                            });

                            response.write("请求地址" + pathname + "还未配置json文件");
                            response.end();

                        }else{

                            fs.readFile(realPath, "binary", function (err, file) {
                                if (err) {
                                    response.writeHead(200, {
                                        'Content-Type': 'text/plain'
                                    });
                                    response.end(err);
                                } else {
                                    var contentType = mine[ext] || "text/plain";
                                    response.writeHead(200, {
                                        'Content-Type': contentType+';charset=UTF-8'
                                    });
                                    response.write(file, "binary");
                                    response.end();
                                }
                            });
                            
                        }
                    })
                    
                }

            });
        }
    });

    server.listen(port);
    console.log("Server runing at port: " + port + ".");
}
mockServer();