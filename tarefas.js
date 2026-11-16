// Tarefas de reparo (uma por sala, na ordem do prompt).
// Cada função monta a tela dentro de c e chama ok() quando o reparo termina.
const TAREFAS = [
  // Sala 1 – Oxigênio: clicar de 1 a 10 em ordem; erro reinicia a sequência
  (c, ok) => {
    c.innerHTML = '<p>Clique nos botões de 1 a 10, em ordem crescente.</p>';
    let n = 1;
    const g = div('grade', c);
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5).forEach(i => {
      botao(i, e => {
        if (i === n) {
          e.currentTarget.classList.add('feito');
          if (++n > 10) ok();
        } else {
          n = 1;
          g.querySelectorAll('button').forEach(b => b.classList.remove('feito'));
          feedback('Fora de ordem! Recomece do 1.', false);
        }
      }, g);
    });
  },
  // Sala 2 – Combustível: cada clique sobe o nível até 100%
  (c, ok) => {
    c.innerHTML = '<p>Clique em Abastecer até o tanque chegar a 100%.</p><div class="tanque"><div id="nivel"></div></div><p id="pct"></p>';
    const niv = c.querySelector('#nivel'), pct = c.querySelector('#pct');
    let n = 20;
    const mostrar = () => { niv.style.height = n + '%'; pct.textContent = n + '%'; };
    mostrar();
    botao('Abastecer', () => { if (n >= 100) return; n = Math.min(100, n + 10); mostrar(); if (n === 100) ok(); }, c);
  },
  // Sala 3 – Energia: arrastar cada fio até o conector da mesma cor (arrastar e soltar com o mouse)
  (c, ok) => {
    c.innerHTML = '<p>Arraste cada fio até o conector da mesma cor.</p><div class="fios"><div id="fe"></div><div id="fd"></div></div>';
    const cores = ['#e0543f', '#3fa7e0', '#f0c43a', '#5fd3a8'];
    const fe = c.querySelector('#fe'), fd = c.querySelector('#fd');
    let ligados = 0;
    cores.slice().sort(() => Math.random() - 0.5).forEach(cor => {
      const w = div('fio', fe);
      w.style.background = cor; w.draggable = true;
      w.ondragstart = e => e.dataTransfer.setData('text', cor);
    });
    cores.slice().sort(() => Math.random() - 0.5).forEach(cor => {
      const k = div('conector', fd);
      k.style.borderColor = cor;
      k.ondragover = e => e.preventDefault();
      k.ondrop = e => {
        e.preventDefault();
        if (k.dataset.ligado) return;
        if (e.dataTransfer.getData('text') === cor) {
          k.dataset.ligado = 1; k.style.background = cor;
          feedback('Conectado!', true);
          if (++ligados === 4) ok();
        } else feedback('Cor errada. Tente outro conector.', false);
      };
    });
  },
  // Sala 4 – Motor: subir até o topo a alavanca indicada
  (c, ok) => {
    const cs = [['vermelha', '#e0543f'], ['azul', '#3fa7e0'], ['amarela', '#f0c43a'], ['verde', '#5fd3a8'], ['roxa', '#a77be0']];
    const alvo = Math.floor(Math.random() * cs.length);
    c.innerHTML = '<p>Ligue o motor: suba até o topo a alavanca <b style="color:' + cs[alvo][1] + '">' + cs[alvo][0] + '</b>.</p>';
    const p = div('painel', c);
    cs.forEach(([nome, cor], i) => {
      const r = document.createElement('input');
      r.type = 'range'; r.min = 0; r.max = 100; r.value = 0;
      r.style.accentColor = cor; r.title = 'Alavanca ' + nome;
      r.oninput = () => {
        if (+r.value < 100) return;
        if (i === alvo) ok();
        else { r.value = 0; feedback('Essa alavanca não liga o motor.', false); }
      };
      p.appendChild(r);
    });
  }
];

// Reparos da segunda nave, com mecânicas diferentes das tarefas da Aurora.
const TAREFAS_ATLAS = [
  (c, ok) => {
    c.innerHTML = '<p>Ative os quatro estabilizadores na sequência indicada.</p><p class="expr" id="seq-alvo"></p><div class="opcoes" id="seq-botoes"></div><p id="seq-status"></p>';
    const ordem = [0, 1, 2, 3].sort(() => Math.random() - .5), cores = ['Vermelho', 'Azul', 'Amarelo', 'Verde'];
    c.querySelector('#seq-alvo').textContent = ordem.map(i => cores[i]).join(' → ');
    let passo = 0;
    ordem.forEach((_, i) => botao(cores[i], () => {
      if (i === ordem[passo]) { passo++; c.querySelector('#seq-status').textContent = `Estabilizadores: ${passo}/4`; if (passo === 4) ok(); }
      else { passo = 0; c.querySelector('#seq-status').textContent = 'Sequência errada. Recomece do primeiro.'; }
    }, c.querySelector('#seq-botoes')));
  },
  (c, ok) => {
    const alvos = [Math.floor(Math.random() * 61) + 20, Math.floor(Math.random() * 61) + 20];
    c.innerHTML = '<p>Ajuste as duas frequências até os valores exibidos e sincronize.</p><div class="opcoes"><label>Canal A: <b>' + alvos[0] + '</b><input id="canal-a" type="range" min="0" max="100" value="0"></label><label>Canal B: <b>' + alvos[1] + '</b><input id="canal-b" type="range" min="0" max="100" value="0"></label></div>';
    botao('Sincronizar', () => { const a = +c.querySelector('#canal-a').value, b = +c.querySelector('#canal-b').value; if (Math.abs(a-alvos[0]) <= 3 && Math.abs(b-alvos[1]) <= 3) ok(); else feedback('Os canais ainda estão fora da frequência. Ajuste e tente de novo.', false); }, c);
  },
  (c, ok) => {
    c.innerHTML = '<p>Calibre o radar clicando nos setores na ordem sinalizada.</p><p class="expr">Noroeste → Sudeste → Norte</p><div class="grade" id="setores"></div><p id="radar-status"></p>';
    const ordem = [0, 3, 1]; let passo = 0;
    ['Noroeste', 'Norte', 'Sul', 'Sudeste'].forEach((nome, i) => botao(nome, () => {
      if (i === ordem[passo]) { passo++; c.querySelector('#radar-status').textContent = `Setores calibrados: ${passo}/3`; if (passo === ordem.length) ok(); }
      else { passo = 0; c.querySelector('#radar-status').textContent = 'Leitura perdida. Recomece a sequência.'; }
    }, c.querySelector('#setores')));
  },
  (c, ok) => {
    c.innerHTML = '<p>Estabilize o reator entre 55 e 85 e confirme a potência.</p><input id="potencia" type="range" min="0" max="100" value="0"><p>Potência: <b id="potencia-num">0%</b></p>';
    const slider = c.querySelector('#potencia');
    slider.oninput = () => c.querySelector('#potencia-num').textContent = slider.value + '%';
    botao('Estabilizar reator', () => { const n = +slider.value; if (n >= 55 && n <= 85) ok(); else feedback('Potência fora da faixa segura (55%–85%).', false); }, c);
  }
];
