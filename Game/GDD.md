# Game Design Document (GDD) — RogueBomb
**Versão:** 2.1 (Documentação Completa do MVP / Protótipo Implementado)  
**Projeto:** RogueBomb — Roguevania com Bombas  
**Engine / Stack:** HTML5, CSS3, JavaScript Vanilla (Canvas API 2D nativa, Web Audio API, Touch Events, Pointer Events)  
**Plataformas:** Web (Desktop) & Dispositivos Móveis (Mobile First / Responsivo)  
**Data da Última Atualização:** Setembro / 2026  

---

## 1. Visão Geral e Pitch do Jogo

### 1.1 Premissa
**RogueBomb** é um *Roguevania* de ação em visão top-down (com simulação de perspectiva isométrica 2D). O jogador controla **Charlotte**, uma jovem inventora que explora as entranhas mecânicas e perigosas de uma mina subterrânea procedural steampunk. Em vez de espadas ou armas de fogo convencionais, Charlotte utiliza a sua **Manopla Mecânica** e um arsenal tático de **Bombas a Vapor e Percussão** para resolver quebra-cabeças ambientais, destruir caixas de minério, combater autômatos hostis e abrir caminho rumo aos andares mais profundos da mina em busca do valioso **Cristal Coal (CC)** — um carvão mineral cristalizado hiper-energético essencial para suas invenções.

### 1.2 Core Loop (Ciclo Central de Jogabilidade)
1. **Entrada na Sala:** Charlotte entra em uma sala gerada proceduralmente. Se houver autômatos, a sala entra em **Lockdown**, trancando as portas até que todos os inimigos sejam derrotados.
2. **Combate & Tática com Bombas:** Uso de bombas temporizadas, de impacto e de propulsão para repelir e destruir os autômatos, evitando a todo custo o contato direto.
3. **Mineração & Coleta de Recursos:** Destruição de caixas e blocos quebráveis para obter **Cristal Coal (CC)**, fragmentos cristalinos atraídos magneticamente.
4. **Depósito Seguro na Goela:** Charlotte deve levar seus cristais de Cristal Coal até as salas equipadas com a **Goela** (duto de descarte seguro). Recursos depositados ficam salvos permanentemente no cofre da oficina.
5. **Verticalidade & Progressão:** Detecção do **Nodo Secreto de Piso** fraturado da mina; ao detonar uma bomba sobre ele, uma cratera abissal se abre, permitindo descer ao próximo nível de profundidade (`Depth`).
6. **Morte & Rebobinar do Tempo (Time Rewind):** Se tocada por um autômato ativo, o tempo rebobina com um efeito de glitch analógico: Charlotte acorda na Safe Room inicial, um novo mapa procedural é gerado, a profundidade reseta e os fragmentos de Cristal Coal não depositados são perdidos (mantendo os já salvos na Goela).

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
   - Contém o **NPC Inventor** (`TILE.INVENTOR_NPC` - tile roxo com óculos ciano de proteção).
   - Contém a **Mesa de Arsenal** (`TILE.ARMORY` - bancada de modificações de equipamentos).
   - Não possui caixas obstruindo a área inicial.
2. **Salas Regulares de Exploração e Combate:**
   - Cercadas por paredes indestrutíveis perimetrais (`TILE.WALL`).
   - Pilares estruturais fixos distribuídos geometricamente em posições pares (`x % 2 === 0 && y % 2 === 0`).
   - Blocos/Caixas de madeira quebráveis (`TILE.BREAKABLE`) distribuídas aleatoriamente pelo piso, protegendo o caminho central das 4 portas.
   - População de autômatos hostis com spawn afastado das portas de entrada para evitar emboscadas injustas.
3. **Salas com Goela (Duto Coletor):**
   - Regra de distribuição: **Pelo menos uma a cada três salas geradas** possui obrigatoriamente uma Goela no centro da sala.
   - Duto circular verde-escuro (`#1b5e20`) com anel exterior pulsante verde-claro (`#4caf50`).
