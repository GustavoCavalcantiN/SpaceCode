// Funções de apoio, usadas também em tarefas.js e main.js
function div(cls, pai) { const d = document.createElement('div'); d.className = cls; pai.appendChild(d); return d; }
function botao(txt, fn, pai) { const b = document.createElement('button'); b.textContent = txt; b.onclick = fn; pai.appendChild(b); return b; }
function feedback(t, bom) { const f = document.getElementById('mf'); f.textContent = t; f.className = bom ? 'ok' : 'erro'; }
function opcoes(c, lista, certa, dica, ok) {
  const g = div('opcoes', c);
  lista.slice().sort(() => Math.random() - 0.5).forEach(t => botao(t, () => t === certa ? ok() : feedback(dica, false), g));
}

// Desafios das portas (um por sala, na ordem do prompt).
// Cada função monta a tela dentro de c e chama ok() quando o jogador acerta.
const DESAFIOS = [
  // Sala 1 – Oxigênio: p ∧ ¬q só é verdadeira com p = V e q = F
  (c, ok) => {
    c.innerHTML = '<p>p: “o tanque reserva está ativo”<br>q: “o filtro está funcionando”</p><p class="expr">p ∧ ¬q</p><p>Configure p e q para a expressão ficar verdadeira.</p>';
    const v = { p: false, q: false }, g = div('opcoes', c);
    ['p', 'q'].forEach(k => {
      const b = botao(k + ' = Falso', () => { v[k] = !v[k]; b.textContent = k + ' = ' + (v[k] ? 'Verdadeiro' : 'Falso'); }, g);
    });
    botao('Confirmar', () => v.p && !v.q ? ok() : feedback('Com esses valores, p ∧ ¬q é falsa.', false), c);
  },
  // Sala 2 – Combustível: p ∨ ¬p é tautologia
  (c, ok) => {
    c.innerHTML = '<p>p: “o tanque auxiliar está disponível”</p><p class="expr">p ∨ ¬p</p><p>Classifique a expressão.</p>';
    opcoes(c, ['Tautologia', 'Contradição', 'Contingência'], 'Tautologia', 'Teste p verdadeiro e p falso: o resultado muda?', ok);
  },
  // Sala 3 – Energia: com p = V e q = F, p → q é falsa
  (c, ok) => {
    c.innerHTML = '<p>p: “o reator está ligado” (verdadeiro)<br>q: “a energia foi restaurada” (falso)</p><p class="expr">p → q</p><p>A implicação é verdadeira ou falsa?</p>';
    opcoes(c, ['Verdadeira', 'Falsa'], 'Falsa', 'Veja a tabela-verdade: o que acontece quando p é V e q é F?', ok);
  },
  // Sala 4 – Motor: ¬(p ∧ q) ≡ ¬p ∨ ¬q (De Morgan)
  (c, ok) => {
    c.innerHTML = '<p class="expr">¬(p ∧ q)</p><p>Qual expressão é logicamente equivalente?</p>';
    opcoes(c, ['¬p ∨ ¬q', '¬p ∧ ¬q', 'p ∨ q', '¬p ∧ q'], '¬p ∨ ¬q', 'Revise a lei de De Morgan.', ok);
  }
];
