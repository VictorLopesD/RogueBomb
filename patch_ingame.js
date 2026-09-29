const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Add dictionary elements
content = content.replace("'opt-cont': 'Continue'", `'opt-cont': 'Continue',
          'ingame-room': 'ROOM',
          'ingame-level': 'LEVEL',
          'ingame-enemies': 'ENEMIES',
          'ingame-gauntlet': 'Gauntlet',
          'ingame-gauntlet-lvl': 'LVL',
          'ingame-cc': 'Crystal Coal',
          'ingame-parts': 'Parts',
          'ingame-map': 'PROCEDURAL MAP',
          'ingame-lockdown': 'LOCKDOWN! ELIMINATE AUTOMATONS',
          'ingame-bosskey': 'BOSS KEY',
          'ingame-bossroom': 'BOSS ROOM',
          'ingame-miniboss': 'RIVAL ARENA',
          'ingame-puzzle': 'CHALLENGE CHAMBER',
          'ingame-secret': 'SECRET FLOOR',
          'ingame-inventor': 'INVENTOR',
          'ingame-armoryfree': 'ARMORY (FREE)',
          'ingame-cost': 'COST:',
          'ingame-chests': 'CHESTS:',
          'ingame-goela': 'CHUTE',
          'armory-title': 'Armory Desk',
          'armory-youhave': 'You have',
          'armory-buy': 'Buy',
          'armory-max': 'MAX',
          'armory-bought': 'BOUGHT',
          'armory-upgrade': 'Upgrade',
          'armory-close': 'Close',
          'armory-gauntlet-name': 'Mechanical Gauntlet',
          'armory-gauntlet-desc': 'Increases throwing range.',
          'armory-boots-name': 'Propulsion Boots',
          'armory-boots-desc': 'Allows Dashing (Press SHIFT or Mobile Button). Cost: 1 CC. Overheats for 5s.',
          'armory-bag-name': 'Expanded Bag',
          'armory-bag-desc': 'Carry more bombs and swap types.'`);

content = content.replace("'opt-cont': 'Continuar'", `'opt-cont': 'Continuar',
          'ingame-room': 'SALA',
          'ingame-level': 'NÍVEL',
          'ingame-enemies': 'INIMIGOS',
          'ingame-gauntlet': 'Manopla',
          'ingame-gauntlet-lvl': 'NV.',
          'ingame-cc': 'Cristal Coal',
          'ingame-parts': 'Peças',
          'ingame-map': 'MAPA PROCEDURAL',
          'ingame-lockdown': 'LOCKDOWN! ELIMINE OS AUTÔMATOS',
          'ingame-bosskey': 'CHAVE DO BOSS',
          'ingame-bossroom': 'SALA DO CHEFE',
          'ingame-miniboss': 'ARENA DO RIVAL',
          'ingame-puzzle': 'CÂMARA DE DESAFIO',
          'ingame-secret': 'ANDAR SECRETO',
          'ingame-inventor': 'INVENTOR',
          'ingame-armoryfree': 'ARSENAL (LIVRE)',
          'ingame-cost': 'CUSTO:',
          'ingame-chests': 'BAÚS:',
          'ingame-goela': 'GOELA',
          'armory-title': 'Balcão de Arsenal',
          'armory-youhave': 'Você tem',
          'armory-buy': 'Comprar',
          'armory-max': 'MÁXIMO',
          'armory-bought': 'COMPRADO',
          'armory-upgrade': 'Melhorar',
          'armory-close': 'Sair',
          'armory-gauntlet-name': 'Manopla Mecânica',
          'armory-gauntlet-desc': 'Aumenta o alcance de arremesso.',
          'armory-boots-name': 'Botas Propulsoras',
          'armory-boots-desc': 'Permite dar Dash (Aperte SHIFT ou Botão Mobile). Custo: 1 CC. Superaquece por 5s.',
          'armory-bag-name': 'Bolsa Expandida',
          'armory-bag-desc': 'Carrega mais bombas e permite trocar de tipo.'`);

// Update updateLanguage
const armoryUIUpdater = `
      const roomCoords = document.getElementById('room-coords');
      const lockdownBanner = document.getElementById('lockdown-banner');
      if (window.game) { window.game.updateHUD(); window.game.updateArmoryUI(); }
      
      const armoryH2 = document.querySelector('#armory-modal h2');
      if(armoryH2) armoryH2.innerText = window.t('armory-title');
      
      const btnClose = document.querySelector('.btn-close');
      if(btnClose) btnClose.innerText = window.t('armory-close');
      
      const armoryTitles = document.querySelectorAll('.armory-title');
      if(armoryTitles.length >= 3) {
          armoryTitles[0].innerText = window.t('armory-gauntlet-name');
          armoryTitles[1].innerText = window.t('armory-boots-name');
          armoryTitles[2].innerText = window.t('armory-bag-name');
      }
      
      const armoryDescs = document.querySelectorAll('.armory-desc');
      if(armoryDescs.length >= 3) {
          armoryDescs[0].innerText = window.t('armory-gauntlet-desc');
          armoryDescs[1].innerText = window.t('armory-boots-desc');
          armoryDescs[2].innerText = window.t('armory-bag-desc');
      }
      
      const armoryCosts = document.querySelectorAll('.armory-cost');
      if(armoryCosts.length >= 3) {
          armoryCosts[0].innerText = window.t('ingame-cost') + ' 10 CC | 10 ' + window.t('ingame-parts').toUpperCase();
          armoryCosts[1].innerText = window.t('ingame-cost') + ' 15 CC | 15 ' + window.t('ingame-parts').toUpperCase();
          armoryCosts[2].innerText = window.t('ingame-cost') + ' 20 CC | 20 ' + window.t('ingame-parts').toUpperCase();
      }
`;
content = content.replace("document.getElementById('btn-options').innerText = window.t('menu-options');", "document.getElementById('btn-options').innerText = window.t('menu-options');" + armoryUIUpdater);

