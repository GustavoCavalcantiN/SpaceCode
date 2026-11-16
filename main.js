const NOMES = [
  ['Oxigênio', 'Combustível', 'Energia', 'Motor', 'Acoplamento'],
  ['Escudos', 'Comunicações', 'Sensores', 'Reator auxiliar', 'Controle central']
];
const NAVES = ['Aurora', 'Atlas'];
const TXT = { bloqueada: 'Bloqueada', aberta: 'Acessível', consertada: 'Reparado' };
const POS = [[20, 20, 190, 110], [245, 20, 190, 110], [470, 20, 190, 110], [695, 20, 190, 110], [350, 370, 200, 110]];
const S = {}, teclas = [];
const $ = s => document.querySelector(s);
function porta(i) { const [x, y, w, h] = POS[i]; return [x + w / 2, i < 4 ? y + h : y]; }
function estados() { return S.fases[S.fase]; }
function nomes() { return NOMES[S.fase - 1]; }

function iniciar() {
  Object.assign(S, { ativo: true, aberto: false, fase: 1, ponte: false, pendente: null,
    fases: [Array(5).fill('bloqueada'), Array(5).fill('bloqueada')], x: 440, y: 250,
    inicio: Date.now(), fim: Date.now() + 240000, ultimoDano: 0, modoQuiz: 'normal' });
  construirMapa();
  ['#inicio', '#fim'].forEach(s => $(s).hidden = true);
  ['#hud', '#nave'].forEach(s => $(s).hidden = false);
  $('#nave').className = '';
  ajustarMapa(); pintar(); requestAnimationFrame(loop);
}

function construirMapa() {
  const nave = $('#nave'); nave.innerHTML = '<div id="mapa"></div>';
  const mapa = $('#mapa');
  POS.forEach(([x, y, w, h], i) => {
    const el = document.createElement('div'); el.id = 's' + i;
    el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    el.innerHTML = `<b>${nomes()[i]}</b><small></small><i class="porta"></i>`; mapa.appendChild(el);
  });
  mapa.insertAdjacentHTML('beforeend', '<div id="ponte"><b>PONTE DE ACOPLAMENTO</b><small>Pressione E para atravessar</small></div><div id="incendio"><span>🔥</span></div><div id="jogador"></div>');
  $('#ponte').style.left = S.fase === 1 ? '784px' : '0px';
  S.x = S.fase === 1 ? 440 : 100; S.y = 250;
  $('#nave-titulo').textContent = `Nave ${NAVES[S.fase - 1]} · Fase ${S.fase}/2`;
  ajustarMapa(); pintar();
}
function ajustarMapa() { const m = $('#mapa'), n = $('#nave'); if (m && n) m.style.transform = `scale(${Math.min(n.clientWidth / 900, n.clientHeight / 500)})`; }

function pintar() {
  const est = estados();
  est.forEach((e, i) => { const s = $('#s' + i); s.className = 'sala ' + e + (i === 4 ? ' ctrl' : ''); s.querySelector('small').textContent = TXT[e]; });
  const n = est.slice(0, 4).filter(e => e === 'consertada').length;
  $('#prog').textContent = `Sistemas reparados: ${n}/4`;
  $('#ponte').classList.toggle('liberada', S.ponte);
  if (n === 4 && est[4] === 'bloqueada') { est[4] = 'aberta'; pintar(); }
}
function aviso(t) { const a = $('#aviso'); a.textContent = t; a.hidden = false; clearTimeout(aviso.id); aviso.id = setTimeout(() => a.hidden = true, 2600); }
function abrir(titulo, instrucao, monta) { S.aberto = true; S.tipoModal = /^(Porta:|Desvio:)/.test(titulo) ? 'desafio' : 'tarefa'; $('#mt').textContent = titulo; $('#mi').textContent = instrucao; $('#mc').innerHTML = ''; $('#mf').textContent = ''; $('#modal').hidden = false; monta($('#mc')); }
function fecharModal() { $('#modal').hidden = true; S.aberto = false; S.modoQuiz = 'normal'; }
function salaAtual() { const cx = S.x + 11, cy = S.y + 11; return POS.findIndex(([x, y, w, h]) => cx > x && cx < x + w && cy > y && cy < y + h); }
function perto() { const cx = S.x + 11, cy = S.y + 11; return POS.findIndex((_, i) => { const [px, py] = porta(i); return Math.hypot(cx - px, cy - py) < 55; }); }
function pertoPonte() { return S.fase === 1 ? S.x > 765 && S.y > 180 && S.y < 310 : S.x < 145 && S.y > 180 && S.y < 310; }
function entrarSala(i) { const [x, y, w, h] = POS[i]; S.x = x + w / 2 - 11; S.y = i < 4 ? y + h - 34 : y + 12; $('#jogador').style.transform = `translate(${S.x}px,${S.y}px)`; }

