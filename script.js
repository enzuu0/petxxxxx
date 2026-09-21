// ============================================
// Petshop PWA — script principal
// ============================================

// Registra o Service Worker (sw.js) — deixa o site funcionar offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registrado!', reg.scope))
      .catch(err => console.log('Falha ao registrar o Service Worker:', err));
  });
}

// ----- Menu mobile -----
const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu');

btnMenu.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  btnMenu.setAttribute('aria-expanded', String(aberto));
});

// Fecha o menu ao clicar em um link
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('aberto');
    btnMenu.setAttribute('aria-expanded', 'false');
  });
});

// ----- Indicador online/offline (recurso de PWA) -----
const statusConexao = document.getElementById('status-conexao');

function atualizarStatus() {
  if (navigator.onLine) {
    statusConexao.textContent = 'Você está online';
    statusConexao.classList.add('online');
    statusConexao.classList.remove('offline');
  } else {
    statusConexao.textContent = 'Você está offline — o app continua funcionando!';
    statusConexao.classList.add('offline');
    statusConexao.classList.remove('online');
  }
}

window.addEventListener('online', atualizarStatus);
window.addEventListener('offline', atualizarStatus);
atualizarStatus();

// ----- Toast (avisos rápidos) -----
const toast = document.getElementById('toast');
let toastTimer;

function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
}

// ----- Formulário de agendamento (demonstração) -----
const form = document.getElementById('form-agendamento');
const aviso = document.getElementById('form-aviso');

form.addEventListener('submit', evento => {
  evento.preventDefault();
  const nome = form.nome.value.trim();
  aviso.textContent = `Obrigado, ${nome}! Pedido enviado com sucesso. Entraremos em contato pelo WhatsApp.`;
  aviso.hidden = false;
  mostrarToast('Agendamento enviado!');
  form.reset();
});
