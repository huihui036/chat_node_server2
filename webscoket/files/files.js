var fs = require('fs');
const path = require('path')
// 判断文件是否存在
function getStat(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                resolve(false);
            } else {
                resolve(stats);
            }
        })
    })
}


// 创建文件
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

// 判断路径是存在


async function dirExists(dir) {
    let isExists = await getStat(dir);
    //如果该路径且不是文件，返回true
    if (isExists && isExists.isDirectory()) {
        return true;
    } else if (isExists) {     //如果该路径存在但是文件，返回false
        return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir;

    let status = await dirExists(tempDir);
    let mkdirStatus;
    if (status) {
        mkdirStatus = await mkdir(dir);
    }
    //   return mkdirStatus;
    return tempDir
}

module.exports ={ dirExists}