# console-request

> HTTP request logger middleware for node.js

## Table of Contents

- [Why?](#why)
- [Installation](#installation)
- [Functions](#functions)
- [Usage](#usage)

## Why?

A simple logging library for multi-level log for console and file.

## Installation

```sh
$ npm i console-request -s
```

## Functions

Take a look into the [usage section](#usage) for a detailed example.

### console-request

> Note: Use this Middleware below  [body-parser](https://www.npmjs.com/package/body-parser) Middleware.

This Middleware Takes an object as an parameter and logs the request body, request headers and response.

## Usage

**Example 1**  
*Note: it will logs all API*
```js
import * as consoleRequest from 'console-request';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// must parse body before console-request as body will be logged
app.use(bodyParser.json());

// consoleRequest middleware logs the request 
app.use(consoleRequest);
```

**Example 2**  
*Note: it will logs Particular router*
```js
import * as consoleRequest from 'console-request';
import express from 'express';
import bodyParser from 'body-parser';
import * as userRouter from './user';

const app = express();

// must parse body before console-request as body will be logged
app.use(bodyParser.json());

// consoleRequest middleware logs only user Router 
app.use("/user", consoleRequest, userRouter);
```

## Options

console-request accepts these properties in the options object.

##### console

log the header, request and response in the console (default: true), it accepts boolean 

<!-- eslint-disable no-undef -->

``` js
app.use(consoleRequest({
  console : false
}));
```

##### stream

write the header, request and response in file. it accepts  writable stream

<!-- eslint-disable no-undef -->

```js
var logStream = fs.createWriteStream(path.join(__dirname, 'dev.log'), { flags: 'a' })

app.use(consoleRequest({
  stream: logStream,
}));
```

##### header

write the header of the request. it accepts boolean or object (defalut: true)
- pretty: To formate header object (default: true)
- excludeKeys: it accepts array of key that can be excluded

<!-- eslint-disable no-undef -->

```js
app.use(consoleRequest({
  header: false,
}));
```
OR
<!-- eslint-disable no-undef -->

```js
app.use(consoleRequest({
  header: { pretty: false, excludeKeys: ["token"] },
}));
```

##### request

write the request body of the request. it accepts boolean or object (defalut: true)
- pretty: To formate request body object (default: true)
- excludeKeys: it accepts array of key that can be excluded

<!-- eslint-disable no-undef -->

```js
app.use(consoleRequest({
  request: false,
}));
```
OR
<!-- eslint-disable no-undef -->

```js
app.use(consoleRequest({
  request: { pretty: false, excludeKeys: ["password"] },
}));
```

##### response

write the response of the api. it accepts boolean or object (defalut: true)
- pretty: To formate response object (default: true)
- excludeKeys: it accepts array of key that can be excluded

<!-- eslint-disable no-undef -->

```js
app.use(consoleRequest({
  response: false,
}));
```
OR
<!-- eslint-disable no-undef -->

```js
app.use(consoleRequest({
  response: { pretty: false, excludeKeys: ["password"] },
}));
```
##### message

write the custom message of the api. it accepts string

<!-- eslint-disable no-undef -->

```js
app.use(consoleRequest({
  message: "user router",
}));
```
##### excludeURLs

exclude some urls to write

<!-- eslint-disable no-undef -->

```js
app.use(consoleRequest({
  excludeURLs: ["/auth"] ,
}));
```

## write logs to a file

#### single file

Sample app that will log all requests in the to the file `access.log`.

```js
var express = require('express')
var fs = require('fs')
var consoleRequest = require('console-request')
var path = require('path')

var app = express()

// create a write stream (in append mode)
var logStream = fs.createWriteStream(path.join(__dirname, 'dev.log'), { flags: 'a' })

app.use(consoleRequest({
  stream: logStream,
}));

app.get('/', function (req, res) {
  res.send('hello, world!')
})
```

#### log file rotation

Sample app that will log all requests in the log file per day in the `log/` directory using the
[rotating-file-stream module](https://www.npmjs.com/package/rotating-file-stream).

```js
var express = require('express')
var consoleRequest = require('console-request')
var path = require('path')
var rfs = require('rotating-file-stream') // version 2.x

var app = express()

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})

// setup the logger
app.use(consoleRequest({
  stream: accessLogStream,
}));
app.get('/', function (req, res) {
  res.send('hello, world!')
})
```
