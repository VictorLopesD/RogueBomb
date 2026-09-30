// lore_data.js - Base de Dados de Fragmentos e Documentos de Época

window.LORE_PAMPHLETS = {
  operation_manual: {
    id: "operation_manual",
    title: "Manual de Operação - Poço de Extração Nº 4 (1826)",
    fragments: [
      {
        id: "frag_goela",
        roomTypeTarget: "goela",
        officialText: "Art. 2 - Concluído o turno, deposite o Cristal-Carvão no mecanismo de transporte automatizado para pesagem e registo.",
        minerScrawl: "~~transporte automatizado~~ GOELA! Despeje tudo antes da sirene ou volta com o bolso liso pra superfície!",
        popupTip: "DICA: Pise na Goela para enviar o Cristal Coal ao Baú seguro antes de rebobinar."
      },
      {
        id: "frag_lockdown",
        roomTypeTarget: "combat",
        officialText: "Art. 5 - O isolamento hidráulico das galerias é ativado emergencialmente para resguardar o patrimônio corporativo.",
        minerScrawl: "Trancou tudo? Não adianta forçar a grade. Só abre depois que derrubar até a última lata velha!",
        popupTip: "DICA: O Lockdown só abre ao eliminar todos os autômatos da sala."
      },
      {
        id: "frag_hatch",
        roomTypeTarget: "secret_floor",
        officialText: "Art. 8 - A escotilha de ferro fundido serve exclusivamente à ascensão de operários aos níveis superiores.",
        minerScrawl: "Com as travas podres de ferrugem, uma bomba quebra a tampa. Virou nossa descida pros níveis fundos!",
        popupTip: "DICA: Detone a tampa do bueiro com Bombas Temporizadas ou de Percussão para descer de nível."
      },
      {
        id: "frag_bosskey",
        roomTypeTarget: "random",
        officialText: "Art. 12 - O Cartão de Acesso Nível-A é restrito aos Supervisores do Setor. O extravio resultará em demissão sumária.",
        minerScrawl: "O Supervisor deixou o cartão cair quando os autômatos piraram. Pega isso e a gente consegue abrir a Porta Reforçada!",
        popupTip: "DICA: O Cartão de Acesso (Amarelo) abre a porta do Chefe do andar."
      },
      {
        id: "frag_timerbomb",
        roomTypeTarget: "random",
        officialText: "Memorando 42: O uso de explosivos temporizados exige treinamento nível 3. Risco de reação em cadeia estrutural.",
        minerScrawl: "Cadeia estrutural é o caramba, se você jogar uma bomba perto da outra, o impacto detona a segunda na hora! Dá pra fazer uma limpa!",
        popupTip: "DICA: A Bomba-Relógio (Nv.2) zera o timer instantaneamente se for atingida por outra explosão."
      },
      {
        id: "frag_dash",
        roomTypeTarget: "random",
        officialText: "Nota de Manutenção: As Botas a Vapor modelo Mk.II estão consumindo muito Cristal-Carvão em manobras evasivas.",
        minerScrawl: "Gasta 1 CC, mas salva o couro! Na hora que a engrenagem pular em você, usa o propulsor e passa ileso no meio da explosão!",
        popupTip: "DICA: O Dash deixa Charlotte invulnerável por um breve momento, permitindo atravessar explosões."
      },
      {
        id: "frag_automatons",
        roomTypeTarget: "random",
        officialText: "Relatório de Incidente: Anomalia nos Autômatos Mineradores. Eles estão identificando tecido orgânico como minério bruto.",
        minerScrawl: "As máquinas tão malucas! O 'Bomber' joga explosivo na gente e o 'Charger' vem correndo com aquela broca. Fica longe!",
        popupTip: "DICA: Observe o padrão de ataque dos autômatos. O Charger avança em linha reta."
      },
      {
        id: "frag_parts",
        roomTypeTarget: "random",
        officialText: "Diretriz 88: Todas as peças mecânicas recolhidas devem ser enviadas ao Inventor Chefe para reciclagem.",
        minerScrawl: "Reciclagem? O velho tá é construindo um arsenal naquela oficina escondida dele. Leva umas peças lá que ele te faz umas melhorias.",
        popupTip: "DICA: Destrua inimigos para coletar Peças. Use no Arsenal para melhorar equipamentos."
      },
      {
        id: "frag_holes",
        roomTypeTarget: "random",
        officialText: "Aviso de Segurança 04: Cuidado com a integridade do piso nas escavações profundas. A estrutura rochosa cede facilmente.",
        minerScrawl: "Um pisão em falso e você vira camiseta de saudade... essas corps nem ligam pra gente!",
        popupTip: "DICA: Cair em buracos ou sofrer ataques letais rebobina o tempo e consome Recursos não depositados na Goela."
      },
      {
        id: "frag_boss",
        roomTypeTarget: "random",
        officialText: "Registro de Turno final: O Supervisor-Chefe se trancou no nível inferior com os núcleos de energia...",
        minerScrawl: "O chefe pirou de vez! Ele roubou o Núcleo de Propulsão e tá usando as máquinas pesadas pra defender a sala!",
        popupTip: "DICA: Chefes e Mini-Chefes têm mais HP e requerem múltiplas explosões para serem derrotados."
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
      document.getElementById('lore-official').textContent = fragment.officialText || "";
      document.getElementById('lore-scrawl').textContent = fragment.minerScrawl || "";
      document.getElementById('lore-tip').textContent = fragment.popupTip || "";
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
}
