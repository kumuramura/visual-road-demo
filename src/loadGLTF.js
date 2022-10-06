    import * as THREE from "three";
    import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
    import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
    import {DRACOLoader } from "three/examples/jsm/loaders/dracoloader.js";
    import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
    import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
    import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js'


    import * as INIT from './start_a_scene.js' ;

    var width = window.innerWidth*0.7; //窗口宽度
    var height = window.innerHeight*0.84; //窗口高度

    var scene = INIT.initscene();
    var camera=INIT.initcamera(width,height,scene);
     /**
      * 创建渲染器对象
      */
    var maincanvas=document.getElementById("mainCanvas");
    var renderer = new THREE.WebGLRenderer({canvas:maincanvas});//通过html的canvas中id绑定
    renderer.setSize(width, height);//设置渲染区域尺寸
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色


    var axes = new THREE.AxisHelper(100);
    scene.add(axes);  
    

    //控制
    var controls = new OrbitControls(camera,renderer.domElement);//创建控件对象
    controls.update();
     //此处不要写controls.addEventListener('change', render)
     // 已经通过requestAnimationFrame(render);周期性执行render函数，没必要再通过监听鼠标事件执行render函数
     //否则严重影响卡顿



    //加载数据文件
    var inputdatas;
    window.onload=function(){
      inputdatas = document.getElementById('txt_uploads');
      inputdatas.addEventListener('change',setData);
    }
    function setData(){
      const curFiles=inputdatas.files; 
       if(curFiles.length != 0) {   //有文件输入
          const para = document.getElementById("txtName");
          para.textContent = curFiles[0].name;
    
        } 
    }  
    
    
     

    //设置文件输入
    const input = document.getElementById('model_uploads');
    const preview = document.querySelector('.preview');
    input.style.opacity = 0;
    input.addEventListener('change', updateModelDisplay);
    var enableSubmit=-1;

    //获取文件的按钮
    const submit=document.getElementById('submit');
    submit.addEventListener('click', loadFiles);
    //清空列表按钮
    const deleteallItem=document.getElementById('clearList');
    deleteallItem.addEventListener('click',deleteAllItem);


    function updateModelDisplay(){   //模型待上传列表
        //循环清除preview中的内容
        while(preview.firstChild) {
          preview.removeChild(preview.firstChild);
          enableSubmit=-1;
        }     
        const curFiles=input.files; 
        if(curFiles.length == 0) {   //没有文件输入
          const para = document.createElement('p');
          para.className='result';
          para.textContent = '当前列表没有文件';
          preview.appendChild(para);
          enableSubmit=-1;

        } else {   //有文件输入
            enableSubmit=0;
            const list = document.createElement('ul');
            list.id='modelList'
            preview.appendChild(list);
            for(const file of curFiles){ //遍历文件列表
                const listItem=document.createElement('li');
                const para = document.createElement('p');
                const descirption=document.createElement('p');//单独写个描述信息
                listItem.id=file.name;//列表里的item的id就是文件的名字！
                listItem.className='load';//用于标明是否要加载
                const fileTypes = [//设定可用文件类型
                  'gltf',
                  'fbx'
                ];
                if(getFileType(file.name)=='obj'){ //加载obj模型
                  para.className='result';
                  descirption.className='description';
                  descirption.textContent = `文件名: ${file.name}`+'\r\n'+`文件大小: ${returnFileSize(file.size)}.`;
                  //材质输入的input元素
                  const mtl=document.createElement('input');
                  mtl.name=file.name+'mtl';//材质按键的名字为文件名+mtl
                  mtl.type='file';
                  mtl.accept='.mtl';
                  mtl.className='mtl';
                  para.appendChild(mtl);
                  //描述信息输入
                  para.appendChild(descirption);
                  //添加para到item中，把可提交设置与0或
                  listItem.appendChild(para);
                  enableSubmit=enableSubmit||0;
                  //添加一个删除按钮，该功能移除


                }else if(fileTypes.includes(getFileType(file.name))) { //加载非obj模型
                  para.className='result';
                  para.textContent = `文件名: ${file.name}`+'\r\n'+`文件大小: ${returnFileSize(file.size)}.`;
                  listItem.appendChild(para);
                  enableSubmit=enableSubmit||0;
                  //添加一个删除按钮，该功能移除

                } else {
                  para.className='badResult';
                  para.textContent = `文件名: ${file.name}——————非法格式。请重新选择。`;
                  listItem.appendChild(para);
                  enableSubmit=enableSubmit||1;
                  //添加一个删除按钮，该功能移除

                }           
                list.appendChild(listItem);
            }

        }

    }
     
    function getFileType(fileName) {//获取文件类型
      
      var filetype=fileName.split(".").slice(-1);
      return filetype[0];
    }

    function returnFileSize(number) {
       if(number < 1024) {
         return number + 'bytes';
       } else if(number >= 1024 && number < 1048576) {
         return (number/1024).toFixed(1) + 'KB';
       } else if(number >= 1048576) {
         return (number/1048576).toFixed(1) + 'MB';
       }
     }



    function deleteAllItem(){//清除所有文件
      while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
      } 
      const para = document.createElement('p');
      para.className='result';
      para.textContent = '当前列表没有文件';
      preview.appendChild(para);
      enableSubmit=-1;
      input.value='';
      alert('列表已清空');
    }





    function loadFiles(){
      const curFiles=input.files; 
        if(enableSubmit == -1) {   //没有文件输入
          alert("Please choose your 3D model file!");

        } 
        else if(enableSubmit==0){ //正常输入
          for(const file of curFiles){

            
            if(document.getElementById(file.name).className&&document.getElementById(file.name).className=='load')
              {
                 var url = null;//获取文件url，网上找的
                 if (window.createObjcectURL != undefined) {
                    url = window.createOjcectURL(file);
                 } else if (window.URL != undefined) {//火狐
                    url = window.URL.createObjectURL(file);
                 } else if (window.webkitURL != undefined) {//webkit或者chrome
                   url = window.webkitURL.createObjectURL(file);
                 }
                 var filetype=file.name.split(".").slice(-1)[0];//分割，取最后一位，最后一位取出来是个数组再取数组第一个
                 if(filetype=='obj'||filetype=='OBJ'){
                   //加载obj
                   const obj3d = new THREE.Object3D();//代理模型
                   obj3d.name=file.name;  
                   var loader = new OBJLoader();
                   var mloader=new MTLLoader();
                   if(document.getElementById(file.name).getElementsByClassName("result").getElementsByClassName("mtl")){
                        mloader.load('', function(materials) {
                          materials.preload();
                          loader.setMaterials(materials);
                          loader.load(url, function loadobj(obj) {          
                            obj3d.add(obj);
                            })             
                        });                 
                   }
                   else{                  
                         loader.load(url, function loadobj(obj) {              
                           obj3d.add(obj);
                           });
                   }

                    scene.add(obj3d);
                    URL.revokeObjectURL(url);
                  }  
                 
                 else if(filetype=='gltf'||filetype=='GLTF'){
                   //加载gltf，draco版
                   var loader = new GLTFLoader();
                   var dracoloader=new DRACOLoader();
                   const obj3d = new THREE.Object3D();//代理模型
                   obj3d.name=file.name;  
                   dracoloader.setDecoderPath('static/gltf/');//加载解码库
                   dracoloader.setDecoderConfig({type: 'js'});//作用不明
                   dracoloader.preload(); 
                   loader.setDRACOLoader(dracoloader);
                   loader.load(url, function loadgltf(gltf) {
                      obj3d.add(gltf.scene);  
                   });
                   scene.add(obj3d);
                   URL.revokeObjectURL(url);
                 }
                 else if(filetype=='fbx'||filetype=='FBX'){
                   //加载fbx
                   const obj3d = new THREE.Object3D();//代理模型
                   obj3d.name=file.name;                  
                   var loader = new FBXLoader();//创建一个FBX加载器
                   loader.load(url, function loadfbx(fbx) {
                   obj3d.add( fbx );
                   
                   });
                   scene.add(obj3d);
                   URL.revokeObjectURL(url);
                 }
             
              }         
          }

          //加载完了进行清空操作
          //删除ul里所有的li
          while(preview.firstChild) {
            preview.removeChild(preview.firstChild);
          }  
          const para = document.createElement('p');
          para.className='result';
          para.textContent = 'No files currently selected for upload';
          preview.appendChild(para);
          enableSubmit=-1;


        }
        else if(enableSubmit==1){ //非法输入
          alert("Invalid file type in list!");
        }
    }




    
    //记录帧数
    var framePerSecond=document.getElementById('frame');
    var clock=new THREE.Clock();   
    var frameTime=0;
    var TimeS=0;
    clock.start();
    function render() {
        renderer.render(scene, camera);
        frameTime=frameTime+1;
        //.getDelta()方法获得两帧的时间间隔
        var T = clock.getDelta(); 
        TimeS=TimeS+T;
        
        if(TimeS>=1){
          framePerSecond.innerHTML="帧数："+frameTime/TimeS;
          TimeS=0;
          frameTime=0;
        }    
        requestAnimationFrame(render);//请求再次执行渲染函数render

     }
    render();



    

    
       