4. **Sala Secreta / Andar Inferior (Verticalidade):**
   - Acessada através de uma cratera aberta no chão (`TILE.HOLE`) gerada ao explodir o ponto fraco da mina.
   - Contém a Escada de Emergência (`TILE.SECRET_LADDER`) para retorno à superfície e pedestais de upgrade.

### 2.4 Transição de Salas e Câmera
- **Efeito Visual:** *Fade out / Fade in* suave com duração total de ~0.5s preenchendo a tela em preto translúcido (`rgba(12, 14, 18, alpha)`).
- **Reposicionamento Oposto:** Ao atravessar a porta Norte, Charlotte ressurge na borda Sul da nova sala (com margem segura de 1.5 tiles); o mesmo ocorre para Leste $\leftrightarrow$ Oeste.
- **Proteção do Jogador na Entrada:** Ao carregar a nova sala, Charlotte recebe 0.6s de invulnerabilidade e todos os autômatos da sala recebem **1.2 segundos de carência de inicialização (`dormant`)**, impedindo dano acidental na entrada.

---

## 3. Mecânica de Lockdown (Trancamento de Sala)

### 3.1 Regras de Ativação
- Ao entrar em qualquer sala inexplorada que contenha autômatos vivos:
  - Todas as aberturas de portas centrais são instantaneamente substituídas por **Portões de Lockdown** (`TILE.LOCK_GATE` - blocos vermelhos pulsantes com estrias diagonais de aviso).
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
- **Invulnerabilidade:** Piscamento translúcido de 15 Hz durante períodos pós-transição (0.6s) ou pós-rebobinamento (1.8s).

### 4.2 Sprites e Animações Implementadas (`Img/charllote_spritesheet_64x64.png`)
Grid de spritesheet com células de $64 \times 64$ pixels (10 frames por ação):
- **Linha 0 — Idle (Parada):** 10 frames a 8 FPS, respiração sutil.
- **Linha 1 — Walk (Caminhada):** 10 frames a 10 FPS, passada com movimento de braços e jaleco.
- **Linha 3 — Dash / Recuo:** 10 frames a 14 FPS, postura aerodinâmica durante a propulsão.
- **Linha 4 — Throw / Arremesso:** 10 frames a 12 FPS (sustenta o frame 3 enquanto o jogador estiver mirando com a Manopla).
- **Fallback Gráfico:** Caso a imagem do sprite falhe ou não tenha carregado, o jogo renderiza suavemente um avatar vetorial nítido (círculo azul `#29b6f6` com óculos de proteção brancos direcionais).

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
O alcance do arremesso pode ser aprimorado encontrando pedestais de upgrade (`TILE.GAUNTLET_ITEM`), pressionando a tecla `[U]` no desktop ou clicando diretamente no badge da Manopla no HUD:
- **Nível 1 (Inicial):** Alcance de **140 pixels** (~3.5 blocos).
- **Nível 2:** Alcance de **220 pixels** (~5.5 blocos).
- **Nível 3 (MÁXIMO):** Alcance de **300 pixels** (~7.5 blocos — metade exata do mapa).
- *Feedback de Upgrade:* Fanfarra melódica de 5 notas ascendentes (`playUpgradeFanfare`), explosão de faíscas douradas e cianas sobre Charlotte e notificação em toast.

### 5.3 Sistema de Munição e Recarga Passiva
- Charlotte carrega um estoque máximo de **5 Bombas Temporizadas**.
- O estoque é exibido no botão mobile e no HUD superior `TEMP (5)`.
- Se as bombas estiverem esgotadas, um aviso sonoro e toast alertam: `"SEM BOMBAS! AGUARDE RECARGA..."`.
- **Recarga Passiva:** A cada 3.0 segundos sem disparar no limite, 1 bomba é reabastecida automaticamente.

### 5.4 Tipos de Bombas Implementadas

