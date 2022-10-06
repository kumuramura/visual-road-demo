import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js'
import { Object3D } from "three";





/**
     * 创建场景对象Scene
     */
 var scene = new THREE.Scene();

 // Canvas
 //const thecanvas = document.querySelector('canvas.webgl')


 var axes = new THREE.AxisHelper(250);
 scene.add(axes);

 var geoPlane=new THREE.PlaneGeometry(80,80);

 var matPlane = new THREE.MeshBasicMaterial({
   color:new THREE.Color(0,0,0)
  }); //材质对象Material
  var plane = new THREE.Mesh(geoPlane, matPlane); //网格模型对象Mesh
  plane.name="plane";
  plane.rotateX(-Math.PI/2);
  plane.translateZ(-0.1);
  scene.add(plane); //网格模型添加到场景中

var father=new Object3D();
father.name='father'
//加载
 var loader = new OBJLoader();
 var mloader=new MTLLoader();
 mloader.load('../model/city2.mtl', function(materials) {
  materials.preload();
  loader.setMaterials(materials);
  loader.load('../model/city2.obj', function loadobj(obj) {

    obj.name="cityGroup";
    father.add(obj);
  });

});
scene.add(father);
console.log(scene);



// 环境光
const light = new THREE.AmbientLight(0xbdbdbd); // soft white light
scene.add(light);

// 平行光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.45);
directionalLight.position.set(100, 100, 10);
scene.add(directionalLight);




 var width = window.innerWidth*0.55; //窗口宽度
 var height = window.innerHeight*0.55; //窗口高度
 //创建相机对象
 var camera = new THREE.PerspectiveCamera(55,width/height,0.1,20000);
 camera.position.set(10, 25, 25); //设置相机位置
 camera.lookAt(scene.position); //设置相机方向(指向的场景对象)


 /**
  * 创建渲染器对象
  */
 var renderer = new THREE.WebGLRenderer({
   antialias:true
 });
 renderer.setSize(width, height);//设置渲染区域尺寸
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
 renderer.setClearColor(new THREE.Color('#404040'), 1); //设置背景颜色
 document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
 //执行渲染操作   指定场景、相机作为参数

 function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);//请求再次执行渲染函数render
    
 }
   render();

   
   var controls = new OrbitControls(camera,renderer.domElement);//创建控件对象


   console.log('查看Scene的子对象',scene.children);
   console.log('查看plane',scene.getObjectByName("plane"));


  