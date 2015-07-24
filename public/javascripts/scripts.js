var t;

this.t = setInterval("redereciona()", '10000');//60 segundos

function redereciona() {
    location.reload()
}

function acao() {
    clearInterval(this.t);
    //inicia novamente
    this.t = setInterval("redereciona()", '10000');//60 segundos
}