| Bomba | Representação Visual | Efeito Imediato | Dano | Raio de Ação | Efeito no Chão / Ambiente |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bomba a Vapor Temporizada** | Quadrado Amarelo com display digital de contagem regressiva | Fica no chão piscando por 3.0 segundos; emite beeps sonoros que aceleram no final antes de explodir | **2 HP** | Cruz de 2 blocos (5 blocos de extensão) | Destrói blocos quebráveis e quebra o **Nodo Secreto de Piso** abrindo a descida para o andar inferior |
| **Bomba de Percussão (Impacto)** | Quadrado Vermelho pequeno com contorno branco | Explode instantaneamente no momento da aterrissagem | **1 HP** + repulsão | Círculo de 1.5 blocos ($3 \times 3$) | Destrói blocos quebráveis e danifica o piso fraco da mina |
| **Bomba de Vapor Propulsor** | Quadrado Ciano brilhante com estrias | Detonação instantânea de vapor superaquecido a alta pressão | **0 HP** (Não causa dano) | Repulsão de 3.5 blocos nos inimigos; 2.8 blocos em Charlotte | Se Charlotte estiver na área, é arremessada na direção oposta ao centro em um dash veloz de **3 blocos**; repele todos os autômatos com força de 380 px/s |

---

## 6. Verticalidade e Andares Mais Profundos da Mina

O jogo expande a tradicional exploração horizontal incorporando progressão vertical procedural em andares de mina (`Depth`).

### 6.1 O Nodo Secreto de Piso (`SecretFloorNode`)
- Em cada nível gerado, exatamente **uma sala** da mina (não-inicial e sem Goela) abriga um ponto fraco estrutural no chão de pedra.
- O bloco utiliza o frame 2 do spritesheet `Img/chao_mina.png` (ladrilho com fissura/rachadura acentuada).
- **Sequência de Quebra em 4 Etapas:**
  1. Ao ser atingido por uma explosão pesada (Temporizada ou Impacto), inicia a animação de colapso.
  2. Partículas de cascalho marrom e poeira são ejetadas (`playFloorCrumble`).
  3. Transição progressiva pelos frames de desmoronamento (Frames 3, 4 e 5).
  4. Formação da cratera aberta (Frame 6): um abismo circular negro emitindo uma aura de energia ciano pulsante com uma seta indicadora de descida `▼`.
- **Descida de Nível:** Ao pisar na cratera aberta, Charlotte desce para a profundidade seguinte (`nextDepth = currentDepth + 1`).

### 6.2 Escalonamento de Dificuldade por Profundidade (`Depth`)
A descida a andares mais fundos altera a ecologia da mina procedural:
- **Quantidade de Inimigos:**
  - Nível 1: 1 a 2 autômatos por sala de combate.
  - Nível 2: 2 a 3 autômatos por sala.
  - Nível 3+: 2 a 4 autômatos por sala.
- **Taxa de Drop de Cristal Coal (CC):** A chance de obter CC ao quebrar caixas aumenta de 50% (Nível 1) para até 85% (Níveis 3+). No nível 3+, há 35% de chance de obter drop duplo.
- **Velocidade e Reação dos Inimigos:** Inimigos ganham até +45 px/s de velocidade de perseguição e têm o tempo de retardo de reação reduzido de 0.65s para 0.38s.

---

## 7. Inimigos: Autômatos Mecânicos (IA e Tiers)

Os inimigos são máquinas a vapor movidas a engrenagens deixadas para trás na mina.

### 7.1 Máquina de Estados da IA (`Automaton`)
A IA dos autômatos é estruturada em 4 estados com comportamentos orgânicos:
1. **`dormant` (Carência / Inicialização):**
   - Ativado nos primeiros 1.0s a 1.2s ao entrar na sala.
   - O autômato fica acinzentado, com núcleo ótico apagado e animação textual `"zzz"`.
   - **NÃO causa dano nem rebobina o tempo se encostar no jogador**, permitindo que o jogador se posicione na entrada.
