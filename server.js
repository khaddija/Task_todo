const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const {MongoClient,ObjectId} = require('mongodb')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
let quotesCollection,db;
MongoClient.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qke6lsy.mongodb.net/?retryWrites=true&w=majority`, {
    useUnifiedTopology: true
}).then(client => {
     db = client.db(`tasks`)
     quotesCollection = db.collection('quotes')
     console.log('connect')
    
}).catch(err => {
    console.log(err)
});
app.get('/', (req, res) => {
    db.collection('quotes').find().toArray()
    .then(result => {
        // console.log(result)
        res.render('index.ejs', {quotes:result})
    })
    .catch(/* ... */)
})

app.get('/quotes/edit/:id', async (req, res) => {
    const {id} = req.params;
   
    let quote = await quotesCollection.findOne({ "_id": ObjectId(id) });
    res.render('update.ejs', {quote})
})


app.post('/quotes', (req, res) => {
    
    quotesCollection.insertOne(req.body)
    .then(result => {
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

app.post('/quotes/:id', (req, res) => {
    const {id} = req.params;
    quotesCollection.findOneAndUpdate({ "_id": ObjectId(id) }, {
        $set: {
          name: req.body.name,
          quote: req.body.quote
        }
      },)
    .then(result => {
        res.redirect('/')
    })
    .catch(error => console.error(error))
  })

  app.get('/quotes/delete/:id', (req, res) => {
    const {id} = req.params;
    quotesCollection.deleteOne({ "_id": ObjectId(id) })
    .then(result => {
        res.redirect('/')
    })
    .catch(error => console.error(error))
  })



app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
