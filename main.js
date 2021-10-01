const express = require('express');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser');


let db;
let collection;
MongoClient.connect("mongodb+srv://test:test@cluster0.dndcx.mongodb.net/axede?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    db = client.db('axede')
    collection = db.collection('sedes')
})
//Ruta Principal pueden poner una descripcion Rutas: 
app.use(bodyParser.json());
app.get('/', (req, res) => {

    res.send("ruta principal");

})

app.get('/sedes', (req, res) => {

    db.collection('sedes').find().toArray()
        .then(results => {
            res.json(results);
        }).catch(error => console.error(error));
})

app.get('/sedes/:id', (req, res) => {
    db.collection('sedes').find({ sede: req.params.id, cupos_disp: { $gt: 0 } }).toArray()
        .then(results => {
            res.json(results);
        }).catch(error => console.error(error));
})

app.post('/sede', (req, res) => {
    collection.insertOne(req.body)
        .then(result => {
            res.json('Success');
        })
        .catch(error => console.error(error))
})

app.put('/sede/:id', (req, res) => {
    collection.findOneAndUpdate({ sede: req.params.id }, {
            $set: {

                sede: req.body.sede,
                hab_total: {
                    std_ttl: req.body.std_ttl,
                    prm_ttl: req.body.prm_ttl,
                    vip_ttl: req.body.vip_ttl
                },
                hab_disp: {
                    std_disp: req.body.std_disp,
                    prm_disp: req.body.prm_disp,
                    vip_disp: req.body.vip_disp
                },

                tarifas: {
                    std_tarf: req.body.std_tarf,
                    prm_tarf: req.body.prm_tarf,
                    vip_tarf: req.body.vip_tarf
                },
                temporada: req.body.temporada,
                cupos_disp: req.body.cupos_disp,
                total_hab: req.body.total_hab,
                cupo_maxhab: req.body.cupo_maxhab

            }
        }, {
            upsert: true
        }).then(result => { res.json('Updated') })
        .catch(error => console.error(error))

});

app.delete('/sedes/:id', (req, res) => {
    collection.deleteOne({ name: req.params.id })
        .then(result => {
            res.json('Deleted')
        })
        .catch(error => console.error(error))
})

app.listen(port, function() {
    console.log('listening on ' + port)
});