# Game Design Document (GDD) â€” RogueBomb
**VersÃ£o:** 2.2 (DocumentaÃ§Ã£o Completa do MVP / ProtÃ³tipo Implementado com Puzzles, Chefes e Autotiling)  
**Projeto:** RogueBomb â€” Roguevania com Bombas  
**Engine / Stack:** HTML5, CSS3, JavaScript Vanilla (Canvas API 2D nativa, Web Audio API, Touch Events, Pointer Events)  
**Plataformas:** Web (Desktop) & Dispositivos MÃ³veis (Mobile First / Responsivo)  
**Data da Ãšltima AtualizaÃ§Ã£o:** Setembro / 2026  

---

## Atualizações Recentes (Setembro / 2026)

### Sistema de Arsenal e Loadout de Bombas
- **Bolsa de Bombas com Slots:** O jogador agora possui uma bolsa com capacidade limite em slots (Nível 1 = 5, Nível 2 = 7, Nível 3 = 10 slots).
- **Sistema de Loadout Personalizável:** Na aba "🎒 Bolsa" da Mesa de Arsenal, o jogador clica nos slots para escolher quais bombas levar consigo para a corrida (mesclando Temporizadas, de Impacto e Propulsoras como preferir).
- **Cooldown Individual por Slot:** A munição global de bombas foi substituída por um tempo de recarga individual de **5 segundos por slot**, forçando uma cadência tática no uso de cada tipo.
- **Botões no HUD Dinâmicos:** Os botões de bombas agora mostram a munição no formato `(Prontas / Total Equipado)`.

### Loja do Inventor e Progressão
- **Desvinculação de Capacidade e Tipos de Bomba:** A expansão de capacidade da bolsa na Mesa de Arsenal agora apenas adiciona mais slots (+2 a cada nível).
- **Loja do Inventor (Popup):** O NPC Inventor na Safe Room agora oferece uma loja dedicada para liberar novos **Tipos de Bomba**:
  - Bomba de Impacto (Requer 15 CC, 10 Peças).
  - Bomba de Vórtice Magnético (Requer 25 CC, 20 Peças; exige a de Impacto primeiro).
- **Resgate do Inventor:** Após resolver a Câmara de Desafio (Puzzle) e resgatar o Inventor, a sala dele é substituída por um Cofre Seguro (`TILE.VAULT_CHEST`) nas runs subsequentes. Um ícone de placa (`TILE.SIGN`) indica ausência quando ele não foi resgatado.

### Modo "Enlouquecido" dos Autômatos (Nível 2+)
- A partir do Nível 2, autômatos sofrem surtos temporários (duração de 3s, com intervalo aleatório entre 5s a 10s).
- **Efeitos Visuais:** Olhos vermelhos brilhantes e emissão pesada de fumaça preta (diesel) e faíscas.
- **Buff de Inimigo (Charger):** Durante a fúria, o autômato Charger esmaga caixas de madeira instantaneamente se trombar nelas com sua investida, enquanto em estado normal ele demora 2 segundos triturando a caixa.

### Chefe Final: Autômato Titânico (Nível 5)
- **Identidade e Robustez:** Um colossal autômato a vapor com chassi blindado pesado, fornalha central e engrenagens móveis. Possui **10 vidas**.
- **Habilidades Integradas de Todos os Autômatos:**
  - **Investidas Super-Rápidas:** Telegrafadas com linha de mira a laser vermelha; esmaga obstáculos pelo caminho.
  - **Blindagem Ativável:** Escudo protetor que bloqueia Bombas de Impacto e só pode ser quebrado com detonação direta de Bomba-Relógio (Timer Bomb).
  - **Lançamento de Bombas:** Alterna entre Bombas-Relógio (emboscada na rota de fuga) e Bombas de Impacto (mira circular vermelha).
- **Mecânica Única (Terremoto e Queda de Rochas):** O chefe bate no chão provocando estrondo sísmico que derruba rochas e estalactites do teto da mina. Se uma rocha atingir Charlotte, retira **1 coração e vida**.
- **Fase 2 (Sobrecarga Enlouquecida - 5 Vidas ou menos):** O chefe entra em fúria desenfreada com fumaça e brasas contínuas, velocidade acelerada, investidas em cadeia para múltiplas direções, e arremesso duplo de bombas com cadência aumentada.

### Sistema de Saúde de Charlotte (3 Vidas / Corações)
- Charlotte possui **3 Corações** (vidas visíveis no HUD: `❤️❤️❤️`).
- Ao ser atingida por autômatos, chefes ou rochas em queda, perde **1 coração**, recebe recuo e 1.6s de invulnerabilidade (i-frames piscantes).
- Perder os 3 corações aciona o **Rebobinar do Tempo (Time Rewind)** para a Safe Room.

### Música
- Adicionada a faixa de batalha `The_Clockwork_Siege.mp3` tocando proceduralmente nos duelos ou no lockdown.

---

## 1. VisÃ£o Geral e Pitch do Jogo

### 1.1 Premissa
**RogueBomb** Ã© um *Roguevania* de aÃ§Ã£o em visÃ£o top-down (com simulaÃ§Ã£o de perspectiva isomÃ©trica 2D). O jogador controla **Charlotte**, uma jovem inventora que explora as entranhas mecÃ¢nicas e perigosas de uma mina subterrÃ¢nea procedural steampunk. Em vez de espadas ou armas de fogo convencionais, Charlotte utiliza a sua **Manopla MecÃ¢nica** e um arsenal tÃ¡tico de **Bombas a Vapor e PercussÃ£o** para resolver quebra-cabeÃ§as ambientais, destruir caixas de minÃ©rio, combater autÃ´matos hostis e abrir caminho rumo aos andares mais profundos da mina em busca do valioso **Cristal Coal (CC)** â€” um carvÃ£o mineral cristalizado hiper-energÃ©tico essencial para suas invenÃ§Ãµes â€” e **PeÃ§as MecÃ¢nicas** deixadas para trÃ¡s pelas mÃ¡quinas a vapor.

### 1.2 Core Loop (Ciclo Central de Jogabilidade)
1. **Entrada na Sala:** Charlotte entra em uma sala gerada proceduralmente. Se houver autÃ´matos, a sala entra em **Lockdown**, trancando as portas atÃ© que todos os inimigos sejam derrotados.
2. **Combate & TÃ¡tica com Bombas:** Uso de bombas temporizadas, de impacto e de propulsÃ£o para repelir, destruir ou empurrar autÃ´matos para dentro dos abismos, evitando a todo custo o contato direto.
3. **Desafios Metroidvania (Salas de Puzzle):** ResoluÃ§Ã£o de enigmas ambientais em cada profundidade (placas de pressÃ£o sincronizadas, travessia sobre lava com dash ou ativaÃ§Ã£o de cristais interruptores Ã  distÃ¢ncia).
4. **MineraÃ§Ã£o & Coleta de Recursos:** DestruiÃ§Ã£o de caixas para obter **Cristal Coal (CC)** e eliminaÃ§Ã£o de autÃ´matos para coletar **PeÃ§as MecÃ¢nicas (Engrenagens)**.
5. **DepÃ³sito Seguro na Goela:** Charlotte deve levar seus recursos atÃ© as salas equipadas com a **Goela** (duto de descarte seguro). Recursos depositados sÃ£o enviados permanentemente para o **BaÃº da Safe Room**.
6. **Verticalidade & ProgressÃ£o:** DetecÃ§Ã£o do **Bueiro / Nodo Secreto de Piso** da mina; ao detonar uma bomba sobre ele, a escotilha se destranca e abre, permitindo descer ao prÃ³ximo nÃ­vel de profundidade (`Depth`).
7. **Confrontos com Chefes:** Enfrentar o **Engenheiro Rival (Mini-Boss)** em uma arena isolada dedicada nos nÃ­veis 3 e 4, e localizar a **Chave do Boss** para desbloquear o portal do **Chefe Mestre Final** no nÃ­vel 5.
8. **Morte & Rebobinar do Tempo (Time Rewind):** Ao colidir com um autÃ´mato ativo ou cair em um abismo sem proteÃ§Ã£o, o tempo rebobina com um efeito de glitch analÃ³gico: Charlotte acorda na Safe Room inicial, um novo mapa procedural Ã© gerado, a profundidade reseta e os recursos volÃ¡teis nÃ£o depositados sÃ£o perdidos (mantendo os jÃ¡ salvos na Goela e guardados no BaÃº).

---

## 2. Estrutura do Mundo e Salas Modulares

