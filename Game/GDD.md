# Game Design Document (GDD) — RogueBomb
**Versão:** 2.2 (Documentação Completa do MVP / Protótipo Implementado com Puzzles, Chefes e Autotiling)  
**Projeto:** RogueBomb — Roguevania com Bombas  
**Engine / Stack:** HTML5, CSS3, JavaScript Vanilla (Canvas API 2D nativa, Web Audio API, Touch Events, Pointer Events)  
**Plataformas:** Web (Desktop) & Dispositivos Móveis (Mobile First / Responsivo)  
**Data da Última Atualização:** Setembro / 2026  

---

## 1. Visão Geral e Pitch do Jogo

### 1.1 Premissa
**RogueBomb** é um *Roguevania* de ação em visão top-down (com simulação de perspectiva isométrica 2D). O jogador controla **Charlotte**, uma jovem inventora que explora as entranhas mecânicas e perigosas de uma mina subterrânea procedural steampunk. Em vez de espadas ou armas de fogo convencionais, Charlotte utiliza a sua **Manopla Mecânica** e um arsenal tático de **Bombas a Vapor e Percussão** para resolver quebra-cabeças ambientais, destruir caixas de minério, combater autômatos hostis e abrir caminho rumo aos andares mais profundos da mina em busca do valioso **Cristal Coal (CC)** — um carvão mineral cristalizado hiper-energético essencial para suas invenções — e **Peças Mecânicas** deixadas para trás pelas máquinas a vapor.

### 1.2 Core Loop (Ciclo Central de Jogabilidade)
1. **Entrada na Sala:** Charlotte entra em uma sala gerada proceduralmente. Se houver autômatos, a sala entra em **Lockdown**, trancando as portas até que todos os inimigos sejam derrotados.
2. **Combate & Tática com Bombas:** Uso de bombas temporizadas, de impacto e de propulsão para repelir, destruir ou empurrar autômatos para dentro dos abismos, evitando a todo custo o contato direto.
3. **Desafios Metroidvania (Salas de Puzzle):** Resolução de enigmas ambientais em cada profundidade (placas de pressão sincronizadas, travessia sobre lava com dash ou ativação de cristais interruptores à distância).
4. **Mineração & Coleta de Recursos:** Destruição de caixas para obter **Cristal Coal (CC)** e eliminação de autômatos para coletar **Peças Mecânicas (Engrenagens)**.
5. **Depósito Seguro na Goela:** Charlotte deve levar seus recursos até as salas equipadas com a **Goela** (duto de descarte seguro). Recursos depositados são enviados permanentemente para o **Baú da Safe Room**.
6. **Verticalidade & Progressão:** Detecção do **Bueiro / Nodo Secreto de Piso** da mina; ao detonar uma bomba sobre ele, a escotilha se destranca e abre, permitindo descer ao próximo nível de profundidade (`Depth`).
7. **Confrontos com Chefes:** Enfrentar o **Engenheiro Rival (Mini-Boss)** em uma arena isolada dedicada nos níveis 3 e 4, e localizar a **Chave do Boss** para desbloquear o portal do **Chefe Mestre Final** no nível 5.
8. **Morte & Rebobinar do Tempo (Time Rewind):** Ao colidir com um autômato ativo ou cair em um abismo sem proteção, o tempo rebobina com um efeito de glitch analógico: Charlotte acorda na Safe Room inicial, um novo mapa procedural é gerado, a profundidade reseta e os recursos voláteis não depositados são perdidos (mantendo os já salvos na Goela e guardados no Baú).

---

## 2. Estrutura do Mundo e Salas Modulares

### 2.1 Grid e Resolução
- **Tamanho do Grid por Sala:** Matriz de $15 \times 15$ blocos (tiles).
- **Tamanho de cada Tile:** $40 \times 40$ pixels.
- **Dimensões do Mundo por Sala:** $600 \times 600$ pixels.
- **Renderização:** Apenas uma sala é renderizada por vez no Canvas central, garantindo performance de 60 FPS mesmo em smartphones mais modestos.
- **Ajuste Responsivo:** Canvas com escala automática (`resizeCanvas`) mantendo proporção nítida pixel-perfect com CSS `image-rendering: crisp-edges` e `pixelated`.

### 2.2 Geração Procedural do Mapa (`MapManager`)
- **Matriz de Exploração:** Matriz de $5 \times 5$ coordenadas de salas.
- **Quantidade de Salas:** Gera proceduralmente um conjunto ramificado de 10 salas conectadas através de algoritmo de difusão aleatória (BFS com fila e probabilidade de bifurcação de 75%).
- **Coordenada Inicial (Safe Room):** Posição central `[2, 2]`.
- **Topologia de Portas:** Portas centrais posicionadas no meio exato de cada borda (tile de índice 7):
  - Borda Norte: `(0, 7)`
  - Borda Sul: `(14, 7)`
  - Borda Oeste: `(7, 0)`
  - Borda Leste: `(7, 14)`
- **Conexões Garantidas:** O gerador verifica vizinhos ortogonais imediatos e conecta portas bidirecionalmente entre salas adjacentes existentes.

### 2.3 Tipos de Sala
1. **Sala Inicial (Safe Room / Ponto de Partida):**
   - Nunca contém inimigos e nunca entra em Lockdown.
   - Ponto de respawn de Charlotte.
   - Contém o **NPC Inventor** (`TILE.INVENTOR_NPC` - tile com óculos de proteção).
   - Contém a **Mesa de Arsenal** (`TILE.ARMORY` - bancada de modificações de equipamentos).
   - Contém o **Baú de Armazenamento** (`TILE.CHEST` - armazena permanentemente CC e Peças depositadas na Goela).
   - Apenas no Nível 1 é uma Safe Room temática desobstruída; em andares subsequentes funciona como ponto de chegada.

2. **Salas Regulares de Exploração e Combate:**
   - Cercadas por paredes indestrutíveis perimetrais (`TILE.WALL`).
   - Pilares estruturais fixos distribuídos geometricamente em posições pares (`x % 2 === 0 && y % 2 === 0`).
   - Blocos/Caixas de madeira quebráveis (`TILE.BREAKABLE`) distribuídas aleatoriamente pelo piso, protegendo o caminho central das 4 portas.
   - População de autômatos hostis com spawn afastado das portas de entrada para evitar emboscadas injustas.

