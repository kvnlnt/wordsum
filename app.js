// imports
var express = require('express');
var app     = express();
var sqlite3 = require('sqlite3').verbose();
var db      = new sqlite3.Database("wordsum.sqlite");

// word
function getWords(res, word){

    var qry = "SELECT \
                    definitions, \
                    related_words, \
                    (SELECT group_concat(idiom, '|') FROM idioms WHERE UPPER(idiom) LIKE '"+word+"%' or UPPER(idiom) LIKE '% "+word+"') AS idioms, \
                    (SELECT group_concat(lemma, '|') FROM wordsums WHERE TRIM(phoneme) LIKE ('%' || (SELECT SUBSTR(TRIM(phoneme), LENGTH(TRIM(phoneme))/2) FROM wordsums WHERE lemma = '"+word+"'))) as rhymes \
                FROM \
                    wordsums \
                WHERE \
                    lemma = '"+word+"';";

    // wordsum
    db.all(qry, function(err, rows) {

        // assign results to express res object
        res.send(rows[0]);

    });

}

// get word
app.get('/:word', function(req, res){

    // CORS
    res.set('Access-Control-Allow-Origin', req.headers.origin);
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Content-Type, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');

    var word = req.params.word;
    return getWords(res, word);

    // return 200
    // res.send(200);


});

app.listen(3000);
//console.log('Listening on port 3000');