2. **`idle` (Patrulha Passiva):**
   - O autômato realiza deslocamentos lentos (36 px/s) em direções ortogonais aleatórias com pausas entre 1 e 2 segundos.
3. **`alert` (Alerta com Retardo de Reação):**
   - Quando Charlotte se aproxima dentro do raio de detecção (**4.5 blocos**), o autômato entra em alerta.
   - O autômato para no lugar e suas engrenagens vibram intensamente.
   - Um balão com **ponto de exclamação `!`** flutua acima de sua cabeça e o efeito sonoro de alerta mecânico toca (`playEnemyAlert`).
   - Ele aguarda o tempo de retardo de reação (**0.65s a 0.38s**) antes de iniciar a investida. Se Charlotte recuar para longe nesse intervalo, o alerta é cancelado e ele volta a patrulhar.
4. **`chase` (Perseguição Ativa com Desvio de Obstáculos):**
   - O autômato avança com velocidade calibrada (80 a 125 px/s) em direção a Charlotte.
   - Possui rotina inteligente de desvio de obstáculos: se colidir com uma parede ou pilar frontal, redireciona o vetor pelo eixo ortogonal desimpedido mais próximo.
   - Se Charlotte se afastar mais de **6 blocos** (`loseRange`), o autômato perde o alvo de vista e retorna para `idle`.

### 7.2 Tiers de Autômatos por Nível de Profundidade
- **Tier 1 — Autômato de Cobre Comum (Nível 1):**
  - Cor: Vermelho Carmim (`#c62828`).
  - Vida: **1 HP** (destruído com 1 golpe de qualquer bomba ofensiva).
- **Tier 2 — Autômato Blindado Ametista (Nível 2):**
  - Cor: Roxo metálico (`#8e24aa`).
  - Vida: **2 HP**.
  - Possui barra de vida segmentada sobre a cabeça e carcaça reforçada. Resiste a uma bomba de impacto.
- **Tier 3 — Titã de Obsidiana e Ouro (Nível 3+):**
  - Cor: Placas de grafite escuro com bordas em folha de ouro (`#263238` / `#ffd700`).
  - Vida: **3 a 6 HP** escalando com a profundidade.
  - Barra de vida multi-segmentada. Muito agressivo e resistente.

### 7.3 Reações a Dano e Efeitos Físicos
- Ao ser atingido, pisca em branco absoluto por 0.25s.
- Números de dano flutuantes vermelhos sobem no ar (`-1 HP`, `-2 HP`).
- Sofre recuo físico (knockback) proporcional à força da explosão.
- Ao ser destruído, ejeta uma dispersão de 20 partículas metálicas e faíscas incandescentes.

---

## 8. Economia: Cristal Coal (CC) e a Goela

### 8.1 Cristal Coal (CC)
- Cristais minerais facetados azuis em formato de diamante lapidado com núcleo reluzente e aura luminosa pulsante. Trata-se de **Cristal Coal (CC)**, o combustível mais cobiçado da mina a vapor.
- Obtidos ao quebrar caixas de minério de madeira (`TILE.BREAKABLE`).
- **Magnetismo Orgânico:** Flutuam suavemente no piso; quando Charlotte passa a menos de 58 pixels, são atraídos em aceleração contínua diretamente para a protagonista e coletados ao toque (< 22px).
- Cada cristal coletado emite um SFX brilhante em duas notas agudas (`playCCPickup`), ejeta faíscas ciano/ouro e exibe um texto flutuante `+1 CC`.