### 2.1 Grid e ResoluÃ§Ã£o
- **Tamanho do Grid por Sala:** Matriz de $15 \times 15$ blocos (tiles).
- **Tamanho de cada Tile:** $40 \times 40$ pixels.
- **DimensÃµes do Mundo por Sala:** $600 \times 600$ pixels.
- **RenderizaÃ§Ã£o:** Apenas uma sala Ã© renderizada por vez no Canvas central, garantindo performance de 60 FPS mesmo em smartphones mais modestos.
- **Ajuste Responsivo:** Canvas com escala automÃ¡tica (`resizeCanvas`) mantendo proporÃ§Ã£o nÃ­tida pixel-perfect com CSS `image-rendering: crisp-edges` e `pixelated`.

### 2.2 GeraÃ§Ã£o Procedural do Mapa (`MapManager`)
- **Matriz de ExploraÃ§Ã£o:** Matriz de $5 \times 5$ coordenadas de salas.
- **Quantidade de Salas:** Gera proceduralmente um conjunto ramificado de 10 salas conectadas atravÃ©s de algoritmo de difusÃ£o aleatÃ³ria (BFS com fila e probabilidade de bifurcaÃ§Ã£o de 75%).
- **Coordenada Inicial (Safe Room):** PosiÃ§Ã£o central `[2, 2]`.
- **Topologia de Portas:** Portas centrais posicionadas no meio exato de cada borda (tile de Ã­ndice 7):
  - Borda Norte: `(0, 7)`
  - Borda Sul: `(14, 7)`
  - Borda Oeste: `(7, 0)`
  - Borda Leste: `(7, 14)`
- **ConexÃµes Garantidas:** O gerador verifica vizinhos ortogonais imediatos e conecta portas bidirecionalmente entre salas adjacentes existentes.

### 2.3 Tipos de Sala
1. **Sala Inicial (Safe Room / Ponto de Partida):**
   - Nunca contÃ©m inimigos e nunca entra em Lockdown.
   - Ponto de respawn de Charlotte.
   - ContÃ©m o **NPC Inventor** (`TILE.INVENTOR_NPC` - tile com Ã³culos de proteÃ§Ã£o).
   - ContÃ©m a **Mesa de Arsenal** (`TILE.ARMORY` - bancada de modificaÃ§Ãµes de equipamentos).
   - ContÃ©m o **BaÃº de Armazenamento** (`TILE.CHEST` - armazena permanentemente CC e PeÃ§as depositadas na Goela).
   - Apenas no NÃ­vel 1 Ã© uma Safe Room temÃ¡tica desobstruÃ­da; em andares subsequentes funciona como ponto de chegada.

2. **Salas Regulares de ExploraÃ§Ã£o e Combate:**
   - Cercadas por paredes indestrutÃ­veis perimetrais (`TILE.WALL`).
   - Pilares estruturais fixos distribuÃ­dos geometricamente em posiÃ§Ãµes pares (`x % 2 === 0 && y % 2 === 0`).
   - Blocos/Caixas de madeira quebrÃ¡veis (`TILE.BREAKABLE`) distribuÃ­das aleatoriamente pelo piso, protegendo o caminho central das 4 portas.
   - PopulaÃ§Ã£o de autÃ´matos hostis com spawn afastado das portas de entrada para evitar emboscadas injustas.

3. **Salas com Goela (Duto Coletor):**
   - Regra de distribuiÃ§Ã£o: **Pelo menos uma a cada trÃªs salas geradas** possui obrigatoriamente uma Goela no centro da sala.
   - Duto circular verde-escuro (`#1b5e20`) com anel exterior pulsante verde-claro (`#4caf50`).
   - Transfere instantaneamente os cristais e peÃ§as volÃ¡teis para o cofre seguro da oficina.

4. **Salas de Desafio / Puzzles Metroidvania (`isPuzzleRoom`):**
   - Gera **exatamente uma sala de puzzle Ãºnica por andar**, testando habilidades do jogador em troca de cofres valiosos de Cristal Coal (`TILE.VAULT_CHEST`):
     - **NÃ­vel 1 â€” Cofre Temporizado (`timed_vault`):** O cofre fica no centro protegido por caixas. O jogador deve acionar **duas Placas de PressÃ£o sincronizadas** (`TILE.PRESSURE_PLATE`) nas extremidades da sala em tempo hÃ¡bil para destravar o cofre (Recompensa: 5 CC).
     - **NÃ­vel 2 â€” Fosso de Lava (`lava_chasm`):** Um fosso de lava ardente (`TILE.LAVA`) isola uma plataforma 3x3 no meio da sala contendo o cofre. Charlotte precisa utilizar o **Dash das Botas Propulsoras** ou uma detonaÃ§Ã£o de **Bomba de Vapor Propulsor** para voar sobre o abismo de lava e alcanÃ§ar o cofre (Recompensa: 7 CC).
     - **NÃ­vel 3+ â€” Fortaleza de Cristal Elevado (`gauntlet_target`):** Uma cÃ¢mara protegida por muralhas fixas (`TILE.WALL`). O cofre sÃ³ Ã© aberto ao detonar o **Cristal Interruptor Elevado** (`TILE.SWITCH_TARGET`), exigindo cÃ¡lculo de arremesso parabÃ³lico em arco com a Manopla MecÃ¢nica por cima das muralhas (Recompensa: 10 CC).

5. **Sala Secreta / Andar Inferior (Verticalidade):**
   - Acessada atravÃ©s do **Bueiro / Nodo Secreto** detonado na mina.
   - ContÃ©m a **Escada de EmergÃªncia** (`TILE.SECRET_LADDER`) para retorno Ã  superfÃ­cie e pedestais de upgrade (`TILE.GAUNTLET_ITEM`).

6. **Sala do Chefe Final (Boss Room) e Sala da Chave (Profundidade 5+):**
   - No 5Âº nÃ­vel da mina, uma das salas extremas (*dead-end*) Ã© convertida na arena do **Chefe Final**.
   - A entrada Ã© trancada pelo **PortÃ£o do Boss** (`TILE.BOSS_DOOR`), ilustrado com estrias de caveira mecÃ¢nica.
   - Outra sala aleatÃ³ria do mapa recebe o pedestal da **Chave do Boss** (`TILE.BOSS_KEY`), necessÃ¡ria para destravar o portÃ£o e enfrentar o confronto final.

7. **Arena Isolada do Mini-Boss / Engenheiro Rival (`isMiniBossRoom` â€” NÃ­veis 3 e 4):**
   - Nos nÃ­veis 3 e 4, uma sala extrema sem saÃ­da (*dead-end*) Ã© dedicada exclusivamente para o confronto mano a mano contra o Mini-Boss (`HumanBoss`), sem a presenÃ§a de autÃ´matos comuns.
   - **Arquitetura TÃ¡tica de Duelo (`buildMiniBossLayout`):** A sala conta com 4 pilares maciÃ§os simÃ©tricos (`TILE.WALL`) nos quadrantes centrais para cobertura contra estilhaÃ§os e explosÃµes em cruz, alÃ©m de caixas quebrÃ¡veis (`TILE.BREAKABLE`) nos 4 cantos para recarga emergencial de recursos.
   - **Lockdown e Atmosfera:** Ao entrar, as portas se trancam instantaneamente com `TILE.LOCK_GATE`, soa o alarme com banner "DUELO! DERROTE O ENGENHEIRO RIVAL!" e a trilha sonora transiciona para o modo dinÃ¢mico de batalha.
   - **Indicadores de NavegaÃ§Ã£o:** Identificada no minimapa com uma cÃ©lula de cor magenta viva (`#e91e63`) e no HUD de coordenadas como `NÃVEL X â€¢ ARENA DO RIVAL âš”ï¸ [rx, ry]`.
   - **Recompensa de VitÃ³ria:** Ao ser derrotado, o lockdown Ã© suspenso com fanfarra ("RIVAL DERROTADO! ARENA LIBERADA!"), liberando 5 Cristais Coal e concedendo +5 PeÃ§as MecÃ¢nicas imediatamente.

### 2.4 TransiÃ§Ã£o de Salas e CÃ¢mera
- **Efeito Visual:** *Fade out / Fade in* suave com duraÃ§Ã£o total de ~0.5s preenchendo a tela em preto translÃºcido (`rgba(12, 14, 18, alpha)`).
- **Reposicionamento Oposto:** Ao atravessar a porta Norte, Charlotte ressurge na borda Sul da nova sala (com margem segura de 1.5 tiles); o mesmo ocorre para Leste $\leftrightarrow$ Oeste.
- **ProteÃ§Ã£o do Jogador na Entrada:** Ao carregar a nova sala, Charlotte recebe 0.6s de invulnerabilidade e todos os autÃ´matos da sala recebem **1.2 segundos de carÃªncia de inicializaÃ§Ã£o (`dormant`)**, impedindo dano acidental na entrada.

