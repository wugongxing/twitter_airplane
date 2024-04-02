// 检查页面是否已经加载完成
window.addEventListener('load', function() {
    // 注册一个canvas元素到页面中
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    // 设置canvas的大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // 将canvas添加到body中
    document.body.appendChild(canvas);
  
    // 初始化飞机对象
    let plane = {
      x: canvas.width / 2 - 25, // 飞机初始x位置
      y: canvas.height / 2 - 25, // 飞机初始y位置
      size: 50, // 飞机的“大小”可以根据机翼长度调整
      angle: 0, // 飞机的角度，用于旋转
      speed: 2 // 飞机的速度
    };

    function drawPlane() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // 保存状态  
      ctx.save();
    
      ctx.translate(plane.x, plane.y);
      ctx.rotate(plane.angle * Math.PI / 180);
    
      // 机身
      ctx.fillStyle = 'lightblue';
      ctx.beginPath();
      ctx.moveTo(0, -plane.size/2);
      ctx.lineTo(-plane.size, 0);
      ctx.lineTo(0, plane.size/2);
      ctx.lineTo(plane.size, 0);
      ctx.closePath();
      ctx.fill();
    
      // 机翼
      ctx.fillStyle = 'skyblue'; 
      ctx.beginPath();
      ctx.moveTo(-plane.size/2, -plane.size/4);
      ctx.lineTo(-plane.size, -plane.size/8);
      ctx.lineTo(-plane.size/2, plane.size/4);
      ctx.closePath();
      ctx.fill();
    
      ctx.beginPath();
      ctx.moveTo(plane.size/2, -plane.size/4);
      ctx.lineTo(plane.size, -plane.size/8); 
      ctx.lineTo(plane.size/2, plane.size/4);
      ctx.closePath(); 
      ctx.fill();
    
      // 尾翼 
      ctx.fillStyle = 'dodgerblue';
      ctx.fillRect(0, 0, plane.size/4, plane.size/2);
    
      ctx.restore();
    }

    // 更新飞机位置和角度的函数
    function updatePlane() {
      // ... 更新飞机位置的代码 ...
      plane.x += plane.speed;
      if (plane.x > canvas.width || plane.x < 0) {
        plane.speed = -plane.speed;
      }
      plane.y += plane.speed;
      if (plane.y > canvas.height || plane.y < 0) {
        plane.speed = -plane.speed;
      }


      // 更新飞机的角度，使其面向运动方向
      plane.angle = (360 / plane.speed) * (Math.floor(Math.random() * 100) % 2 === 0 ? 1 : -1);

      drawPlane();
    }

    // // 初始化飞机对象
    // let plane = {
    //   x: canvas.width / 2,
    //   y: canvas.height / 2,
    //   size: 30,
    //   speed: 5
    // };
  
    // // 绘制飞机的函数
    // function drawPlane() {
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   ctx.fillStyle = 'blue';
    //   ctx.fillRect(plane.x, plane.y, plane.size, plane.size);
    // }
  
    // // 更新飞机位置的函数
    // function updatePlane() {
    //   plane.x += plane.speed;
    //   if (plane.x > canvas.width || plane.x < 0) {
    //     plane.speed = -plane.speed;
    //   }
    //   plane.y += plane.speed;
    //   if (plane.y > canvas.height || plane.y < 0) {
    //     plane.speed = -plane.speed;
    //   }
    //   drawPlane();
    // }
  
    // 启动游戏
    setInterval(updatePlane, 16);
  
    // 监听快捷键
    document.addEventListener('keydown', function(event) {
      if (event.ctrlKey && event.key === 's') {
        // 可以在这里添加启动或暂停游戏的逻辑
        event.preventDefault(); // 阻止默认的保存行为
      }
    });
  });