3. **Salas com Goela (Duto Coletor):**
   - Regra de distribuição: **Pelo menos uma a cada três salas geradas** possui obrigatoriamente uma Goela no centro da sala.
   - Duto circular verde-escuro (`#1b5e20`) com anel exterior pulsante verde-claro (`#4caf50`).
   - Transfere instantaneamente os cristais e peças voláteis para o cofre seguro da oficina.

4. **Salas de Desafio / Puzzles Metroidvania (`isPuzzleRoom`):**
   - Gera **exatamente uma sala de puzzle única por andar**, testando habilidades do jogador em troca de cofres valiosos de Cristal Coal (`TILE.VAULT_CHEST`):
     - **Nível 1 — Cofre Temporizado (`timed_vault`):** O cofre fica no centro protegido por caixas. O jogador deve acionar **duas Placas de Pressão sincronizadas** (`TILE.PRESSURE_PLATE`) nas extremidades da sala em tempo hábil para destravar o cofre (Recompensa: 5 CC).
     - **Nível 2 — Fosso de Lava (`lava_chasm`):** Um fosso de lava ardente (`TILE.LAVA`) isola uma plataforma 3x3 no meio da sala contendo o cofre. Charlotte precisa utilizar o **Dash das Botas Propulsoras** ou uma detonação de **Bomba de Vapor Propulsor** para voar sobre o abismo de lava e alcançar o cofre (Recompensa: 7 CC).
     - **Nível 3+ — Fortaleza de Cristal Elevado (`gauntlet_target`):** Uma câmara protegida por muralhas fixas (`TILE.WALL`). O cofre só é aberto ao detonar o **Cristal Interruptor Elevado** (`TILE.SWITCH_TARGET`), exigindo cálculo de arremesso parabólico em arco com a Manopla Mecânica por cima das muralhas (Recompensa: 10 CC).

5. **Sala Secreta / Andar Inferior (Verticalidade):**
   - Acessada através do **Bueiro / Nodo Secreto** detonado na mina.
   - Contém a **Escada de Emergência** (`TILE.SECRET_LADDER`) para retorno à superfície e pedestais de upgrade (`TILE.GAUNTLET_ITEM`).

6. **Sala do Chefe Final (Boss Room) e Sala da Chave (Profundidade 5+):**
   - No 5º nível da mina, uma das salas extremas (*dead-end*) é convertida na arena do **Chefe Final**.
   - A entrada é trancada pelo **Portão do Boss** (`TILE.BOSS_DOOR`), ilustrado com estrias de caveira mecânica.
   - Outra sala aleatória do mapa recebe o pedestal da **Chave do Boss** (`TILE.BOSS_KEY`), necessária para destravar o portão e enfrentar o confronto final.

7. **Arena Isolada do Mini-Boss / Engenheiro Rival (`isMiniBossRoom` — Níveis 3 e 4):**
   - Nos níveis 3 e 4, uma sala extrema sem saída (*dead-end*) é dedicada exclusivamente para o confronto mano a mano contra o Mini-Boss (`HumanBoss`), sem a presença de autômatos comuns.
   - **Arquitetura Tática de Duelo (`buildMiniBossLayout`):** A sala conta com 4 pilares maciços simétricos (`TILE.WALL`) nos quadrantes centrais para cobertura contra estilhaços e explosões em cruz, além de caixas quebráveis (`TILE.BREAKABLE`) nos 4 cantos para recarga emergencial de recursos.
   - **Lockdown e Atmosfera:** Ao entrar, as portas se trancam instantaneamente com `TILE.LOCK_GATE`, soa o alarme com banner "DUELO! DERROTE O ENGENHEIRO RIVAL!" e a trilha sonora transiciona para o modo dinâmico de batalha.
   - **Indicadores de Navegação:** Identificada no minimapa com uma célula de cor magenta viva (`#e91e63`) e no HUD de coordenadas como `NÍVEL X • ARENA DO RIVAL ⚔️ [rx, ry]`.
   - **Recompensa de Vitória:** Ao ser derrotado, o lockdown é suspenso com fanfarra ("RIVAL DERROTADO! ARENA LIBERADA!"), liberando 5 Cristais Coal e concedendo +5 Peças Mecânicas imediatamente.

### 2.4 Transição de Salas e Câmera
- **Efeito Visual:** *Fade out / Fade in* suave com duração total de ~0.5s preenchendo a tela em preto translúcido (`rgba(12, 14, 18, alpha)`).
- **Reposicionamento Oposto:** Ao atravessar a porta Norte, Charlotte ressurge na borda Sul da nova sala (com margem segura de 1.5 tiles); o mesmo ocorre para Leste $\leftrightarrow$ Oeste.
- **Proteção do Jogador na Entrada:** Ao carregar a nova sala, Charlotte recebe 0.6s de invulnerabilidade e todos os autômatos da sala recebem **1.2 segundos de carência de inicialização (`dormant`)**, impedindo dano acidental na entrada.

### 2.5 Sistema Ambiental e Autotiling Procedural
O visual das salas é gerado dinamicamente com base no spritesheet expandido `Img/chao_mina1-3.png`:
- **Autotiling de Abismos (13 Peças):**
  - O gerador cria de 0 a 2 grandes abismos orgânicos por sala (raio entre 1.5 e 4 blocos).
  - **Safe Zone de Portas:** Uma área de proteção com raio de **3.5 blocos em volta das 4 portas centrais** é rigorosamente respeitada, impedindo que o gerador crie abismos obstruindo a passagem entre salas.
  - O autotiling calcula quinas internas (5-2 a 5-5), quinas externas (3-5, 4-1, 4-2, 4-4), bordas retas (3-6, 4-3, 4-5, 4-6) e blocos isolados (3-4).
  - **Física de Queda no Abismo:** Se um autômato for empurrado para o abismo, ele cai e é **eliminado imediatamente**, gerando partículas de destruição. Se Charlotte pisar no abismo desprotegida, o Time Rewind é acionado.
- **Trilhos Procedurais com Autotiling Inteligente (*Look-Ahead*):**
  - Salas têm chance de gerar linhas contínuas de trilhos de vagonete (`railGrid`).
  - **Algoritmo Look-Ahead:** Retas horizontais varrem seus vizinhos para verificar se a linha curvou para cima ou para baixo. Se curvar para cima, utiliza automaticamente o sprite inferior (6-4), garantindo encaixe visual *pixel-perfect* sem degraus ou quebras na arte.
- **Chão Batido / Terra (`TILE.DIRT`):**
  - Manchas orgânicas de terra batida se espalham pelo centro das salas, usando autotiling de 8 peças para conectar de forma suave a terra com os ladrilhos de pedra rachada.

