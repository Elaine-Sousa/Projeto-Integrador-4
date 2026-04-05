// ============================== INÍCIO DO SCRIPT ==============================

// Aguarda o HTML completo carregar antes de executar o JS
document.addEventListener("DOMContentLoaded", () => {

  // ============================== SELEÇÃO DE ELEMENTOS ==============================

  // Formulário de devolução (verifica dois possíveis IDs)
  const form = document.getElementById("formDevolucao") || document.getElementById("returnForm");

  // Botão "Minhas Devoluções"
  const myReturnsBtn = document.getElementById("myReturnsButton");

  // Container onde as devoluções serão exibidas
  const myReturnsContainer = document.getElementById("myReturns");

  // Modal para exibir imagens da devolução
  const modal = document.getElementById("imageModalReturn");

  // Container interno do modal para mostrar imagens
  const modalImagesContainer = document.getElementById("modalReturnImages");

  // ============================== ESTADO GLOBAL DA MODAL ==============================

  window.imagensAtuaisReturn = [];  // Armazena as imagens atuais da devolução
  window.indiceAtualReturn = 0;     // Índice da imagem exibida atualmente

  // ============================== ENVIO DO FORMULÁRIO ==============================

  if (form) {
    form.addEventListener("submit", async (e) => {

      e.preventDefault(); // Impede que a página recarregue ao enviar o formulário

      // ============================== PEGAR ID DO CLIENTE ==============================

      const clienteIdFromStorage = localStorage.getItem("cliente_id"); // Pega do localStorage
      const customerIdField = document.getElementById("customerId");   // Ou do campo input, se existir
      const cliente_id = clienteIdFromStorage || (customerIdField ? customerIdField.value.trim() : null);

      if (!cliente_id) {  // Se não tiver ID, impede envio
        alert("Você precisa estar logado para registrar uma devolução.");
        return;
      }

      // ============================== PEGAR DADOS DO FORM ==============================

      const orderNumber = document.getElementById("orderNumber").value.trim();
      const name = document.getElementById("name").value.trim();
      const reason = document.getElementById("reason").value.trim();
      const imagesInput = document.getElementById("images");

      if (!orderNumber || !name || !reason) { // Validação simples
        alert("Preencha todos os campos.");
        return;
      }

      // ============================== CRIAR FORM DATA ==============================

      const formData = new FormData();
      formData.append("orderNumber", orderNumber);
      formData.append("name", name);
      formData.append("reason", reason);
      formData.append("customerId", cliente_id);

      // Adiciona todas as imagens selecionadas
      if (imagesInput.files.length > 0) {
        for (let i = 0; i < imagesInput.files.length; i++) {
          formData.append("images", imagesInput.files[i]);
        }
      }

      try {
        // ============================== ENVIO PARA O BACKEND ==============================

        const res = await fetch("/registroDevolucao", {  // Rota Flask que aceita POST
          method: "POST",
          body: formData
        });

        const contentType = res.headers.get("Content-Type") || "";

        if (!res.ok) {  // Se deu erro
          if (contentType.includes("application/json")) {
            const errJson = await res.json();
            throw new Error(errJson.message);
          } else {
            const txt = await res.text();
            throw new Error(txt.slice(0, 200));
          }
        }

        // Se deu certo, pega o JSON de resposta
        const data = contentType.includes("application/json") ? await res.json() : null;

        if (data && data.status === "success") { // Se backend confirmou sucesso
          alert("Devolução registrada com sucesso!");
          form.reset(); // Limpa formulário
          await carregarMinhasDevolucoes(); // Atualiza lista

          // Abre modal da última devolução
          setTimeout(() => {
            const cards = document.querySelectorAll(".return-item");
            const ultimoCard = cards[cards.length - 1];
            if (ultimoCard) abrirModalReturn(ultimoCard.dataset.id, 0);
          }, 300);

        } else {
          alert("Não foi possível registrar a devolução.");
        }

      } catch (err) {
        console.error("Erro:", err);
        alert("Erro ao registrar devolução. Veja o console.");
      }

    });
  }

  // ============================== CARREGAR DEVOLUÇÕES ==============================

  async function carregarMinhasDevolucoes() {
    myReturnsContainer.innerHTML = ""; // Limpa container

    const cliente_id = localStorage.getItem("cliente_id");
    if (!cliente_id) {
      myReturnsContainer.innerHTML = "<p>Faça login.</p>";
      return;
    }

    try {
      const res = await fetch(`/minhas_devolucoes/${cliente_id}`); // GET no backend
      const data = await res.json();

      if (!data.length) {
        myReturnsContainer.innerHTML = "<p>Nenhuma devolução.</p>";
        return;
      }

      data.forEach(d => { // Para cada devolução, cria card
        const card = document.createElement("div");
        card.className = "return-item";
        card.dataset.id = d.id;

        const imagens = Array.isArray(d.images) ? d.images : [];
        card.dataset.imagens = JSON.stringify(imagens);

        card.innerHTML = `
          <p><strong>Pedido:</strong> ${d.order_number}</p>
          <p><strong>Motivo:</strong> ${d.reason}</p>
          <p><strong>Status:</strong> ${d.status}</p>
        `;

        card.addEventListener("click", () => abrirModalReturn(d.id, 0));

        myReturnsContainer.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      myReturnsContainer.innerHTML = "<p>Erro ao carregar devoluções.</p>";
    }
  }

  window.carregarMinhasDevolucoes = carregarMinhasDevolucoes;

  // ============================== MODAL ==============================

  window.abrirModalReturn = function(id, index = 0) {
    const card = document.querySelector(`.return-item[data-id='${id}']`);
    if (!card) return;

    window.imagensAtuaisReturn = JSON.parse(card.dataset.imagens || "[]");
    window.indiceAtualReturn = index;

    atualizarModalReturn();
    modal.style.display = "flex"; // Mostra modal
  };

  function atualizarModalReturn() {
    const imgs = window.imagensAtuaisReturn;
    if (!imgs.length) {
      modalImagesContainer.innerHTML = "<p>Sem imagem</p>";
      return;
    }

    const url = imgs[window.indiceAtualReturn];
    modalImagesContainer.innerHTML = `
      <img src="${url}" class="modal-img">
      <p>${window.indiceAtualReturn + 1} / ${imgs.length}</p>
    `;
  }

  window.fecharModalReturn = function() { modal.style.display = "none"; };
  window.proximaImagemReturn = function() {
    const imgs = window.imagensAtuaisReturn;
    window.indiceAtualReturn = (window.indiceAtualReturn + 1) % imgs.length;
    atualizarModalReturn();
  };
  window.imagemAnteriorReturn = function() {
    const imgs = window.imagensAtuaisReturn;
    window.indiceAtualReturn = (window.indiceAtualReturn - 1 + imgs.length) % imgs.length;
    atualizarModalReturn();
  };

  // ============================== EVENTOS ==============================

  if (myReturnsBtn) myReturnsBtn.addEventListener("click", carregarMinhasDevolucoes);

  modal.addEventListener("click", (e) => { if (e.target === modal) fecharModalReturn(); });

  document.addEventListener("keydown", (e) => {
    if (modal.style.display !== "flex") return;
    if (e.key === "Escape") fecharModalReturn();
    if (e.key === "ArrowRight") proximaImagemReturn();
    if (e.key === "ArrowLeft") imagemAnteriorReturn();
  });

  // Carrega devoluções se estiver logado
  if (localStorage.getItem("cliente_id")) carregarMinhasDevolucoes();

});