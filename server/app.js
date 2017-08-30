const Koa = require('koa');
const koaBody = require('koa-body');
const path = require('path');
const cors = require('koa2-cors');
const fs = require('fs');
const os = require('os');
const app = new Koa();
// cross domain http head Allow-origin-access
const main = async function(ctx) {
    const tmpdir = os.tmpdir();
    const files = ctx.request.body.files || {};
    const filePaths = [];
    for (let key in files) {
        // 保存文件
        // saveFile 异步
        // 文件上传不一，所有文件上传完成
        // 在返回结果?异步便同步
        // path: 
        const file = files[key];
        const filePath = path.join(tmpdir, file.name);
        console.log(filePath)
        console.log(file.path);
        // 里面有内容  读取流打开
        const reader = fs.createReadStream(file.path)
            // filePath 目的地有了，等内容
        const writer = fs.createWriteStream(filePath);
        reader.pipe(writer);
        filePaths.push(filePath);
    }
    ctx.body = filePaths;
}
app.use(cors({
    // localhost:8080/upload
    origin: function(ctx) {
        if (ctx.url == '/test') {
            return false
        }
        return '*'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorrization', 'Accept']
}))
app.use(koaBody({
    multipart: true
}))
app.use(main);
app.listen(3000);