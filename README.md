# Pane na Aurora

Jogo 2D de aventura e reparo feito em HTML, CSS e JavaScript para a disciplina de Lógica para Computação. A Lógica Proposicional faz parte da progressão: é preciso interpretar e resolver os desafios para acessar os sistemas da nave.

## Jogue e acesse o projeto

- [Link do jogo](http://127.0.0.1:5500/index.html) 
- [Repositório do jogo no GitHub](https://github.com/GustavoCavalcantiN/SpaceCode)
- [Arquivo principal do jogo](https://github.com/GustavoCavalcantiN/SpaceCode/blob/main/index.html)

O jogo ainda não tem uma página pública. Para abrir pelo navegador sem aparecer como arquivo local:

1. No VS Code, abra `index.html`.
2. Clique em **Go Live** na barra inferior para iniciar o Live Server.
3. Abra [http://127.0.0.1:5500/index.html](http://127.0.0.1:5500/index.html) no Chrome. O Live Server normalmente também abre a página automaticamente.

O endereço `127.0.0.1` aponta para o próprio computador: só funciona nele e enquanto o Live Server estiver ligado. Para compartilhar o jogo com outras pessoas pela internet, será necessário publicá-lo em um serviço de hospedagem estática.

## História

A nave Aurora está voltando de uma missão de exploração quando atravessa uma tempestade de micrometeoritos. O impacto danifica sistemas essenciais, desvia a nave da rota e ativa o protocolo de segurança: as portas dos setores são bloqueadas para evitar novas falhas.

A tripulação tem seis minutos antes que o suporte de emergência se esgote. Para salvar a missão, o jogador precisa recuperar o oxigênio, o combustível, a energia e o motor. Cada setor exige duas etapas: resolver um problema de Lógica Proposicional para liberar a entrada e concluir uma tarefa prática de reparo dentro da sala.

Quando os quatro sistemas estiverem funcionando, a sala de controle será liberada. O painel de navegação permite definir uma nova rota e conduzir a Aurora de volta em segurança.

## Como jogar

1. Pressione **Iniciar missão**. O cronômetro de seis minutos começa junto com a partida.
2. Mova-se pela nave usando **WASD** ou as **setas**.
3. Aproxime-se de uma porta e pressione **E** ou clique no botão de interação.
4. Resolva o desafio lógico. Ao acertar, você entra na sala automaticamente.
5. Pressione **E** dentro da sala para iniciar o reparo correspondente.
6. Repare os quatro sistemas e vá à sala de controle para confirmar a rota.

Uma resposta incorreta não libera a porta. A tecla **Esc** fecha a janela de desafio ou reparo; o progresso já concluído permanece. Se o cronômetro chegar a zero antes da vitória, a nave explode e a partida pode ser reiniciada.

## Salas e lógica proposicional

| Sala | Desafio da porta | Tarefa de reparo |
| --- | --- | --- |
| **Oxigênio** | Configurar `p ∧ ¬q` como verdadeira, com `p` representando o tanque reserva ativo e `q`, o filtro funcionando. A solução é `p = V` e `q = F`. | Clicar nos números de 1 a 10 em ordem crescente. Um erro reinicia a sequência. |
| **Combustível** | Classificar `p ∨ ¬p`, em que `p` representa a disponibilidade do tanque auxiliar. A expressão é uma tautologia. | Abastecer o tanque até 100%, acompanhando o nível visual. |
| **Energia** | Avaliar `p → q` com `p = V` e `q = F`. A implicação é falsa nesse caso. | Arrastar os quatro fios até os conectores da mesma cor. |
| **Motor** | Encontrar a expressão equivalente a `¬(p ∧ q)` pela lei de De Morgan. A resposta é `¬p ∨ ¬q`. | Levar ao topo a alavanca indicada pelo painel. |

Depois dos quatro reparos, o painel da sala de controle encerra a missão quando o jogador confirma a nova rota.

## Lógica como parte da jogabilidade

As proposições descrevem condições do funcionamento da nave. O jogador precisa avaliar conectivos, negação, implicação, tautologia e equivalência lógica para decidir se cada setor pode ser aberto. Sem resolver os desafios corretamente, não consegue acessar os reparos nem avançar até o controle. Assim, a lógica determina o caminho e as decisões da partida.

## Critérios do projeto

- **Jogabilidade:** regras diretas, movimentação, interação com portas, tarefas por sala, cronômetro, vitória e derrota.
- **Lógica proposicional explícita:** os desafios usam fórmulas e conceitos lógicos para liberar áreas essenciais.
- **Apresentação:** a história e as instruções situam o jogador; cada desafio e reparo apresenta feedback.
- **Originalidade:** aventura espacial, narrativa de emergência e tarefas práticas combinadas com desafios de lógica.

## Próxima melhoria planejada

Atualmente, cada sala apresenta um desafio lógico fixo por partida; a ordem das alternativas pode mudar. Uma evolução desejada é variar as fórmulas entre partidas, mantendo enunciados, alternativas e respostas corretas coerentes com a tabela-verdade.

## Arquivos

- `index.html`: estrutura da interface e tela inicial.
- `style.css`: cores, layout e efeitos visuais.
- `main.js`: movimentação, portas, cronômetro e fluxo da partida.
- `desafios.js`: desafios de Lógica Proposicional.
- `tarefas.js`: tarefas práticas de reparo.
