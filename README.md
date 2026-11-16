# Pane na Aurora

Aventura 2D de ficção científica feita em HTML, CSS e JavaScript para a disciplina de Lógica para Computação. A Lógica Proposicional é parte da progressão: cada porta de sistema exige resolver um desafio antes do reparo.

## Acesse o jogo

- [Abrir o jogo publicado](http://127.0.0.1:5500/index.html)
- [Repositório no GitHub](https://github.com/GustavoCavalcantiN/SpaceCode)

O link publicado depende do GitHub Pages estar ativado nas configurações do repositório. Para jogar localmente, abra a pasta no VS Code e inicie o Live Server no `index.html`; o endereço local só funciona enquanto o servidor estiver ligado.

## História

Uma tempestade de micrometeoritos atinge a nave Aurora, desvia sua rota e danifica quatro sistemas. Enquanto o incêndio se alastra, a tripulação tem quatro minutos para restaurar oxigênio, combustível, energia e motor. Cada porta está protegida por um desafio de lógica.

Com a Aurora reparada, a sala de acoplamento libera uma ponte para a nave Atlas, que também sofreu danos. A segunda nave tem quatro novos sistemas e novos problemas de lógica. As duas naves precisam ser reparadas antes que a contagem termine para que a tripulação consiga confirmar uma rota segura.

## Como jogar

1. Pressione **Iniciar missão**. O cronômetro de quatro minutos começa e segue contando nas duas naves. O progresso acompanha os oito sistemas no total (por exemplo, 4/8 ao chegar à Atlas).
2. Mova-se com **WASD** ou as **setas** e pressione **E** perto de uma porta.
3. Resolva o desafio para liberar a sala e, já dentro dela, pressione **E** para iniciar o reparo.
4. Se errar um desafio de porta, visite outra sala e resolva corretamente o desafio dela. Só então poderá retornar à porta pendente.
5. Repare os quatro sistemas da Aurora, libere a ponte e atravesse para a Atlas.
6. Repare os quatro sistemas da Atlas e confirme a rota no controle central.

As chamas surgem em vários setores, espalham-se e aceleram com o tempo. Tocá-las reduz o tempo restante; o cronômetro não reinicia ao trocar de nave. É possível fechar uma tela com **Esc**; reparos já concluídos permanecem. Se o tempo acabar, a nave explode e a partida pode ser reiniciada.

## Salas e desafios

| Nave e sala | Conteúdo lógico | Tarefa prática |
| --- | --- | --- |
| Aurora — Oxigênio | Configurar `p ∧ ¬q` como verdadeira (`p = V`, `q = F`). | Clicar de 1 a 10 em ordem; erro reinicia a sequência. |
| Aurora — Combustível | Classificar `p ∨ ¬p` como tautologia. | Abastecer até 100%. |
| Aurora — Energia | Avaliar `p → q` com `p = V`, `q = F`; resultado falso. | Ligar quatro fios aos conectores da mesma cor. |
| Aurora — Motor | Aplicar De Morgan: `¬(p ∧ q) ≡ ¬p ∨ ¬q`. | Levar ao topo a alavanca indicada. |
| Atlas — Escudos | Avaliar `p ∧ q` com `p = V`, `q = F`; resultado falso. | Repetir a sequência aleatória de estabilizadores. |
| Atlas — Comunicações | Avaliar `p ↔ q` com valores diferentes; resultado falso. | Ajustar dois canais às frequências exibidas. |
| Atlas — Sensores | Avaliar `¬p ∨ q` com `p = F`, `q = F`; resultado verdadeiro. | Calibrar os setores do radar na ordem indicada. |
| Atlas — Reator auxiliar | Avaliar `p → (q ∨ r)` com `p = V`, `q = F`, `r = V`; resultado verdadeiro. | Manter a potência dentro da faixa segura. |

Os desafios da Atlas variam as proposições e os valores apresentados. As tarefas com sequência, frequência e alvo também mudam a cada partida.

## Lógica como parte da jogabilidade

Os conectivos de negação, conjunção, disjunção, implicação e bicondicional controlam o acesso às salas. A missão exige interpretar valores-verdade, reconhecer tautologias e equivalências e usar essas respostas para escolher o caminho. Uma resposta errada cria um desvio obrigatório: o jogador precisa resolver outro desafio antes de tentar a porta pendente de novo.

## Arquivos

- `index.html`: interface e tela inicial.
- `style.css`: layout e efeitos visuais.
- `main.js`: movimentação, duas naves, ponte, cronômetro e incêndio.
- `desafios.js`: desafios de lógica das duas naves.
- `tarefas.js`: tarefas práticas de reparo.