### 2.6 Catálogo Completo de Tiles do Sistema (`TILE`)

| ID | Constante | Nome / Função | Visual / Spritesheet | Comportamento Físico |
| :---: | :--- | :--- | :--- | :--- |
| `0` | `TILE.EMPTY` | Piso Vazio / Trânsito Livre | Ladrilhos de pedra rachada (1-1 a 1-4) | Transitável |
| `1` | `TILE.WALL` | Parede Indestrutível Perimetral / Pilares | Rocha maciça e chapas de metal escuro | Bloqueio total de movimento e bombas |
| `2` | `TILE.BREAKABLE` | Caixa de Madeira / Minério Quebrável | Caixa rústica com cantoneiras de ferro | Bloqueia movimento; destrutível por bombas; dropa CC |
| `3` | `TILE.LOCK_GATE` | Portão de Confinamento (Lockdown) | Bloco vermelho pulsante com estrias de aviso | Bloqueia portas durante combates |
| `4` | `TILE.HOLE` | Abismo / Cratera Aberta | Autotiling orgânico escuro de 13 peças | Intransitável; elimina inimigos; reinicia Charlotte |
| `5` | `TILE.GOELA` | Duto Coletor Subterrâneo | Duto metálico verde com anéis pulsantes | Transitável; descarrega CC e Peças no cofre seguro |
| `6` | `TILE.SECRET_LADDER` | Escada de Emergência do Andar Inferior | Escada de ferro iluminada por lanterna | Transitável; retorna ao andar superior |
| `7` | `TILE.GAUNTLET_ITEM` | Pedestal de Upgrade da Manopla | Pedestal de latão com luva mecânica ciano | Ao tocar, aprimora o nível da Manopla |
| `8` | `TILE.INVENTOR_NPC` | NPC Inventor (Safe Room) | Inventor com terno de couro e óculos ciano | Bloqueia passagem; oferece diálogos/lore |
| `9` | `TILE.ARMORY` | Mesa de Arsenal | Bancada de madeira com ferramentas e peças | Ao aproximar com recursos, abre a loja de melhorias |
| `10` | `TILE.BOSS_DOOR` | Portão Trancado da Sala do Chefe | Grade de ferro reforçada com emblema de caveira | Bloqueia passagem; requer a Chave do Boss |
| `11` | `TILE.BOSS_KEY` | Chave Mecânica do Chefe | Cartão/chave magnética dourada giratória | Coletável ao toque; abre o portão do Boss |
| `12` | `TILE.CHEST` | Baú Seguro de Armazenamento | Baú de ferro reforçado com display de saldo | Exibe total de CC e Peças salvas permanentemente |
| `13` | `TILE.LAVA` | Fosso de Lava Incandescente | Magma fervente animado em tons laranja e rubro | Intransitável a pé; transponível via Dash ou Propulsão |
| `14` | `TILE.VAULT_CHEST` | Cofre de Recompensa de Puzzle Trancado | Cofre blindado dourado com engrenagens | Destrancado ao solucionar o puzzle da sala |
| `15` | `TILE.VAULT_CHEST_OPEN`| Cofre de Puzzle Aberto | Cofre com tampa erguida emitindo brilho | Permanece vazio após coleta dos cristais |
| `16` | `TILE.PRESSURE_PLATE` | Placa de Pressão de Puzzle | Laje mecânica rebaixada com sensor ciano | Ativada ao pisar; mantém temporizador por alguns segundos |
| `17` | `TILE.SWITCH_TARGET` | Cristal Interruptor Elevado | Cristal ciano pulsante sobre pilastra | Ativado unicamente por detonação direta de bomba |
| `18` | `TILE.DIRT` | Chão Batido / Terra Orgânica | Textura de terra com autotiling de 8 bordas | Transitável; variação estética de bioma |

---

## 3. Mecânica de Lockdown (Trancamento de Sala)

### 3.1 Regras de Ativação
- Ao entrar em qualquer sala inexplorada que contenha autômatos vivos:
  - Todas as aberturas de portas centrais são instantaneamente substituídas por **Portões de Lockdown** (`TILE.LOCK_GATE`).
  - O estado da sala muda para `isLockdown = true`.
  - Disparo de alarme sonoro característico de trancamento mecânico (`playLockdownSound`).
  - O banner superior no HUD exibe com animação de pulso: `"LOCKDOWN! ELIMINE OS AUTÔMATOS"`.
  - A música ambiente transita imediatamente da exploração para o tema de combate tenso (`Locked_Gears_and_Steam.mp3`) via crossfade sonoro de 1.2 segundos.

### 3.2 Resolução e Destrancamento
- O Lockdown é mantido até que a contagem de autômatos vivos na sala chegue a **zero**.
- Ao eliminar o último autômato:
  - Os portões vermelhos voltam a ser aberturas transitáveis (`TILE.EMPTY`).
  - A sala é marcada como liberada (`cleared = true`).
  - Efeito sonoro harmônico de desbloqueio em arpejo maior Dó-Mi-Sol (`playUnlockSound`).
  - O banner de Lockdown é recolhido e um toast de `"SALA LIBERADA!"` é exibido.
  - A música ambiente realiza crossfade de volta para o tema sereno de exploração (`The_Weight_of_Brass.mp3`).

---

## 4. Personagem Jogável: Charlotte

### 4.1 Características Físicas e Atributos
- **Raio de Colisão:** 16 pixels.
- **Velocidade Base de Caminhada:** 175 pixels/segundo.
- **Física de Colisão:** Colisão contínua eixo a eixo (deslize suave em cantos de paredes e blocos).
- **Direcionamento e Olhar (Facing):**
  - Ao caminhar, Charlotte olha rigorosamente na direção do seu movimento.
  - Ao segurar para mirar uma bomba (clique e arraste), sua rotação fixa dinamicamente na direção do arco de arremesso.
  - Espelhamento horizontal visual automático (`scale(-1, 1)`) ao se virar para a esquerda.
- **Invulnerabilidade:** Piscamento translúcido de 15 Hz durante períodos pós-transição (0.6s), pós-dash (0.5s) ou pós-rebobinamento (1.8s).

