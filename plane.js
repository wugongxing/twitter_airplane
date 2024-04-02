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
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 30,
      speed: 5
    };
  
    // 绘制飞机的函数
    function drawPlane() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'blue';
      ctx.fillRect(plane.x, plane.y, plane.size, plane.size);
    }
  
    // 更新飞机位置的函数
    function updatePlane() {
      plane.x += plane.speed;
      if (plane.x > canvas.width || plane.x < 0) {
        plane.speed = -plane.speed;
      }
      plane.y += plane.speed;
      if (plane.y > canvas.height || plane.y < 0) {
        plane.speed = -plane.speed;
      }
      drawPlane();
    }
  
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