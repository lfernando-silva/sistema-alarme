var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var veiculoSchema = new Schema({
    placa: { type: String, required: "Insira a placa" },
    marca: { type: String, required: "Insira a marca" },
    cor: { type: String, required: "Insira a cor" },
    //dispositivo
    numeroSerie: { type: String, required: "Insira o número de série" },
    status: { type: Number, required: "Insira o status" },
    created: { type: Date, default: Date.now }
});

var Veiculo = mongoose.model("Veiculo", veiculoSchema);

module.exports = {
    Veiculo : Veiculo
}