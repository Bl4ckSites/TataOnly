/**********************************************************************************
 * Nome: javascript.js
 * Descrição: Manipulação de interações, proteções e animações do site
 * Créditos: Desenvolvido por roger_19y - Versão 3.0 otimizada
 **********************************************************************************/

// Variável global para armazenar o alerta customizado atualmente exibido
let currentAlert = null;

/**
 * Exibe um alerta customizado logo abaixo do elemento alvo (targetEl).
 * @param {string} message - Mensagem do alerta.
 * @param {Element} targetEl - Elemento abaixo do qual o alerta será posicionado.
 */
function customAlert(message, targetEl) {
  // Remove qualquer alerta existente
  if (currentAlert) {
    currentAlert.remove();
    currentAlert = null;
  }
  
  // Cria o elemento de alerta
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  alertBox.textContent = message;
  
  // Calcula a posição logo abaixo do elemento clicado
  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    alertBox.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    alertBox.style.left = (rect.left + window.scrollX + (rect.width / 2)) + 'px';
    alertBox.style.transform = 'translate(-50%, 0)';
  } else {
    alertBox.style.top = '20px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
  }
  
  document.body.appendChild(alertBox);
  currentAlert = alertBox;

  // Remove o alerta após 3 segundos com efeito fade-out
  setTimeout(() => {
    alertBox.style.animation = 'fadeOut 0.5s forwards';
    alertBox.addEventListener('animationend', () => {
      alertBox.remove();
      currentAlert = null;
    });
  }, 3000);
}

/**
 * Protege imagens de ações indesejadas e configura placeholders
 */
function protectImages() {
  try {
    // Impede o menu de contexto para elementos protegidos
    document.addEventListener('contextmenu', function(e) {
      if (e.target.classList.contains('preview-image') || 
          e.target.classList.contains('profile-photo')) {
        e.preventDefault();
      }
    });

    // Impede o arrastar das imagens protegidas
    const protectedImages = document.querySelectorAll('.preview-image, .profile-photo');
    protectedImages.forEach(img => {
      img.addEventListener('dragstart', function(e) {
        e.preventDefault();
      });
    });

    console.log("Proteções de imagens aplicadas com sucesso.");
  } catch (err) {
    console.error("Erro na função protectImages:", err);
  }
}

/**
 * Configura os eventos para as pré-visualizações protegidas.
 */
function setupPreviews() {
  const previewItems = document.querySelectorAll('.preview-item');

  previewItems.forEach((item) => {
    // Remove o href para prevenir redirecionamento
    item.removeAttribute('href');
    
    // Bloqueia ações de clique direito e arrastar
    item.addEventListener('contextmenu', (e) => e.preventDefault());
    item.addEventListener('dragstart', (e) => e.preventDefault());

    // Ao clicar na pré-visualização, exibe o alerta customizado
    item.addEventListener('click', function(e) {
      e.preventDefault();
      customAlert('Compre esse pacote para estar acessando o conteúdo!!!', item);
    });
  });
}

/**
 * Ativa proteções contra capturas de tela e atalhos de cópia.
 */
function enhanceSecurity() {
  // Bloqueia o uso da tecla Print Screen
  document.addEventListener('keydown', function(e) {
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      customAlert('Capturas de tela estão desativadas neste site.');
    }
  });

  // Bloqueia a seleção de texto em elementos protegidos
  document.addEventListener('selectstart', function(e) {
    if (e.target.classList.contains('preview-image') || 
        e.target.classList.contains('profile-photo')) {
      e.preventDefault();
    }
  });

  // Desativa atalhos de teclado para copiar/colar
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && ['c', 'x', 'v', 'C', 'X', 'V'].includes(e.key)) {
      const protectedElements = document.querySelectorAll('.preview-image, .profile-photo');
      protectedElements.forEach(el => {
        if (el.contains(document.activeElement)) {
          e.preventDefault();
          customAlert('Ações de copiar/colar estão desativadas para conteúdo protegido.');
        }
      });
    }
  });
}

/**
 * Limita o zoom da página para dispositivos móveis
 */
function limitZoom() {
  document.addEventListener('touchmove', function(e) {
    if (window.visualViewport.scale > 1.5) {
      e.preventDefault();
    }
  }, { passive: false });

  const viewportMeta = document.createElement('meta');
  viewportMeta.name = 'viewport';
  viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.5, user-scalable=yes';
  document.head.appendChild(viewportMeta);
}

/**
 * Efeito de parallax na foto de capa
 */
function setupParallax() {
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const coverPhoto = document.querySelector('.cover-photo');
    if (coverPhoto) {
      coverPhoto.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    }
  });
}

/**
 * Inicialização principal quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
  protectImages();
  setupPreviews();
  enhanceSecurity();
  limitZoom();
  setupParallax();

  // Adiciona classe para animações após carregamento
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});
 // Desabilita o menu de contexto para ajudar na segurança (impede downloads via clique direito)
    document.addEventListener('contextmenu', event => event.preventDefault());
    
    // Carregamento da página para disparar as transições
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
    });
    
    // Lógica para rotação 360° da foto de perfil ao ser clicada
    const profileFrame = document.getElementById('profileFrame');
    profileFrame.addEventListener('click', () => {
      profileFrame.style.animation = 'rotateProfile 1s ease forwards';
      // Remover o estilo de animação para permitir nova interação
      profileFrame.addEventListener('animationend', () => {
        profileFrame.style.animation = '';
      }, {once: true});
    });
    
    // Lógica para ampliar a foto do card num overlay centralizado
    const overlay = document.getElementById('overlay');
    const overlayImage = document.getElementById('overlayImage');
    const photoCards = document.querySelectorAll('.photo-card');
    
    photoCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.querySelector('img').getAttribute('src');
        overlayImage.setAttribute('src', imgSrc);
        overlay.classList.add('active');
      });
      // Também permite navegação por teclado
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const imgSrc = card.querySelector('img').getAttribute('src');
          overlayImage.setAttribute('src', imgSrc);
          overlay.classList.add('active');
        }
      });
    });
    
    // Fechar o overlay quando clicado ou pressionar "ESC"
    overlay.addEventListener('click', () => overlay.classList.remove('active'));
    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape" && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
      }
    });
    
    // Lógica simples para o carrossel
    const carouselInner = document.getElementById('carouselInner');
    const arrowLeft = document.getElementById('arrowLeft');
    const arrowRight = document.getElementById('arrowRight');
    let currentIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    
    function updateCarousel() {
      carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    arrowLeft.addEventListener('click', () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      updateCarousel();
    });
    
    arrowRight.addEventListener('click', () => {
      currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      updateCarousel();
    });
    
    // Cursor personalizado (exemplo básico de movimentação)
    const customCursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', () => {
      customCursor.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
      customCursor.classList.remove('click');
    });