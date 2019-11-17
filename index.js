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
			res.redirect("usuarioExiste")
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
		console.log(body)
		req.session.loggedin = true
		req.session.username = body.nome_completo
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

app.get("/", (req,res) => {
	res.render("feed", {user: req.session.username})
})

app.listen(80, function () {
	console.log('Example app listening on port 80!');
});