//2nd step create server
const express = require('express');
const app = express();
const path = require('path');

app.use(require('body-parser').json());

//5th step - connect the server to the dist folder that webpack creates 
app.use('/dist', express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));

//4th step - connect client files to server files
//thru index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

//3rd step - create routes
app.get('/api/things', (req, res, next) => {
  Thing.findAll()
    .then( things => res.send(things))
    .catch(next)
});

app.post('/api/things', (req, res, next) => {
  Thing.create(req.body)
    .then( thing => res.send(thing))
    .catch(next);
})

//1st step setup Sequelize models
const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL);

const Thing = conn.define('thing', {
  name : {
    type : Sequelize.STRING,
    unique : true
  }
});

const syncAndSeed = async () => {
  await conn.sync({ force : true });
  await Promise.all([
    Thing.create({ name : 'foo' }),
    Thing.create({ name : 'bar' }),
    Thing.create({ name : 'bazz' }),
  ]);
}

syncAndSeed();