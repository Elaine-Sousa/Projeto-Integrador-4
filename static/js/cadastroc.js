document.addEventListener("DOMContentLoaded", () => {

  // Seleciona o formulário
  const form = document.getElementById("cadastroForm");

  // Seleciona a modal
  const modal = document.getElementById("modal");

  // Função para abrir a modal
  function abrirModal() {
    modal.style.display = "flex"; // mostra a modal
  }

  // Função para fechar a modal
  window.fecharModal = function () {
    modal.style.display = "none"; // esconde a modal
  }

  // Função ao clicar no OK
  window.confirmarEnvio = function () {
    fecharModal();

    // Redireciona para login (opcional)
    window.location.href = "/loginc";
  }

  // Evento de envio do formulário
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // impede reload da página

    // Pegando os valores dos inputs
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

    // Validação simples
    if (!nome || !cpf || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos!");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    // 🔥 AQUI você pode integrar com Flask depois
    // Por enquanto só simula sucesso

    console.log("Cadastro realizado com sucesso!");

    // Abre a modal
    abrirModal();
  });

});