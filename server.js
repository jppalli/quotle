#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = process.env.PORT || 8080;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Parse URL
    const parsedUrl = url.parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;

    // If pathname is just a directory, serve index.html
    if (pathname === './') {
        pathname = './index.html';
    }

    // Get file extension
    const ext = path.parse(pathname).ext;

    fs.exists(pathname, (exist) => {
        if (!exist) {
            // File not found
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

        // If it's a directory, try to serve index.html
        if (fs.statSync(pathname).isDirectory()) {
            pathname += '/index.html';
        }

        // Read file from file system
        fs.readFile(pathname, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // Set the right header
                res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');
                
                // Add CORS headers for development
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                
                res.end(data);
            }
        });
    });
});

server.listen(port, () => {
    console.log(`🎮 Daily Quote Puzzle server running at:`);
    console.log(`   Local:   http://localhost:${port}`);
    console.log(`   Network: http://127.0.0.1:${port}`);
    console.log('');
    console.log('Press Ctrl+C to stop the server');
});