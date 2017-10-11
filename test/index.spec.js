require('./test_setup');

const os = require('os');
const path = require('path');
const fs = require('fs');

const {makeTmpFile, makeTmpFileSync, deleteTmpFile} = require('../index');

describe('index.js', () => {
    it('should export three function', function () {
        makeTmpFile.should.be.a('function');
        makeTmpFileSync.should.be.a('function');
        deleteTmpFile.should.be.a('function');
    });
    describe('makeTmpFile()', () => {
        it('should return a promise', async () => {
            let promise = makeTmpFile();

            promise.should.be.a('promise');
            deleteTmpFile(await promise);
        });
        describe('when make tmp file success', () => {
            it('return a file path', async () => {
                let tmpfilePath = await makeTmpFile();

                tmpfilePath.should.be.include(path.join(os.tmpdir(), 'node-util-'));
                fs.existsSync(tmpfilePath).should.be.true;
                deleteTmpFile(tmpfilePath);
            });
        });
        describe('when make tmp file failed', () => {
            it('should throw an error');
        })

    });
    describe('makeTmpFileSync()', () => {
        let tmpfilePath;
        it('return a file path', function () {
            tmpfilePath = makeTmpFileSync();

            tmpfilePath.should.be.include(path.join(os.tmpdir(), 'node-util-'));
            fs.existsSync(tmpfilePath).should.be.true;
        });
        afterEach('clean tmp file', function () {
            deleteTmpFile(tmpfilePath);
        })
    });
    describe('deleteTmpFile()', () => {
        it('should return a promise', async function () {
            let tmpFilePath = await makeTmpFile();
            deleteTmpFile(tmpFilePath).should.be.a('promise');
        });

        describe('when delete success', () => {
            let tmpFilePath;
            beforeEach('prepare tmp file', async () => {
                tmpFilePath = await makeTmpFile();
            });
            it('should return true', async function () {
                let result = await deleteTmpFile(tmpFilePath);

                result.should.be.true;
                fs.existsSync(tmpFilePath).should.be.false;
            });

            it('should also delete parent dir', async function () {
                await deleteTmpFile(tmpFilePath);
                let tmpDir = path.dirname(tmpFilePath);
                fs.existsSync(tmpDir).should.be.false;
            });
        });
        describe('should delete failed', () => {
            it('when path is not absolute', async function () {
                await deleteTmpFile('./tmp/tmp.txt').should.be.rejected;
            });
            it('when path is not in system tmp dir', async function () {
                let abPath = __dirname + '/tmp/tmp.txt';
                await deleteTmpFile(abPath).should.be.rejectedWith(Error)
            });
            describe('when delete failed', () => {
                it('should throw error ')
            });
        });
    })
});
