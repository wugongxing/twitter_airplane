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
      plane.x -= 4;
      positionChanged = true;
    }
    if (isMovingRight) {
      plane.x += 4;
      positionChanged = true;
    }
    if (isMovingUp) {
      plane.y -= 2;
      plane.angle = 0;
      positionChanged = true;
    }
    if (isMovingDown) {
      plane.y += 2;
      plane.angle = 180;
      positionChanged = true;
    }

    // 更新位置变化标记
    plane.hasPositionChanged = positionChanged;

    // 确保飞机不会移出canvas边界
    plane.x = Math.max(0, Math.min(plane.x, canvas.width));
    plane.y = Math.max(0, Math.min(plane.y, canvas.height));
  }

  const hiddenLikes = [];
  let likeCountAll = 0;
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
    const likeCountText = likeButton.getAttribute('aria-label');
    let likeCount = 0;
    if (likeCountText) {
      // 从 aria-label 中提取数字
      const match = likeCountText.match(/(\d+) Likes/);
      if (match) {
        likeCount = parseInt(match[1], 10);
      }
    console.log(`likeButtons[]: ${likeCount} Likes`);
    }

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
     
        //----
        // 创建一个新的红色圆形按钮元素
        const newLikeButton = document.createElement('div');
        newLikeButton.className = 'like-grow';
        newLikeButton.style.left = `${likeX}px`;
        newLikeButton.style.top = `${likeY}px`;
        newLikeButton.style.width = `${likeWidth}px`;
        newLikeButton.style.height = `${likeHeight}px`;

        // 添加 Twitter 的 like 按钮 SVG 代码
        const likeButtonSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        likeButtonSvg.setAttribute('viewBox', '0 0 24 24');
        likeButtonSvg.setAttribute('aria-hidden', 'true');

        // newLikeButton.className = 'custom-like-button';
        likeButtonSvg.classList.add('like-grow');

        const likeButtonPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        likeButtonPath.setAttribute('d', 'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z');
        likeButtonSvg.appendChild(likeButtonPath);
        newLikeButton.appendChild(likeButtonSvg);

        document.body.appendChild(newLikeButton);

        // 1秒后,新的红色按钮从原位置慢慢变大并消失
        setTimeout(() => {
          newLikeButton.remove();
        }, 1000);
        // document.body.appendChild(newLikeButton);
        // // 1秒后,新的红色按钮从原位置慢慢变大并消失
        // setTimeout(() => {
        //   newLikeButton.remove();
        // }, 1000);
        // //----


        // 显示提示信息 0.5 秒后自动关闭
        let toastMessage = document.getElementById('toast-message');
        if (!toastMessage) {
          // toastMessage = createToastMessage();
          toastMessage = createToastMessage(likeRect.x, likeRect.y, likeRect.width, likeRect.height);
        }
        
        likeCountAll = likeCountAll + likeCount; 

        toastMessage.textContent = `Consumed ${likeCount} likes`;
        updateInitialToastMessage(`Total Score:：${likeCountAll}`);
        // toastMessage.textContent = `已隐藏 ${currentHiddenCount + 1} 个点赞按钮`;
        toastMessage.style.display = 'block';

        setTimeout(() => {
          toastMessage.style.display = 'none';
        }, 1000);

        // //-----
        // // 创建一个新的红色圆形按钮元素
        // const newLikeButton = document.createElement('div');
        // newLikeButton.className = 'new-like-button';
        // newLikeButton.style.position = 'fixed';
        // newLikeButton.style.left = `${likeX}px`;
        // newLikeButton.style.top = `${likeY}px`;
        // newLikeButton.style.width = `${likeWidth}px`;
        // newLikeButton.style.height = `${likeHeight}px`;
        // newLikeButton.style.backgroundColor = 'red';
        // newLikeButton.style.borderRadius = '50%';
        // newLikeButton.style.transition = 'all 1s ease-in-out';
        // document.body.appendChild(newLikeButton);

        // // 1秒后,新的红色按钮向右上角移动并变大
        // setTimeout(() => {
        //   newLikeButton.style.transform = 'translate(50%, -50%) scale(5)';
        //   newLikeButton.style.opacity = '0';
        // }, 1000);

        // // 1.5秒后,移除新的红色按钮元素
        // setTimeout(() => {
        //   newLikeButton.remove();
        // }, 1500);
        // //---



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
  createInitialToastMessage(); 
  drawPlane();
  animate();
});


// function createToastMessage() {
//   const toastMessage = document.createElement('div');
//   toastMessage.id = 'toast-message';
//   toastMessage.className = 'toast-message';
//   toastMessage.style.position = 'fixed';
//   toastMessage.style.bottom = '50px';
//   toastMessage.style.left = '50%';
//   toastMessage.style.transform = 'translateX(-50%)';
//   toastMessage.style.backgroundColor = 'rgba(200, 255, 200, 0.9)'; // 淡绿色背景
//   toastMessage.style.color = 'black'; // 黑色字体
//   toastMessage.style.padding = '20px 30px'; // 更大的面积
//   toastMessage.style.fontSize = '18px'; // 更大的字体
//   toastMessage.style.borderRadius = '8px';
//   toastMessage.style.zIndex = '9999';
//   toastMessage.style.display = 'none';
//   document.body.appendChild(toastMessage);
//   return toastMessage;
// }

function createToastMessage(planeX, planeY, planeWidth, planeHeight) {
  const toastMessage = document.createElement('div');
  toastMessage.id = 'toast-message';
  toastMessage.className = 'toast-message';
  toastMessage.style.position = 'fixed';
  toastMessage.style.top = `${planeY}px`; // 设置距离上边界的距离
  toastMessage.style.right = `${planeX + planeWidth + 10}px`; // 设置距离右边界的距离
  toastMessage.style.transform = 'translateY(-50%)'; // 垂直居中
  toastMessage.style.backgroundColor = 'rgba(200, 255, 200, 0.9)';
  toastMessage.style.color = 'black';
  toastMessage.style.padding = '20px 30px';
  toastMessage.style.fontSize = '18px';
  toastMessage.style.borderRadius = '8px';
  toastMessage.style.zIndex = '9999';
  toastMessage.style.display = 'none';
  document.body.appendChild(toastMessage);
  return toastMessage;
}

function createInitialToastMessage() {
  const initialToastMessage = document.createElement('div');
  initialToastMessage.id = 'initial-toast-message';
  initialToastMessage.className = 'initial-toast-message';
  initialToastMessage.textContent = 'Please press Ctrl+S to start';
  initialToastMessage.style.position = 'fixed';
  initialToastMessage.style.top = '50%';
  initialToastMessage.style.left = '10px';
  initialToastMessage.style.transform = 'translateY(-50%)';
  initialToastMessage.style.backgroundColor = 'rgba(200, 200, 200, 0.8)';
  initialToastMessage.style.color = 'navy';
  initialToastMessage.style.padding = '30px 60px';
  initialToastMessage.style.fontSize = '20px';
  initialToastMessage.style.borderRadius = '5px';
  initialToastMessage.style.zIndex = '9999';
  document.body.appendChild(initialToastMessage);
}

function updateInitialToastMessage(newMessage) {
  const initialToastMessage = document.getElementById('initial-toast-message');
  if (initialToastMessage) {
    initialToastMessage.textContent = newMessage;
  }
}

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
