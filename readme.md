Utils to make tmpfile sync or async

## THIS PROJECT IS 【INACTIVE】
This project is not maintained anymore. Please use alternative.

## Install

```
npm install @taluoo/tmpfile --save
```

## Usage

```
const {makeTmpFile, makeTmpFileSync, deleteTmpFile} = require('@taluoo/tmpfile');

let tmpfile1 = makeTmpFileSync();
console.log(tmpfile1);

async function test() {
    let tmpFile2 = await makeTmpFile();
    console.log(tmpFile2);
}

test();

deleteTmpFile(tmpfile1);
```

## TODO

-