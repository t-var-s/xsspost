const fs = require('fs');
const http = require('http');
const querystring = require('querystring');
const port = 1337;
const hosted_files = loadTextFilesFromFolder('hosted');
const server = http.createServer((request, response) => {
    let chunks = [];
    request.on('data', chunk=>chunks.push(chunk));
    request.on('end', () => {
        request.body = chunks.join('');
        switch(request.rawHeaders[1]){
            case 'localhost:' + port:// to simulate the target server
                switch(request.method){
                    case 'GET': respondWithPrivatePage(response); break;
                    case 'POST': respondWithVulnerableService(response, request); break;
                    default: respondWith404(response); break;
                }
            break;
            case '127.0.0.1:' + port:// to simulate the attacker resources
                switch(request.method){
                    case 'GET':
                        switch(request.url){
                            case '/': respondWithForm(response); break;
                            case '/js': respondWithJSPayload(response); break;
                            default: respondWith404(response); break;
                        }
                    break;
                    case 'POST': respondWithStorageService(response, request); break;
                    default: respondWith404(response); break;
                }
            break;
        }
    });
});
function loadTextFilesFromFolder(folder){
    const filenames = fs.readdirSync(folder);
    const files = {};
    for(let f = 0; f < filenames.length; f++){
        files[filenames[f]] = fs.readFileSync(folder + '/' + filenames[f], 'utf8');
    }
    return files;
}
function ok(response, body, type='text/html'){
    response.statusCode = 200;
    response.setHeader('Content-Type', type);
    response.end(body);
}
function respondWith404(response){
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end('404');
}
function respondWithPrivatePage(response){
    //WARNING: cookie should be HTTP-only
    response.setHeader('Set-Cookie', ['token=2h0r590rphds8hs30f0suy']);
    ok(response, hosted_files['private.html']);
}
function respondWithForm(response){
    ok(response, hosted_files['form.html'])
}
function respondWithJSPayload(response){
    ok(response, hosted_files['payload.js'], 'text/javascript');
}
function respondWithVulnerableService(response, request){
    //WARNING: service does not have a CSP header like for example:
    //response.setHeader("Content-Security-Policy", "script-src 'none'");
    let parameters = {};
    try{
        parameters = JSON.parse(request.body);
    }catch(error){//WARNING: service also accepts urlencoded form data
        parameters = querystring.parse(request.body);
    }
    if(!parameters.action){
        ok(response, '{success:false}', 'application/json');
        return false;
    }
    parameters.success = true;
    const response_body = JSON.stringify(parameters);//WARNING: service reflects parameters
    ok(response, response_body);//WARNING: service does not set content type header
}
function respondWithStorageService(response, request){
    console.log(request.body);
    ok(response, '{}', 'application/json');
}


server.listen(port, '127.0.0.1', () => {
    console.log(`Start by opening http://localhost:${port}/ in your browser.`);
    console.log('Compromised data from the page above will be logged here:');
});
