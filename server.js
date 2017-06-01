const express = require('express');
const multer  = require('multer');
const Sharp = require('sharp');

let origin_path = 'storage/origin/';
let optimized_path = 'storage/optimized/';

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, origin_path)
    },
    filename: function (req, file, cb) {
        let extension = file.originalname.split(".");
        cb(null, Date.now() + '.' + extension[extension.length - 1])
    }
});

let upload = multer({storage: storage});

app.post('/upload', upload.single('file'), function (req, res) {
    let img_dest = optimized_path + req.file.filename;
    Sharp(origin_path + req.file.filename)
        .jpeg({quality:50})
        .webp({quality:50})
        .png({quality:50})
        .toFile(img_dest, function (err) {
            res.send(err);
        });
});

app.get('/', function (req, res) {
    res.send('Hello World');
});

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
});
