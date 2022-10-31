const mysql = require('mysql2/promise');
const express = require('express');
const router = express.Router();

let db = {};
mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'movies_db'
    },
    console.log('Connected to movies_db')
).then((connection)=>{db = connection});

router.get('/movies', async(req,res)=>{
    const result = await db.query(`SELECT * FROM movies`);
    res.status(200).json(result[0]);
});

router.post('/add-movie', async(req,res)=>{
    const result = await db.query('INSERT INTO movies (movie_name) VALUES (?)', [req.body.name]);
    if (result[0].affectedRows > 0){
        res.status(200).send(`${req.body.name} has been added.`);
    }else{
        res.status(500).send('Something went wrong.');
    }
})

router.post('/add-review', async(req,res)=>{
    const movieResults = await db.query('SELECT * FROM movies WHERE id = ?', req.body.id);
    if (movieResults[0].length == 0){
        return res.status(400).send("Movie with that ID doesn't exist");
    }
    const insertResults = await db.query('INSERT INTO reviews (movie_id, review) VALUES (?,?)',[req.body.id,req.body.review]);
    if (insertResults[0].affectedRows > 0){
        res.status(200).send('Review has been submitted')
    }else{
        res.status(500).send('Something went wrong');
    }
    console.log(movieResults);
})

router.post('/update-review', async(req,res)=>{
    const movieResults = await db.query('SELECT * FROM reviews WHERE id = ?', req.body.id);
    if (movieResults[0].length == 0){
        return res.status(400).send("A review with that ID doesn't exist.");
    }
    const insertResults = await db.query('UPDATE reviews SET review = ? WHERE id = ?',[req.body.review, req.body.id]);
    if (insertResults[0].affectedRows > 0){
        res.status(200).send('Review has been updated')
    }else{
        res.status(500).send('Something went wrong');
    }
    console.log(movieResults);
})

router.delete("/movie/:id", async(req,res)=>{
    const results = await db.query(`DELETE FROM movies WHERE id = ?`, [parseInt(req.params.id)]);
    const deleteCount = results[0].affectedRows;
    if (deleteCount){
        res.status(200).send("Movie was deleted");
    }else{
        res.status(400).send(`Movie with id '${req.params.id}' doesn't exist.`);
    }
})

module.exports = router;