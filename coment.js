/*-------------------------------------------------
ENVIAR RESEÑA Y ADMINISTRARLA
-------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  // ----------------------
  // ENVÍO DE RESEÑA
  // ----------------------
  const form = document.getElementById("review-form");
  const reviewList = document.getElementById("review-list");
  const adminBtn = document.getElementById("admin-btn");
  let isAdmin = false;
  const adminPass = "1234"; // Cambiar por contraseña segura

  // Función para renderizar reseñas
  function renderReviews() {
    if (!reviewList) return;

    reviewList.innerHTML = "";
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    reviews.forEach((rev, index) => {
      const div = document.createElement("div");
      div.classList.add("review-card");
      div.innerHTML = `
        <strong>${rev.name}</strong> - ${rev.rating} ⭐<br>
        ${rev.comment}<br>
        ${
          rev.files
            ? rev.files
                .map(
                  (f) =>
                    `<img src="${f}" alt="Archivo" style="max-width:100px;margin:5px;">`
                )
                .join(" ")
            : ""
        }
        ${
          isAdmin
            ? `<br><button class="delete-btn" data-index="${index}">Eliminar</button>`
            : ""
        }
      `;
      reviewList.appendChild(div);
    });

    // Botones de eliminar solo si es admin
    if (isAdmin) {
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = parseInt(btn.dataset.index);
          deleteReview(index);
        });
      });
    }
  }

  // Función para eliminar reseña
  function deleteReview(index) {
    if (!confirm("¿Estás seguro que quieres eliminar este comentario?")) return;
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.splice(index, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    renderReviews();
  }

  // ----------------------
  // ENVÍO DE FORMULARIO
  // ----------------------
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

      const name = form.name.value;
      const email = form.email.value;
      const rating = form.rating.value;
      const comment = form.comment.value;

      // Manejo de archivos
      const filesInput = form.files.files;
      const filesArray = [];

      for (let i = 0; i < filesInput.length; i++) {
        const reader = new FileReader();
        reader.onload = function (event) {
          filesArray.push(event.target.result);
          if (filesArray.length === filesInput.length) saveReview();
        };
        reader.readAsDataURL(filesInput[i]);
      }

      if (filesInput.length === 0) saveReview();

      function saveReview() {
        const review = { name, email, rating, comment, files: filesArray };
        reviews.push(review);
        localStorage.setItem("reviews", JSON.stringify(reviews));
        form.reset();
        alert("¡Gracias por tu comentario!");
        renderReviews();
      }
    });
  }

  // ----------------------
  // ADMINISTRADOR
  // ----------------------
  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      const inputPass = prompt("Ingrese la contraseña de administrador:");
      if (inputPass === adminPass) {
        isAdmin = true;
        renderReviews();
        alert("Modo Admin activado: ahora puedes eliminar comentarios.");
      } else {
        alert("Contraseña incorrecta.");
      }
    });
  }

  // Render inicial
  renderReviews();
});
