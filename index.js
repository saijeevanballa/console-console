"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

let subOptions = { pretty: true, excludeKeys: [] }

exports.default.consoleRequest = ({
    console: Console = true,
    stream,
    response = { ...subOptions, excludeStatus: [] },
    request = { ...subOptions },
    header = { ...subOptions },
    message = null,
    excludeURLs = [] }) => {

    const getDurationInMilliseconds = (start) => {
        const NS_PER_SEC = 1e9;
        const NS_TO_MS = 1e6;
        const diff = process.hrtime(start);
        return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
    };

    return (req, res, next) => {
        excludeURLs.map(block => { if (req.originalUrl.includes(block)) { next() } });
        const start = process.hrtime();
        const defaultWrite = res.write;
        const defaultEnd = res.end;
        const chunks = [];
        res.write = (...restArgs) => {
            chunks.push(Buffer.from(restArgs[0]));
            defaultWrite.apply(res, restArgs);
        };
        res.end = (...restArgs) => {
            if (restArgs[0]) {
                chunks.push(Buffer.from(restArgs[0]));
            }
            const resBody = Buffer.concat(chunks).toString('utf8');
            let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            let finalMessage = `API DETAILS: ${message || ""}\n METHOD: ${req.method} | URL: ${fullUrl} | RESPONSE TIME: ${getDurationInMilliseconds(start).toLocaleString()} ms \n DATE: ${new Date().toUTCString()}`;
            if (header) {
                if (isObj(header)) {
                    let headerObj = header && header.excludeKeys && header.excludeKeys.length ? Object.keys(req.headers).reduce((main, curr) => Object.assign(main, !header.excludeKeys.includes(curr) ? { [curr]: req.headers[curr] } : {}), {}) : req.headers
                    headerObj = header && header.pretty ? JSON.stringify(headerObj, null, '\t') : JSON.stringify(headerObj)
                    finalMessage = finalMessage + `\n Request Header:\n ${headerObj}`
                } else {
                    finalMessage = finalMessage + `\n Request Header:\n ${JSON.stringify(req.headers, null, '\t')}`
                }
            }
            if (request) {
                if (isObj(request)) {
                    let bodyObj = request && request.excludeKeys && request.excludeKeys.length ? Object.keys(req.body).reduce((main, curr) => Object.assign(main, !request.excludeKeys.includes(curr) ? { [curr]: req.body[curr] } : {}), {}) : req.body
                    bodyObj = request && request.pretty ? JSON.stringify(bodyObj, null, '\t') : JSON.stringify(bodyObj)
                    finalMessage = finalMessage + `\n Request Body:\n ${bodyObj}`
                } else {
                    finalMessage = finalMessage + `\n Request Body:\n ${JSON.stringify(req.body, null, '\t')}`
                }
            }
            if ((response && !isObj(response) || (response && response.excludeStatus && !response.excludeStatus.includes(res.statusCode)) || (Object.keys(response).length && !response.excludeStatus))) {
                if (isObj(response)) {
                    let responseObj = response && response.excludeKeys && response.excludeKeys.length ? Object.keys(resBody).reduce((main, curr) => Object.assign(main, !response.excludeKeys.includes(curr) ? { [curr]: resBody[curr] } : {}), {}) : resBody
                    responseObj = response && response.pretty ? JSON.stringify(responseObj, null, '\t') : JSON.stringify(responseObj)
                    finalMessage = finalMessage + `\n Response: ${res.statusCode}\n ${responseObj}`
                } else {
                    finalMessage = finalMessage + `\n Response: ${res.statusCode}\n ${JSON.stringify(resBody, null, '\t')}`
                }
            }
            if (Console) {
                console.log(finalMessage);
            };
            if (stream && stream.writable) {
                stream.write(finalMessage + "\n");
            };
            defaultEnd.apply(res, restArgs);
        };
        next();
    };
};

const isObj = ele => ele?.constructor === Object;