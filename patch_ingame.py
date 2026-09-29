import sys
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add dictionary elements
content = content.replace("'opt-cont': 'Continue'", "'opt-cont': 'Continue',\n          'ingame-room': 'ROOM',\n          'ingame-level': 'LEVEL',\n          'ingame-enemies': 'ENEMIES',\n          'ingame-gauntlet': 'Gauntlet',\n          'ingame-gauntlet-lvl': 'LVL.',\n          'ingame-cc': 'Crystal Coal',\n          'ingame-parts': 'Parts',\n          'ingame-map': 'PROCEDURAL MAP',\n          'ingame-lockdown': 'LOCKDOWN! ELIMINATE AUTOMATONS',\n          'ingame-bosskey': 'BOSS KEY',\n          'ingame-bossroom': 'BOSS ROOM',\n          'ingame-miniboss': 'RIVAL ARENA',\n          'ingame-puzzle': 'CHALLENGE CHAMBER',\n          'ingame-secret': 'SECRET FLOOR',\n          'ingame-inventor': 'INVENTOR',\n          'ingame-armoryfree': 'ARMORY (FREE)',\n          'ingame-cost': 'COST:',\n          'ingame-chests': 'CHESTS:',\n          'ingame-goela': 'CHUTE',\n          'armory-title': 'Armory Desk',\n          'armory-youhave': 'You have',\n          'armory-buy': 'Buy',\n          'armory-max': 'MAX',\n          'armory-bought': 'BOUGHT',\n          'armory-upgrade': 'Upgrade',\n          'armory-close': 'Close',\n          'armory-gauntlet-name': 'Mechanical Gauntlet',\n          'armory-gauntlet-desc': 'Increases throwing range.',\n          'armory-boots-name': 'Propulsion Boots',\n          'armory-boots-desc': 'Allows Dashing (Press SHIFT or Mobile Button). Cost: 1 CC. Overheats for 5s.',\n          'armory-bag-name': 'Expanded Bag',\n          'armory-bag-desc': 'Carry more bombs and swap types.'")

content = content.replace("'opt-cont': 'Continuar'", "'opt-cont': 'Continuar',\n          'ingame-room': 'SALA',\n          'ingame-level': 'NÍVEL',\n          'ingame-enemies': 'INIMIGOS',\n          'ingame-gauntlet': 'Manopla',\n          'ingame-gauntlet-lvl': 'NV.',\n          'ingame-cc': 'Cristal Coal',\n          'ingame-parts': 'Peças',\n          'ingame-map': 'MAPA PROCEDURAL',\n          'ingame-lockdown': 'LOCKDOWN! ELIMINE OS AUTÔMATOS',\n          'ingame-bosskey': 'CHAVE DO BOSS',\n          'ingame-bossroom': 'SALA DO CHEFE',\n          'ingame-miniboss': 'ARENA DO RIVAL',\n          'ingame-puzzle': 'CÂMARA DE DESAFIO',\n          'ingame-secret': 'ANDAR SECRETO',\n          'ingame-inventor': 'INVENTOR',\n          'ingame-armoryfree': 'ARSENAL (LIVRE)',\n          'ingame-cost': 'CUSTO:',\n          'ingame-chests': 'BAÚS:',\n          'ingame-goela': 'GOELA',\n          'armory-title': 'Balcão de Arsenal',\n          'armory-youhave': 'Você tem',\n          'armory-buy': 'Comprar',\n          'armory-max': 'MÁXIMO',\n          'armory-bought': 'COMPRADO',\n          'armory-upgrade': 'Melhorar',\n          'armory-close': 'Sair',\n          'armory-gauntlet-name': 'Manopla Mecânica',\n          'armory-gauntlet-desc': 'Aumenta o alcance de arremesso.',\n          'armory-boots-name': 'Botas Propulsoras',\n          'armory-boots-desc': 'Permite dar Dash (Aperte SHIFT ou Botão Mobile). Custo: 1 CC. Superaquece por 5s.',\n          'armory-bag-name': 'Bolsa Expandida',\n          'armory-bag-desc': 'Carrega mais bombas e permite trocar de tipo.'")