### 4.2 Sprites e Animações Implementadas (`Img/charllote_spritesheet_64x64.png`)
Grid de spritesheet com células de $64 \times 64$ pixels (10 frames por ação):
- **Linha 0 — Idle (Parada):** 10 frames a 8 FPS, respiração sutil.
- **Linha 1 — Walk (Caminhada):** 10 frames a 10 FPS, passada com movimento de braços e jaleco.
- **Linha 3 — Dash / Recuo:** 10 frames a 14 FPS, postura aerodinâmica durante a propulsão.
- **Linha 4 — Throw / Arremesso:** 10 frames a 12 FPS (sustenta o frame 3 enquanto o jogador estiver mirando com a Manopla).
- **Fallback Gráfico:** Caso a imagem do sprite falhe ou não tenha carregado, o jogo renderiza suavemente um avatar vetorial nítido (círculo azul `#29b6f6` com óculos de proteção brancos direcionais).

### 4.3 Botas Propulsoras e Mecânica de Dash
Adquiridas na Mesa de Arsenal da Safe Room, as **Botas Propulsoras** introduzem alta mobilidade evasiva ao jogo:
- **Ativação:** Tecla <kbd>Shift</kbd> (Desktop) ou toque no botão ciano dedicado de Dash no painel mobile.
- **Custo Operacional:** Consome **1 Cristal Coal (CC)** por ativação. Se Charlotte estiver com 0 CC, o dash não é disparado e um alerta é exibido.
- **Propulsão e Invulnerabilidade:** Dispara Charlotte em alta velocidade na direção do movimento por 3 blocos de distância, concedendo **0.5s de invulnerabilidade total (i-frames)** durante o trajeto.
- **Travessia de Perigos:** Permite voar sobre fossos de lava (`TILE.LAVA`) e abismos abertos (`TILE.HOLE`) sem cair.
- **Superaquecimento / Cooldown:** Após o uso, as botas entram em resfriamento por **5.0 segundos**. Um contador regressivo em tempo real e overlay visual de recarga são exibidos no botão mobile e no HUD.

---

## 5. Ferramentas, Bombas e a Manopla Mecânica

Charlotte não possui ataques corporais diretos. Suas ferramentas são arremessadas através de sua **Manopla Mecânica** especial acoplada ao braço direito.

### 5.1 Sistema de Mira e Arremesso Balístico
- **Arremesso Tático (Clique e Arraste / Toque e Arraste):**
  - Ao clicar/tocar no Canvas e arrastar, uma trajetória parabólica em arco pontilhado é projetada em tempo real.
  - A cor da linha de mira corresponde ao tipo de bomba selecionada (Amarelo, Vermelho ou Ciano).
  - Um círculo tracejado exibe o limite máximo do alcance da Manopla ao redor de Charlotte.
  - Se o cursor ultrapassar o alcance máximo, a mira trava no raio máximo com retículo de alerta vermelho.
  - Ao soltar o botão/toque, Charlotte assume a postura de arremesso e a bomba é lançada.
- **Arremesso Rápido Frontal:**
  - Pressionar a **Barra de Espaço** (Desktop) ou tocar no botão de **AÇÃO** (Mobile) dispara uma bomba à frente na direção em que Charlotte está virada, a uma distância padrão segura de 2.5 blocos.
- **Arremesso Rápido no Cursor (Botão Direito do Mouse):**
  - No PC, clicar com o botão direito do mouse lança instantaneamente a bomba na coordenada do cursor, respeitando o raio da manopla.
- **Física da Bomba em Voo (`FlyingBomb`):**
  - Duração de voo: 0.32 segundos.
  - Elevação parabólica simulada em Z: arco de até 45 pixels de altura.
  - Rotação dinâmica em torno do próprio eixo durante o voo.
  - Sombra projetada no chão que encolhe conforme a bomba ganha altitude e expande ao aterrissar.

### 5.2 Níveis de Aprimoramento da Manopla Mecânica
O alcance do arremesso pode ser aprimorado encontrando pedestais de upgrade (`TILE.GAUNTLET_ITEM`), comprando na Mesa de Arsenal ou usando a tecla `[U]` de debug:
- **Nível 1 (Inicial):** Alcance de **140 pixels** (~3.5 blocos).
- **Nível 2:** Alcance de **220 pixels** (~5.5 blocos).
- **Nível 3 (MÁXIMO):** Alcance de **300 pixels** (~7.5 blocos — metade exata do mapa).
- *Feedback de Upgrade:* Fanfarra melódica de 5 notas ascendentes (`playUpgradeFanfare`), explosão de faíscas douradas e cianas sobre Charlotte e notificação em toast.

### 5.3 Sistema de Munição e Recarga Passiva
- Charlotte carrega um estoque máximo base de **5 Bombas Temporizadas** (expansível até 9 com a Bolsa do Arsenal).
- O estoque é exibido no botão mobile e no HUD superior `TEMP (X)`.
- Se as bombas estiverem esgotadas, um aviso sonoro e toast alertam: `"SEM BOMBAS! AGUARDE RECARGA..."`.
- **Recarga Passiva:** A cada 3.0 segundos sem disparar no limite, 1 bomba é reabastecida automaticamente.

### 5.4 Tipos de Bombas Implementadas

| Bomba | Representação Visual | Efeito Imediato | Dano | Raio de Ação | Efeito no Chão / Ambiente |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bomba a Vapor Temporizada** | Quadrado Amarelo com display digital de contagem regressiva | Fica no chão piscando por 3.0 segundos; emite beeps sonoros que aceleram no final antes de explodir | **2 HP** | Cruz de 2 blocos (5 blocos de extensão) | Destrói blocos quebráveis e abre o **Bueiro / Nodo Secreto** para descer de nível |
| **Bomba de Percussão (Impacto)** | Quadrado Vermelho pequeno com contorno branco | Explode instantaneamente no momento da aterrissagem | **1 HP** + repulsão | Círculo de 1.5 blocos ($3 \times 3$) | Destrói blocos quebráveis e quebra o bueiro de descida |
| **Bomba de Vapor Propulsor** | Quadrado Ciano brilhante com estrias | Detonação instantânea de vapor superaquecido a alta pressão | **0 HP** (Sem dano direto) | Repulsão de 3.5 blocos nos inimigos; 2.8 blocos em Charlotte | Lança Charlotte a 3 blocos de distância; empurra autômatos para dentro de **abismos**, destruindo-os imediatamente |

---

## 6. Verticalidade e Andares Mais Profundos da Mina

