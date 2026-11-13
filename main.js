const NOMES = ['Oxigênio', 'Combustível', 'Energia', 'Motor', 'Controle'];
const TXT = { bloqueada: 'Bloqueada', aberta: 'Acessível', consertada: 'Reparado' };
// Posição e tamanho das salas: [x, y, largura, altura]. As 4 primeiras são os sistemas; a última é o controle.
const POS = [[20, 20, 190, 110], [245, 20, 190, 110], [470, 20, 190, 110], [695, 20, 190, 110], [350, 370, 200, 110]];
const S = {}, teclas = {};
const $ = s => document.querySelector(s);

// Centro da porta de cada sala (embaixo nas de cima; em cima na sala de controle)
function porta(i) { const [x, y, w, h] = POS[i]; return [x + w / 2, i < 4 ? y + h : y]; }

function iniciar() {
  Object.assign(S, { ativo: true, aberto: false, est: Array(5).fill('bloqueada'), x: 440, y: 250, fim: Date.now() + 360000 });
  const n = $('#nave');
  n.className = ''; n.innerHTML = '';
  POS.forEach(([x, y, w, h], i) => {
    const s = document.createElement('div');
    s.id = 's' + i;
    s.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    s.innerHTML = `<b>${NOMES[i]}</b><small></small><i class="porta"></i>`;
    n.appendChild(s);
  });
  n.insertAdjacentHTML('beforeend', '<div id="jogador"></div>');
  ['#inicio', '#fim'].forEach(s => $(s).hidden = true);
  ['#hud', '#nave'].forEach(s => $(s).hidden = false);
  pintar();
  requestAnimationFrame(loop);
}

// Atualiza cores das salas, textos de estado e o progresso. Libera o controle com 4 sistemas reparados.
function pintar() {
  S.est.forEach((e, i) => {
    const s = $('#s' + i);
    s.className = 'sala ' + e + (i === 4 ? ' ctrl' : '');
    s.querySelector('small').textContent = TXT[e];
  });
  const n = S.est.slice(0, 4).filter(e => e === 'consertada').length;
  $('#prog').textContent = `Sistemas reparados: ${n}/4`;
  if (n === 4 && S.est[4] === 'bloqueada') { S.est[4] = 'aberta'; pintar(); }
}

function aviso(t) {
  const a = $('#aviso');
  a.textContent = t; a.hidden = false;
  clearTimeout(aviso.id);
  aviso.id = setTimeout(() => a.hidden = true, 2500);
}

// Abre a janela de desafio/tarefa. O movimento fica pausado enquanto ela está aberta.
function abrir(titulo, instrucao, monta) {
  S.aberto = true;
  $('#mt').textContent = titulo; $('#mi').textContent = instrucao;
  $('#mc').innerHTML = ''; $('#mf').textContent = '';
  $('#modal').hidden = false;
  monta($('#mc'));
}
function fecharModal() { $('#modal').hidden = true; S.aberto = false; }

// Índice da sala cuja porta está perto do jogador (ou -1)
function perto() {
  const cx = S.x + 11, cy = S.y + 11;
  return POS.findIndex((_, i) => { const [px, py] = porta(i); return Math.hypot(cx - px, cy - py) < 55; });
}

function interagir() {
  if (!S.ativo || S.aberto) return;
  const i = perto();
  if (i < 0) return;
  const e = S.est[i];
  if (i === 4) {
    if (e !== 'aberta') return aviso('Conserte os 4 sistemas para liberar o controle.');
    return abrir('Painel de navegação', 'Confirme a nova rota para retomar o rumo.', c => botao('Retomar o rumo', () => fim(true), c));
  }
  if (e === 'consertada') return aviso('Este sistema já foi reparado.');
  if (e === 'bloqueada') {
    abrir('Porta: ' + NOMES[i], 'Resolva o desafio lógico para abrir a porta.', c =>
      DESAFIOS[i](c, () => { S.est[i] = 'aberta'; fecharModal(); pintar(); aviso('Porta aberta. Interaja de novo para entrar.'); }));
  } else {
    abrir('Reparo: ' + NOMES[i], 'Complete a tarefa para consertar o sistema.', c =>
      TAREFAS[i](c, () => { S.est[i] = 'consertada'; fecharModal(); pintar(); aviso('Sistema reparado!'); }));
  }
}

// Movimento com colisão contra as salas
function bate(x, y) { return POS.some(([a, b, w, h]) => x < a + w && x + 22 > a && y < b + h && y + 22 > b); }
function tentar(x, y) { if (x < 0 || y < 0 || x > 878 || y > 478 || bate(x, y)) return; S.x = x; S.y = y; }
function mover() {
  const dx = (teclas.arrowright || teclas.d ? 1 : 0) - (teclas.arrowleft || teclas.a ? 1 : 0);
  const dy = (teclas.arrowdown || teclas.s ? 1 : 0) - (teclas.arrowup || teclas.w ? 1 : 0);
  tentar(S.x + dx * 3, S.y);
  tentar(S.x, S.y + dy * 3);
  $('#jogador').style.transform = `translate(${S.x}px,${S.y}px)`;
}

function loop() {
  if (!S.ativo) return;
  const r = Math.max(0, S.fim - Date.now()), seg = Math.ceil(r / 1000);
  $('#tempo').textContent = String(Math.floor(seg / 60)).padStart(2, '0') + ':' + String(seg % 60).padStart(2, '0');
  $('#tempo').classList.toggle('critico', r < 60000);
  if (r === 0) return fim(false);
  if (!S.aberto) mover();
  $('#dica').hidden = S.aberto || perto() < 0;
  requestAnimationFrame(loop);
}

function fim(venceu) {
  S.ativo = false;
  fecharModal();
  $('#dica').hidden = true;
  if (!venceu) $('#nave').classList.add('explode');
  setTimeout(() => {
    $('#ft').textContent = venceu ? 'A nave retomou o rumo!' : 'A nave explodiu';
    $('#fp').textContent = venceu ? 'Os quatro sistemas foram reparados a tempo. Boa viagem, tripulação.' : 'O tempo acabou antes de os sistemas serem consertados.';
    $('#fim').hidden = false;
  }, venceu ? 0 : 1500);
}

document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (S.ativo && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k) && !S.aberto) e.preventDefault();
  teclas[k] = true;
  if (k === 'escape' && S.aberto) fecharModal();
  if ((k === 'e' || k === 'enter') && !e.repeat) interagir();
});
document.addEventListener('keyup', e => delete teclas[e.key.toLowerCase()]);
$('#dica').onclick = interagir;
$('#fechar').onclick = fecharModal;
$('#jogar').onclick = $('#denovo').onclick = iniciar;
