const sql = require("sqlite3")
const db = new sql.Database("api.db")
const fs = require('fs');
const path = require("path");
const c = require("crypto")
const express = require('express');
const app = express();

//Criptografa o parametro informado como sha256
//@exemplo
//  getSha256("abc"); //ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
//
//@param    {string}    v   valor que será criptografado
//@returns  {string}
function getSha256(v) {
    let md5 = c.createHash("sha256")
    md5.update(v);
    let _hash = md5.digest("hex")
    return _hash;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/cadastrar", (req,res) => {
    let u = req.body.nomeUsuario;
    let s = getSha256(u.substr(0,3) + req.body.senha);
    let sqlValida = "SELECT id FROM usuarios WHERE nome_exibicao = ? and senha = ?"
    let stm = db.prepare(sqlValida);
    stm.get([u,s], (err, row) => {
        if(err) {
            res.status(500).end()
        } else if (row!==undefined) {
            console.log("Usuário já cadastrado!")
            res.status(400).end()
        } else {
            let nu = req.body.nomeCompleto;
            let em = req.body.emailAdd;
            let ba = req.body.bairro;
            let ci = req.body.cidade;
            let sqlNovoUsuario = "INSERT INTO usuarios(nome_exibicao,nome_completo,bairro,cidade,email,senha) VALUES(?,?,?,?,?,?)"
            let stm = db.prepare(sqlNovoUsuario)
            stm.run([u,nu,ba,ci,em,s], (err) => {
                if(err) {
                    res.status(500).end()
                } else {
                    console.log("Usuário cadastrado com sucesso!")
                    res.status(200).end()
                }
            })
        }
    })
    //s = getSha256(u.substring(0,3) + s);
    //console.log(u, s, e)
})

app.post("/login", (req,res) => {
    let u = req.body.nomeUsuario;
    let s = req.body.senha;
    s = getSha256(u.substr(0,3) + req.body.senha);
    let sqlLogin = "SELECT NOME_COMPLETO FROM USUARIOS WHERE NOME_EXIBICAO = ? AND SENHA = ?"
    let stm = db.prepare(sqlLogin);
    stm.get([u,s], (err,row) => {
        if(err) {
            res.status(500).end()
        } else if(row==undefined) {
            console.log("Usuário ou senha inválidos!")
            res.status(403).end()
        } else {
            console.log("Autenticado com sucesso!")
            res.status(200).json(row)
        }
    })
})

app.listen(81, function () {
	console.log('Example app listening on port 81!');
});