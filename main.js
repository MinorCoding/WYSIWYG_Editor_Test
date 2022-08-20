import http from 'http';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

http.createServer((req, res) =>
{
    const paths = req.url.split('/');
    switch(paths[1])
    {
        case 'image' :
        {
            console.log(req.method);
            if(req.method === 'GET')
            {
                if(paths.length === 3)
                {
                    const [ filename, ext ] = paths[2].split('.');
                    if(ext)
                    {
                        const mimes = {
                            jpg : 'image/jpeg',
                            jpeg : 'image/jpeg',
                            png : 'image/png',
                            gif : 'image/gif'
                        };

                        if(ext in mimes)
                        {
                            const filePath = path.join(path.resolve(), 'summer-note', 'image', filename + '.' + ext);
                            fs.readFile(filePath, (err, img) =>
                            {
                                if(err)
                                {
                                    if(err.errno === -4058)
                                    {
                                        res.writeHead(404, { 'Content-Type' : 'text/plain; charset=utf-8' }).end('해당 이미지 파일이 존재하지 않습니다.');
                                        return;
                                    }
                                    else
                                    {
                                        res.writeHead(500, { 'Content-Type' : 'text/plain; charset=utf-8' }).end('Server Internal Error');
                                        return;
                                    }
                                }
                                else
                                {
                                    res.writeHead(200, { 'Content-Type' : mimes[ext] }).end(img);
                                }
                            });
                            return;
                        }
                        else
                            res.writeHead(400, { 'Content-Type' : 'text/plain; charset=utf-8' }).end('해당 확장자의 이미지 파일은 지원하지 않습니다');
                    }
                    else
                        res.writeHead(400, { 'Content-Type' : 'text/plain; charset=utf-8' }).end('잘못된 파일 이름입니다');
                }
                else
                    res.writeHead(400, { 'Content-Type' : 'text/plain; charset=utf-8' }).end('잘못된 url 경로입니다');
            }
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
                    const result = JSON.stringify({ url : 'http://localhost:3000/image/' + files.file[0].newFilename });
                    console.log(result);
                    res.end(result);
                    return;
                });
              
                return;
            }
        }
    }
}).listen(3000);