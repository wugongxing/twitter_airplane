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

  const planeImage = new Image();
  planeImage.src = chrome.runtime.getURL('plane2.png');

  // 初始化飞机对象
  let plane = {
    x: canvas.width / 2 - 25, // 飞机初始x位置
    y: canvas.height / 2 - 25, // 飞机初始y位置
    size: 150, // 飞机的"大小"可以根据机翼长度调整
    angle: 0, // 飞机的角度,用于旋转
    speed: 2, // 飞机的速度
    maxSpeed: 10, // 飞机的最大速度
    minSpeed: 1, // 飞机的最小速度
    hasPositionChanged: false // 标记飞机位置是否发生变化
  };

  function drawPlane() {
    // console.log('****drpanle*****')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(plane.x, plane.y);
    ctx.rotate(plane.angle * Math.PI / 180);
    ctx.drawImage(planeImage, -plane.size / 2, -plane.size / 2, plane.size, plane.size);
    // console.log('****drpanle2*****')
    ctx.restore();
  }

  // 更新飞机位置的函数
  function updatePlanePosition() {
    let positionChanged = false;
    
    // 根据按键状态更新飞机位置
    if (isMovingLeft) {
      plane.x -= 2;
      positionChanged = true;
    }
    if (isMovingRight) {
      plane.x += 2;
      positionChanged = true;
    }
    if (isMovingUp) {
      plane.y -= 2;
      positionChanged = true;
    }
    if (isMovingDown) {
      plane.y += 2;
      positionChanged = true;
    }

    // 更新位置变化标记
    plane.hasPositionChanged = positionChanged;

    // 确保飞机不会移出canvas边界
    plane.x = Math.max(0, Math.min(plane.x, canvas.width));
    plane.y = Math.max(0, Math.min(plane.y, canvas.height));
  }

  const hiddenLikes = [];
  // function checkForOverlap() {
  //   // 获取页面上所有的like元素
  //   const likeButtons = document.querySelectorAll('[data-testid="like"]');

  //   // 遍历所有like元素
  //   likeButtons.forEach(likeButton => {
  //     const likeRect = likeButton.getBoundingClientRect();

  //     // console.log("tweetElements ---------- 2")


  //     if (
  //       // plane.x >= likeRect.left -20 && plane.x <= likeRect.right +20 &&
  //       // plane.y >= likeRect.top -2 && plane.y <= likeRect.bottom + 2

  //       plane.x >= likeRect.left - 25  &&
  //       plane.y >= likeRect.top -20

  //     ) {
  //       // 如果重叠,并且该元素尚未被隐藏,则隐藏它
  //       if (!hiddenLikes.includes(likeButton)) {

  //         console.log("tweetElements 2 likeRect.left "+ likeRect.left) 
  //         console.log("tweetElements likeRect.top "+ likeRect.top) 
  //         console.log("tweetElements likeRect.right "+ likeRect.right) 
  //         console.log("tweetElements likeRect.bottom "+ likeRect.bottom) 

  //         console.log("tweetElements plane.x "+ plane.x) 
  //         console.log("tweetElements plane.y "+ plane.y) 

  //         hiddenLikes.push(likeButton);
  //         likeButton.style.display = 'none';
  //       }
  //     } else {
  //       // 如果不重叠,并且该元素已经被隐藏,则显示它
  //       if (hiddenLikes.includes(likeButton)) {
  //         const index = hiddenLikes.indexOf(likeButton);
  //         hiddenLikes.splice(index, 1);
  //         likeButton.style.display = '';
  //       }
  //     }
  //   });
  // }

function checkForOverlap() {
  // 获取页面上所有的like元素
  const likeButtons = document.querySelectorAll('[data-testid="like"]');

  // 遍历所有like元素
  likeButtons.forEach(likeButton => {
    const likeRect = likeButton.getBoundingClientRect();
    const likeX = likeRect.left;
    const likeY = likeRect.top;
    const likeWidth = likeRect.width;
    const likeHeight = likeRect.height;

    // 计算飞机的边界框
    const planeLeft = plane.x - plane.size / 2;
    const planeRight = plane.x + plane.size / 2;
    const planeTop = plane.y - plane.size / 2;
    const planeBottom = plane.y + plane.size / 2;

    if (
      planeLeft <= likeX + likeWidth &&
      planeRight >= likeX &&
      planeTop <= likeY + likeHeight &&
      planeBottom >= likeY
    ) {
      // 如果重叠,并且该元素尚未被隐藏,则隐藏它
      if (!hiddenLikes.includes(likeButton)) {
        hiddenLikes.push(likeButton);
        likeButton.style.display = 'none';
      }
    } 
    // else {
    //   // 如果不重叠,并且该元素已经被隐藏,则显示它
    //   if (hiddenLikes.includes(likeButton)) {
    //     const index = hiddenLikes.indexOf(likeButton);
    //     hiddenLikes.splice(index, 1);
    //     likeButton.style.display = '';
    //   }
    // }
  });
}

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
      isMovingRight = false;
      isMovingLeft = true;
    } else if (event.key === 'ArrowRight') {
      isMovingLeft = false;
      isMovingRight = true;
    } else if (event.key === 'ArrowUp' || event.key === 'U') {
      isMovingDown = false;
      isMovingUp = true;
    } else if (event.key === 'ArrowDown' || event.key === 'D') {
      isMovingUp = false;
      isMovingDown = true;
    } else if (event.key === 'S') {
      drawPlane();
      shuffleButtons();
    }
  });

  document.addEventListener('keyup', function(event) {
    // 检查是否松开了方向键
    if (event.key === 'ArrowLeft') {
      isMovingLeft = false;
    } else if (event.key === 'ArrowRight') {
      isMovingRight = false;
    } else if (event.key === 'ArrowUp' || event.key === 'U') {
      isMovingUp = false;
    } else if (event.key === 'ArrowDown' || event.key === 'D') {
      isMovingDown = false;
    }
  });
  

  function animate() {
    // console.log('****animate****')
    updatePlanePosition();
    if (plane.hasPositionChanged) {
      drawPlane();
      plane.hasPositionChanged = false;
    }
    checkForOverlap();
    requestAnimationFrame(animate);
  }


  
  
  
  // shuffleButtons();
  drawPlane();
  animate();
});


function shuffleButtons() {
  console.log('****begin   ***   tweetElements****')
  // 获取所有的 twtee 元素
  const tweetElements = document.querySelectorAll('div[role="group"]');
    console.log('****tweetElements****')
    console.log(tweetElements.length);

  // 遍历每个 twtee 元素
  tweetElements.forEach((tweetElement) => {
    // 获取这个 twtee 中的前三个按钮
    const buttons = Array.from(tweetElement.children).slice(0, 3);
    console.log('****tweetElements****');

    // 随机排列这三个按钮
    for (let i = buttons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    }

    // 将随机排列后的按钮插入到 twtee 元素中
    const firstChild = tweetElement.children[0];
    buttons.forEach((button) => {
      const likeRect = button.getBoundingClientRect();
      console.log("tweetElements 2 likeRect.left "+ likeRect.left) 
      console.log("tweetElements likeRect.top "+ likeRect.top) 
      console.log("tweetElements likeRect.right "+ likeRect.right) 
      console.log("tweetElements likeRect.bottom "+ likeRect.bottom) 
      tweetElement.insertBefore(button, firstChild);
    });
  });
}

// 在页面加载完成后调用该函数
// window.addEventListener('DOMContentLoaded', shuffleButtons);
