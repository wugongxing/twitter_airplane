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
    speed: 2, // 飞机的速度
    maxSpeed: 10, // 飞机的最大速度
    minSpeed: 1, // 飞机的最小速度
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

    // 更新飞机位置的函数
    function updatePlane() {
      // 确保飞机不会移出canvas边界
      if (plane.x > canvas.width || plane.x < 0) {
        plane.x = Math.max(0, Math.min(plane.x, canvas.width));
      }

      // 绘制飞机
      drawPlane();
    }

  // 启动游戏
  // setInterval(updatePlane, 64);
  // setInterval(updatePlane, 16);
  function animate() {
    updatePlane();
    requestAnimationFrame(animate);
  }
  animate();

    let scrollPosition = 0;
    const scrollSpeed = 3 ; // 滚动速度，可以根据需要调整
    let isScrolling = false; // 滚动状态标志

    function smoothScroll() {
      scrollPosition += scrollSpeed;
      scrollPosition = Math.min(scrollPosition, document.body.scrollHeight - window.innerHeight);

      window.scrollTo(0, scrollPosition);
      scrollRequest = requestAnimationFrame(smoothScroll);
    }

    let scrollRequest; // 用于requestAnimationFrame的变量

    document.addEventListener('keydown', (event) => {
      if (event.key === 's') {
        // 当按下'S'键时，开始滚动
        if (!scrollRequest && window.scrollY < document.body.scrollHeight - window.innerHeight) {
          isScrolling = true;
          scrollRequest = requestAnimationFrame(smoothScroll);
        }else{
          isScrolling = false; // 停止滚动
        }
      }
    });

    // 用于清除滚动动画的函数
    function cancelScroll() {
      cancelAnimationFrame(scrollRequest);
      isScrolling = false; // 停止滚动
      scrollRequest = null;
    }

    // 监听keyup事件来取消滚动
    document.addEventListener('keyup', (event) => {
      if (isScrolling) {
        if (event.key === 'p') {
          cancelScroll();
        }
      } 
    });

  // 假设plane对象已经定义，并且有x和y属性表示位置
  let isMovingLeft = false;
  let isMovingRight = false;
  let isMovingUp = false;
  let isMovingDown = false;

  document.addEventListener('keydown', function(event) {
    // 阻止默认的保存行为
    if (event.ctrlKey && event.key === 'O') {
      event.preventDefault();
    }
    // 检查是否按下了方向键
    if (event.key === 'ArrowLeft') {
      isMovingRight = false; // 确保不会同时向右移动
      isMovingLeft = true; // 开始向左移动
    } else if (event.key === 'ArrowRight') {
      isMovingLeft = false; // 确保不会同时向左移动
      isMovingRight = true; // 开始向右移动
    } else if (event.key === 'ArrowUp' || event.key === 'U') {
      isMovingDown = false; // 确保不会同时向下移动
      isMovingUp = true; // 开始向上移动
    } else if (event.key === 'ArrowDown' || event.key === 'D') {
      isMovingUp = false; // 确保不会同时向上移动
      isMovingDown = true; // 开始向下移动
    }
  });

  function updatePlanePosition() {
    // 根据按键状态更新飞机位置
    if (isMovingLeft) {
      plane.x -= 5;
      isMovingLeft = false
    }
    if (isMovingRight) {
      plane.x += 5;
      isMovingRight = false
    }
    if (isMovingUp) {
      plane.y -= 5;
      isMovingUp = false
    }
    if (isMovingDown) {
      plane.y += 5;
      isMovingDown = false
    }
    drawPlane()
  }

  // 假设这个函数会在每一帧调用，例如通过setInterval或者requestAnimationFrame
  function animate2() {
    updatePlanePosition();
    checkForOverlap();
    // 这里可以添加其他动画逻辑
  }

  // 启动动画
  setInterval(animate2, 16); // 16毫秒执行一次，大约60帧每秒



  const hiddenLikes = [];
  function checkForOverlap() {
    // 获取页面上所有的like元素
    const likeButtons = document.querySelectorAll('[data-testid="like"]');
    // console.log('likebutton is ' + likeButtons)
    // 遍历所有like元素
    likeButtons.forEach(likeButton => {
      // 检查飞机是否与like元素重叠
      // 这里我们使用简单的边界框碰撞检测
      // console.log('each ' + likeButton)
      const likeRect = likeButton.getBoundingClientRect();
      if (
        plane.x >= likeRect.left - 25  &&
        plane.y >= likeRect.top -20
        // plane.x >= (likeRect.left -25) && plane.x <= (likeRect.right + 25) &&
        // plane.y >= (likeRect.top -20) && plane.y <= (likeRect.bottom + 20)
      ) {
        console.log('1 ' + likeRect.left);
        console.log('2 ' + likeRect.right);
        console.log('3 ' + likeRect.top);
        console.log('4 ' + likeRect.bottom);
        // 如果重叠，并且该元素尚未被隐藏，则隐藏它
        if (!hiddenLikes.includes(likeButton)) {
          hiddenLikes.push(likeButton);
          likeButton.style.display = 'none';
        }
      } else {
        console.log('plane y is'+ likeRect.left)
        // 如果不重叠，并且该元素已经被隐藏，则显示它
        if (hiddenLikes.includes(likeButton)) {
          const index = hiddenLikes.indexOf(likeButton);
          hiddenLikes.splice(index, 1);
          likeButton.style.display = '';
        }
      }
    });
  }

  

});