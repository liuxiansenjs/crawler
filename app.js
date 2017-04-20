const express = require('express');
const url = require('url');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


// app.use(express.static('public'));
//https://www.zhihu.com/question/37787176
// app.get('/curl', function(req, res, next) {
function crawler(crawlerURL) {
    request(crawlerURL, function(error, response, html) {
        if (error || response.statusCode != 200) {
            console.log('error');
            //res.send('error');
            return;
        }

        const $ = cheerio.load(html);
        var imgs_object = $('img');
        //console.log(imgs_object);
        //console.log(Object.keys(imgs_object));
        //console.log(imgs_object.length);
        var imgs_array = [];
        for (var i = 0; i < imgs_object.length; i++) {
            //console.log(imgs_object[`${i}`].attribs.src);
            imgs_array.push(imgs_object[`${i}`].attribs.src);

        }

        // imgs_array = imgs_array.filter(function(val) {
        //     //console.log(/^https/.test(val));
        //     return /^http/.test(val);
        // })

        var _imgs_array = imgs_array.map(function(val, index, array) {
            if (/^http/.test(val)) {
                return val;
            } else {
                return `${crawlerURL}+${val}`;
            }
        });

        console.log(_imgs_array);

        //console.log(imgs_array);

        _imgs_array.forEach(function(val, index, arr) {
            const extname = path.extname(val);

            request(val)
                .pipe(fs.createWriteStream(`./public/image/${Number(new Date()) + extname}`))
                .on('error', function() {
                    console.log('error');
                });
        });
        // res.send('All commands have been executed.');
        






    });
}
// });

// app.listen(port);

crawler('http://www.ellechina.com/');
