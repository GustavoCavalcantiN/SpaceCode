// Tarefas de reparo (uma por sala, na ordem do prompt).
// Cada função monta a tela dentro de c e chama ok() quando o reparo termina.
const ARTES = {
  oxigenio: ['Oxigênio', '<rect x="175" y="18" width="58" height="74" rx="15"/><path d="M190 18v-9h28v9M190 57h28"/><circle cx="263" cy="34" r="5"/><circle cx="286" cy="22" r="3"/><path d="M260 62c12-12 23 12 35 0m-35 16c12-12 23 12 35 0"/>'],
  combustivel: ['Combustível', '<path d="M178 25h64v62h-64zM188 14h44v11M242 38h14v32l10 8V48l-10-10"/><path d="M184 61h52v21h-52z" fill="#f0a43a" stroke="none"/><path d="M190 46h40"/>'],
  energia: ['Energia', '<path d="M168 30h44v48h-44zM254 30h44v48h-44z"/><path d="M212 42c20 0 18 24 42 24" stroke="#e0543f"/><path d="M212 53c20 0 18-22 42-22" stroke="#4fc3d9"/><path d="M212 64c20 0 18 13 42 13" stroke="#f0c43a"/>'],
  motor: ['Motor', '<rect x="170" y="18" width="130" height="75" rx="8"/><path d="M190 78V38m28 40V32m28 46V44m28 34V28"/><circle cx="190" cy="38" r="7" fill="#e0543f"/><circle cx="218" cy="32" r="7" fill="#4fc3d9"/><circle cx="246" cy="44" r="7" fill="#f0c43a"/><circle cx="274" cy="28" r="7" fill="#5fd3a8"/>'],
  escudos: ['Escudos', '<path d="M235 16l42 14v26c0 22-18 34-42 45-24-11-42-23-42-45V30z"/><path d="M208 55l18 18 38-40"/><path d="M174 28l-13-8m119 8 13-8M166 74l-14 5m132-5 14 5"/>'],
  comunicacoes: ['Comunicações', '<path d="M210 83l22-43 22 43m-60 0h76M232 40V19"/><circle cx="232" cy="17" r="7"/><path d="M209 34a32 32 0 0 0 0 38m46-38a32 32 0 0 1 0 38M191 24a50 50 0 0 0 0 58m82-58a50 50 0 0 1 0 58"/>'],
  sensores: ['Sensores', '<circle cx="230" cy="55" r="38"/><circle cx="230" cy="55" r="24"/><circle cx="230" cy="55" r="9"/><path d="M230 55l29-25M192 55h76M230 17v76"/><circle cx="259" cy="30" r="5" fill="#f0a43a"/>'],
  reator: ['Reator auxiliar', '<circle cx="232" cy="55" r="39"/><circle cx="232" cy="55" r="26"/><circle cx="232" cy="55" r="11" fill="#4fc3d9"/><path d="M188 55h16m56 0h16M232 11v16m0 56v16M200 23l11 12m42 42 11 12m0-66-11 12m-42 42-11 12"/>']
};
function ilustrar(c, tipo) {
  const [rotulo, desenho] = ARTES[tipo], quadro = div('task-art', c);
  quadro.innerHTML = `<svg viewBox="0 0 420 110" role="img" aria-label="Ilustração do reparo: ${rotulo}"><rect class="art-fundo" x="1" y="1" width="418" height="108" rx="12"/><path class="art-trilho" d="M16 88H404"/><g class="art-desenho">${desenho}</g><text x="20" y="30">${rotulo.toUpperCase()}</text><circle class="art-luz" cx="389" cy="22" r="5"/></svg>`;
  c.prepend(quadro);
}
const TAREFAS = [
  // Sala 1 – Oxigênio: clicar de 1 a 10 em ordem; erro reinicia a sequência
  (c, ok) => {
    c.innerHTML = '<p>Clique nos botões de 1 a 10, em ordem crescente.</p>';
    ilustrar(c, 'oxigenio');
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
    ilustrar(c, 'combustivel');
    const niv = c.querySelector('#nivel'), pct = c.querySelector('#pct');
    let n = 20;
    const mostrar = () => { niv.style.height = n + '%'; pct.textContent = n + '%'; };
    mostrar();
    botao('Abastecer', () => { if (n >= 100) return; n = Math.min(100, n + 10); mostrar(); if (n === 100) ok(); }, c);
  },
  // Sala 3 – Energia: arrastar cada fio até o conector da mesma cor (arrastar e soltar com o mouse)
  (c, ok) => {
    c.innerHTML = '<p>Arraste cada fio até o conector da mesma cor.</p><div class="fios"><div id="fe"></div><div id="fd"></div></div>';
    ilustrar(c, 'energia');
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
    ilustrar(c, 'motor');
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
    ilustrar(c, 'escudos');
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
    c.innerHTML = '<p>Ajuste cada controle para chegar ao alvo. O valor atual aparece logo abaixo. Aceitamos uma diferença máxima de 5 MHz.</p><div class="frequencias"><label class="canal"><span>Canal A · alvo <b>' + alvos[0] + ' MHz</b></span><input id="canal-a" type="range" min="0" max="100" value="0"><small>Atual: <output id="atual-a">0</output> MHz</small></label><label class="canal"><span>Canal B · alvo <b>' + alvos[1] + ' MHz</b></span><input id="canal-b" type="range" min="0" max="100" value="0"><small>Atual: <output id="atual-b">0</output> MHz</small></label></div><p id="sinal-status" class="sinal-status">Ajuste os dois canais para sincronizar.</p>';
    ilustrar(c, 'comunicacoes');
    const canais = [c.querySelector('#canal-a'), c.querySelector('#canal-b')];
    const atualizar = () => {
      const valores = canais.map((input, i) => +input.value);
      valores.forEach((valor, i) => { c.querySelector(`#atual-${i ? 'b' : 'a'}`).value = valor; });
      const certo = valores.every((valor, i) => Math.abs(valor - alvos[i]) <= 5);
      c.querySelector('#sinal-status').textContent = certo ? 'Sinal alinhado! Pode sincronizar.' : 'Ainda fora do alvo: ajuste os controles até a diferença ficar em 5 MHz ou menos.';
      c.querySelector('#sinal-status').classList.toggle('alinhado', certo);
      return certo;
    };
    canais.forEach(input => input.addEventListener('input', atualizar));
    botao('Sincronizar', () => { if (atualizar()) ok(); else feedback('Confira o valor atual de cada canal e aproxime-o do alvo (diferença máxima: 5 MHz).', false); }, c);
  },
  (c, ok) => {
    c.innerHTML = '<p>Clique nos setores nesta ordem. Se errar, a sequência recomeça.</p><p class="expr">Noroeste → Sudeste → Norte</p><div class="grade setores-grade" id="setores"></div><p id="radar-status"></p>';
    ilustrar(c, 'sensores');
    const ordem = [0, 3, 1]; let passo = 0;
    ['Noroeste', 'Norte', 'Sul', 'Sudeste'].forEach((nome, i) => botao(nome, () => {
      if (i === ordem[passo]) { passo++; c.querySelector('#radar-status').textContent = `Setores calibrados: ${passo}/3`; if (passo === ordem.length) ok(); }
      else { passo = 0; c.querySelector('#radar-status').textContent = 'Leitura perdida. Recomece a sequência.'; }
    }, c.querySelector('#setores')));
  },
  (c, ok) => {
    c.innerHTML = '<p>Estabilize o reator entre 55 e 85 e confirme a potência.</p><input id="potencia" type="range" min="0" max="100" value="0"><p>Potência: <b id="potencia-num">0%</b></p>';
    ilustrar(c, 'reator');
    const slider = c.querySelector('#potencia');
    slider.oninput = () => c.querySelector('#potencia-num').textContent = slider.value + '%';
    botao('Estabilizar reator', () => { const n = +slider.value; if (n >= 55 && n <= 85) ok(); else feedback('Potência fora da faixa segura (55%–85%).', false); }, c);
  }
];
