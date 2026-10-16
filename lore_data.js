// lore_data.js - Base de Dados de Fragmentos e Documentos de Época

window.LORE_PAMPHLETS = {
  operation_manual: {
    id: "operation_manual",
    title: "Manual de Operação - Poço de Extração Nº 4 (1826)",
    title_en: "Operations Manual - Extraction Shaft No. 4 (1826)",
    fragments: [
      {
        id: "frag_goela",
        roomTypeTarget: "goela",
        officialText: "Art. 2 - Concluído o turno, deposite o Cristal-Carvão no mecanismo de transporte automatizado para pesagem e registo.",
        officialText_en: "Sec. 2 - Shift complete: deposit all Crystal Coal into the automated transport chute for weighing and logging.",
        minerScrawl: "~~transporte automatizado~~ GOELA! Despeje tudo antes da sirene ou volta com o bolso liso pra superfície!",
        minerScrawl_en: "~~automated transport chute~~ THE CHUTE! Dump every crystal before the whistle blows or you'll head back up with empty pockets!",
        popupTip: "DICA: Pise na Goela para enviar o Cristal Coal ao Baú seguro antes de rebobinar.",
        popupTip_en: "TIP: Step onto the Chute to send your carried Crystal Coal to the safe Vault Chest before rewinding."
      },
      {
        id: "frag_lockdown",
        roomTypeTarget: "combat",
        officialText: "Art. 5 - O isolamento hidráulico das galerias é ativado emergencialmente para resguardar o patrimônio corporativo.",
        officialText_en: "Sec. 5 - Hydraulic isolation of tunnel sectors engages automatically in emergencies to safeguard corporate assets.",
        minerScrawl: "Trancou tudo? Não adianta forçar a grade. Só abre depois que derrubar até a última lata velha!",
        minerScrawl_en: "Locked in tight? Don't bother wrenching the iron bars. They won't budge until every last tin can is scrap metal!",
        popupTip: "DICA: O Lockdown só abre ao eliminar todos os autômatos da sala.",
        popupTip_en: "TIP: Lockdown gates only reopen once every hostile automaton in the room is destroyed."
      },
      {
        id: "frag_hatch",
        roomTypeTarget: "secret_floor",
        officialText: "Art. 8 - A escotilha de ferro fundido serve exclusivamente à ascensão de operários aos níveis superiores.",
        officialText_en: "Sec. 8 - The cast-iron hatch serves exclusively for worker ascension to upper mine levels.",
        minerScrawl: "Com as travas podres de ferrugem, uma bomba quebra a tampa. Virou nossa descida pros níveis fundos!",
        minerScrawl_en: "With the latches rusted through, a well-placed bomb cracks the lid right off. Now it's our shortcut down to the deepest depths!",
        popupTip: "DICA: Detone a tampa do bueiro com Bombas Temporizadas ou de Percussão para descer de nível.",
        popupTip_en: "TIP: Detonate the manhole cover with Timed or Impact Bombs to descend to the next level."
      },
      {
        id: "frag_bosskey",
        roomTypeTarget: "random",
        officialText: "Art. 12 - O Cartão de Acesso Nível-A é restrito aos Supervisores do Setor. O extravio resultará em demissão sumária.",
        officialText_en: "Sec. 12 - Level-A Keycards are restricted to Sector Supervisors. Loss will result in immediate termination.",
        minerScrawl: "O Supervisor deixou o cartão cair quando os autômatos piraram. Pega isso e a gente consegue abrir a Porta Reforçada!",
        minerScrawl_en: "The Supervisor dropped his keycard when the automatons went berserk! Snag it and we can pop the Reinforced Door open!",
        popupTip: "DICA: O Cartão de Acesso (Amarelo) abre a porta do Chefe do andar.",
        popupTip_en: "TIP: The Yellow Access Keycard unlocks the floor's Boss Chamber gate."
      },
      {
        id: "frag_timerbomb",
        roomTypeTarget: "random",
        officialText: "Memorando 42: O uso de explosivos temporizados exige treinamento nível 3. Risco de reação em cadeia estrutural.",
        officialText_en: "Memorandum 42: Operating timed explosives requires Level 3 certification. Danger of structural chain reactions.",
        minerScrawl: "Cadeia estrutural é o caramba, se você jogar uma bomba perto da outra, o impacto detona a segunda na hora! Dá pra fazer uma limpa!",
        minerScrawl_en: "Structural chain my wrench! Drop one bomb next to another and the blast pops the second one instantly! Clear the whole room!",
        popupTip: "DICA: A Bomba-Relógio (Nv.2) zera o timer instantaneamente se for atingida por outra explosão.",
        popupTip_en: "TIP: Level 2 Time Bombs detonate instantly upon taking impact from any adjacent explosion."
      },
      {
        id: "frag_dash",
        roomTypeTarget: "random",
        officialText: "Nota de Manutenção: As Botas a Vapor modelo Mk.II estão consumindo muito Cristal-Carvão em manobras evasivas.",
        officialText_en: "Maintenance Note: Mk.II Steam Boots consume excessive Crystal Coal during emergency evasive maneuvers.",
        minerScrawl: "Gasta 1 CC, mas salva o couro! Na hora que a engrenagem pular em você, usa o propulsor e passa ileso no meio da explosão!",
        minerScrawl_en: "Burns 1 CC, but saves your hide! When whirling cogs fly straight at you, fire the thrusters and dart clean through the explosion!",
        popupTip: "DICA: O Dash deixa Charlotte invulnerável por um breve momento, permitindo atravessar explosões.",
        popupTip_en: "TIP: Dashing grants Charlotte brief invulnerability, allowing you to bypass explosions unharmed."
      },
      {
        id: "frag_automatons",
        roomTypeTarget: "random",
        officialText: "Relatório de Incidente: Anomalia nos Autômatos Mineradores. Eles estão identificando tecido orgânico como minério bruto.",
        officialText_en: "Incident Report: Mining Automaton malfunction. Units are misidentifying organic tissue as raw unprocessed ore.",
        minerScrawl: "As máquinas tão malucas! O 'Bomber' joga explosivo na gente e o 'Charger' vem correndo com aquela broca. Fica longe!",
        minerScrawl_en: "The machines have gone crazy! The 'Bomber' chucks dynamite at us and the 'Charger' comes barreling down with that drill. Stay clear!",
        popupTip: "DICA: Observe o padrão de ataque dos autômatos. O Charger avança em linha reta.",
        popupTip_en: "TIP: Learn the automaton attack telegraphs. The Charger dashes in a straight line."
      },
      {
        id: "frag_parts",
        roomTypeTarget: "random",
        officialText: "Diretriz 88: Todas as peças mecânicas recolhidas devem ser enviadas ao Inventor Chefe para reciclagem.",
        officialText_en: "Directive 88: All recovered mechanical scrap and cogs must be delivered to the Chief Inventor for recycling.",
        minerScrawl: "Reciclagem? O velho tá é construindo um arsenal naquela oficina escondida dele. Leva umas peças lá que ele te faz umas melhorias.",
        minerScrawl_en: "Recycling? The old tinkerer is building an arsenal in that secret workshop of his! Bring him some gears and he'll pimp out your gear.",
        popupTip: "DICA: Destrua inimigos para coletar Peças. Use no Arsenal para melhorar equipamentos.",
        popupTip_en: "TIP: Destroy enemies to collect Mechanical Parts. Spend them at the Armory to forge upgrades."
      },
      {
        id: "frag_holes",
        roomTypeTarget: "random",
        officialText: "Aviso de Segurança 04: Cuidado com a integridade do piso nas escavações profundas. A estrutura rochosa cede facilmente.",
        officialText_en: "Safety Notice 04: Exercise caution regarding floor stability in deep digs. Subterranean bedrock collapses without warning.",
        minerScrawl: "Um pisão em falso e você vira camiseta de saudade... essas corps nem ligam pra gente!",
        minerScrawl_en: "One wrong step into the black void and you're history... These corporate barons don't give a damn about us!",
        popupTip: "DICA: Cair em buracos ou sofrer ataques letais rebobina o tempo e consome Recursos não depositados na Goela.",
        popupTip_en: "TIP: Falling into chasms or suffering lethal strikes rewinds time, losing any resources not sent up the Chute."
      },
      {
        id: "frag_boss",
        roomTypeTarget: "random",
        officialText: "Registro de Turno final: O Supervisor-Chefe se trancou no nível inferior com os núcleos de energia...",
        officialText_en: "Final Shift Log: The Chief Supervisor barricaded himself in the sub-level with the central energy cores...",
        minerScrawl: "O chefe pirou de vez! Ele roubou o Núcleo de Propulsão e tá usando as máquinas pesadas pra defender a sala!",
        minerScrawl_en: "The boss lost his mind completely! He stole the Steam Propulsion Core and commandeered heavy mining rigs to guard his lair!",
        popupTip: "DICA: Chefes e Mini-Chefes têm mais HP e requerem múltiplas explosões para serem derrotados.",
        popupTip_en: "TIP: Bosses and Mini-Bosses possess larger health pools and require coordinated bomb detonations to bring down."
      }
    ]
  }
};

