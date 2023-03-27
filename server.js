const express = require('express');
const path = require('path');

const web = express();
const PORT = process.env.PORT || 8080;

web.use(express.urlencoded({ extended: true }));
web.use(express.json());
web.use(express.static('./public'));

require('./routes/api')(web);
require('./routes/routes')(web);

web.listen(PORT, function() {
    console.log(`App listening on Port: ${PORT}`);
});