# Update updateLanguage
armoryUIUpdater = """
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
"""
content = content.replace("document.getElementById('btn-options').innerText = window.t('menu-options');", "document.getElementById('btn-options').innerText = window.t('menu-options');" + armoryUIUpdater)

# Replace lines directly
content = content.replace("coordsEl.textContent = `NÍVEL ${depth} — CÂMARA DE DESAFIO 🧩 [${room.rx}, ${room.ry}]`;", "coordsEl.textContent = `${window.t('ingame-level')} ${depth} - ${window.t('ingame-puzzle')} 🧩 [${room.rx}, ${room.ry}]`;")
content = content.replace("coordsEl.textContent = `NÍVEL ${depth} — ARENA DO RIVAL 🤺 [${room.rx}, ${room.ry}]`;", "coordsEl.textContent = `${window.t('ingame-level')} ${depth} - ${window.t('ingame-miniboss')} 🤺 [${room.rx}, ${room.ry}]`;")
content = content.replace("coordsEl.textContent = `NÍVEL ${depth} — SALA DO CHEFE 💀 [${room.rx}, ${room.ry}]`;", "coordsEl.textContent = `${window.t('ingame-level')} ${depth} - ${window.t('ingame-bossroom')} 💀 [${room.rx}, ${room.ry}]`;")
content = content.replace("coordsEl.textContent = `ANDAR SECRETO — NÍVEL ${depth}`;", "coordsEl.textContent = `${window.t('ingame-secret')} - ${window.t('ingame-level')} ${depth}`;")
content = content.replace("let extra = this.player.hasBossKey ? '   [CHAVE DO BOSS]' : '';", "let extra = this.player.hasBossKey ? `   [${window.t('ingame-bosskey')}]` : '';")
content = content.replace("coordsEl.textContent = `NÍVEL ${depth}   SALA [${room.rx}, ${room.ry}]${extra}`;", "coordsEl.textContent = `${window.t('ingame-level')} ${depth}   ${window.t('ingame-room')} [${room.rx}, ${room.ry}]${extra}`;")
content = content.replace("enemyEl.textContent = `INIMIGOS: ${room.enemies.length}`;", "enemyEl.textContent = `${window.t('ingame-enemies')}: ${room.enemies.length}`;")

content = content.replace("document.getElementById('part-counter').textContent = `${this.player.parts || 0} PEÇAS`;", "document.getElementById('part-counter').textContent = `${this.player.parts || 0} ${window.t('ingame-parts').toUpperCase()}`;")
content = content.replace("document.getElementById('gauntlet-level').textContent = `NV. ${this.player.gauntletLevel} (${this.player.getGauntletRange()}px)`;", "document.getElementById('gauntlet-level').textContent = `${window.t('ingame-gauntlet-lvl')} ${this.player.gauntletLevel} (${this.player.getGauntletRange()}px)`;")

content = content.replace("lockdownBanner.textContent = 'LOCKDOWN! ELIMINE OS AUTÔMATOS';", "lockdownBanner.textContent = window.t('ingame-lockdown');")

content = content.replace("document.getElementById('armory-coins').textContent = `Você tem: ${totalCC} CC | ${totalParts} PEÇAS`;", "document.getElementById('armory-coins').textContent = `${window.t('armory-youhave')}: ${totalCC} CC | ${totalParts} ${window.t('ingame-parts').toUpperCase()}`;")
content = re.sub(r"btnGauntlet\.textContent = 'MÁXIMO';", "btnGauntlet.textContent = window.t('armory-max');", content)
content = re.sub(r"btnGauntlet\.textContent = 'Melhorar';", "btnGauntlet.textContent = window.t('armory-upgrade');", content)
content = re.sub(r"btnBoots\.textContent = 'COMPRADO';", "btnBoots.textContent = window.t('armory-bought');", content)
content = re.sub(r"btnBoots\.textContent = 'Comprar';", "btnBoots.textContent = window.t('armory-buy');", content)
content = re.sub(r"btnBag\.textContent = 'MÁXIMO';", "btnBag.textContent = window.t('armory-max');", content)
content = re.sub(r"btnBag\.textContent = 'Melhorar';", "btnBag.textContent = window.t('armory-upgrade');", content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