### 2.5 Sistema Ambiental e Autotiling Procedural
O visual das salas Ã© gerado dinamicamente com base no spritesheet expandido `Img/chao_mina1-3.png`:
- **Autotiling de Abismos (13 PeÃ§as):**
  - O gerador cria de 0 a 2 grandes abismos orgÃ¢nicos por sala (raio entre 1.5 e 4 blocos).
  - **Safe Zone de Portas:** Uma Ã¡rea de proteÃ§Ã£o com raio de **3.5 blocos em volta das 4 portas centrais** Ã© rigorosamente respeitada, impedindo que o gerador crie abismos obstruindo a passagem entre salas.
  - O autotiling calcula quinas internas (5-2 a 5-5), quinas externas (3-5, 4-1, 4-2, 4-4), bordas retas (3-6, 4-3, 4-5, 4-6) e blocos isolados (3-4).
  - **FÃ­sica de Queda no Abismo:** Se um autÃ´mato for empurrado para o abismo, ele cai e Ã© **eliminado imediatamente**, gerando partÃ­culas de destruiÃ§Ã£o. Se Charlotte pisar no abismo desprotegida, o Time Rewind Ã© acionado.
- **Trilhos Procedurais com Autotiling Inteligente (*Look-Ahead*):**
  - Salas tÃªm chance de gerar linhas contÃ­nuas de trilhos de vagonete (`railGrid`).
  - **Algoritmo Look-Ahead:** Retas horizontais varrem seus vizinhos para verificar se a linha curvou para cima ou para baixo. Se curvar para cima, utiliza automaticamente o sprite inferior (6-4), garantindo encaixe visual *pixel-perfect* sem degraus ou quebras na arte.
- **ChÃ£o Batido / Terra (`TILE.DIRT`):**
  - Manchas orgÃ¢nicas de terra batida se espalham pelo centro das salas, usando autotiling de 8 peÃ§as para conectar de forma suave a terra com os ladrilhos de pedra rachada.

### 2.6 CatÃ¡logo Completo de Tiles do Sistema (`TILE`)

| ID | Constante | Nome / FunÃ§Ã£o | Visual / Spritesheet | Comportamento FÃ­sico |
| :---: | :--- | :--- | :--- | :--- |
| `0` | `TILE.EMPTY` | Piso Vazio / TrÃ¢nsito Livre | Ladrilhos de pedra rachada (1-1 a 1-4) | TransitÃ¡vel |
| `1` | `TILE.WALL` | Parede IndestrutÃ­vel Perimetral / Pilares | Rocha maciÃ§a e chapas de metal escuro | Bloqueio total de movimento e bombas |
| `2` | `TILE.BREAKABLE` | Caixa de Madeira / MinÃ©rio QuebrÃ¡vel | Caixa rÃºstica com cantoneiras de ferro | Bloqueia movimento; destrutÃ­vel por bombas; dropa CC |
| `3` | `TILE.LOCK_GATE` | PortÃ£o de Confinamento (Lockdown) | Bloco vermelho pulsante com estrias de aviso | Bloqueia portas durante combates |
| `4` | `TILE.HOLE` | Abismo / Cratera Aberta | Autotiling orgÃ¢nico escuro de 13 peÃ§as | IntransitÃ¡vel; elimina inimigos; reinicia Charlotte |
| `5` | `TILE.GOELA` | Duto Coletor SubterrÃ¢neo | Duto metÃ¡lico verde com anÃ©is pulsantes | TransitÃ¡vel; descarrega CC e PeÃ§as no cofre seguro |
| `6` | `TILE.SECRET_LADDER` | Escada de EmergÃªncia do Andar Inferior | Escada de ferro iluminada por lanterna | TransitÃ¡vel; retorna ao andar superior |
| `7` | `TILE.GAUNTLET_ITEM` | Pedestal de Upgrade da Manopla | Pedestal de latÃ£o com luva mecÃ¢nica ciano | Ao tocar, aprimora o nÃ­vel da Manopla |
| `8` | `TILE.INVENTOR_NPC` | NPC Inventor (Safe Room) | Inventor com terno de couro e Ã³culos ciano | Bloqueia passagem; oferece diÃ¡logos/lore |
| `9` | `TILE.ARMORY` | Mesa de Arsenal | Bancada de madeira com ferramentas e peÃ§as | Ao aproximar com recursos, abre a loja de melhorias |
| `10` | `TILE.BOSS_DOOR` | PortÃ£o Trancado da Sala do Chefe | Grade de ferro reforÃ§ada com emblema de caveira | Bloqueia passagem; requer a Chave do Boss |
| `11` | `TILE.BOSS_KEY` | Chave MecÃ¢nica do Chefe | CartÃ£o/chave magnÃ©tica dourada giratÃ³ria | ColetÃ¡vel ao toque; abre o portÃ£o do Boss |
| `12` | `TILE.CHEST` | BaÃº Seguro de Armazenamento | BaÃº de ferro reforÃ§ado com display de saldo | Exibe total de CC e PeÃ§as salvas permanentemente |
| `13` | `TILE.LAVA` | Fosso de Lava Incandescente | Magma fervente animado em tons laranja e rubro | IntransitÃ¡vel a pÃ©; transponÃ­vel via Dash ou PropulsÃ£o |
| `14` | `TILE.VAULT_CHEST` | Cofre de Recompensa de Puzzle Trancado | Cofre blindado dourado com engrenagens | Destrancado ao solucionar o puzzle da sala |
| `15` | `TILE.VAULT_CHEST_OPEN`| Cofre de Puzzle Aberto | Cofre com tampa erguida emitindo brilho | Permanece vazio apÃ³s coleta dos cristais |
| `16` | `TILE.PRESSURE_PLATE` | Placa de PressÃ£o de Puzzle | Laje mecÃ¢nica rebaixada com sensor ciano | Ativada ao pisar; mantÃ©m temporizador por alguns segundos |
| `17` | `TILE.SWITCH_TARGET` | Cristal Interruptor Elevado | Cristal ciano pulsante sobre pilastra | Ativado unicamente por detonaÃ§Ã£o direta de bomba |
| `18` | `TILE.DIRT` | ChÃ£o Batido / Terra OrgÃ¢nica | Textura de terra com autotiling de 8 bordas | TransitÃ¡vel; variaÃ§Ã£o estÃ©tica de bioma |

---

## 3. MecÃ¢nica de Lockdown (Trancamento de Sala)

### 3.1 Regras de AtivaÃ§Ã£o
- Ao entrar em qualquer sala inexplorada que contenha autÃ´matos vivos:
  - Todas as aberturas de portas centrais sÃ£o instantaneamente substituÃ­das por **PortÃµes de Lockdown** (`TILE.LOCK_GATE`).
  - O estado da sala muda para `isLockdown = true`.
  - Disparo de alarme sonoro caracterÃ­stico de trancamento mecÃ¢nico (`playLockdownSound`).
  - O banner superior no HUD exibe com animaÃ§Ã£o de pulso: `"LOCKDOWN! ELIMINE OS AUTÃ”MATOS"`.
  - A mÃºsica ambiente transita imediatamente da exploraÃ§Ã£o para o tema de combate tenso (`Locked_Gears_and_Steam.mp3`) via crossfade sonoro de 1.2 segundos.

### 3.2 ResoluÃ§Ã£o e Destrancamento
- O Lockdown Ã© mantido atÃ© que a contagem de autÃ´matos vivos na sala chegue a **zero**.
- Ao eliminar o Ãºltimo autÃ´mato:
  - Os portÃµes vermelhos voltam a ser aberturas transitÃ¡veis (`TILE.EMPTY`).
  - A sala Ã© marcada como liberada (`cleared = true`).
  - Efeito sonoro harmÃ´nico de desbloqueio em arpejo maior DÃ³-Mi-Sol (`playUnlockSound`).
  - O banner de Lockdown Ã© recolhido e um toast de `"SALA LIBERADA!"` Ã© exibido.
  - A mÃºsica ambiente realiza crossfade de volta para o tema sereno de exploraÃ§Ã£o (`The_Weight_of_Brass.mp3`).

---

## 4. Personagem JogÃ¡vel: Charlotte

