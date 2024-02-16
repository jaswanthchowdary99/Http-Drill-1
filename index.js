const http = require('http');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid');
const { setTimeout } = require('timers');
const { json } = require('express');


const server =  http.createServer((request,resolve)=>{

// resolve.setHeader = ('Content-Type','application/json');


  if(request.url == '/html' && request.method == 'GET'){
    fs.readFile('index.html','utf8',(err,data)=>{
      if(err){
        resolve.writeHead(500)
        resolve.end('Internal server error');
      }
      else{
        resolve.writeHead(200,{'Content-Type':'text/html'});
        resolve.end(data);
      }
    })
  }

  else if(request.url == '/json' && request.method == 'GET'){
    fs.readFile('data.json','utf8',(err,json)=>{
      if(err){
        resolve.writeHead(500)
        resolve.end('json data not found');
      }else{
        const parseData = JSON.stringify(json);
        resolve.writeHead(200,{'Content-Type':'application/json'})
        resolve.end(JSON.stringify(parseData));
      }
    })
  }

  else if(request.url == '/uuid' && request.method == 'GET'){
    const uuid = uuidv4();
    resolve.writeHead(200,{'Content-Type':'text/plain'});
    resolve.end(uuid);
  }

  else if(request.url.startsWith('/delay/')  && request.method == "GET"){
    const delayTime = parseInt(request.url.split('/')[2]);
    setTimeout(()=>{
      resolve.writeHead(200,{'Content-Type':'text/plain'})
      resolve.end(JSON.stringify(`success after delay time ${delayTime} seconds`))
    },delayTime*1000)
  }

  else if(request.url.startsWith('/status/') && request.method == 'GET'){
    const statusUrl = parseInt(request.url.split('/')[2]);
    const statusText = http.STATUS_CODES[statusUrl] || 'Unknown Status';
    resolve.writeHead(statusUrl,{'Content-Type':'text/plain'});
    resolve.end(JSON.stringify(`Response with status code : ${statusUrl} = ${statusText}`));
  }
 
  else{
    resolve.writeHead(404);
    resolve.end('file not found')
  }
})
const port = 8000;
server.listen(port,()=>{
  console.log(`server running on http://localhost:${port}`)
});