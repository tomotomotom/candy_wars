document.addEventListener('DOMContentLoaded', function() {
  const field = document.getElementById('field');
  const spawnButton = document.getElementById('spawn');

  spawnButton.addEventListener('click', () => {
    spawnUnit();
    spawnCandy();
  });

  // 一定間隔でCPUユニット召喚
  setInterval(() => {
    spawnEnemy();
  }, 3000); // 3秒ごとに敵を出す

  function spawnUnit() {
    const unit = document.createElement('div');
    unit.classList.add('unit');
    field.appendChild(unit);

    let position = 0;
    const speed = 2;

    const moveInterval = setInterval(() => {
      position += speed;
      unit.style.left = position + 'px';

      // ユニットとキャンディの当たり判定
      const candies = document.querySelectorAll('.candy');
      candies.forEach(candy => {
        if (isColliding(unit, candy)) {
          field.removeChild(candy); // キャンディを消す
        }
      });

      if (position > field.offsetWidth) {
        clearInterval(moveInterval);
        field.removeChild(unit);
      }
    }, 30);
  }

  function spawnEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    field.appendChild(enemy);

    let position = field.offsetWidth - 40;
    const speed = 2;

    const moveInterval = setInterval(() => {
      position -= speed;
      enemy.style.left = position + 'px';

      // 敵ユニットとキャンディの当たり判定
      const candies = document.querySelectorAll('.candy');
      candies.forEach(candy => {
        if (isColliding(enemy, candy)) {
          field.removeChild(candy); // キャンディを消す
        }
      });

      if (position < -40) {
        clearInterval(moveInterval);
        field.removeChild(enemy);
      }
    }, 30);
  }

  function spawnCandy() {
    const candy = document.createElement('div');
    candy.classList.add('candy');
    field.appendChild(candy);

    // ランダムな位置に置く
    const randomX = Math.random() * (field.offsetWidth - 20);
    const randomY = Math.random() * (field.offsetHeight - 20);
    candy.style.left = randomX + 'px';
    candy.style.top = randomY + 'px';
  }

  function isColliding(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
      aRect.top > bRect.bottom ||
      aRect.bottom < bRect.top ||
      aRect.left > bRect.right ||
      aRect.right < bRect.left
    );
  }
});