### 4.1 CaracterÃ­sticas FÃ­sicas e Atributos
- **Raio de ColisÃ£o:** 16 pixels.
- **Velocidade Base de Caminhada:** 175 pixels/segundo.
- **FÃ­sica de ColisÃ£o:** ColisÃ£o contÃ­nua eixo a eixo (deslize suave em cantos de paredes e blocos).
- **Direcionamento e Olhar (Facing):**
  - Ao caminhar, Charlotte olha rigorosamente na direÃ§Ã£o do seu movimento.
  - Ao segurar para mirar uma bomba (clique e arraste), sua rotaÃ§Ã£o fixa dinamicamente na direÃ§Ã£o do arco de arremesso.
  - Espelhamento horizontal visual automÃ¡tico (`scale(-1, 1)`) ao se virar para a esquerda.
- **Invulnerabilidade:** Piscamento translÃºcido de 15 Hz durante perÃ­odos pÃ³s-transiÃ§Ã£o (0.6s), pÃ³s-dash (0.5s) ou pÃ³s-rebobinamento (1.8s).

### 4.2 Sprites e AnimaÃ§Ãµes Implementadas (`Img/charllote_spritesheet_64x64.png`)
Grid de spritesheet com cÃ©lulas de $64 \times 64$ pixels (10 frames por aÃ§Ã£o):
- **Linha 0 â€” Idle (Parada):** 10 frames a 8 FPS, respiraÃ§Ã£o sutil.
- **Linha 1 â€” Walk (Caminhada):** 10 frames a 10 FPS, passada com movimento de braÃ§os e jaleco.
- **Linha 3 â€” Dash / Recuo:** 10 frames a 14 FPS, postura aerodinÃ¢mica durante a propulsÃ£o.
- **Linha 4 â€” Throw / Arremesso:** 10 frames a 12 FPS (sustenta o frame 3 enquanto o jogador estiver mirando com a Manopla).
- **Fallback GrÃ¡fico:** Caso a imagem do sprite falhe ou nÃ£o tenha carregado, o jogo renderiza suavemente um avatar vetorial nÃ­tido (cÃ­rculo azul `#29b6f6` com Ã³culos de proteÃ§Ã£o brancos direcionais).

### 4.3 Botas Propulsoras e MecÃ¢nica de Dash
Adquiridas na Mesa de Arsenal da Safe Room, as **Botas Propulsoras** introduzem alta mobilidade evasiva ao jogo:
- **AtivaÃ§Ã£o:** Tecla <kbd>Shift</kbd> (Desktop) ou toque no botÃ£o ciano dedicado de Dash no painel mobile.
- **Custo Operacional:** Consome **1 Cristal Coal (CC)** por ativaÃ§Ã£o. Se Charlotte estiver com 0 CC, o dash nÃ£o Ã© disparado e um alerta Ã© exibido.
- **PropulsÃ£o e Invulnerabilidade:** Dispara Charlotte em alta velocidade na direÃ§Ã£o do movimento por 3 blocos de distÃ¢ncia, concedendo **0.5s de invulnerabilidade total (i-frames)** durante o trajeto.
- **Travessia de Perigos:** Permite voar sobre fossos de lava (`TILE.LAVA`) e abismos abertos (`TILE.HOLE`) sem cair.
- **Superaquecimento / Cooldown:** ApÃ³s o uso, as botas entram em resfriamento por **5.0 segundos**. Um contador regressivo em tempo real e overlay visual de recarga sÃ£o exibidos no botÃ£o mobile e no HUD.

---

## 5. Ferramentas, Bombas e a Manopla MecÃ¢nica

Charlotte nÃ£o possui ataques corporais diretos. Suas ferramentas sÃ£o arremessadas atravÃ©s de sua **Manopla MecÃ¢nica** especial acoplada ao braÃ§o direito.

### 5.1 Sistema de Mira e Arremesso BalÃ­stico
- **Arremesso TÃ¡tico (Clique e Arraste / Toque e Arraste):**
  - Ao clicar/tocar no Canvas e arrastar, uma trajetÃ³ria parabÃ³lica em arco pontilhado Ã© projetada em tempo real.
  - A cor da linha de mira corresponde ao tipo de bomba selecionada (Amarelo, Vermelho ou Ciano).
  - Um cÃ­rculo tracejado exibe o limite mÃ¡ximo do alcance da Manopla ao redor de Charlotte.
  - Se o cursor ultrapassar o alcance mÃ¡ximo, a mira trava no raio mÃ¡ximo com retÃ­culo de alerta vermelho.
  - Ao soltar o botÃ£o/toque, Charlotte assume a postura de arremesso e a bomba Ã© lanÃ§ada.
- **Arremesso RÃ¡pido Frontal:**
  - Pressionar a **Barra de EspaÃ§o** (Desktop) ou tocar no botÃ£o de **AÃ‡ÃƒO** (Mobile) dispara uma bomba Ã  frente na direÃ§Ã£o em que Charlotte estÃ¡ virada, a uma distÃ¢ncia padrÃ£o segura de 2.5 blocos.
- **Arremesso RÃ¡pido no Cursor (BotÃ£o Direito do Mouse):**
  - No PC, clicar com o botÃ£o direito do mouse lanÃ§a instantaneamente a bomba na coordenada do cursor, respeitando o raio da manopla.
- **FÃ­sica da Bomba em Voo (`FlyingBomb`):**
  - DuraÃ§Ã£o de voo: 0.32 segundos.
  - ElevaÃ§Ã£o parabÃ³lica simulada em Z: arco de atÃ© 45 pixels de altura.
  - RotaÃ§Ã£o dinÃ¢mica em torno do prÃ³prio eixo durante o voo.
  - Sombra projetada no chÃ£o que encolhe conforme a bomba ganha altitude e expande ao aterrissar.

### 5.2 NÃ­veis de Aprimoramento da Manopla MecÃ¢nica
O alcance do arremesso pode ser aprimorado encontrando pedestais de upgrade (`TILE.GAUNTLET_ITEM`), comprando na Mesa de Arsenal ou usando a tecla `[U]` de debug:
- **NÃ­vel 1 (Inicial):** Alcance de **140 pixels** (~3.5 blocos).
- **NÃ­vel 2:** Alcance de **220 pixels** (~5.5 blocos).
- **NÃ­vel 3 (MÃXIMO):** Alcance de **300 pixels** (~7.5 blocos â€” metade exata do mapa).
- *Feedback de Upgrade:* Fanfarra melÃ³dica de 5 notas ascendentes (`playUpgradeFanfare`), explosÃ£o de faÃ­scas douradas e cianas sobre Charlotte e notificaÃ§Ã£o em toast.

### 5.3 Sistema de MuniÃ§Ã£o e Recarga Passiva
- Charlotte carrega um estoque mÃ¡ximo base de **5 Bombas Temporizadas** (expansÃ­vel atÃ© 9 com a Bolsa do Arsenal).
- O estoque Ã© exibido no botÃ£o mobile e no HUD superior `TEMP (X)`.
- Se as bombas estiverem esgotadas, um aviso sonoro e toast alertam: `"SEM BOMBAS! AGUARDE RECARGA..."`.
- **Recarga Passiva:** A cada 3.0 segundos sem disparar no limite, 1 bomba Ã© reabastecida automaticamente.

### 5.4 Tipos de Bombas Implementadas

| Bomba | Representação Visual | Efeito Imediato | Dano | Raio de Ação | Efeito no Chão / Ambiente |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bomba a Vapor Temporizada** | Quadrado Amarelo com display digital | Fica no chão piscando por 3.0s; beeps sonoros aceleram antes de explodir | **2 HP** (Cruz) + Dano de estilhaço | Cruz de 2 blocos (5 blocos de extensão) | **Efeito Chain:** 45% de chance de ejetar 1 a 2 estilhaços aleatórios de pedra ou ferro (conforme bioma/andar) que causam dano dinâmico. Apenas uma fração vira obstáculo permanente (teto máx. de 3 na sala) para manter a fluidez de movimentação. **Destruição:** A explosão em cruz destrói instantaneamente estilhaços e rochas no raio. |
| **Bomba de Percussão (Impacto)** | Quadrado Vermelho pequeno com contorno branco | Explode instantaneamente no momento da aterrissagem | **1 HP** + repulsão | Círculo de 1.5 blocos ($3 \times 3$) | Destrói blocos quebráveis, destrói instantaneamente estilhaços de pedra/ferro (1 HP) ou trinca rochas do boss, e abre o bueiro de descida. |
| **Bomba de Vórtice Magnético** | Esfera Ciano/Violeta com núcleo de singularidade giratório | Cria campo de sucção gravitacional ativo por 2.0 segundos | **1 HP base + 1.5 HP por estilhaço absorvido** (Implosão final) | Sucção de 4.2 blocos; Implosão de 2.2 blocos | Puxa autômatos, itens e **suga estilhaços/rochas** do chão; ao implodir, pulveriza obstáculos restantes e esmaga o epicentro com dano devastador acumulado. |