### 6.1 O Nodo Secreto de Piso / Bueiro de Transição
- Em cada nível gerado, exatamente **uma sala** da mina (não-inicial, sem Goela e sem puzzle) abriga o ponto de descida vertical.
- **Visual do Bueiro Metálico:** Baseado na linha 7 do spritesheet `Img/chao_mina1-3.png`.
- **Etapas de Abertura:**
  1. O bueiro começa fechado e trancado com anéis de ferro fundido.
  2. Ao receber o impacto de uma explosão pesada (Temporizada ou Percussão), a trava mecânica quebra e a tampa treme emitindo partículas de poeira e som de metal retorcido (`playFloorCrumble`).
  3. A escotilha se abre por completo revelando a passagem profunda com fluxo de vapor e iluminação ciano indicando descida `▼`.
- **Descida de Nível:** Ao pisar sobre a escotilha aberta, Charlotte desce para a profundidade seguinte (`nextDepth = currentDepth + 1`).

### 6.2 Escalonamento de Dificuldade por Profundidade (`Depth`)
A descida a andares mais fundos altera a ecologia da mina procedural:
- **Quantidade de Inimigos:**
  - Nível 1: 1 a 2 autômatos por sala de combate.
  - Nível 2: 2 a 3 autômatos por sala.
  - Nível 3+: 2 a 4 autômatos por sala.
- **Taxa de Drop de Recursos:** A chance de obter CC ao quebrar caixas aumenta de 50% (Nível 1) para até 85% (Níveis 3+). Inimigos derrotados dropam de 1 a 3 Peças Mecânicas conforme a profundidade.
- **Comportamento dos Inimigos:** Inimigos ganham até +45 px/s de velocidade de perseguição e têm o tempo de retardo de reação reduzido de 0.65s para 0.38s.

---

## 7. Inimigos e Chefes Mecânicos (IA e Tiers)

### 7.1 Máquina de Estados da IA (`Automaton`)
A IA dos autômatos é estruturada em 4 estados orgânicos:
1. **`dormant` (Carência de Inicialização):** Ativado nos primeiros 1.2s ao entrar na sala. Fica acinzentado com núcleo ótico apagado e `"zzz"`. Não causa dano ao contato.
2. **`idle` (Patrulha Passiva):** Deslocamento lento (36 px/s) em direções ortogonais com pausas naturais.
3. **`alert` (Alerta com Retardo):** Ao avistar Charlotte dentro de 4.5 blocos, emite balão de exclamação `!` e som de sirene (`playEnemyAlert`), pausando por 0.65s a 0.38s antes da perseguição.
4. **`chase` (Perseguição Ativa com Desvio de Obstáculos):** Avança com velocidade calibrada em direção a Charlotte, desviando de pilares e paredes indestrutíveis. Se Charlotte se afastar mais de 6 blocos, retorna para `idle`.

### 7.2 Tiers de Autômatos por Nível de Profundidade
- **Tier 1 — Autômato de Cobre Comum (Nível 1):** Vermelho Carmim (`#c62828`), **1 HP** (destruído por qualquer golpe).
- **Tier 2 — Autômato Blindado Ametista (Nível 2):** Roxo metálico (`#8e24aa`), **2 HP**, barra de vida segmentada sobre a cabeça.
- **Tier 3 — Titã de Obsidiana e Ouro (Nível 3+):** Grafite com detalhes em ouro (`#263238`), **3 a 6 HP**, carcaça resistente e perseguição veloz.

### 7.3 Interação com o Cenário e Dano
- Ao sofrer dano, pisca em branco por 0.25s e exibe números de dano flutuantes (`-1 HP`, `-2 HP`).
- Sofre recuo físico proporcional ao impacto da explosão.
- **Eliminação por Abismos:** Se for empurrado para um tile de `TILE.HOLE`, cai no vácuo e é destruído instantaneamente.

### 7.4 Chefe Humano: Mini-Boss e Chefe Final da Mina (`HumanBoss`)
Além dos autômatos a vapor, Charlotte encontra engenheiros humanos rivais equipados com seu próprio arsenal de bombas alquímicas e botas propulsoras:

- **Mini-Boss — O Engenheiro Rival (Níveis 3 e 4):**
  - **Arena Isolada Dedicada (`isMiniBossRoom`):** Não spawna mais aleatoriamente entre autômatos comuns; habita exclusivamente uma arena própria de duelo 1v1 gerada em pontas de caminho (*dead-ends*).
  - **Espelhamento Físico e Visual de Charlotte:**
    - Possui as mesmas dimensões de Charlotte (raio físico de 16px).
    - Renderizado utilizando o spritesheet original de Charlotte (`Img/charllote_spritesheet_64x64.png`) com animações completas de *idle*, *walk*, *throw* e *dash*, aplicado com um filtro alquímico contrastante em tom carmim/rubro renegado (`hue-rotate(160deg) saturate(2.5)`).
    - Exibe barra de vida dinâmica e identificador visual flutuante (`ENGENHEIRO RIVAL`) acima da cabeça.
  - **Atributos de Combate:** **3 HP**, velocidade de corrida de 150 px/s e 0.35s de invulnerabilidade ao sofrer dano (com efeito visual de flash estroboscópico).
  - **IA de Posicionamento e Espaçamento Tático (Kiting & Strafing):**
    - Mantém distância ideal de 3 a 5 blocos em relação a Charlotte.
    - Circula lateralmente (*strafe* contínuo com alternância periódica) e recua ativamente caso Charlotte se aproxime a menos de 2.8 blocos.
    - Avança estrategicamente caso a distância exceda 5.2 blocos.
  - **Botas Propulsoras com Dash e I-Frames:**
    - Monitora o campo em tempo real: caso detecte uma bomba temporizada a menos de 3.2 blocos ou seja encurralado (< 1.8 blocos), dispara um **Dash a vapor a 460 px/s** em vetor de fuga oposto ao perigo.
    - Concede 0.45s de invulnerabilidade total (*i-frames*), emitindo partículas ciano e som de vapor de alta pressão (`playPropulsorSteam`).
    - Tempo de recarga do dash: 4.5s.
  - **Arremesso Balístico com Arsenal Triplo:**
    - Dispara bombas em arremesso parabólico (`FlyingBomb`) com cálculo preditivo de trajetória (*lead target*) baseado na movimentação e direção de Charlotte.
    - Alterna dinamicamente seu arsenal: **Bomba de Propulsão** a curta distância (para repelir Charlotte), e **Bomba de Impacto (60%)** ou **Bomba Temporizada (40%)** a média/longa distância.
  - **Colisão Física sem Morte por Contato (Preservação do Duelo):**
    - Ao encostar fisicamente em Charlotte, **NÃO** causa dano por toque zumbi nem ativa o rebobinamento temporal instantâneo.
    - Em vez disso, ambos sofrem uma **repulsão elástica recíproca** (impulso de choque), faíscas ciano, som de impacto metálico e aviso "AFASTE-SE!", garantindo que o embate seja resolvido puramente por tática e explosões de bombas.
  - **Recompensa de Vitória:** Ao ser derrotado, dropa 5 Cristais Coal e concede +5 Peças Mecânicas na bolsa de Charlotte.

