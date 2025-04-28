document.addEventListener('DOMContentLoaded', function() {
  const field = document.getElementById('field');

  // 最初のキャンディ生成
  spawnCandies();

  field.addEventListener('click', (event) => {
    const rect = field.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (clickX < field.offsetWidth / 2) {
      const laneY = getLaneFromY(clickY);
      spawnUnit(laneY);
    }
  });

  setInterval(() => {
    spawnEnemy();
  }, 3000);

  // ★ここ！ユニット同士の衝突判定を毎30msチェック
  setInterval(() => {
    checkUnitCollisions();
  }, 30);
  
  function spawnUnit(laneY) {
    const unit = document.createElement('div');
    unit.classList.add('unit');
    field.appendChild(unit);
  
    let position = 0;
    const speed = 2;
  
    unit.style.top = laneY + 'px';
  
    const moveInterval = setInterval(() => {
      position += speed;
      unit.style.left = position + 'px';
  
      const candies = document.querySelectorAll('.candy');
      candies.forEach(candy => {
        if (isColliding(unit, candy)) {
          if (candy.classList.contains('enemy-candy')) { // ★プレイヤーは敵のキャンディだけ取る！
            field.removeChild(candy);
          }
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
    const laneY = getRandomLaneY();
  
    enemy.style.top = laneY + 'px';
  
    const moveInterval = setInterval(() => {
      position -= speed;
      enemy.style.left = position + 'px';
  
      const candies = document.querySelectorAll('.candy');
      candies.forEach(candy => {
        if (isColliding(enemy, candy)) {
          if (candy.classList.contains('my-candy')) { // ★敵は自軍キャンディだけ取る！
            field.removeChild(candy);
          }
        }
      });
  
      if (position < -40) {
        clearInterval(moveInterval);
        field.removeChild(enemy);
      }
    }, 30);
  }
  
  function spawnCandies() {
    const lanes = [70, 130, 190]; // 上・中・下レーンのY座標
  
    lanes.forEach(y => {
      // 自陣（左側、1/4あたり）
      const myCandy = document.createElement('div');
      myCandy.classList.add('candy', 'my-candy'); // ★自陣用のクラス追加
      field.appendChild(myCandy);
      const myX = field.offsetWidth * 0.25 - 10;
      myCandy.style.left = myX + 'px';
      myCandy.style.top = y + 'px';
  
      // 相手陣地（右側、3/4あたり）
      const enemyCandy = document.createElement('div');
      enemyCandy.classList.add('candy', 'enemy-candy'); // ★敵陣用のクラス追加
      field.appendChild(enemyCandy);
      const enemyX = field.offsetWidth * 0.75 - 10;
      enemyCandy.style.left = enemyX + 'px';
      enemyCandy.style.top = y + 'px';
    });
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

  function getLaneFromY(clickY) {
    if (clickY < 100) {
      return 70;
    } else if (clickY < 200) {
      return 130;
    } else {
      return 190;
    }
  }

  function getRandomLaneY() {
    const lanes = [70, 130, 190];
    const randomIndex = Math.floor(Math.random() * lanes.length);
    return lanes[randomIndex];
  }

  
  function checkUnitCollisions() {
    const myUnits = document.querySelectorAll('.unit');
    const enemyUnits = document.querySelectorAll('.enemy');

    myUnits.forEach(myUnit => {
      enemyUnits.forEach(enemyUnit => {
        if (isColliding(myUnit, enemyUnit)) {
          // 衝突したら両方消す
          if (field.contains(myUnit)) field.removeChild(myUnit);
          if (field.contains(enemyUnit)) field.removeChild(enemyUnit);
        }
      });
    });
  }
});