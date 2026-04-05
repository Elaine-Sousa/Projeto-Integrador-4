let formulario = document.getElementById('cadastroForm');
let podeEnviar = false; // controla se o formulário pode ser enviado após o modal

formulario.addEventListener('submit', function(event) {
    if (!podeEnviar) {
        event.preventDefault();
    }

    let hasError = false;

    // Limpa erros antigos
    document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
    document.querySelectorAll('input').forEach(el => el.classList.remove('error-border'));

    // Validação
    const nome = document.getElementById('nome').value.trim();
    const matricula = document.getElementById('matricula').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

    if (nome === '') {
        mostrarErro('nome', 'O nome é obrigatório.');
        hasError = true;
    }
    if (matricula === '') {
        mostrarErro('matricula', 'A matrícula é obrigatória.');
        hasError = true;
    }
    if (email === '') {
        mostrarErro('email', 'O email é obrigatório.');
        hasError = true;
    }
    if (senha === '') {
        mostrarErro('senha', 'A senha é obrigatória.');
        hasError = true;
    }
    if (confirmarSenha === '') {
        mostrarErro('confirmarSenha', 'A confirmação da senha é obrigatória.');
        hasError = true;
    } else if (confirmarSenha !== senha) {
        mostrarErro('confirmarSenha', 'As senhas não correspondem.');
        hasError = true;
    }

    if (!hasError && !podeEnviar) {
        showModal(); // Exibe modal se está tudo certo
    }
});

function mostrarErro(id, mensagem) {
    const erro = document.getElementById(id + 'Error');
    erro.textContent = mensagem;
    erro.style.display = 'block';
    document.getElementById(id).classList.add('error-border');
}

function showModal() {
    document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

function confirmarEnvio() {
    document.getElementById("modal").style.display = "none";
    window.location.href = "/login"; // Redireciona diretamente para o login
}