window.LoreManager = class LoreManager {
  constructor() {
    this.storageKey = "roguebomb_collected_lore";
    this.collectedFragments = new Set(this.loadCollected());
    this.toastTimer = 0;
  }

  loadCollected() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCollected() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify([...this.collectedFragments]));
    } catch (e) {
      console.warn("Falha ao salvar lore", e);
    }
  }

  collect(fragment, audioManager = null) {
    if (!fragment) return;
    this.collectedFragments.add(fragment.id);
    this.saveCollected();

    if (audioManager && typeof audioManager.playPaperRustle === "function") {
      audioManager.playPaperRustle();
    }

    const panel = document.getElementById('lore-panel');
    if (panel) {
      const lang = (window.getCurrentLang ? window.getCurrentLang() : (window.currentLang || 'pt'));
      const isEn = (lang === 'en');
      
      const official = (isEn && fragment.officialText_en) ? fragment.officialText_en : fragment.officialText;
      const scrawl = (isEn && fragment.minerScrawl_en) ? fragment.minerScrawl_en : fragment.minerScrawl;
      const tip = (isEn && fragment.popupTip_en) ? fragment.popupTip_en : fragment.popupTip;

      const headerEl = panel.querySelector('.lore-header');
      if (headerEl) {
        headerEl.textContent = (typeof window.t === 'function' ? window.t('lore-found-header') : (isEn ? "📜 LOG FOUND (1826)" : "📜 REGISTRO ENCONTRADO (1826)"));
      }

      const closeBtn = panel.querySelector('button');
      if (closeBtn) {
        closeBtn.textContent = (typeof window.t === 'function' ? window.t('lore-close') : (isEn ? "Close" : "Fechar"));
      }

      document.getElementById('lore-official').textContent = official || "";
      document.getElementById('lore-scrawl').textContent = scrawl || "";
      document.getElementById('lore-tip').textContent = tip || "";
      panel.style.display = 'flex';
      
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        panel.style.display = 'none';
      }, 12000);
    }
  }
  
  getCollectedList() {
    const list = [];
    window.LORE_PAMPHLETS.operation_manual.fragments.forEach(frag => {
      if (this.collectedFragments.has(frag.id)) {
        list.push(frag);
      }
    });
    return list;
  }
};
