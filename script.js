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

// ============================================
// Instalação do PWA (botão "Instalar App")
// ============================================
let deferredPrompt = null;
const btnInstalar = document.getElementById('btn-instalar');
const modalInstalacao = document.getElementById('modal-instalacao');
const modalFechar = document.getElementById('modal-fechar');
const modalOk = document.getElementById('modal-ok');

// Detecta se o app já está rodando em modo standalone (já instalado/aberto da tela inicial)
function appEmModoStandalone() {
  // Android/Chrome/Edge/Desktop (display-mode: standalone)
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  // iOS Safari: window.navigator.standalone é true quando aberto pela tela inicial
  if (window.navigator.standalone === true) return true;
  return false;
}

// Detecta iPhone/iPad (inclui iPadOS 13+, que se identifica como MacIntel com touch)
function ehIOS() {
  const ua = window.navigator.userAgent || '';
  if (/iPhone|iPad|iPod/.test(ua)) return true;
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
  return false;
}

// Captura o prompt nativo de instalação (Chrome, Edge, Opera, Android)
// e guarda para abrir quando o usuário clicar no botão.
window.addEventListener('beforeinstallprompt', (event) => {
  // Cancela o mini-infobar padrão do navegador para usar o nosso botão
  event.preventDefault();
  deferredPrompt = event;
  // Mostra o botão somente em Android/desktop Chromium (iOS usa fluxo próprio)
  if (!appEmModoStandalone() && !ehIOS()) {
    btnInstalar.hidden = false;
  }
});

// Clique no botão "Instalar App"
btnInstalar.addEventListener('click', async () => {
  // iPhone/iPad: o Safari não dispara beforeinstallprompt — mostra as instruções
  if (ehIOS()) {
    abrirModalInstalacao();
    return;
  }
  // Android/Desktop: usa o prompt nativo capturado
  if (!deferredPrompt) return;
  btnInstalar.hidden = true; // esconde enquanto o prompt nativo está aberto
  deferredPrompt.prompt();
  const escolha = await deferredPrompt.userChoice;
  if (escolha.outcome === 'accepted') {
    mostrarToast('Instalando o Petshop...');
  } else {
    // Usuário cancelou — mostra o botão novamente
    btnInstalar.hidden = false;
  }
  deferredPrompt = null;
});

// Detecta quando o PWA foi instalado com sucesso e esconde o botão
window.addEventListener('appinstalled', () => {
  btnInstalar.hidden = true;
  deferredPrompt = null;
  mostrarToast('Petshop instalado com sucesso!');
  console.log('PWA instalado');
});

// No iOS o beforeinstallprompt nunca dispara: mostramos o botão direto
// (desde que o app não esteja em modo standalone)
if (!appEmModoStandalone() && ehIOS()) {
  btnInstalar.hidden = false;
}

// ----- Modal de instruções (iPhone/iPad) -----
function abrirModalInstalacao() {
  modalInstalacao.hidden = false;
  modalFechar.focus();
}

function fecharModalInstalacao() {
  modalInstalacao.hidden = true;
  btnInstalar.focus();
}

modalFechar.addEventListener('click', fecharModalInstalacao);
modalOk.addEventListener('click', fecharModalInstalacao);

// Fecha o modal ao clicar no fundo (backdrop)
modalInstalacao.addEventListener('click', (event) => {
  if (event.target === modalInstalacao) fecharModalInstalacao();
});

// Fecha o modal com a tecla Esc
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalInstalacao.hidden) fecharModalInstalacao();
});

// Reavalia o modo standalone se o display-mode mudar (ex.: instalação concluída no desktop)
window.matchMedia('(display-mode: standalone)').addEventListener('change', (event) => {
  if (event.matches) btnInstalar.hidden = true;
});