### 8.2 A Goela (Duto de Depósito Permanente)
- Duto tubular subterrâneo verde localizado no centro de determinadas salas.
- **Mecânica de Banco (Risk/Reward):** O Cristal Coal carregado no inventário de Charlotte (`chronoCores` / `crystalCoal`) é volátil e perdido em caso de derrota.
- Ao pisar sobre a Goela carregando cristais, todos são depositados instantaneamente:
  - SFX característico de sucção a vácuo (`playChuteDeposit`).
  - Toast: `"DEPOSITADO: X CC NA GOELA!"`.
  - Partículas verdes e texto flutuante `+X CC DEPOSITADO`.
  - O saldo é transferido permanentemente para `depositedCores`, ficando seguro mesmo se o tempo rebobinar.

---

## 9. Mecânica de Morte: Rebobinar o Tempo (Time Rewind)

No universo de RogueBomb, Charlotte não morre definitivamente: o maquinário temporal de sua invenção rebobina o espaço-tempo ao sofrer uma avaria crítica.

### 9.1 Condição de Disparo
- Ocorre quando qualquer autômato que **não esteja em estado dormant** faz contato físico com Charlotte (distância entre centros < soma dos raios).
- Charlotte só é vulnerável se seu temporizador de invulnerabilidade estiver em zero.

### 9.2 Sequência de Rebobinamento
1. **SFX de Glitch:** Som agudo de fita analógica rebobinando em aceleração exponencial (`playRewindGlitch`).
2. **VFX de Glitch Temporal:** A tela pisca com aberração cromática em faixas ciano e vermelho desfasadas horizontalmente.
3. **Toast Central:** Mensagem enfática: `"TEMPO REBOBINADO: NOVO MAPA GERADO!"`.
4. **Fade e Reset de Estado:**
   - Charlotte é teletransportada para o centro da Safe Room inicial.
   - Todo o Cristal Coal volátil da bolsa é zerado (o saldo depositado na Goela é preservado).
   - Bombas em voo, explosões e partículas ativas são limpas.
   - Charlotte recebe **1.8 segundos de invulnerabilidade total**.
   - **Geração de Novo Mundo:** Um mapa procedural completamente novo de 10 salas é reconstruído instantaneamente, renovando o desafio de navegação.
5. **Comando de Debug:** Pressionar a tecla `[R]` no teclado permite testar manualmente o ciclo de rebobinamento temporal a qualquer momento.

---

## 10. Design de Áudio (Web Audio API e BGM Adaptativa)

O jogo utiliza uma combinação híbrida de trilhas em áudio digital estéreo e sintetizador procedural em tempo real:

### 10.1 Trilha Sonora Adaptativa (BGM)
- **Modo Exploração:** `song/The_Weight_of_Brass.mp3` — Trilha misteriosa com metais e percussão de engrenagens, tocada durante navegação livre e salas liberadas.
- **Modo Combate (Lockdown):** `song/Locked_Gears_and_Steam.mp3` — Trilha rápida e opressiva com batidas mecânicas aceleradas, ativada automaticamente durante o Lockdown.
- **Sistema de Crossfade Inteligente:** Transição suave entre as duas faixas com duração de 1.2 segundos (30 etapas lineares de atenuação e ganho simultâneos).

