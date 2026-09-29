import sys
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

menuStyles = '''
    /* ==============================================================
       Menus UI (Menu Principal e Opções)
       ============================================================== */
    .menu-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(10, 14, 20, 0.95);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .menu-overlay.hidden {
      display: none !important;
    }
    .menu-title {
      font-size: 3rem;
      color: var(--accent-yellow);
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 2rem;
      text-shadow: 0 4px 12px rgba(255, 202, 40, 0.4);
    }
    .menu-btn {
      background: var(--panel-bg);
      border: 2px solid var(--border-color);
      color: white;
      font-size: 1.2rem;
      font-weight: bold;
      padding: 12px 32px;
      margin: 8px;
      border-radius: 8px;
      cursor: pointer;
      width: 250px;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .menu-btn:hover {
      border-color: var(--accent-blue);
      background: rgba(41, 182, 246, 0.2);
      transform: scale(1.05);
      box-shadow: 0 0 16px rgba(41, 182, 246, 0.4);
    }
    .menu-btn:active {
      transform: scale(0.95);
    }
    .options-container {
      width: 450px;
      background: var(--panel-bg);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .option-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .option-group.toggle-group {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .option-group label {
      font-weight: bold;
      color: var(--text-dim);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .option-group input[type='range'] {
      width: 100%;
      accent-color: var(--accent-blue);
      cursor: pointer;
    }
    .option-group input[type='checkbox'] {
      width: 20px;
      height: 20px;
      accent-color: var(--accent-blue);
      cursor: pointer;
    }
    .option-group select {
      background: rgba(10, 14, 20, 0.95);
      color: white;
      border: 1px solid var(--border-color);
      padding: 8px;
      border-radius: 6px;
      font-weight: bold;
    }
'''

htmlToAdd = '''
    <!-- Tela de Menu Principal -->
    <div id="main-menu" class="menu-overlay">
      <h1 class="menu-title">RogueBomb</h1>
      <button class="menu-btn" id="btn-start">Iniciar Jogo</button>
      <button class="menu-btn" id="btn-continue" style="display: none;">Continuar</button>
      <button class="menu-btn" id="btn-options">Opções</button>
      <button class="menu-btn" id="btn-exit" style="display: none;">Sair</button>
    </div>

    <!-- Tela de Menu de Opções -->
    <div id="options-menu" class="menu-overlay hidden">
      <h1 class="menu-title" style="font-size: 2rem;">Opções</h1>
      <div class="options-container">
        
        <div class="option-group">
          <label for="music-vol">Volume da Música (<span id="music-vol-val">100</span>%)</label>
          <input type="range" id="music-vol" min="0" max="100" value="100">
        </div>
        
        <div class="option-group">
          <label for="sfx-vol">Volume dos Efeitos (<span id="sfx-vol-val">100</span>%)</label>
          <input type="range" id="sfx-vol" min="0" max="100" value="100">
        </div>

        <div class="option-group toggle-group">
          <label for="screen-shake">Vibração de Tela (Screen Shake)</label>
          <input type="checkbox" id="screen-shake" checked>
        </div>

        <div class="option-group toggle-group">
          <label for="fullscreen-toggle">Tela Cheia (Fullscreen)</label>
          <input type="checkbox" id="fullscreen-toggle">
        </div>

        <div class="option-group toggle-group">
          <label for="crt-effect">Efeito Visual Retrô (CRT)</label>
          <input type="checkbox" id="crt-effect">
        </div>

        <div class="option-group toggle-group">
          <label for="show-fps">Mostrar FPS</label>
          <input type="checkbox" id="show-fps" checked>
        </div>

        <div class="option-group">
          <label for="aim-sens">Sensibilidade da Mira (<span id="aim-sens-val">50</span>%)</label>
          <input type="range" id="aim-sens" min="1" max="100" value="50">
        </div>

        <div class="option-group toggle-group">
          <label for="language-select">Idioma</label>
          <select id="language-select">
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
        </div>

        <button class="menu-btn" style="width: 100%; margin-top: 16px;" id="btn-back-menu">Voltar</button>
      </div>
    </div>
'''

jsToAdd = '''
    // Script de Menus
    document.addEventListener('DOMContentLoaded', () => {
      const mainMenu = document.getElementById('main-menu');
      const optionsMenu = document.getElementById('options-menu');
      
      const btnStart = document.getElementById('btn-start');
      const btnOptions = document.getElementById('btn-options');
      const btnBackMenu = document.getElementById('btn-back-menu');

      const musicVol = document.getElementById('music-vol');
      const musicVolVal = document.getElementById('music-vol-val');
      const sfxVol = document.getElementById('sfx-vol');
      const sfxVolVal = document.getElementById('sfx-vol-val');
      
      const screenShake = document.getElementById('screen-shake');
      const fullscreenToggle = document.getElementById('fullscreen-toggle');
      const crtEffect = document.getElementById('crt-effect');
      const showFps = document.getElementById('show-fps');
      const aimSens = document.getElementById('aim-sens');
      const aimSensVal = document.getElementById('aim-sens-val');
      const languageSelect = document.getElementById('language-select');

      // Botões de navegação
      btnStart.addEventListener('click', () => {
        mainMenu.classList.add('hidden');
        if(window.game) {
            window.game.isPaused = false;
        }
      });

      btnOptions.addEventListener('click', () => {
        mainMenu.classList.add('hidden');
        optionsMenu.classList.remove('hidden');
      });

      btnBackMenu.addEventListener('click', () => {
        optionsMenu.classList.add('hidden');
        mainMenu.classList.remove('hidden');
      });

      // Atualização dos inputs
      musicVol.addEventListener('input', (e) => {
        musicVolVal.innerText = e.target.value;
      });

      sfxVol.addEventListener('input', (e) => {
        sfxVolVal.innerText = e.target.value;
      });

      aimSens.addEventListener('input', (e) => {
        aimSensVal.innerText = e.target.value;
      });

      fullscreenToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
          document.documentElement.requestFullscreen().catch(err => {
            console.warn(`Error attempting to enable fullscreen: ${err.message}`);
            e.target.checked = false;
          });
        } else {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
        }
      });
      
    });
'''

# Se já não houver, vamos inserir
if "main-menu" not in content:
    content = content.replace('</style>', menuStyles + '\\n  </style>')
    content = content.replace('<!-- Modal do Arsenal -->', htmlToAdd + '\\n    <!-- Modal do Arsenal -->')
    content = content.replace('</script>', jsToAdd + '\\n  </script>')

    # Pausar o jogo inicialmente
    content = content.replace('requestAnimationFrame(this.loop);', 'this.isPaused = true;\\n          requestAnimationFrame(this.loop);')
    content = content.replace('this.update();', 'if (!this.isPaused) this.update();')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Sucesso")
else:
    print("O menu já foi inserido.")
