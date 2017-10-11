const fs = require('fs');
const os = require('os');
const path = require('path');

let tmpDirPrefix = path.join(os.tmpdir(), 'node-util-');
let tmpFileName = 'tmp.tmp';
/**
 * 同步创建临时文件
 * @return {*} 临时文件路径
 */
function makeTmpFileSync() {
    let tmpPath = fs.mkdtempSync(tmpDirPrefix);
    let tmpFilePath = path.join(tmpPath, tmpFileName);
    fs.openSync(tmpFilePath, 'wx');
    return tmpFilePath;
}

/**
 * 异步创建临时文件
 * @return {Promise} 成功时返回临时文件路径
 */
function makeTmpFile() {
    return new Promise(function (resolve, reject) {
        fs.mkdtemp(tmpDirPrefix, function (err, tmpDir) {
            if (err) {
                reject(err)
            } else {
                let tmpFilePath = path.join(tmpDir, tmpFileName);
                fs.open(tmpFilePath, 'wx', function (err, fd) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(tmpFilePath);
                    }
                })
            }
        })
    })
}

/**
 * 删除临时文件，及其上层目录
 * @param filePath 必须是绝对路径，且位于系统 os.tmpdir()
 * @return {Promise} 成功时返回 true
 */
function deleteTmpFile(filePath) {
    return new Promise(function (resolve, reject) {
        if (!path.isAbsolute(filePath)) {
            reject(new Error('deleteTmpFile(filePath) 中 filePath 必须是绝对路径'));
        }
        if (filePath.indexOf(tmpDirPrefix) !== 0) {
            reject(new Error('deleteTmpFile(filePath) 中 filePath 必须位于 os.tmpdir()'));
        }
        fs.unlink(filePath, err => {
            if (err) {
                reject(err)
            } else {
                fs.rmdir(path.dirname(filePath), err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true);
                    }
                })
            }
        })
    })
}

module.exports = {
    makeTmpFile,
    makeTmpFileSync,
    deleteTmpFile
};