function responderDesafio(i, ok) {
  S.indiceDesafio = i;
  S.modoQuiz = S.pendente === null ? 'normal' : 'desvio';
  const desafios = S.fase === 1 ? DESAFIOS : DESAFIOS_ATLAS;
  desafios[i]($('#mc'), () => {
    if (S.modoQuiz === 'desvio') {
      S.pendente = null; fecharModal();
      if (estados()[i] === 'bloqueada') { estados()[i] = 'aberta'; pintar(); entrarSala(i); }
      aviso('Desafio de desvio resolvido. Agora volte à porta que ficou pendente.');
      return;
    }
    ok();
  });
}
function erroDesafio() {
  if (S.modoQuiz !== 'desvio') {
    S.pendente = S.indiceDesafio;
    fecharModal();
    aviso('Resposta incorreta! Vá a outra sala e resolva o desafio dela para poder voltar.');
  }
}
function interagir() {
  if (!S.ativo || S.aberto) return;
  if (pertoPonte()) {
    if (S.fase === 1 && !S.ponte) return aviso('Conserte os quatro sistemas e libere o acoplamento para abrir a ponte.');
    S.fase = S.fase === 1 ? 2 : 1; construirMapa(); aviso(`Você chegou à nave ${NAVES[S.fase - 1]}.`); return;
  }
  const dentro = salaAtual(), i = dentro >= 0 ? dentro : perto(); if (i < 0) return;
  const est = estados(), e = est[i];
  if (S.pendente !== null) {
    if (i === S.pendente) return aviso('Resolva primeiro o desafio de outra sala para voltar a esta porta.');
    if (i === 4) return aviso('Escolha outra sala para resolver o desafio de desvio.');
    if (dentro !== i) {
      if (e === 'bloqueada') return abrir(`Desvio: porta ${nomes()[i]}`, 'Você errou antes. Resolva corretamente este outro desafio para poder voltar.', () => responderDesafio(i, () => {}));
      if (e === 'aberta' || e === 'consertada') { entrarSala(i); aviso('Entre na sala e pressione E para resolver o desafio de desvio.'); return; }
    } else return abrir(`Desvio: sala ${nomes()[i]}`, 'Resolva corretamente este desafio para poder voltar à porta pendente.', () => responderDesafio(i, () => {}));
  }
  if (i === 4) {
    if (e !== 'aberta') return aviso('Conserte os quatro sistemas para liberar o controle.');
    if (dentro !== 4) return aviso('A porta está liberada. Entre na sala de controle.');
    if (S.fase === 1) return abrir('Acoplamento da ponte', 'Os quatro sistemas da Aurora estão ativos. Liberar a passagem para a nave Atlas?', c => botao('Liberar ponte', () => { S.ponte = true; fecharModal(); pintar(); aviso('Ponte liberada! Vá até a passagem à direita.'); }, c));
    return abrir('Painel de navegação', 'As duas naves foram reparadas. Confirme a rota para retomar o rumo.', c => botao('Retomar o rumo', () => fim(true), c));
  }
  if (dentro !== i) {
    if (e === 'bloqueada') {
      S.modoQuiz = 'normal';
      abrir('Porta: ' + nomes()[i], 'Resolva o desafio lógico para liberar a entrada.', () => responderDesafio(i, () => { est[i] = 'aberta'; fecharModal(); pintar(); entrarSala(i); aviso('Porta liberada. Pressione E dentro da sala para reparar.'); }));
    } else if (e === 'aberta') aviso('Atravesse a porta liberada para acessar o sistema.');
    else aviso('Este sistema já foi reparado.'); return;
  }
  if (e === 'consertada') return aviso('Este sistema já foi reparado.');
  const tasks = S.fase === 1 ? TAREFAS : TAREFAS_ATLAS;
  abrir('Reparo: ' + nomes()[i], 'Complete a tarefa prática para restaurar este sistema.', c => tasks[i](c, () => { est[i] = 'consertada'; fecharModal(); pintar(); aviso('Sistema reparado!'); }));
}