> [!NOTE]
> **Destruição de Estilhaços e Obstáculos de Mapa:**
> - **Por Bombas:** Qualquer explosão de bomba (Impacto, Temporizada, Vórtice ou bombas lançadas por artilheiros inimigos) destrói estilhaços no seu raio de ação.
> - **Por Avanços dos Autômatos:** 
>   - **Investida do Perfurador (`Charger`)**: Atravessa e esmaga (`ESMAGADO!`) qualquer estilhaço ou rocha em seu caminho.
>   - **Investida Titânica e Estrondo Sísmico do Chefe Final (`Goliath / Boss`)**: Pulveriza estilhaços e rochas da arena.
>   - **Avanço de Perseguição (`Chase`)**: Autômatos comuns quebrando estilhaços de pedra para desobstruir caminho.

---

## 6. Verticalidade e Andares Mais Profundos da Mina

### 6.1 O Nodo Secreto de Piso / Bueiro de TransiÃ§Ã£o
- Em cada nÃ­vel gerado, exatamente **uma sala** da mina (nÃ£o-inicial, sem Goela e sem puzzle) abriga o ponto de descida vertical.
- **Visual do Bueiro MetÃ¡lico:** Baseado na linha 7 do spritesheet `Img/chao_mina1-3.png`.
- **Etapas de Abertura:**
  1. O bueiro comeÃ§a fechado e trancado com anÃ©is de ferro fundido.
  2. Ao receber o impacto de uma explosÃ£o pesada (Temporizada ou PercussÃ£o), a trava mecÃ¢nica quebra e a tampa treme emitindo partÃ­culas de poeira e som de metal retorcido (`playFloorCrumble`).
  3. A escotilha se abre por completo revelando a passagem profunda com fluxo de vapor e iluminaÃ§Ã£o ciano indicando descida `â–¼`.
- **Descida de NÃ­vel:** Ao pisar sobre a escotilha aberta, Charlotte desce para a profundidade seguinte (`nextDepth = currentDepth + 1`).

### 6.2 Escalonamento de Dificuldade por Profundidade (`Depth`)
A descida a andares mais fundos altera a ecologia da mina procedural:
- **Quantidade de Inimigos:**
  - NÃ­vel 1: 1 a 2 autÃ´matos por sala de combate.
  - NÃ­vel 2: 2 a 3 autÃ´matos por sala.
  - NÃ­vel 3+: 2 a 4 autÃ´matos por sala.
- **Taxa de Drop de Recursos:** A chance de obter CC ao quebrar caixas aumenta de 50% (NÃ­vel 1) para atÃ© 85% (NÃ­veis 3+). Inimigos derrotados dropam de 1 a 3 PeÃ§as MecÃ¢nicas conforme a profundidade.
- **Comportamento dos Inimigos:** Inimigos ganham atÃ© +45 px/s de velocidade de perseguiÃ§Ã£o e tÃªm o tempo de retardo de reaÃ§Ã£o reduzido de 0.65s para 0.38s.

---

## 7. Inimigos e Chefes MecÃ¢nicos (IA e Tiers)

### 7.1 MÃ¡quina de Estados da IA (`Automaton`)
A IA dos autÃ´matos Ã© estruturada em 4 estados orgÃ¢nicos:
1. **`dormant` (CarÃªncia de InicializaÃ§Ã£o):** Ativado nos primeiros 1.2s ao entrar na sala. Fica acinzentado com nÃºcleo Ã³tico apagado e `"zzz"`. NÃ£o causa dano ao contato.
2. **`idle` (Patrulha Passiva):** Deslocamento lento (36 px/s) em direÃ§Ãµes ortogonais com pausas naturais.
3. **`alert` (Alerta com Retardo):** Ao avistar Charlotte dentro de 4.5 blocos, emite balÃ£o de exclamaÃ§Ã£o `!` e som de sirene (`playEnemyAlert`), pausando por 0.65s a 0.38s antes da perseguiÃ§Ã£o.
4. **`chase` (PerseguiÃ§Ã£o Ativa com Desvio de ObstÃ¡culos):** AvanÃ§a com velocidade calibrada em direÃ§Ã£o a Charlotte, desviando de pilares e paredes indestrutÃ­veis. Se Charlotte se afastar mais de 6 blocos, retorna para `idle`.

### 7.2 Tiers de Autômatos por Nível de Profundidade
- **Tier 1 — Autômato de Cobre Comum (Nível 1):** Vermelho Carmim (`#c62828`), **1 HP** (destruído por qualquer golpe).
- **Tier 2 — Autômato Charger Perfurador (Nível 2):**
  - **Ataque em Linha Reta:** Trava mira em Charlotte e executa investida veloz destruindo caixas e paredes internas no caminho.
  - **Sem Blindagem no Nível 2:** Carcaça enferrujada direta de 1 HP (sem escudo protetor).
  - **Linha Telegráfica de Ataque:** Durante a preparação (windup), projeta uma linha no chão indicando **para onde** vai investir (trajetória e retículo de impacto na parede) e **quando** vai atacar (feixe de energia progressivo e pulsante).
- **Tier 3 — Charger Blindado e Titãs Mecânicos (Nível 3+):**
  - **Blindagem Dourada Ativa (`hasArmor`):** A partir do Nível 3, o Charger recebe escudo de blindagem que absorve a primeira explosão de Bomba Temporizada ou bloqueia Bombas de Impacto.
  - Mantém o ataque em linha reta com a linha telegráfica de aviso.
- **Tier 4 e 5 — Autômatos de Elite (Níveis 4 e 5):** **2 a 6 HP**, carcaça resistente, velocidade elevada e ataques especializados.

### 7.3 InteraÃ§Ã£o com o CenÃ¡rio e Dano
- Ao sofrer dano, pisca em branco por 0.25s e exibe nÃºmeros de dano flutuantes (`-1 HP`, `-2 HP`).
- Sofre recuo fÃ­sico proporcional ao impacto da explosÃ£o.
- **EliminaÃ§Ã£o por Abismos:** Se for empurrado para um tile de `TILE.HOLE`, cai no vÃ¡cuo e Ã© destruÃ­do instantaneamente.

### 7.4 Chefe Humano: Mini-Boss e Chefe Final da Mina (`HumanBoss`)
AlÃ©m dos autÃ´matos a vapor, Charlotte encontra engenheiros humanos rivais equipados com seu prÃ³prio arsenal de bombas alquÃ­micas e botas propulsoras:

- **Mini-Boss â€” O Engenheiro Rival (NÃ­veis 3 e 4):**
  - **Arena Isolada Dedicada (`isMiniBossRoom`):** NÃ£o spawna mais aleatoriamente entre autÃ´matos comuns; habita exclusivamente uma arena prÃ³pria de duelo 1v1 gerada em pontas de caminho (*dead-ends*).
  - **Espelhamento FÃ­sico e Visual de Charlotte:**
    - Possui as mesmas dimensÃµes de Charlotte (raio fÃ­sico de 16px).
    - Renderizado utilizando o spritesheet original de Charlotte (`Img/charllote_spritesheet_64x64.png`) com animaÃ§Ãµes completas de *idle*, *walk*, *throw* e *dash*, aplicado com um filtro alquÃ­mico contrastante em tom carmim/rubro renegado (`hue-rotate(160deg) saturate(2.5)`).
    - Exibe barra de vida dinÃ¢mica e identificador visual flutuante (`ENGENHEIRO RIVAL`) acima da cabeÃ§a.
  - **Atributos de Combate:** **3 HP**, velocidade de corrida de 150 px/s e 0.35s de invulnerabilidade ao sofrer dano (com efeito visual de flash estroboscÃ³pico).
  - **IA de Posicionamento e EspaÃ§amento TÃ¡tico (Kiting & Strafing):**
    - MantÃ©m distÃ¢ncia ideal de 3 a 5 blocos em relaÃ§Ã£o a Charlotte.
    - Circula lateralmente (*strafe* contÃ­nuo com alternÃ¢ncia periÃ³dica) e recua ativamente caso Charlotte se aproxime a menos de 2.8 blocos.
    - AvanÃ§a estrategicamente caso a distÃ¢ncia exceda 5.2 blocos.
  - **Botas Propulsoras com Dash e I-Frames:**
    - Monitora o campo em tempo real: caso detecte uma bomba temporizada a menos de 3.2 blocos ou seja encurralado (< 1.8 blocos), dispara um **Dash a vapor a 460 px/s** em vetor de fuga oposto ao perigo.
    - Concede 0.45s de invulnerabilidade total (*i-frames*), emitindo partÃ­culas ciano e som de vapor de alta pressÃ£o (`playPropulsorSteam`).
    - Tempo de recarga do dash: 4.5s.
  - **Arremesso BalÃ­stico com Arsenal Triplo:**
    - Dispara bombas em arremesso parabÃ³lico (`FlyingBomb`) com cÃ¡lculo preditivo de trajetÃ³ria (*lead target*) baseado na movimentaÃ§Ã£o e direÃ§Ã£o de Charlotte.
    - Alterna dinamicamente seu arsenal: **Bomba de PropulsÃ£o** a curta distÃ¢ncia (para repelir Charlotte), e **Bomba de Impacto (60%)** ou **Bomba Temporizada (40%)** a mÃ©dia/longa distÃ¢ncia.
  - **ColisÃ£o FÃ­sica sem Morte por Contato (PreservaÃ§Ã£o do Duelo):**
    - Ao encostar fisicamente em Charlotte, **NÃƒO** causa dano por toque zumbi nem ativa o rebobinamento temporal instantÃ¢neo.
    - Em vez disso, ambos sofrem uma **repulsÃ£o elÃ¡stica recÃ­proca** (impulso de choque), faÃ­scas ciano, som de impacto metÃ¡lico e aviso "AFASTE-SE!", garantindo que o embate seja resolvido puramente por tÃ¡tica e explosÃµes de bombas.
  - **Recompensa de VitÃ³ria:** Ao ser derrotado, dropa 5 Cristais Coal e concede +5 PeÃ§as MecÃ¢nicas na bolsa de Charlotte.

- **Chefe Final da Mina â€” O Engenheiro Mestre (NÃ­vel 5):**
  - Encontrado exclusivamente na Sala do Boss (`isBossRoom`), acessada apÃ³s abrir a Porta do Boss com a Chave MecÃ¢nica.
  - CarcaÃ§a reforÃ§ada de cor escarlate escuro com **5 HP**, velocidade aumentada para 165 px/s e cooldown de dash reduzido para 3.5s.
  - Barra de vida e identificador no topo: `CHEFE MESTRE`.
  - CadÃªncia de bombas acelerada (cooldown de 1.8s a 2.6s), combinando bombardeio contÃ­nuo e evasÃ£o de alta precisÃ£o.

---

## 8. Economia: Cristal Coal (CC), PeÃ§as e Arsenal

### 8.1 Cristal Coal (CC)
- CombustÃ­vel azul reluzente lapidado obtido ao explodir caixas de minÃ©rio (`TILE.BREAKABLE`) ou abrir cofres de salas de puzzle.
- Possui **magnetismo orgÃ¢nico**, sendo puxado em aceleraÃ§Ã£o para Charlotte a menos de 58px.
- Utilizado como moeda permanente para melhorias na oficina e como combustÃ­vel volÃ¡til imediato para as Botas Propulsoras (1 CC por Dash).

### 8.2 PeÃ§as MecÃ¢nicas (Parts / Engrenagens)
- Engrenagens prateadas deixadas para trÃ¡s exclusivamente ao derrotar autÃ´matos hostis e chefes.
- Coletadas ao toque com feedback sonoro metÃ¡lico.
- Essenciais para destravar a Mesa de Arsenal e forjar aprimoramentos industriais.

### 8.3 A Goela (Duto Coletor Permanente)
- Duto tubular subterrÃ¢neo presente em pelo menos 1 a cada 3 salas geradas.
- Charlotte descarrega instantaneamente todo o Cristal Coal e PeÃ§as MecÃ¢nicas volÃ¡teis da bolsa ao pisar na Goela.
- Os recursos sÃ£o transferidos em seguranÃ§a para o inventÃ¡rio do cofre (`depositedCores` e `depositedParts`).

### 8.4 Baú da Safe Room (`TILE.CHEST`)
- Localizado no canto inferior direito da Safe Room do Nível 1.
- Exibe em texto flutuante em tempo real o saldo de recursos guardados: `BAÚ: X CC | Y PEÇAS`.
- **Interação por Proximidade e Grade de Armazenamento (Grid):**
  - Ao chegar perto do baú, uma interface com grade de inventário (grid) abre automaticamente exibindo tudo o que está guardado: Cristal Coal (CC), Peças Mecânicas, Pistão Hidráulico, Núcleo a Vapor, Cartão de Acesso do Supervisor e Projetos Desbloqueados.
  - Permite inspecionar cada item em detalhes (nome, categoria, descrição e quantidade).
  - Inclui botão para descarregar recursos voláteis trazidos da mochila diretamente para o baú.
  - Ao se afastar do baú ou pressionar <kbd>ESC</kbd> / Botão Fechar, o grid fecha automaticamente.
- Permite que o jogador visualize a poupança acumulada entre expedições.

### 8.5 Mesa de Arsenal (`TILE.ARMORY`) e Ãrvore de Upgrades
Localizada no canto superior direito da Safe Room, permite que Charlotte fabrique melhorias permanentes:
- **Desbloqueio da Bancada:** Exige **10 CC + 10 PeÃ§as**. Ao pagar, a bancada Ã© destravada permanentemente com faÃ­scas douradas.
- **Upgrades DisponÃ­veis:**
  1. **Aprimoramento da Manopla MecÃ¢nica:** Aumenta o alcance mÃ¡ximo de arremesso de 140px $\to$ 220px $\to$ 300px (NÃ­vel MÃ¡ximo 3).
  2. **Botas Propulsoras (Dash):** Destrava a habilidade de Dash com <kbd>Shift</kbd> / BotÃ£o Mobile.
  3. **Bolsa Expandida de Ferramentas:** Eleva a capacidade mÃ¡xima de bombas de 5 para 7 e 10 unidades.
  4. **Bomba-RelÃ³gio NÃ­vel 2:** (Custo: 20 CC + 18 PeÃ§as) â€” Reação em Cadeia (detona ao sofrer impacto de outras explosÃµes).
  5. **Bomba de Impacto NÃ­vel 2 (ReaÃ§Ã£o CatalÃ­tica):** (Custo: 25 CC + 20 PeÃ§as) â€” Absorve Cristais Coal no raio da explosÃ£o, expandindo o raio em +10% por cristal consumido. Permite arremessar Cristais Coal com <kbd>C</kbd> ou botÃ£o mobile.
  6. **Bomba de VÃ³rtice NÃ­vel 2 (EjeÃ§Ã£o de Sucata em X):** (Custo: 30 CC + 25 PeÃ§as) â€” Tritura os autÃ´matos sugados e dispara suas carcaÃ§as nas 4 diagonais (em X), atingindo e repelindo autÃ´matos fora do centro.
- **MecÃ¢nica AlquÃ­mica de Cura do VÃ³rtice (Qualquer NÃ­vel):**
  - Ao puxar Cristais Coal para o centro da singularidade, a compressÃ£o gravitacional funde o minÃ©rio em Cristais Vitais que recuperam **+0.5 â¤ï¸** ao serem coletados.
- **Desbloqueio Independente no Inventor:**
  - Charlotte pode adquirir a Bomba de VÃ³rtice no Inventor assim que possuir 25 CC e 20 PeÃ§as, sem exigir a Bomba de Impacto previamente.

---

## 9. MecÃ¢nica de Morte: Rebobinar o Tempo (Time Rewind)

No universo de RogueBomb, Charlotte nÃ£o morre: seu maquinÃ¡rio temporal de bolso rebobina o espaÃ§o-tempo ao sofrer uma avaria crÃ­tica.

### 9.1 CondiÃ§Ãµes de Disparo
1. Contato fÃ­sico direto com qualquer autÃ´mato ou chefe em estado ativo (fora da carÃªncia `dormant`), com temporizador de invulnerabilidade zerado.
2. Queda em um abismo aberto (`TILE.HOLE`) ou pisar em poÃ§a de lava sem o escudo de invulnerabilidade do Dash.

