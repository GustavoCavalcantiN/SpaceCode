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
