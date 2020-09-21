const fs = require('fs');
const path = require('path');

(function () {
    console.log(1);
    fs.readFile(path.resolve(__dirname, './forRead.js'), (err, content) => {
        console.log(content.toString());
        console.log(3);
    });


})();

let a = fs.createReadStream(path.resolve(__dirname, './forRead.js'));
let b = fs.createWriteStream(path.resolve(__dirname, './forWrite.js'));

a.pipe(b);

console.log(2)