### 9.2 SequÃªncia de Rebobinamento
1. **SFX de Glitch:** Som agudo de fita analÃ³gica rebobinando em aceleraÃ§Ã£o exponencial (`playRewindGlitch`).
2. **VFX de Glitch Temporal:** AberraÃ§Ã£o cromÃ¡tica em faixas horizontais ciano e magenta.
3. **Toast Central:** `"TEMPO REBOBINADO: NOVO MAPA GERADO!"`.
4. **Reset de Estado:**
   - Charlotte Ã© teletransportada para a Safe Room inicial.
   - Recursos volÃ¡teis nÃ£o depositados (CC e PeÃ§as) na bolsa sÃ£o perdidos.
   - Saldo depositado na Goela e guardado no BaÃº permanece intacto.
   - Charlotte recebe **1.8 segundos de invulnerabilidade total**.
   - **Novo Mapa Gerado:** Um novo labirinto procedural de 10 salas Ã© construÃ­do instantaneamente.
5. **Comando de Debug:** Tecla `[R]` no teclado permite acionar o rebobinamento manualmente para testes.

---

## 10. Design de Ãudio (Web Audio API e BGM Adaptativa)

### 10.1 Trilha Sonora Adaptativa (BGM)
- **Modo ExploraÃ§Ã£o:** `song/The_Weight_of_Brass.mp3` â€” Trilha misteriosa com metais e percussÃ£o de engrenagens para exploraÃ§Ã£o livre.
- **Modo Combate (Lockdown):** `song/Locked_Gears_and_Steam.mp3` â€” Ritmo mecÃ¢nico acelerado e opressivo para momentos de trancamento.
- **Crossfade Suave:** TransiÃ§Ã£o matemÃ¡tica contÃ­nua entre as faixas em 1.2 segundos (30 passos lineares de atenuaÃ§Ã£o/ganho).

