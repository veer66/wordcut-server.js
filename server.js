var express = require("express")
  , app = express()
  , Busboy = require("busboy")
  , wordcut = require("wordcut")
  , nconf = require("nconf");

nconf.argv().env();
nconf.file({file:  __dirname + "/config.json"});

wordcut.init();

app.post("/segment", function(req, res) {
  var text;
  var busboy = new Busboy({headers: req.headers});

  busboy.on('finish', function() {
    if (text) {
      res.json(wordcut.cutIntoRanges(text));
    } else {
      res.json([]);
    }
  });

  req.pipe(busboy);
  busboy.on('field', function(fieldname, val, valTruncated, keyTruncated) {
    if (fieldname == "text") {
      text = val;
    }
  });
});

app.listen(nconf.get("port"), nconf.get("host"));
console.log('Listening on port ' + nconf.get("port"));