// Modify GameEngine updateHUD
let updateHUDStr = `      updateHUD() {
        const room = this.map.currentRoom;
        const coordsEl = document.getElementById('room-coords');
        const enemyEl = document.getElementById('enemy-counter');
        const lockdownBanner = document.getElementById('lockdown-banner');

        const depth = this.map.currentDepth || 1;
        if (room.isPuzzleRoom) {
          coordsEl.textContent = \\\`\\\${window.t('ingame-level')} \\\${depth} - \\\${window.t('ingame-puzzle')} [\\\${room.rx}, \\\${room.ry}]\\\`;
        } else if (room.isMiniBossRoom) {
          coordsEl.textContent = \\\`\\\${window.t('ingame-level')} \\\${depth} - \\\${window.t('ingame-miniboss')} [\\\${room.rx}, \\\${room.ry}]\\\`;
        } else if (room.isBossRoom) {
          coordsEl.textContent = \\\`\\\${window.t('ingame-level')} \\\${depth} - \\\${window.t('ingame-bossroom')} [\\\${room.rx}, \\\${room.ry}]\\\`;
        } else if (room.isSecret) {
          coordsEl.textContent = \\\`\\\${window.t('ingame-secret')} - \\\${window.t('ingame-level')} \\\${depth}\\\`;
        } else {
          let extra = this.player.hasBossKey ? \\\`   [\\\${window.t('ingame-bosskey')}]\\\` : '';
          coordsEl.textContent = \\\`\\\${window.t('ingame-level')} \\\${depth}   \\\${window.t('ingame-room')} [\\\${room.rx}, \\\${room.ry}]\\\${extra}\\\`;
        }

        enemyEl.textContent = \\\`\\\${window.t('ingame-enemies')}: \\\${room.enemies.length}\\\`;

        document.getElementById('cc-counter').textContent = \\\`\\\${this.player.chronoCores || 0} CC\\\`;
        document.getElementById('part-counter').textContent = \\\`\\\${this.player.parts || 0} \\\${window.t('ingame-parts').toUpperCase()}\\\`;
        document.getElementById('gauntlet-level').textContent = \\\`\\\${window.t('ingame-gauntlet-lvl')} \\\${this.player.gauntletLevel} (\\\${this.player.getGauntletRange()}px)\\\`;
        
        document.querySelector('#gauntlet-badge .hud-badge-label').textContent = window.t('ingame-gauntlet');
        document.querySelector('#cc-badge .hud-badge-label').textContent = window.t('ingame-cc');
        document.querySelector('#part-badge .hud-badge-label').textContent = window.t('ingame-parts');
        document.querySelector('.minimap-badge-label').textContent = window.t('ingame-map');
        
        if (room.lockdown) {
            lockdownBanner.textContent = window.t('ingame-lockdown');
        }
      }`;

// Regex replace updateHUD
content = content.replace(/updateHUD\(\) \{[\s\S]*?enemyEl\.textContent = `INIMIGOS: \$\{room\.enemies\.length\}`;/m, updateHUDStr.split('document.getElementById(\\'cc-counter\\')')[0].trim());

// Modify updateArmoryUI
let updateArmoryUIStr = `      updateArmoryUI() {
        const totalCC = this.getAvailableCC();
        const totalParts = this.getAvailableParts();
        document.getElementById('armory-coins').textContent = \\\`\\\${window.t('armory-youhave')}: \\\${totalCC} CC | \\\${totalParts} \\\${window.t('ingame-parts').toUpperCase()}\\\`;
        
        // Gauntlet
        const btnGauntlet = document.getElementById('btn-buy-gauntlet');
        if (this.player.gauntletLevel >= 3) {
          btnGauntlet.textContent = window.t('armory-max');
          btnGauntlet.disabled = true;
        } else {
          btnGauntlet.textContent = window.t('armory-upgrade');
          btnGauntlet.disabled = (totalCC < 10 || totalParts < 10);
        }

        // Boots
        const btnBoots = document.getElementById('btn-buy-boots');
        if (this.player.bootsLevel >= 1) {
          btnBoots.textContent = window.t('armory-bought');
          btnBoots.disabled = true;
        } else {
          btnBoots.textContent = window.t('armory-buy');
          btnBoots.disabled = (totalCC < 15 || totalParts < 15);
        }

        // Bag
        const btnBag = document.getElementById('btn-buy-bag');
        if (this.player.bagLevel >= 3) {
          btnBag.textContent = window.t('armory-max');
          btnBag.disabled = true;
        } else {
          btnBag.textContent = window.t('armory-upgrade');
          btnBag.disabled = (totalCC < 20 || totalParts < 20);
        }
      }`;

content = content.replace(/updateArmoryUI\(\) \{[\s\S]*?btnBag\.disabled = \(totalCC < 20 \|\| totalParts < 20\);\n        \}/, updateArmoryUIStr);

fs.writeFileSync('index.html', content);
