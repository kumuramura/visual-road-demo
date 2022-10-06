const obj2gltf = require('obj2gltf');
const fs = require('fs');
obj2gltf('./model/cube.obj').then(function (gltf) {
    const data = Buffer.from(JSON.stringify(gltf));
    fs.writeFileSync('./model/cube.gltf', data);
});
