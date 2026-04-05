// Espera o HTML carregar completamente antes de executar o JS
document.addEventListener("DOMContentLoaded", () => {

  // Pega o formulário pelo ID
  const form = document.getElementById("loginForm");

  // Pega elementos da modal
  const modal = document.getElementById("modalloginc");
  const okBtn = document.getElementById("okModalBtn");

  // Se não encontrar o formulário, para tudo (evita erro)
  if (!form) {
    console.log("Formulário NÃO encontrado");
    return;
  }

  console.log("JS CARREGADO ✅");

  // ---------------- MODAL ---------------- //

  // Função para abrir a modal
  const openModal = () => {
    if (!modal) return; // evita erro se não existir
    modal.classList.add("open"); // adiciona classe para mostrar
    modal.setAttribute("aria-hidden", "false"); // acessibilidade
  };

  // Função para fechar a modal
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open"); // remove classe (esconde)
    modal.setAttribute("aria-hidden", "true");
  };

  // Evento do botão OK da modal
  if (okBtn) {
    okBtn.addEventListener("click", () => {
      closeModal(); // fecha a modal

      // Pega URL de redirecionamento do atributo data-url
      const redirectUrl = form.getAttribute("data-url") || "/registroDevolucao";

      // Redireciona para outra página
      window.location.href = redirectUrl;
    });
  }

  // Fecha a modal ao clicar fora dela
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Fecha a modal ao pressionar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // ---------------- FORMULÁRIO ---------------- //

  // Evento de envio do formulário
  form.addEventListener("submit", async (e) => {

    e.preventDefault(); // 🚨 MUITO IMPORTANTE: bloqueia envio padrão (GET)

    console.log("Submit interceptado 🚀");

    // Limpa mensagem de erro anterior
    document.getElementById("loginErro").textContent = "";

    // Pega valores dos campos
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    // Validação simples
    if (!cpf || !email || !senha) {
      document.getElementById("loginErro").textContent = "Preencha todos os campos.";
      return;
    }

    // Cria objeto FormData para enviar ao backend
    const formData = new FormData();
    formData.append("cpf", cpf);
    formData.append("email", email);
    formData.append("senha", senha);

    try {
      // Faz requisição POST para o Flask
      const res = await fetch("/loginc", {
        method: "POST",
        body: formData
      });

      // Se deu erro de conexão
      if (!res.ok) {
        document.getElementById("loginErro").textContent = "Erro ao conectar com o servidor.";
        return;
      }

      // Converte resposta para JSON
      const result = await res.json();

      console.log("Resposta do servidor:", result);

      // Se login deu certo
      if (result.status === "success") {

        // Salva dados no navegador
        localStorage.setItem("cliente_id", result.cliente_id);
        localStorage.setItem("cliente_nome", result.nome);

        // Abre modal de sucesso
        openModal();

      } else {
        // Mostra erro vindo do backend
        document.getElementById("loginErro").textContent =
          result.message || "Erro no login.";
      }

    } catch (err) {
      // Erro geral (ex: servidor offline)
      console.error("Erro no fetch /loginc:", err);
      document.getElementById("loginErro").textContent =
        "Erro ao conectar com o servidor.";
    }
  });
});