let express = require('express');
let app = express();

app.get('/', function( req, res ) {
  res.send('Hello Blockchain')
} );

app.listen( 3000 );