### 10.2 Efeitos Sonoros Sintetizados Proceduralmente (Web Audio API)
Sem necessidade de carregar arquivos WAV/MP3 externos para SFX, todo o design de som de combate é gerado matematicamente pelo navegador:
- `playImpactExplosion()`: Ruído branco com filtro passa-baixas exponencial (600 Hz $\to$ 80 Hz em 0.35s).
- `playPropulsorSteam()`: Ruído com filtro passa-faixa sibilante Q=3.0 (1400 Hz $\to$ 300 Hz em 0.4s), simulando vazamento de vapor de alta pressão.
- `playTimedBeep(pitchMult)`: Onda senoidal pura em 700 Hz com aceleração de pitch nos momentos finais da contagem.
- `playBigTimedExplosion()`: Combinação de oscilador triangular sub-grave (140 Hz $\to$ 30 Hz) com explosão massiva de ruído filtrado (800 Hz $\to$ 50 Hz em 0.6s).
- `playLockdownSound()`: Onda dente-de-serra modulada descendente (220 Hz $\to$ 180 Hz em 0.4s), simulando tranca hidráulica de ferro.
- `playUnlockSound()`: Acorde arpejado maior senoidal límpido de 3 notas (Dó5, Mi5, Sol5).
- `playRewindGlitch()`: Onda quadrada com varredura exponencial rápida ascendente (120 Hz $\to$ 950 Hz em 0.4s).
- `playChuteDeposit()`: Onda triangular com sweep de 320 Hz para 640 Hz.
- `playThrowWhoosh()`: Modulação senoidal curta simulando corte de vento.
- `playUpgradeFanfare()`: Fanfarra festiva de 5 notas (Mi4, Lá4, Dó#5, Mi5, Lá5).
- `playEnemyAlert()`: Sirene rápida dente-de-serra (380 Hz $\to$ 760 Hz).
- `playCCPickup()`: Duas notas senoidais agudas límpidas (880 Hz e 1318.5 Hz).
- `playFloorCrumble()`: Frequências graves triangulares simulando desmoronamento de rocha sólida.

---

## 11. Interface de Usuário (HUD) e Controles Híbridos

### 11.1 HUD Superior
- **Painel de Status da Sala (Canto Superior Esquerdo):**
  - Coordenadas da sala e nível atual: `NÍVEL X • SALA [rx, ry]` (ou `ANDAR SECRETO`).
  - Contador de autômatos vivos: `INIMIGOS: X` (verde quando 0; vermelho pulsante em alerta de combate).
- **Badge Interativo da Manopla (Centro-Esquerda):**
  - Ícone da luva mecânica 🥊 e nível atual (`NV. 1 (140px)`, `NV. 2 (220px)`, `NV. 3 MAX (300px)`).
  - Clicável diretamente para aprimorar o equipamento.
- **Badge de Cristal Coal (Centro-Direita):**
  - Ícone de diamante 💎 com contagem de cristais acumulados na bolsa atual (`X CC`).
- **Minimapa Procedural Dinâmico (Canto Superior Direito):**
  - Canvas dedicado de $70 \times 70$ pixels.
  - Exibe a matriz $5 \times 5$ com código de cores:
    - **Azul Claro:** Sala em que Charlotte está atualmente.
    - **Cinza Chumbo:** Salas já visitadas e liberadas de inimigos.
    - **Vermelho:** Salas visitadas com autômatos ainda vivos.
    - **Ponto Verde:** Indica salas que abrigam uma Goela de depósito.
- **Banner de Lockdown:** Faixa vermelha proeminente animada no topo da tela com aviso de confinamento.
- **Feedbacks Flutuantes:** Danos (`-1 HP`), coleta (`+1 CC`), depósitos e toasts centrais com fade automático.

### 11.2 Mapeamento de Controles Desktop
- **Movimentação:** Teclas <kbd>W</kbd>, <kbd>A</kbd>, <kbd>S</kbd>, <kbd>D</kbd> ou <kbd>Setas Direcionais</kbd> (movimentação ortogonal e diagonal normalizada por $\sqrt{2}/2$).
- **Mira e Arremesso Balístico:** Clicar e arrastar com o botão esquerdo do mouse para traçar a parábola; soltar para lançar.
- **Arremesso Rápido Direto:** Clicar com o botão direito do mouse arremessa instantaneamente no cursor.
- **Arremesso Rápido Frontal:** Barra de <kbd>ESPAÇO</kbd>.
- **Seleção de Ferramentas:** Teclas numéricas <kbd>1</kbd> (Impacto), <kbd>2</kbd> (Propulsor), <kbd>3</kbd> (Temporizada) ou <kbd>Scroll do Mouse</kbd>.
- **Dash (Botas Propulsoras):** Tecla <kbd>Shift</kbd> (Custa 1 CC por uso, concede 0.5s de invulnerabilidade/i-frames, superaquece com resfriamento de 5.0s).
- **Aprimorar Manopla:** Tecla <kbd>U</kbd> ou clique no HUD.
- **Cheat de Tester:** <kbd>Ctrl</kbd> + <kbd>Y</kbd> (+10 CC e +10 Peças).
- **Revelar Saída (Debug):** <kbd>Ctrl</kbd> + <kbd>U</kbd>.
- **Rebobinar o Tempo (Debug):** Tecla <kbd>R</kbd>.

### 11.3 Mapeamento de Controles Mobile (Touch)
- **Joystick Analógico Virtual Dinâmico (Lado Inferior Esquerdo):**
  - Base e manopla circulares com detecção contínua 360° via *Pointer Events* e captura de ponteiro (`setPointerCapture`).
  - Manopla com arrasto suave de até 46px de raio, retornando suavemente ao centro ao soltar.
  - Ajuste de velocidade proporcional à intensidade do arrasto.
- **Painel de Ações (Lado Inferior Direito):**
  - **Botão Principal de Ação:** Botão circular proeminente laranja para disparo rápido frontal.
  - **Botão de Dash (Botas Propulsoras):** Botão circular ciano dedicado (`#dash-trigger`) posicionado ergonomicamente ao lado do botão de ação, permitindo realizar o Dash no mobile. Possui indicador de custo (1 CC), overlay com contador regressivo em tempo real durante o resfriamento/superaquecimento (5.0s), e estado bloqueado com aviso caso o jogador ainda não tenha adquirido as botas na Mesa de Arsenal.
  - **Botões Seletores de Bombas:** Três botões circulares temáticos com ícones coloridos para alternância imediata de ferramentas e indicador de munição.

---

## 12. Tabela Comparativa: GDD Original (PDF) vs. MVP Implementado

A tabela a seguir documenta a conformidade do projeto em relação ao documento original de especificação e as melhorias e expansões incorporadas:

| Requisito do Documento Original (PDF) | Situação no Código Atual | Detalhes da Implementação / Expansão |
| :--- | :---: | :--- |
| **Engine Vanilla (HTML/CSS/JS + Canvas API)** | ✅ **Completo** | Jogo 100% contido em arquitetura modular limpa e comentada sem bibliotecas externas |
| **Controles Híbridos (PC + Mobile)** | ✅ **Completo** | Suporte simultâneo a teclado, mouse com clique-e-arraste, botão direito, joystick touch dinâmico 360° e botões mobile |
| **Grid 15x15 e Salas Modulares** | ✅ **Completo** | Grid rigoroso de 15x15 blocos (40px/tile = 600x600px), 1 sala renderizada por vez |
| **Matriz Procedural de Salas** | ✅ **Expandido** | Matriz 5x5 com 10 salas ramificadas, minimapa no HUD com códigos de status e portas ortogonais centrais |
| **Transição com Fade Out / Fade In** | ✅ **Completo** | Transição suave de tela preta (fade 1.2s), reposicionamento na borda oposta e carência de proteção |
| **Regra da Goela (1 a cada 3 salas)** | ✅ **Completo** | Algoritmo garante pelo menos 1 Goela a cada 3 salas; sistema bancário de depósito de Cristal Coal (CC) implementado |
| **Placeholders vs Arte Final** | ✅ **Expandido** | Substituídos placeholders simples por **Spritesheet oficial de 64x64 de Charlotte** (Idle, Walk, Dash, Throw), **Spritesheet do Chão da Mina** (192x192), caixas de madeira com cantoneiras e autômatos desenhados com detalhes de engrenagens |
| **Mecânica de Lockdown** | ✅ **Completo** | Portas viram blocos vermelhos pulsantes, alerta no HUD, troca adaptativa de música e liberação ao zerar inimigos |
| **Bomba de Impacto (Percussão)** | ✅ **Completo** | Detonação imediata ao pousar, raio de 1.5 blocos, quebra caixas e causa 1 de dano com repulsão |
| **Bomba de Vapor Propulsor** | ✅ **Completo** | Sem dano direto, aplica recuo/dash físico de 3 blocos em Charlotte e empurra autômatos para longe (380 px/s) |
| **Bomba a Vapor Temporizada** | ✅ **Completo** | Timer de 3 segundos com beeps acelerados, explosão pesada em cruz de 2 blocos, 2 de dano e quebra caixas |
| **Regra de Verticalidade (Andar Inferior)** | ✅ **Expandido** | Implementado **Nodo Secreto de Piso** fraturado integrado ao chão que desmorona em 4 fases de animação de cratera, permitindo descer para andares de maior profundidade (`Depth`) |
| **Comportamento dos Inimigos (Autômatos)** | ✅ **Expandido** | IA evoluída para Máquina de Estados (Dormant com carência de 1.2s na entrada, Idle com patrulha, Alert com retardo de reação e Chase com desvio de obstáculos). Criados 3 Tiers de inimigos (Comum 1 HP, Blindado 2 HP e Titã 3+ HP) |
| **Rebobinar o Tempo (Time Rewind)** | ✅ **Completo** | Contato letal ativa SFX de glitch analógico, tela com aberração cromática, novo mapa procedural gerado, retorno à Safe Room e perda apenas dos recursos não depositados |
| **Design de Som e Música** | 🌟 **Adicional Implementado** | BGM adaptativa dupla com crossfade de 1.2s (Exploração e Batalha) e 13 efeitos sonoros sintetizados em tempo real via Web Audio API |
| **Manopla Mecânica com Upgrades** | ✨ **Adicional Implementado** | Sistema de alcance balístico em 3 níveis. Comprado na Mesa de Arsenal. |
| **Safe Room Temática** | ✨ **Adicional Implementado** | Sala inicial (apenas Nível 1) com NPC Inventor, Mesa de Arsenal e Baú para ver saldo depositado. |
| **Loja na Mesa de Arsenal** | ✨ **Adicional Implementado** | Upgrades comprados com CC e Peças depositadas. Melhorias de Manopla, Botas (Dash com Shift) e Bolsa (+2 Bombas e tipos novos). |
| **Autômatos e Drop de Peças** | ✨ **Adicional Implementado** | Inimigos agora deixam cair "Peças" (engrenagens prateadas) além do CC das caixas. Quantidade de drop escala com a profundidade. |
| **Human Boss (Mini-boss)** | ✨ **Adicional Implementado** | No nível 3+, chance de aparecer um humano (vestido de vermelho) que joga bombas de impacto e dá *dash* aleatório para desviar de suas bombas. |
| **Porta e Chave do Boss** | ✨ **Adicional Implementado** | Uma porta bloqueada com uma caveira que requer a coleta da *Chave do Boss* em um pedestal no mesmo mapa. |
| **Buracos/Armadilhas no Chão** | ✨ **Adicional Implementado** | Quadrados vazios no chão que não são transponíveis e causam dano/rebobinam o tempo se o jogador tentar andar sobre eles. |
| **Dica de Saída (Ctrl+U)** | ✨ **Adicional Implementado** | Jogador pode segurar `Ctrl+U` para revelar no minimapa e no chão a posição exata da sala e do piso falso que leva para o próximo nível. |

---

## 13. Roteiro e Backlog para Próximas Atualizações (Pós-MVP)

1. **Expansão de Boss Fights:**
   - Criação de um autômato colossal no 5º nível (sala sem saída).
2. **Novos Tipos de Bombas / Alquimia:**
   - Bomba de Óleo Escorregadio (lentidão) e Bomba Criogênica a Gás (congelamento temporário).
3. **Mecânica de Movimentação de Blocos:**
   - Permitir que a bomba de propulsão empurre/puxe estátuas ou blocos para resolver quebra-cabeças e formar pontes sobre os buracos.
