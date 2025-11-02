// Variables globales
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlideSpan = document.getElementById('currentSlide');

// Función para mostrar una diapositiva específica
function showSlide(n) {
    // Remover clase active de todas las diapositivas
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Validar límites
    if (n >= totalSlides) {
        currentSlide = totalSlides - 1;
    }
    if (n < 0) {
        currentSlide = 0;
    }
    
    // Mostrar la diapositiva actual
    slides[currentSlide].classList.add('active');
    
    // Actualizar contador
    currentSlideSpan.textContent = currentSlide + 1;
    
    // Actualizar estado de los botones
    updateNavigationButtons();
    
    // Pausar todos los audios
    pauseAllAudios();
    
    // Scroll al inicio de la página
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Actualizar indicadores de progreso
    updateProgressIndicators();
}

// Función para cambiar de diapositiva
function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

// Función para actualizar el estado de los botones de navegación
function updateNavigationButtons() {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

// Función para pausar todos los audios
function pauseAllAudios() {
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        changeSlide(-1);
    }
    if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        changeSlide(1);
    }
    // Espacio para reproducir/pausar audio
    if (e.key === ' ' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        const currentAudio = slides[currentSlide].querySelector('audio');
        if (currentAudio) {
            if (currentAudio.paused) {
                currentAudio.play();
            } else {
                currentAudio.pause();
            }
        }
    }
});

// Soporte para gestos táctiles (móvil)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && !nextBtn.disabled) {
            // Swipe left - next slide
            changeSlide(1);
        } else if (diff < 0 && !prevBtn.disabled) {
            // Swipe right - previous slide
            changeSlide(-1);
        }
    }
}

// Función para ir a una diapositiva específica
function goToSlide(slideNumber) {
    if (slideNumber >= 0 && slideNumber < totalSlides) {
        currentSlide = slideNumber;
        showSlide(currentSlide);
    }
}

// Agregar indicadores de progreso
function createProgressIndicators() {
    const navigation = document.querySelector('.navigation');
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-indicators';
    progressContainer.style.cssText = `
        display: flex;
        gap: 8px;
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
    `;
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.style.cssText = `
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: ${i === currentSlide ? '#2D5E8E' : '#cbd5e1'};
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        dot.addEventListener('click', () => goToSlide(i));
        dot.addEventListener('mouseenter', () => {
            if (i !== currentSlide) {
                dot.style.background = '#64748b';
            }
        });
        dot.addEventListener('mouseleave', () => {
            if (i !== currentSlide) {
                dot.style.background = '#cbd5e1';
            }
        });
        
        progressContainer.appendChild(dot);
    }
    
    navigation.style.position = 'relative';
    navigation.style.marginBottom = '50px';
    navigation.appendChild(progressContainer);
}

// Actualizar indicadores de progreso
function updateProgressIndicators() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.style.background = index === currentSlide ? '#2D5E8E' : '#cbd5e1';
    });
}

// Manejo de errores para imágenes que no cargan
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #64748b;
                font-size: 1.2em;
                padding: 40px;
                text-align: center;
                border-radius: 8px;
            `;
            placeholder.textContent = '🖼️ Imagen no disponible';
            this.parentElement.appendChild(placeholder);
        });
    });
}

// Manejo de errores para audios que no cargan
function handleAudioErrors() {
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        audio.addEventListener('error', function() {
            this.style.display = 'none';
            const audioNote = document.createElement('div');
            audioNote.style.cssText = `
                padding: 15px;
                background: #fef3c7;
                border-radius: 8px;
                border: 2px dashed #fbbf24;
                color: #78350f;
                margin-top: 20px;
                text-align: center;
            `;
            audioNote.innerHTML = '🎤 <strong>Audio no disponible</strong> - El archivo de audio no se pudo cargar.';
            this.parentElement.appendChild(audioNote);
        });
    });
}

// Inicializar la presentación
function init() {
    showSlide(0);
    createProgressIndicators();
    updateProgressIndicators();
    handleImageErrors();
    handleAudioErrors();
    
    // Mensaje de bienvenida en consola
    console.log('%c¡Bienvenido a la presentación de Miguel de Cervantes!', 'color: #2D5E8E; font-size: 16px; font-weight: bold;');
    console.log('%cControles:', 'color: #64748b; font-size: 14px;');
    console.log('← → : Navegar entre diapositivas');
    console.log('Espacio: Reproducir/Pausar audio');
    console.log('Swipe: En dispositivos táctiles');
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Exportar funciones para uso externo si es necesario
window.cervantesPresentation = {
    goToSlide,
    changeSlide,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides
};