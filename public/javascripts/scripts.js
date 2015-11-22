//var t;

//this.t = setInterval("redereciona()", '10000');//30 segundos

//function redereciona() {
//    location.reload()
//}

//function acao() {
//    clearInterval(this.t);
//    //inicia novamente
//    this.t = setInterval("redereciona()", '10000');//30 segundos
//}
function formatCpf() {
    jQuery(function ($) {
        $("#cpf").mask("999.999.999-99");
    });
}

function formatPlaca() {
    jQuery(function ($) {
        $("#placa").mask("aaa-9999");
    });
}

function formatNome(id){
    
    var nome = document.getElementById(id).value;
    var fNome = "";

    var listaDeNomes = nome.split(" ");
    
    for (var i in listaDeNomes) {
        
        var da = listaDeNomes[i] == "da";
        var de = listaDeNomes[i] == "de";
        var ndo = listaDeNomes[i] == "do";
        var dos = listaDeNomes[i] == "dos";
        
        if (!(da | ndo | de | dos)) {
            fNome = fNome + " " + listaDeNomes[i].substr(0, 1).toUpperCase() + listaDeNomes[i].substr(1).toLowerCase();
        } else {
            fNome = fNome + " " + listaDeNomes[i];
        }
    }
    
    fNome = fNome.substr(1);
    document.getElementById(id).value = fNome;
}

function toUpper(termo){
    var upper = document.getElementById(termo).value;

    upper = upper.toUpperCase();

    document.getElementById(termo).value = upper;
}