import http from 'http';
import formidable from 'formidable';
import path from 'path';

http.createServer((req, res) =>
{
    switch(req.url)
    {
        case '/image' :
        {
            console.log(req.method);
            if(req.method === 'GET')
                res.end('good');
            if(req.method === 'POST')
            {
                const form = formidable({
                    keepExtensions : true,
                    uploadDir : path.join(path.resolve(), 'summer-note', 'image'),
                    maxFileSize : 50 * 1024 * 1024
                });

                form.parse(req, (err, fields, files) => 
                {
                    if (err) 
                    {
                        console.error(err);
                        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                        res.end(String(err));
                        return;
                    }
                    console.log(fields);
                    console.log('\n\n');
                    console.log(files);
                    res.writeHead(200, 
                        { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin' : '*',
                            'Access-Control-Allow-Headers' : '*'
                        });
                    const result = JSON.stringify({ url : files.file[0].filepath });
                    console.log(result);
                    res.end(result);
                    return;
                });
              
                return;
            }
        }
    }
}).listen(3000);