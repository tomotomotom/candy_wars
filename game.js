document.addEventListener('DOMContentLoaded', function() {
  const field = document.getElementById('field');

  // 最初にキャンディを配置
  spawnCandies();

  // 自軍召喚：フィールドクリック
  field.addEventListener('click', (event) => {
    const rect = field.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (clickX < field.offsetWidth / 2) { // 左半分だけ
      const laneY = getLaneFromY(clickY);
      spawnUnit(laneY);
    }
  });

  // 敵軍召喚：3秒ごと
  setInterval(() => {
    spawnEnemy();
  }, 3000);

  // ユニット同士の衝突判定
  setInterval(() => {
    checkUnitCollisions();
  }, 30);

  // --- ユニット召喚（自軍） ---
  function spawnUnit(laneY) {
    const unit = document.createElement('div');
    unit.classList.add('unit');
    field.appendChild(unit);
  
    let x = 0;
    let y = laneY;
  
    unit.style.left = x + 'px';
    unit.style.top = y + 'px';
  
    const bridgeX = field.offsetWidth / 2 - 50; // 自陣から見た橋入口
    const bridgeCenterX = field.offsetWidth / 2; // 川の中心
    const targetY = (laneY < 150) ? 80 : 200; // 上橋or下橋のy座標
  
    let phase = 1;
    const speed = 1;
  
    const moveInterval = setInterval(() => {
      if (phase === 1) {
        // フェーズ1：橋入口まで斜め移動
        if (x < bridgeX) {
          x += speed;
          if (y < targetY) {
            y += speed;
          } else if (y > targetY) {
            y -= speed;
          }
        } else {
          phase = 2;
        }
      } else if (phase === 2) {
        // フェーズ2：橋を直進
        if (x < bridgeCenterX) {
          x += speed;
        } else {
          phase = 3;
        }
      } else if (phase === 3) {
        // フェーズ3：敵陣でターゲット追いかけ開始
        const target = document.querySelector('.enemy-candy');
        if (target) {
          const targetRect = target.getBoundingClientRect();
          const fieldRect = field.getBoundingClientRect();
  
          const targetX = targetRect.left - fieldRect.left;
          const targetY = targetRect.top - fieldRect.top;
  
          if (x < targetX) x += speed;
          if (x > targetX) x -= speed;
          if (y < targetY) y += speed;
          if (y > targetY) y -= speed;
  
          if (isColliding(unit, target)) {
            field.removeChild(target);
          }
        } else {
          // ターゲットがない場合は右へ進むだけ
          x += speed;
        }
      }
  
      unit.style.left = x + 'px';
      unit.style.top = y + 'px';
  
      if (x > field.offsetWidth) {
        clearInterval(moveInterval);
        field.removeChild(unit);
      }
    }, 30);
  }
    
  // --- ユニット召喚（敵軍） ---
  function spawnEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    field.appendChild(enemy);
  
    let x = field.offsetWidth - 40;
    let y = getRandomLaneY();
  
    enemy.style.left = x + 'px';
    enemy.style.top = y + 'px';
  
    const bridgeX = field.offsetWidth / 2 + 10; // 敵陣から見た橋入口
    const bridgeCenterX = field.offsetWidth / 2;
    const targetY = (y < 150) ? 80 : 200; // 上橋or下橋のy座標
  
    let phase = 1;
    const speed = 1;
  
    const moveInterval = setInterval(() => {
      if (phase === 1) {
        // フェーズ1：橋入口まで斜め移動
        if (x > bridgeX) {
          x -= speed;
          if (y < targetY) {
            y += speed;
          } else if (y > targetY) {
            y -= speed;
          }
        } else {
          phase = 2;
        }
      } else if (phase === 2) {
        // フェーズ2：橋を直進
        if (x > bridgeCenterX) {
          x -= speed;
        } else {
          phase = 3;
        }
      } else if (phase === 3) {
        // フェーズ3：自陣でターゲット追いかけ開始
        const target = document.querySelector('.my-candy');
        if (target) {
          const targetRect = target.getBoundingClientRect();
          const fieldRect = field.getBoundingClientRect();
  
          const targetX = targetRect.left - fieldRect.left;
          const targetY = targetRect.top - fieldRect.top;
  
          if (x < targetX) x += speed;
          if (x > targetX) x -= speed;
          if (y < targetY) y += speed;
          if (y > targetY) y -= speed;
  
          if (isColliding(enemy, target)) {
            field.removeChild(target);
          }
        } else {
          // ターゲットがない場合は左へ進むだけ
          x -= speed;
        }
      }
  
      enemy.style.left = x + 'px';
      enemy.style.top = y + 'px';
  
      if (x < -40) {
        clearInterval(moveInterval);
        field.removeChild(enemy);
      }
    }, 30);
  }
    
  // --- 最初に設置するキャンディ ---
  function spawnCandies() {
    const lanes = [70, 130, 190]; // 上・中央・下レーン

    lanes.forEach(y => {
      // 自陣（左側）
      const myCandy = document.createElement('div');
      myCandy.classList.add('candy', 'my-candy');
      field.appendChild(myCandy);
      const myX = field.offsetWidth * 0.25 - 10;
      myCandy.style.left = myX + 'px';
      myCandy.style.top = y + 'px';

      // 敵陣（右側）
      const enemyCandy = document.createElement('div');
      enemyCandy.classList.add('candy', 'enemy-candy');
      field.appendChild(enemyCandy);
      const enemyX = field.offsetWidth * 0.75 - 10;
      enemyCandy.style.left = enemyX + 'px';
      enemyCandy.style.top = y + 'px';
    });
  }

  // --- ユニット同士の衝突チェック ---
  function checkUnitCollisions() {
    const myUnits = document.querySelectorAll('.unit');
    const enemyUnits = document.querySelectorAll('.enemy');

    myUnits.forEach(myUnit => {
      enemyUnits.forEach(enemyUnit => {
        if (isColliding(myUnit, enemyUnit)) {
          if (field.contains(myUnit)) field.removeChild(myUnit);
          if (field.contains(enemyUnit)) field.removeChild(enemyUnit);
        }
      });
    });
  }

  // --- 衝突判定（キャンディ＆ユニット間）---
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

  // --- クリックY座標からレーン決定 ---
  function getLaneFromY(clickY) {
    if (clickY < 100) {
      return 70; // 上レーン
    } else if (clickY < 200) {
      return 130; // 中央レーン
    } else {
      return 190; // 下レーン
    }
  }

  // --- ランダムレーン選択（敵用） ---
  function getRandomLaneY() {
    const lanes = [70, 130, 190];
    const randomIndex = Math.floor(Math.random() * lanes.length);
    return lanes[randomIndex];
  }
});
