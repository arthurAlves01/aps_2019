const express = require('express');
const app = express();
const session = require("express-session")
const path = require("path")
const request = require('request');

app.set('view engine', 'pug')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: '9pf48z74ur',
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false }
}))

app.use("/styles", express.static("styles"))
app.use("/img", express.static("img"))
app.use("/scripts", express.static("scripts"))

app.get(["/home", "/home/:page"], (req,res) => {
	if(req.session.loggedin) {
		res.redirect("/")
	}
	else {
		let p = req.params.page;
		if(p==undefined){
			p = "login";
		}
		let obj = {}
		obj[p] = true;
		res.render("home", obj)
	}
})

app.get("/confirmaCadastro", (req,res) => {
	res.render("confirmaCadastro")
})

app.get("/acessoNegado", (req,res) => {
	res.render("acessoNegado")
})

app.post("/cadastraUsuario", (req,res) => {
	request.post('http://localhost:81/cadastrar', {
		json: {
			nomeUsuario: req.body.nomeUsuario,
			nomeCompleto: req.body.nomeCompleto,
			emailAdd: req.body.emailAdd,
			bairro: req.body.bairro,
			cidade: req.body.cidade,
			senha: req.body.senha
		}
	}, (error, httpRes, body) => {
		if (httpRes.statusCode!==200) {
			console.error(error)
			res.redirect("/usuarioExiste")
			return
		}
		res.redirect("/confirmaCadastro")
	})
})

app.post("/validaLogin", (req,res) => {
	request.post('http://localhost:81/login', {
		json: {
			nomeUsuario: req.body.nomeUsuario,
			senha: req.body.senha
		}
	}, (error, httpRes, body) => {
		if(httpRes.statusCode==403) {
			res.redirect("/acessoNegado")
			return
		} else if(httpRes.statusCode==500) {
			res.redirect("/erro")
			return
		}
		req.session.loggedin = true
		req.session.username = body.nome_completo
		req.session.id_usuario = body.id_usuario
		res.redirect("/")
	})
})

app.get(["/","/*"], (req,res,next) => {
	if(req.session.loggedin) {
        next();
    } else {
        res.redirect("/home")
    }
})

app.get("/formCriaEvento", (req,res) => {
	res.render("formCriaEvento", {user: req.session.username, logado: req.session.loggedin})
})

app.post("/criarEvento", (req,res) => {
	request.post('http://localhost:81/criarEvento', {
		json: {
			nomeEvento: req.body.nomeEvento,
			bairro: req.body.bairro,
			cidade: req.body.cidade,
			endereco: req.body.endereco,
			dtEvento: req.body.dtEvento,
			criadoPor: req.session.id_usuario
		}
	}, (error, httpRes, body) => {
		if (httpRes.statusCode!==200) {
			res.redirect("/erroCriarEvento")
			return
		}
		res.redirect("/eventoCriado")
	})
})
app.get("/erroCriarEvento", (req,res) => {
	res.render("erroCriarEvento", {user: req.session.username, logado: req.session.loggedin})
})
app.get("/eventoCriado", (req,res) => {
	res.render("eventoCriado", {user: req.session.username, logado: req.session.loggedin})
})
app.get("/erroBuscarEventos", (req,res) => {
	res.render("erroBuscarEventos", {user: req.session.username, logado: req.session.loggedin})
})
app.get("/meusEventos", (req,res) => {
	request.get('http://localhost:81/buscarEventos', {
		json: {
			usuario: req.session.id_usuario
		}
	}, (error, httpRes, body) => {
		if (httpRes.statusCode!==200) {
			res.redirect("/erroBuscarEventos")
			return
		}
		res.render("meusEventos", {user: req.session.username, logado: req.session.loggedin, eventos: body.eventos})
	})
	
})
app.get("/", (req,res) => {
	res.render("feed", {user: req.session.username, logado: req.session.loggedin})
})
app.get("/sair", (req,res) => {
    req.session.destroy(() => {
		res.redirect("/home/login")
	})
})

app.get("/*", (req,res) => {
	res.render("404", {logado: req.session.loggedin})
})

app.listen(80, function () {
	console.log('Example app listening on port 80!');
});