function dentroDaSala(i, x, y) { const [a, b, w, h] = POS[i], cx = x + 11, cy = y + 11; return cx > a && cx < a + w && cy > b && cy < b + h; }
function naAbertura(i, x, y) { const [px, py] = porta(i), [, b, , h] = POS[i], parede = i < 4 ? b + h : b, cy = y + 11; return Math.abs(x + 11 - px) < 28 && Math.abs(cy - parede) < 23; }
function atravessouPorta(i, x1, y1, x2, y2) { const [px, py] = porta(i), [, b, , h] = POS[i], parede = i < 4 ? b + h : b, a = y1 + 11 - parede, c = y2 + 11 - parede; return (a <= 0 && c >= 0 || a >= 0 && c <= 0) && a !== c && Math.abs((x1 + x2) / 2 + 11 - px) < 28; }
function bate(x, y) {
  if (S.fase === 1 && !S.ponte && x > 790 && y > 180 && y < 310) return true;
  if (S.fase === 2 && x < 35 && y > 180 && y < 310) return true;
  return POS.some(([a, b, w, h], i) => {
    if (!(x < a + w && x + 22 > a && y < b + h && y + 22 > b)) return false;
    if (estados()[i] === 'aberta' || estados()[i] === 'consertada') { if (dentroDaSala(i, S.x, S.y) && dentroDaSala(i, x, y)) return false; if (naAbertura(i, x, y) || atravessouPorta(i, S.x, S.y, x, y)) return false; }
    return true;
  });
}
function tentar(x, y) { if (x < 0 || y < 0 || x > 878 || y > 478 || bate(x, y)) return; S.x = x; S.y = y; }
function mover() {
  const dx = (teclas.arrowright || teclas.d ? 1 : 0) - (teclas.arrowleft || teclas.a ? 1 : 0), dy = (teclas.arrowdown || teclas.s ? 1 : 0) - (teclas.arrowup || teclas.w ? 1 : 0);
  tentar(S.x + dx * 3, S.y); tentar(S.x, S.y + dy * 3); $('#jogador').style.transform = `translate(${S.x}px,${S.y}px)`;
}
function atualizarFogo(agora, restante) {
  const pct = Math.min(100, Math.floor((1 - restante / 240000) * 100));
  $('#fogo-nivel').style.width = pct + '%'; $('#fogo-pct').textContent = pct + '%';
  const fogo = $('#incendio'), tamanho = 54 + pct * 2.1;
  fogo.style.width = tamanho + 'px'; fogo.style.height = (34 + pct * .72) + 'px'; fogo.style.opacity = .48 + pct / 200;
  fogo.style.left = (423 - tamanho / 2) + 'px'; fogo.style.top = (250 - (34 + pct * .72) / 2) + 'px';
  if (pct >= 20 && S.x + 22 > 423 - tamanho / 2 && S.x < 423 + tamanho / 2 && S.y + 22 > 250 - (34 + pct * .72) / 2 && S.y < 250 + (34 + pct * .72) / 2 && agora - S.ultimoDano > 1800) {
    S.fim -= 7000; S.ultimoDano = agora; aviso('As chamas atingiram você! 7 segundos foram perdidos.');
  }
}
function loop() {
  if (!S.ativo) return;
  let r = Math.max(0, S.fim - Date.now()), seg = Math.ceil(r / 1000);
  $('#tempo').textContent = String(Math.floor(seg / 60)).padStart(2, '0') + ':' + String(seg % 60).padStart(2, '0');
  $('#tempo').classList.toggle('critico', r < 60000); atualizarFogo(Date.now(), r);
  if (S.fim <= Date.now()) return fim(false);
  if (!S.aberto) mover();
  const dentro = salaAtual(), prox = perto(), pp = pertoPonte();
  $('#dica').hidden = S.aberto || (dentro < 0 && prox < 0 && !pp);
  if (!$('#dica').hidden) {
    if (pp) $('#dica').textContent = S.fase === 1 ? (S.ponte ? 'Atravessar para a Atlas (E)' : 'Ponte bloqueada') : 'Voltar à Aurora (E)';
    else { const i = dentro >= 0 ? dentro : prox; $('#dica').textContent = dentro >= 0 ? (i === 4 ? 'Controle (E)' : estados()[i] === 'consertada' ? 'Sistema reparado' : 'Reparar / desafio (E)') : estados()[i] === 'bloqueada' ? 'Desafio da porta (E)' : 'Entrar na sala (E)'; }
  }
  requestAnimationFrame(loop);
}
function fim(venceu) { S.ativo = false; fecharModal(); $('#dica').hidden = true; if (!venceu) $('#nave').classList.add('explode'); setTimeout(() => { $('#ft').textContent = venceu ? 'As naves retomaram o rumo!' : 'A nave explodiu'; $('#fp').textContent = venceu ? 'Aurora e Atlas foram reparadas. A tripulação está em segurança.' : 'O incêndio consumiu o tempo antes de a missão terminar.'; $('#fim').hidden = false; }, venceu ? 0 : 1500); }

document.addEventListener('keydown', e => { const k = e.key.toLowerCase(); if (S.ativo && ['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k) && !S.aberto) e.preventDefault(); teclas[k] = true; if (k === 'escape' && S.aberto) fecharModal(); if ((k === 'e' || k === 'enter') && !e.repeat) interagir(); });
document.addEventListener('keyup', e => delete teclas[e.key.toLowerCase()]);
window.addEventListener('resize', ajustarMapa); $('#dica').onclick = interagir; $('#fechar').onclick = fecharModal; $('#jogar').onclick = $('#denovo').onclick = iniciar;
