import * as THREE from "three";

export function initscene(){
    var scene = new THREE.Scene();
    //点光源
    var point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point); //点光源添加到场景中
    //环境光
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
   return scene;

}

export function initcamera(width,height,scene){
    //创建相机对象
    var camera = new THREE.PerspectiveCamera(55,width/height,0.1,20000);
    camera.position.set(80, 80, 80); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    return camera;
}



