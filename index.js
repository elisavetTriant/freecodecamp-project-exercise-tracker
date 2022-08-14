const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204


//Adding routes
const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
