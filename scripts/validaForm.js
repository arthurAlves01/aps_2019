function validaDadosCadastro(f) {
    let usuario = $("#nomeUsuario").val()
    let nome = $("#nomeCompleto").val()
    let email = $("#emailAdd").val()
    let bairro = $("#bairro").val()
    let cidade = $("#cidade").val()
    let senha = $("#senha").val()
    let confirmaSenha = $("#confirmaSenha").val()
    let dados =[
        usuario, nome, email, bairro, cidade, senha, confirmaSenha
    ]
    if(dados.indexOf("")!=-1) {
        alert("Todos os campos são obrigatórios!")
        return;
    }
    if(senha!==confirmaSenha) {
        alert("As senhas não conferem!")
        return;
    }
    f.submit()
}

function validaDadosLogin(f) {
    let usuario = $("#nomeUsuario").val()
    let senha = $("#senha").val()
    if([usuario,senha].indexOf("")!==-1) {
        alert("Informa o usuário e senha!")
        return;
    }
    f.submit()
}

function validaDadosEvento(f) {
    let nomeEvento = $("#nomeEvento").val();
    let bairro = $("#bairro").val();
    let cidade = $("#cidade").val();
    let endereco = $("#endereco").val();
    let dataEv = $("#dtEvento").val();
    if([nomeEvento,bairro,cidade,endereco,dataEv].indexOf("")!=-1) {
        alert("Todos os campos são obrigatórios")
        return
    }
    f.submit()
}