- **Chefe Final da Mina — O Engenheiro Mestre (Nível 5):**
  - Encontrado exclusivamente na Sala do Boss (`isBossRoom`), acessada após abrir a Porta do Boss com a Chave Mecânica.
  - Carcaça reforçada de cor escarlate escuro com **5 HP**, velocidade aumentada para 165 px/s e cooldown de dash reduzido para 3.5s.
  - Barra de vida e identificador no topo: `CHEFE MESTRE`.
  - Cadência de bombas acelerada (cooldown de 1.8s a 2.6s), combinando bombardeio contínuo e evasão de alta precisão.

---

## 8. Economia: Cristal Coal (CC), Peças e Arsenal

### 8.1 Cristal Coal (CC)
- Combustível azul reluzente lapidado obtido ao explodir caixas de minério (`TILE.BREAKABLE`) ou abrir cofres de salas de puzzle.
- Possui **magnetismo orgânico**, sendo puxado em aceleração para Charlotte a menos de 58px.
- Utilizado como moeda permanente para melhorias na oficina e como combustível volátil imediato para as Botas Propulsoras (1 CC por Dash).

### 8.2 Peças Mecânicas (Parts / Engrenagens)
- Engrenagens prateadas deixadas para trás exclusivamente ao derrotar autômatos hostis e chefes.
- Coletadas ao toque com feedback sonoro metálico.
- Essenciais para destravar a Mesa de Arsenal e forjar aprimoramentos industriais.

### 8.3 A Goela (Duto Coletor Permanente)
- Duto tubular subterrâneo presente em pelo menos 1 a cada 3 salas geradas.
- Charlotte descarrega instantaneamente todo o Cristal Coal e Peças Mecânicas voláteis da bolsa ao pisar na Goela.
- Os recursos são transferidos em segurança para o inventário do cofre (`depositedCores` e `depositedParts`).

### 8.4 Baú da Safe Room (`TILE.CHEST`)
- Localizado no canto inferior direito da Safe Room do Nível 1.
- Exibe em texto flutuante em tempo real o saldo de recursos guardados: `BAÚ: X CC | Y PEÇAS`.
- Permite que o jogador visualize a poupança acumulada entre expedições.

### 8.5 Mesa de Arsenal (`TILE.ARMORY`) e Árvore de Upgrades
Localizada no canto superior direito da Safe Room, permite que Charlotte fabrique melhorias permanentes:
- **Desbloqueio da Bancada:** Exige **10 CC + 10 Peças**. Ao pagar, a bancada é destravada permanentemente com faíscas douradas.
- **Upgrades Disponíveis:**
  1. **Aprimoramento da Manopla Mecânica:** (Custo: 10 CC + 10 Peças) — Aumenta o alcance máximo de arremesso de 140px $\to$ 220px $\to$ 300px (Nível Máximo 3).
  2. **Botas Propulsoras (Dash):** (Custo: 15 CC + 15 Peças) — Destrava a habilidade de Dash com <kbd>Shift</kbd> / Botão Mobile.
  3. **Bolsa Expandida de Ferramentas:** (Custo: 20 CC + 20 Peças) — Eleva a capacidade máxima de bombas temporizadas de 5 para 7 e 9 unidades.

---

## 9. Mecânica de Morte: Rebobinar o Tempo (Time Rewind)

No universo de RogueBomb, Charlotte não morre: seu maquinário temporal de bolso rebobina o espaço-tempo ao sofrer uma avaria crítica.

### 9.1 Condições de Disparo
1. Contato físico direto com qualquer autômato ou chefe em estado ativo (fora da carência `dormant`), com temporizador de invulnerabilidade zerado.
2. Queda em um abismo aberto (`TILE.HOLE`) ou pisar em poça de lava sem o escudo de invulnerabilidade do Dash.

### 9.2 Sequência de Rebobinamento
1. **SFX de Glitch:** Som agudo de fita analógica rebobinando em aceleração exponencial (`playRewindGlitch`).
2. **VFX de Glitch Temporal:** Aberração cromática em faixas horizontais ciano e magenta.
3. **Toast Central:** `"TEMPO REBOBINADO: NOVO MAPA GERADO!"`.
4. **Reset de Estado:**
   - Charlotte é teletransportada para a Safe Room inicial.
   - Recursos voláteis não depositados (CC e Peças) na bolsa são perdidos.
   - Saldo depositado na Goela e guardado no Baú permanece intacto.
   - Charlotte recebe **1.8 segundos de invulnerabilidade total**.
   - **Novo Mapa Gerado:** Um novo labirinto procedural de 10 salas é construído instantaneamente.
5. **Comando de Debug:** Tecla `[R]` no teclado permite acionar o rebobinamento manualmente para testes.

---

## 10. Design de Áudio (Web Audio API e BGM Adaptativa)

### 10.1 Trilha Sonora Adaptativa (BGM)
- **Modo Exploração:** `song/The_Weight_of_Brass.mp3` — Trilha misteriosa com metais e percussão de engrenagens para exploração livre.
- **Modo Combate (Lockdown):** `song/Locked_Gears_and_Steam.mp3` — Ritmo mecânico acelerado e opressivo para momentos de trancamento.
- **Crossfade Suave:** Transição matemática contínua entre as faixas em 1.2 segundos (30 passos lineares de atenuação/ganho).

