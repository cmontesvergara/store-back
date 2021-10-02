const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser');
require('dotenv').config();
var cors = require("cors");



const port = process.env.PORT;
let db;
let collection;
MongoClient.connect("mongodb+srv://test:test@cluster0.dndcx.mongodb.net/MontesVergara?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    db = client.db('MontesVergara')
    collection = db.collection('Personas')
})
//Ruta Principal pueden poner una descripcion Rutas: 
app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {

  
            res.json({
                Nombre: "API MontesVergara",
            });
     

})
app.get('/personas', (req, res) => {

    db.collection('Personas').find().toArray()
        .then(results => {
            res.json(results);
        }).catch(error => console.error(error));
})

app.get('/personas/:nombre', (req, res) => {
    db.collection('Personas').find({nombre: req.params.nombre}).toArray()
        .then(results => {
            res.json(results);
        }).catch(error => console.error(error));
})

app.post('/personas', (req, res) => {
    collection.insertOne(req.body)
        .then(result => {
            res.json('Success');
        })
        .catch(error => console.error(error))
})

app.put('/personas/:nombre', (req, res) => {
    collection.findOneAndUpdate({ nombre: req.params.nombre }, {
            $set: {

                nombre: req.body.nombre,
                apellido: req.body.apellido,
                telefono: req.body.telefono

            }
        }, {
            upsert: true
        }).then(result => { res.json('Updated') })
        .catch(error => console.error(error))

});

app.delete('/personas/:nombre', (req, res) => {
    collection.deleteOne({ nombre: req.params.nombre })
        .then(result => {
            res.json('Deleted')
        })
        .catch(error => console.error(error))
})

app.listen(port, function() {
    console.log('listening on ' + port)
});