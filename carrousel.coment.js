const wrapper = document.querySelector('#comentarios-wrapper');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const reviewForm = document.querySelector('#review-form');
let index = 0;
let slides = [];

// 🟢 Agregar comentario al carrusel
function agregarComentario({ nombre, rating, comentario, archivos }) {
  const estrellas = '⭐'.repeat(rating);
  let mediaHTML = '';

  // ✅ Permitir imágenes y videos
  archivos.forEach((file) => {
    const url = URL.createObjectURL(file);

    if (file.type.startsWith('image/')) {
      mediaHTML += `<img src="${url}" alt="Imagen del comentario">`;
    } else if (file.type.startsWith('video/')) {
      mediaHTML += `
        <div class="comentario-video">
          <video controls preload="metadata" style="width:100%; height:auto; object-fit:cover;">
            <source src="${url}" type="${file.type}">
            Tu navegador no soporta el video.
          </video>
        </div>`;
    }
  });

  // TU CÓDIGO AQUÍ
  const nuevoSlide = document.createElement('div');
  nuevoSlide.classList.add('comentario-slide');
  nuevoSlide.innerHTML = `
    <div class="comentario-info">
      <div class="comentario-header">
        <img src="https://i.pravatar.cc/80?u=${nombre}" alt="${nombre}" class="comentario-img">
        <div>
          <h3>${nombre}</h3>
          <span>Nuevo cliente</span>
          <div class="comentario-estrellas">${estrellas}</div>
        </div>
      </div>
      <p class="comentario-text">"${comentario}"</p>
    </div>
    <div class="comentario-fotos">${mediaHTML}</div>
  `;

  wrapper.appendChild(nuevoSlide);
  slides = document.querySelectorAll('.comentario-slide');
  showSlide(slides.length - 1); // Muestra el nuevo comentario
}

// 🟢 Función para mostrar el slide actual y pausar videos de slides ocultos
function showSlide(i) {
  if (!slides.length) return;
  index = (i + slides.length) % slides.length;

  wrapper.style.transform = `translateX(-${index * 100}%)`;

  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);

    // Pausar videos de slides ocultos
    const videos = slide.querySelectorAll('video');
    videos.forEach(v => {
      if (idx === index) return; // Mantener visible
      v.pause();
      v.currentTime = 0;
    });
  });
}

// 🟢 Navegación manual
nextBtn.addEventListener('click', () => showSlide(index + 1));
prevBtn.addEventListener('click', () => showSlide(index - 1));

// 🟢 Auto-rotación
setInterval(() => showSlide(index + 1), 7000);

// 🟢 Captura del formulario
reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.querySelector('#name').value || 'Anónimo';
  const rating = parseInt(document.querySelector('#rating').value) || 5;
  const comentario = document.querySelector('#comment').value;
  const archivos = Array.from(document.querySelector('#files').files);

  agregarComentario({ nombre, rating, comentario, archivos });

  reviewForm.reset();
  alert('¡Tu comentario se agregó correctamente!');
});

// 🟢 Inicia sin comentarios
showSlide(0);