### 10.2 Efeitos Sonoros Sintetizados Proceduralmente (Web Audio API)
Sons 100% sintetizados via código matemático, sem dependência de assets de áudio para SFX:
- `playImpactExplosion()`: Ruído branco com filtro passa-baixas exponencial (600 Hz $\to$ 80 Hz).
- `playPropulsorSteam()`: Ruído com filtro passa-faixa sibilante Q=3.0 (1400 Hz $\to$ 300 Hz).
- `playTimedBeep(pitchMult)`: Onda senoidal pura em 700 Hz com aceleração de frequência.
- `playBigTimedExplosion()`: Oscilador triangular sub-grave (140 Hz $\to$ 30 Hz) + explosão de ruído passa-baixas.
- `playLockdownSound()`: Onda dente-de-serra modulada descendente (220 Hz $\to$ 180 Hz).
- `playUnlockSound()`: Acorde arpejado maior senoidal límpido (Dó5, Mi5, Sol5).
- `playRewindGlitch()`: Varredura de onda quadrada exponencial rápida (120 Hz $\to$ 950 Hz).
- `playChuteDeposit()`: Varredura harmônica triangular (320 Hz $\to$ 640 Hz).
- `playThrowWhoosh()`: Modulação senoidal curta de corte de vento.
- `playUpgradeFanfare()`: Fanfarra melódica de 5 notas (Mi4, Lá4, Dó#5, Mi5, Lá5).
- `playEnemyAlert()`: Sirene rápida dente-de-serra (380 Hz $\to$ 760 Hz).
- `playCCPickup()`: Duas notas senoidais agudas em sino (880 Hz e 1318.5 Hz).
- `playFloorCrumble()`: Ressonância sub-grave triangular simulando desmoronamento de rocha e ferro.

---

## 11. Interface de Usuário (HUD) e Controles Híbridos

### 11.1 HUD Superior e Informações em Tela
- **Status da Sala (Canto Superior Esquerdo):** Exibe `NÍVEL X • SALA [rx, ry]` (ou `SALA DO CHEFE 💀` / `ARENA DO RIVAL ⚔️` / `CÂMARA DE DESAFIO 💎` / `ANDAR SECRETO`) e contagem dinâmica `INIMIGOS: X` (verde em paz; vermelho em combate).
- **Badge da Manopla Mecânica (Centro-Esquerda):** Ícone 🥊 com nível atual (`NV. 1`, `NV. 2`, `NV. 3 MAX`), clicável diretamente para aprimoramento.
- **Badges de Economia (Centro-Direita):**
  - Ícone de diamante 💎 com o total de Cristal Coal na bolsa (`X CC`).
  - Ícone de engrenagem ⚙️ com o total de Peças Mecânicas na bolsa (`Y P`).
- **Minimapa Procedural (Canto Superior Direito):**
  - Canvas de $70 \times 70$ pixels mapeando as salas:
    - **Azul Claro:** Sala atual de Charlotte.
    - **Cinza Chumbo:** Salas visitadas e limpas.
    - **Vermelho:** Salas de combate comuns com autômatos vivos.
    - **Magenta / Rosa Vivo (`#e91e63`):** Arena do Mini-Boss (Engenheiro Rival isolado).
    - **Dourado Radiante (`#ffb300`):** Câmara de Desafio / Puzzle Metroidvania.
    - **Ponto Verde:** Sala que abriga a Goela de depósito.
    - **Ponto Amarelo:** Sala que contém a chave do Boss ou cofre de puzzle.
    - **Ícone de Caveira:** Sala do Chefe Final.
- **Banner de Lockdown:** Faixa vermelha animada no topo da tela durante o confinamento (`DUELO! DERROTE O ENGENHEIRO RIVAL!`, `CONFRONTO FINAL! CHEFE MESTRE!` ou `LOCKDOWN ATIVADO!`).
- **Feedbacks Flutuantes:** Danos (`-1 HP`), coleta de recursos (`+1 CC`, `+1 P`), depósitos, repulsão (`AFASTE-SE!`), evasão (`DASH!`, `ESQUIVOU!`) e notificações de toast centrais.

### 11.2 Mapeamento de Controles Desktop
- **Movimentação:** Teclas <kbd>W</kbd>, <kbd>A</kbd>, <kbd>S</kbd>, <kbd>D</kbd> ou <kbd>Setas Direcionais</kbd> (movimento ortogonal e diagonal normalizado).
- **Mira e Arremesso Balístico:** Clicar e arrastar com o botão esquerdo do mouse para traçar o arco; soltar para lançar.
- **Arremesso Rápido no Cursor:** Botão direito do mouse.
- **Arremesso Frontal:** Barra de <kbd>ESPAÇO</kbd>.
- **Dash (Botas Propulsoras):** Tecla <kbd>Shift</kbd> (Consome 1 CC, 0.5s de invulnerabilidade, resfriamento de 5.0s).
- **Seleção de Ferramentas:** Teclas <kbd>1</kbd> (Impacto), <kbd>2</kbd> (Propulsor), <kbd>3</kbd> (Temporizada) ou <kbd>Scroll do Mouse</kbd>.
- **Aprimorar Manopla:** Tecla <kbd>U</kbd> ou clique no badge do HUD.
- **Atalhos de Tester (Debug):**
  - <kbd>Ctrl</kbd> + <kbd>Y</kbd>: +10 CC e +10 Peças.
  - <kbd>Ctrl</kbd> + <kbd>U</kbd>: Revela no minimapa e no chão a saída secreta para o próximo nível.
  - <kbd>R</kbd>: Rebobina o tempo instantaneamente.

### 11.3 Mapeamento de Controles Mobile (Touch)
- **Joystick Analógico Virtual Dinâmico (Inferior Esquerdo):** Detecção 360° suave via Pointer Events com retorno automático ao centro.
- **Painel de Ações (Inferior Direito):**
  - **Botão Principal de Ação:** Disparo frontal da ferramenta selecionada.
  - **Botão de Dash Ciano (`#dash-trigger`):** Aciona as Botas Propulsoras; possui indicador de custo (1 CC), overlay de recarga regressivo durante o resfriamento de 5.0s e estado bloqueado caso ainda não adquirido.
  - **Seletores de Ferramentas:** 3 botões dedicados com cores e contadores de munição para troca ágil de bombas.

---

## 12. Tabela Comparativa: GDD Original (PDF) vs. Protótipo Implementado

| Requisito do Documento Original (PDF) | Situação no Código Atual | Detalhes da Implementação / Expansão |
| :--- | :---: | :--- |
| **Engine Vanilla (HTML/CSS/JS + Canvas API)** | ✅ **Completo** | Jogo 100% contido em arquitetura modular limpa e comentada sem bibliotecas externas |
| **Controles Híbridos (PC + Mobile)** | ✅ **Completo** | Suporte simultâneo a teclado, mouse com clique-e-arraste, joystick touch 360° e botões ergonômicos |
| **Grid 15x15 e Salas Modulares** | ✅ **Completo** | Grid de 15x15 blocos (40px/tile = 600x600px), 1 sala renderizada por vez para alta performance |
| **Matriz Procedural de Salas** | ✅ **Expandido** | Matriz 5x5 com 10 salas ramificadas, minimapa no HUD com códigos de status e portas ortogonais centrais |
| **Transição com Fade Out / Fade In** | ✅ **Completo** | Transição suave de tela preta (fade 1.2s), reposicionamento na borda oposta e carência de proteção |
| **Regra da Goela (1 a cada 3 salas)** | ✅ **Completo** | Pelo menos 1 Goela a cada 3 salas; sistema bancário de depósito de Cristal Coal e Peças |
| **Placeholders vs Arte Final** | ✅ **Expandido** | Spritesheet de Charlotte (64x64), Spritesheet da Mina (192x192 e 384x384), caixas e autômatos detalhados |
| **Mecânica de Lockdown** | ✅ **Completo** | Portas viram blocos vermelhos pulsantes, alerta no HUD, troca adaptativa de música e liberação ao zerar inimigos |
| **Bomba de Impacto (Percussão)** | ✅ **Completo** | Detonação imediata ao pousar, raio de 1.5 blocos, quebra caixas e causa 1 de dano com repulsão |
| **Bomba de Vapor Propulsor** | ✅ **Completo** | Sem dano direto, aplica dash de 3 blocos em Charlotte e empurra autômatos para dentro de abismos |
| **Bomba a Vapor Temporizada** | ✅ **Completo** | Timer de 3 segundos com beeps acelerados, explosão em cruz de 2 blocos, 2 de dano e quebra caixas/bueiros |
| **Regra de Verticalidade (Andar Inferior)** | ✅ **Expandido** | **Bueiro / Escotilha de Ferro** animado em 3 fases que se abre após explosão para descer de profundidade (`Depth`) |
| **Comportamento dos Inimigos (Autômatos)** | ✅ **Expandido** | IA com 4 estados (Dormant, Idle, Alert, Chase) com 3 Tiers (Comum 1 HP, Blindado 2 HP e Titã 3+ HP) |
| **Rebobinar o Tempo (Time Rewind)** | ✅ **Completo** | SFX de glitch analógico, tela com aberração cromática, novo mapa gerado e retorno à Safe Room preservando recursos da Goela |
| **Design de Som e Música Adaptativa** | 🌟 **Completo** | BGM adaptativa dupla com crossfade de 1.2s (Exploração/Combate) e 13 SFX sintetizados proceduralmente |
| **Manopla Mecânica com Upgrades** | ✨ **Completo** | Alcance de arremesso em 3 níveis (140px, 220px, 300px), comprado na Mesa de Arsenal |
| **Botas Propulsoras (Dash)** | ✨ **Completo** | Dash veloz com invulnerabilidade (0.5s), consome 1 CC, resfriamento de 5s e botão dedicado mobile |
| **Salas de Desafio / Puzzles Metroidvania** | ✨ **Novo no MVP** | 1 sala por andar: Cofre Temporizado (Nível 1), Fosso de Lava (Nível 2) e Cristal Elevado (Nível 3+) |
| **Sistema de Autotiling dos Abismos** | ✨ **Novo no MVP** | Clusters orgânicos de abismo com 13 peças de autotiling, Safe Zone de portas e eliminação instantânea de inimigos |
| **Trilhos Procedurais Look-Ahead** | ✨ **Novo no MVP** | Trilhos pelas salas com algoritmo preditivo de encaixe visual perfeito de curvas e retas |
| **Bioma de Terra Batida (`TILE.DIRT`)** | ✨ **Novo no MVP** | Poças orgânicas de terra batida com 8 peças de transição com o chão de pedra |
| **Safe Room Temática Completa** | ✨ **Completo** | NPC Inventor, Mesa de Arsenal e Baú de recursos guardados |
| **Loja na Mesa de Arsenal** | ✨ **Completo** | Desbloqueio e melhorias pagas com CC e Peças depositadas (Manopla, Botas e Bolsa de Bombas) |
| **Inimigos e Drop de Peças Mecânicas** | ✨ **Completo** | Inimigos dropam Peças (engrenagens prateadas) além do CC das caixas, escalando com a profundidade |
| **Mini-Boss: Arena Isolada & IA Charlotte (Níveis 3 e 4)** | ✨ **Completo** | Sala exclusiva 1v1 com 4 pilares, IA com kiting, strafe, dash com i-frames, arsenal de 3 bombas, colisão elástica sem toque zumbi e spritesheet da Charlotte em rubro |
| **Chefe Final da Mina e Chave (Nível 5)** | ✨ **Completo** | Sala do Boss trancada com Portão de Caveira, Chave do Boss em sala secundária e Chefe Mestre com 5 HP, mira laser e fuga com dash |
| **Dica de Saída (Ctrl+U)** | ✨ **Completo** | Revela no minimapa e no chão a posição da sala de saída e do bueiro para o próximo nível |

---

## 13. Roteiro e Backlog para Próximas Atualizações (Pós-MVP)

Com a entrega bem-sucedida do loop de jogo completo, mecânicas de puzzle, autotiling e chefe final do 5º nível, os próximos passos planejados para versões subsequentes incluem:

1. **Persistência de Dados e Salvamento Local (`localStorage`):**
   - Salvar o progresso das compras da Mesa de Arsenal (Manopla, Botas e Bolsa) e os recursos depositados no Baú entre sessões do navegador.
2. **Novos Tipos de Ferramentas / Bombas Alquímicas:**
   - **Bomba de Óleo Escorregadio:** Cria poças que reduzem drasticamente a tração dos autômatos, fazendo-os deslizar descontrolados para dentro de abismos.
   - **Bomba Criogênica a Vapor:** Congela temporariamente autômatos e solidifica poças de lava em plataformas transitáveis de basalto.
3. **Mecânica de Empurrar Blocos e Estátuas Pesadas:**
   - Possibilidade de Charlotte usar a repulsão da Bomba de Propulsão para deslocar blocos maciços sobre placas de pressão permanentes ou formar pontes sobre abismos estreitos.
4. **Variações de Biomas Subterrâneos:**
   - **Níveis 1-2:** Mina de Carvão e Engrenagens (tijolo cinza e terra batida).
   - **Níveis 3-4:** Fundição de Bronze e Tubulações de Vapor Quente (fendas de lava e tubos enferrujados).
   - **Nível 5:** Santuário Central da Forja Mecânica (arena monumental do Chefe Final).
