const gltfPipeline = require("gltf-pipeline");
const fsExtra = require("fs-extra");
const processGltf = gltfPipeline.processGltf;
const gltf = fsExtra.readJsonSync("./model/cube.gltf");
const options = {
  dracoOptions: {
    compressionLevel: 10,
  },
  //separateTextures: true,  保留单独纹理
  //resourceDirectory: './', 模型文件夹

};
processGltf(gltf, options).then(function (results) {
  fsExtra.writeJsonSync("./model/cube-draco.gltf", results.gltf);
});