### 10.2 Efeitos Sonoros Sintetizados Proceduralmente (Web Audio API)
Sons 100% sintetizados via cÃ³digo matemÃ¡tico, sem dependÃªncia de assets de Ã¡udio para SFX:
- `playImpactExplosion()`: RuÃ­do branco com filtro passa-baixas exponencial (600 Hz $\to$ 80 Hz).
- `playPropulsorSteam()`: RuÃ­do com filtro passa-faixa sibilante Q=3.0 (1400 Hz $\to$ 300 Hz).
- `playTimedBeep(pitchMult)`: Onda senoidal pura em 700 Hz com aceleraÃ§Ã£o de frequÃªncia.
- `playBigTimedExplosion()`: Oscilador triangular sub-grave (140 Hz $\to$ 30 Hz) + explosÃ£o de ruÃ­do passa-baixas.
- `playLockdownSound()`: Onda dente-de-serra modulada descendente (220 Hz $\to$ 180 Hz).
- `playUnlockSound()`: Acorde arpejado maior senoidal lÃ­mpido (DÃ³5, Mi5, Sol5).
- `playRewindGlitch()`: Varredura de onda quadrada exponencial rÃ¡pida (120 Hz $\to$ 950 Hz).
- `playChuteDeposit()`: Varredura harmÃ´nica triangular (320 Hz $\to$ 640 Hz).
- `playThrowWhoosh()`: ModulaÃ§Ã£o senoidal curta de corte de vento.
- `playUpgradeFanfare()`: Fanfarra melÃ³dica de 5 notas (Mi4, LÃ¡4, DÃ³#5, Mi5, LÃ¡5).
- `playEnemyAlert()`: Sirene rÃ¡pida dente-de-serra (380 Hz $\to$ 760 Hz).
- `playCCPickup()`: Duas notas senoidais agudas em sino (880 Hz e 1318.5 Hz).
- `playFloorCrumble()`: RessonÃ¢ncia sub-grave triangular simulando desmoronamento de rocha e ferro.

---

## 11. Interface de UsuÃ¡rio (HUD) e Controles HÃ­bridos

### 11.1 HUD Superior e InformaÃ§Ãµes em Tela
- **Status da Sala (Canto Superior Esquerdo):** Exibe `NÃVEL X â€¢ SALA [rx, ry]` (ou `SALA DO CHEFE ðŸ’€` / `ARENA DO RIVAL âš”ï¸` / `CÃ‚MARA DE DESAFIO ðŸ’Ž` / `ANDAR SECRETO`) e contagem dinÃ¢mica `INIMIGOS: X` (verde em paz; vermelho em combate).
- **Badge da Manopla MecÃ¢nica (Centro-Esquerda):** Ãcone ðŸ¥Š com nÃ­vel atual (`NV. 1`, `NV. 2`, `NV. 3 MAX`), clicÃ¡vel diretamente para aprimoramento.
- **Badges de Economia (Centro-Direita):**
  - Ãcone de diamante ðŸ’Ž com o total de Cristal Coal na bolsa (`X CC`).
  - Ãcone de engrenagem âš™ï¸ com o total de PeÃ§as MecÃ¢nicas na bolsa (`Y P`).
- **Minimapa Procedural (Canto Superior Direito):**
  - Canvas de $70 \times 70$ pixels mapeando as salas:
    - **Azul Claro:** Sala atual de Charlotte.
    - **Cinza Chumbo:** Salas visitadas e limpas.
    - **Vermelho:** Salas de combate comuns com autÃ´matos vivos.
    - **Magenta / Rosa Vivo (`#e91e63`):** Arena do Mini-Boss (Engenheiro Rival isolado).
    - **Dourado Radiante (`#ffb300`):** CÃ¢mara de Desafio / Puzzle Metroidvania.
    - **Ponto Verde:** Sala que abriga a Goela de depÃ³sito.
    - **Ponto Amarelo:** Sala que contÃ©m a chave do Boss ou cofre de puzzle.
    - **Ãcone de Caveira:** Sala do Chefe Final.
- **Banner de Lockdown:** Faixa vermelha animada no topo da tela durante o confinamento (`DUELO! DERROTE O ENGENHEIRO RIVAL!`, `CONFRONTO FINAL! CHEFE MESTRE!` ou `LOCKDOWN ATIVADO!`).
- **Feedbacks Flutuantes:** Danos (`-1 HP`), coleta de recursos (`+1 CC`, `+1 P`), depÃ³sitos, repulsÃ£o (`AFASTE-SE!`), evasÃ£o (`DASH!`, `ESQUIVOU!`) e notificaÃ§Ãµes de toast centrais.

### 11.2 Mapeamento de Controles Desktop
- **MovimentaÃ§Ã£o:** Teclas <kbd>W</kbd>, <kbd>A</kbd>, <kbd>S</kbd>, <kbd>D</kbd> ou <kbd>Setas Direcionais</kbd> (movimento ortogonal e diagonal normalizado).
- **Mira e Arremesso BalÃ­stico:** Clicar e arrastar com o botÃ£o esquerdo do mouse para traÃ§ar o arco; soltar para lanÃ§ar.
- **Arremesso RÃ¡pido no Cursor:** BotÃ£o direito do mouse.
- **Arremesso Frontal:** Barra de <kbd>ESPAÃ‡O</kbd>.
- **Dash (Botas Propulsoras):** Tecla <kbd>Shift</kbd> (Consome 1 CC, 0.5s de invulnerabilidade, resfriamento de 5.0s).
- **SeleÃ§Ã£o de Ferramentas:** Teclas <kbd>1</kbd> (Impacto), <kbd>2</kbd> (Propulsor), <kbd>3</kbd> (Temporizada) ou <kbd>Scroll do Mouse</kbd>.
- **Aprimorar Manopla:** Tecla <kbd>U</kbd> ou clique no badge do HUD.
- **Atalhos de Tester (Debug):**
  - <kbd>Ctrl</kbd> + <kbd>Y</kbd>: +10 CC e +10 PeÃ§as.
  - <kbd>Ctrl</kbd> + <kbd>U</kbd>: Revela no minimapa e no chÃ£o a saÃ­da secreta para o prÃ³ximo nÃ­vel.
  - <kbd>R</kbd>: Rebobina o tempo instantaneamente.

### 11.3 Mapeamento de Controles Mobile (Touch)
- **Joystick AnalÃ³gico Virtual DinÃ¢mico (Inferior Esquerdo):** DetecÃ§Ã£o 360Â° suave via Pointer Events com retorno automÃ¡tico ao centro.
- **Painel de AÃ§Ãµes (Inferior Direito):**
  - **BotÃ£o Principal de AÃ§Ã£o:** Disparo frontal da ferramenta selecionada.
  - **BotÃ£o de Dash Ciano (`#dash-trigger`):** Aciona as Botas Propulsoras; possui indicador de custo (1 CC), overlay de recarga regressivo durante o resfriamento de 5.0s e estado bloqueado caso ainda nÃ£o adquirido.
  - **Seletores de Ferramentas:** 3 botÃµes dedicados com cores e contadores de muniÃ§Ã£o para troca Ã¡gil de bombas.

---

## 12. Tabela Comparativa: GDD Original (PDF) vs. ProtÃ³tipo Implementado

| Requisito do Documento Original (PDF) | SituaÃ§Ã£o no CÃ³digo Atual | Detalhes da ImplementaÃ§Ã£o / ExpansÃ£o |
| :--- | :---: | :--- |
| **Engine Vanilla (HTML/CSS/JS + Canvas API)** | âœ… **Completo** | Jogo 100% contido em arquitetura modular limpa e comentada sem bibliotecas externas |
| **Controles HÃ­bridos (PC + Mobile)** | âœ… **Completo** | Suporte simultÃ¢neo a teclado, mouse com clique-e-arraste, joystick touch 360Â° e botÃµes ergonÃ´micos |
| **Grid 15x15 e Salas Modulares** | âœ… **Completo** | Grid de 15x15 blocos (40px/tile = 600x600px), 1 sala renderizada por vez para alta performance |
| **Matriz Procedural de Salas** | âœ… **Expandido** | Matriz 5x5 com 10 salas ramificadas, minimapa no HUD com cÃ³digos de status e portas ortogonais centrais |
| **TransiÃ§Ã£o com Fade Out / Fade In** | âœ… **Completo** | TransiÃ§Ã£o suave de tela preta (fade 1.2s), reposicionamento na borda oposta e carÃªncia de proteÃ§Ã£o |
| **Regra da Goela (1 a cada 3 salas)** | âœ… **Completo** | Pelo menos 1 Goela a cada 3 salas; sistema bancÃ¡rio de depÃ³sito de Cristal Coal e PeÃ§as |
| **Placeholders vs Arte Final** | âœ… **Expandido** | Spritesheet de Charlotte (64x64), Spritesheet da Mina (192x192 e 384x384), caixas e autÃ´matos detalhados |
| **MecÃ¢nica de Lockdown** | âœ… **Completo** | Portas viram blocos vermelhos pulsantes, alerta no HUD, troca adaptativa de mÃºsica e liberaÃ§Ã£o ao zerar inimigos |
| **Bomba de Impacto (PercussÃ£o)** | âœ… **Completo** | DetonaÃ§Ã£o imediata ao pousar, raio de 1.5 blocos, quebra caixas e causa 1 de dano com repulsÃ£o |
| **Bomba de Vapor Propulsor** | âœ… **Completo** | Sem dano direto, aplica dash de 3 blocos em Charlotte e empurra autÃ´matos para dentro de abismos |
| **Bomba a Vapor Temporizada** | âœ… **Completo** | Timer de 3 segundos com beeps acelerados, explosÃ£o em cruz de 2 blocos, 2 de dano e quebra caixas/bueiros |
| **Regra de Verticalidade (Andar Inferior)** | âœ… **Expandido** | **Bueiro / Escotilha de Ferro** animado em 3 fases que se abre apÃ³s explosÃ£o para descer de profundidade (`Depth`) |
| **Comportamento dos Inimigos (AutÃ´matos)** | âœ… **Expandido** | IA com 4 estados (Dormant, Idle, Alert, Chase) com 3 Tiers (Comum 1 HP, Blindado 2 HP e TitÃ£ 3+ HP) |
| **Rebobinar o Tempo (Time Rewind)** | âœ… **Completo** | SFX de glitch analÃ³gico, tela com aberraÃ§Ã£o cromÃ¡tica, novo mapa gerado e retorno Ã  Safe Room preservando recursos da Goela |
| **Design de Som e MÃºsica Adaptativa** | ðŸŒŸ **Completo** | BGM adaptativa dupla com crossfade de 1.2s (ExploraÃ§Ã£o/Combate) e 13 SFX sintetizados proceduralmente |
| **Manopla MecÃ¢nica com Upgrades** | âœ¨ **Completo** | Alcance de arremesso em 3 nÃ­veis (140px, 220px, 300px), comprado na Mesa de Arsenal |
| **Botas Propulsoras (Dash)** | âœ¨ **Completo** | Dash veloz com invulnerabilidade (0.5s), consome 1 CC, resfriamento de 5s e botÃ£o dedicado mobile |
| **Salas de Desafio / Puzzles Metroidvania** | âœ¨ **Novo no MVP** | 1 sala por andar: Cofre Temporizado (NÃ­vel 1), Fosso de Lava (NÃ­vel 2) e Cristal Elevado (NÃ­vel 3+) |
| **Sistema de Autotiling dos Abismos** | âœ¨ **Novo no MVP** | Clusters orgÃ¢nicos de abismo com 13 peÃ§as de autotiling, Safe Zone de portas e eliminaÃ§Ã£o instantÃ¢nea de inimigos |
| **Trilhos Procedurais Look-Ahead** | âœ¨ **Novo no MVP** | Trilhos pelas salas com algoritmo preditivo de encaixe visual perfeito de curvas e retas |
| **Bioma de Terra Batida (`TILE.DIRT`)** | âœ¨ **Novo no MVP** | PoÃ§as orgÃ¢nicas de terra batida com 8 peÃ§as de transiÃ§Ã£o com o chÃ£o de pedra |
| **Safe Room TemÃ¡tica Completa** | âœ¨ **Completo** | NPC Inventor, Mesa de Arsenal e BaÃº de recursos guardados |
| **Loja na Mesa de Arsenal** | âœ¨ **Completo** | Desbloqueio e melhorias pagas com CC e PeÃ§as depositadas (Manopla, Botas e Bolsa de Bombas) |
| **Inimigos e Drop de PeÃ§as MecÃ¢nicas** | âœ¨ **Completo** | Inimigos dropam PeÃ§as (engrenagens prateadas) alÃ©m do CC das caixas, escalando com a profundidade |
| **Mini-Boss: Arena Isolada & IA Charlotte (NÃ­veis 3 e 4)** | âœ¨ **Completo** | Sala exclusiva 1v1 com 4 pilares, IA com kiting, strafe, dash com i-frames, arsenal de 3 bombas, colisÃ£o elÃ¡stica sem toque zumbi e spritesheet da Charlotte em rubro |
| **Chefe Final da Mina e Chave (NÃ­vel 5)** | âœ¨ **Completo** | Sala do Boss trancada com PortÃ£o de Caveira, Chave do Boss em sala secundÃ¡ria e Chefe Mestre com 5 HP, mira laser e fuga com dash |
| **Dica de SaÃ­da (Ctrl+U)** | âœ¨ **Completo** | Revela no minimapa e no chÃ£o a posiÃ§Ã£o da sala de saÃ­da e do bueiro para o prÃ³ximo nÃ­vel |

---

## 13. Roteiro e Backlog para PrÃ³ximas AtualizaÃ§Ãµes (PÃ³s-MVP)

Com a entrega bem-sucedida do loop de jogo completo, mecÃ¢nicas de puzzle, autotiling e chefe final do 5Âº nÃ­vel, os prÃ³ximos passos planejados para versÃµes subsequentes incluem:

1. **PersistÃªncia de Dados e Salvamento Local (`localStorage`):**
   - Salvar o progresso das compras da Mesa de Arsenal (Manopla, Botas e Bolsa) e os recursos depositados no BaÃº entre sessÃµes do navegador.
2. **Novos Tipos de Ferramentas / Bombas AlquÃ­micas:**
   - **Bomba de Ã“leo Escorregadio:** Cria poÃ§as que reduzem drasticamente a traÃ§Ã£o dos autÃ´matos, fazendo-os deslizar descontrolados para dentro de abismos.
   - **Bomba CriogÃªnica a Vapor:** Congela temporariamente autÃ´matos e solidifica poÃ§as de lava em plataformas transitÃ¡veis de basalto.
3. **MecÃ¢nica de Empurrar Blocos e EstÃ¡tuas Pesadas:**
   - Possibilidade de Charlotte usar a repulsÃ£o da Bomba de PropulsÃ£o para deslocar blocos maciÃ§os sobre placas de pressÃ£o permanentes ou formar pontes sobre abismos estreitos.
4. **VariaÃ§Ãµes de Biomas SubterrÃ¢neos:**
   - **NÃ­veis 1-2:** Mina de CarvÃ£o e Engrenagens (tijolo cinza e terra batida).
   - **NÃ­veis 3-4:** FundiÃ§Ã£o de Bronze e TubulaÃ§Ãµes de Vapor Quente (fendas de lava e tubos enferrujados).
   - **NÃ­vel 5:** SantuÃ¡rio Central da Forja MecÃ¢nica (arena monumental do Chefe Final).

