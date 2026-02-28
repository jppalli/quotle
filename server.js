#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = process.env.PORT || 8080;
const baseDir = path.resolve(__dirname);

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

    // Parse URL and constrain file access to project directory
    const parsedUrl = url.parse(req.url);
    let requestPath = '/';
    try {
        requestPath = decodeURIComponent(parsedUrl.pathname || '/');
    } catch (error) {
        res.statusCode = 400;
        res.end('Bad Request');
        return;
    }
    const normalizedPath = path.normalize(requestPath === '/' ? '/index.html' : requestPath);
    const resolvedPath = path.resolve(baseDir, `.${normalizedPath}`);

    if (!resolvedPath.startsWith(baseDir + path.sep) && resolvedPath !== baseDir) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }

    fs.stat(resolvedPath, (statErr, stats) => {
        if (statErr) {
            res.statusCode = 404;
            res.end('File not found!');
            return;
        }

        const filePath = stats.isDirectory() ? path.join(resolvedPath, 'index.html') : resolvedPath;

        fs.readFile(filePath, (readErr, data) => {
            if (readErr) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${readErr}.`);
                return;
            }

            const ext = path.extname(filePath);
            res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');

            // Add CORS headers for development
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            res.end(data);
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
