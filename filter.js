
var canvas = document.getElementById('canvas');
//이미지초기 값 담기
init_brightness =""; 
//invert 변수
var invert = document.getElementById('invert');
//밝기조정 변수
var myRange = document.getElementById('myRange');
var reset= document.getElementById('reset');
var img = document.getElementById('img');
pointValue = 0;// 기준 밝기값
bright_flag = 3; //flag 초기값

//gray 변수
var grayBtn = document.getElementById('grayBtn');

//sepia 변수
var sepia = document.getElementById('sepia');

if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    // drawing code here
  } else {
    // canvas-unsupported code here
  }
  
  
  //필터 버튼
  // 반전 필터
   function invertFilter(pData){
    for(let i = 0; i<pData.data.length;i+=4){
        pData.data[i] = 255 - pData.data[i] //r
        pData.data[i+1] = 255 - pData.data[i+1] //g
        pData.data[i+2] = 255 - pData.data[i+2] //b
        pData.data[i+3] = 255 //Alpha
    }
    return pData;
  }
  //반전 필터 클릭 시
  invert.onclick = ()=>{
     let pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
     let filterData = invertFilter(pixels);
     ctx.putImageData(filterData,0,0);
  }
  //발기 조정 필터
  function brightnessFilter(pData,value){
    if(Number(value)>pointValue){
        if(bright_flag===0){
          for(let i = 0; i<pData.data.length;i+=4){            
            pData.data[i] += pointValue/2//r
            pData.data[i+1] +=  pointValue/2 //g
            pData.data[i+2] +=  pointValue/2 //b
            bright_flag = 1
          }
        }else{
          for(let i = 0; i<pData.data.length;i+=4){            
            pData.data[i] -= pointValue/2//r
            pData.data[i+1] -=  pointValue/2 //g
            pData.data[i+2] -=  pointValue /2//b
            bright_flag = 0
          }
        }

        for(let i = 0; i<pData.data.length;i+=4){
            pData.data[i] += value/2//r
            pData.data[i+1] +=  value/2 //g
            pData.data[i+2] +=  value/2 //b
            bright_flag = 1
        }


    }else{
        if(bright_flag===1){
          for(let i = 0; i<pData.data.length;i+=4){
            pData.data[i] -= pointValue/2  //r
            pData.data[i+1] -=  pointValue/2 //g
            pData.data[i+2] -=  pointValue/2 //b
            bright_flag = 0
          }
        }else{
          for(let i = 0; i<pData.data.length;i+=4){
            pData.data[i] += pointValue/2  //r
            pData.data[i+1] +=  pointValue/2 //g
            pData.data[i+2] +=  pointValue/2 //b
            bright_flag = 1
          }
        }

        for(let i = 0; i<pData.data.length;i+=4){
            pData.data[i] -= value/2//r
            pData.data[i+1] -=  value/2 //g
            pData.data[i+2] -=  value/2 //b
            bright_flag = 0
        }
    }

    pointValue = value;
    return pData;
  }
  //발기 조정
  myRange.onchange =(e)=>{
    let pixels = ctx.getImageData(0,0,canvas.width,canvas.height);    
    let filterData = brightnessFilter(pixels,e.target.value);
    ctx.putImageData(filterData,0,0);
  }
  //원상 복구
  reset.onclick =()=>{
    myRange.value = 0;
    bright_flag = 3;
    ctx.putImageData(init_brightness,0,0);
  }

  //gray filter
  function grayFilter(pData){
    for(let i = 0; i<pData.data.length;i+=4){
       var r = pData.data[i]
       var g = pData.data[i+1] 
       var b = pData.data[i+2] 

       var v = 0.2126*r + 0.7152*g + 0.0722*b //보정값
       pData.data[i] = pData.data[i+1] = pData.data[i+2] =v;
    }
    return pData;
  }
  //gray 사진으로 만들기 
  grayBtn.onclick =()=>{
    let pixels = ctx.getImageData(0,0,canvas.width,canvas.height);    
    let filterData = grayFilter(pixels);
    ctx.putImageData(filterData,0,0);
  }
  //sepia filter
  function sepiaFilter(pData){
    for(let i = 0; i<pData.data.length;i+=4){
      var r = pData.data[i]
      var g = pData.data[i+1] 
      var b = pData.data[i+2] 

      pData.data[i] = r*0.3588 + g*0.7044 + b*0.1368;
      pData.data[i+1] = r*0.2990 + g*0.5870 + b*0.1140;
      pData.data[i+2] = r*0.2392 + g*0.4696 + b*0.0912;
    }
    return pData;
  }
  //sepia 사진으로 만들기
  sepia.onclick =()=>{
    let pixels = ctx.getImageData(0,0,canvas.width,canvas.height);    
    let filterData = sepiaFilter(pixels);
    ctx.putImageData(filterData,0,0);
  }


  //이미치 변경될때
  img.onchange = function(e){
    var file = e.target.files[0];
    var fileReader = new FileReader();
    fileReader.onload=e=>{
        var image = new Image();
        image.src = e.target.result;
        image.onload =()=>{
          
            image = drawImageData(image)            
       }
    }
    fileReader.readAsDataURL(file);
   
  }

  //캔버스 크기로이미지 맞추기
  function drawImageData(image){
    // image.height *= canvas.offsetWidth /image.width;
    // image.width = canvas.offsetWidth;

    // if(image.height>canvas.offsetHeight){
    //     image.height *= canvas.offsetHeight /image.height;
    //     image.width = canvas.offsetWidth;
    // }
    canvas.height = image.height
    canvas.width = image.width    
    ctx.drawImage(image,0,0,image.width,image.height);
    init_brightness = ctx.getImageData(0,0,canvas.width,canvas.height)   
  }

  