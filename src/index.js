const express = require('express'); //external module for using express
const { Client } = require('pg') //external module for using postgres with node
const config = require('./config.js'); // internal module for connecting to our config file

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client(config); //creating our database Client with our config values

const getLanguages = async () => {
  await client.connect() //connecting to our database
  const result = await client.query('SELECT * FROM programming_languages');
  console.log(result.rows);
  await client.end() //ending the connection to our database
  return result.rows;
}

const getLanguage = async (id) => {
  await client.connect() //connecting to our database
  const result = await client.query(`SELECT * FROM programming_languages WHERE id = ${id}`)
  console.log(result.rows);
  await client.end() //ending the connection to our database
  return result.rows;
}
 
 const addLanguage = async (language, released_year, githut_rank, pypl_rank, tiobe_rank) => {

    await client.connect();
    const lastId = await client.query('SELECT MAX(id) FROM programming_languages');
    const newId = lastId.rows[0].max + 1;
    const result = await client.query(`INSERT INTO programming_languages (id, name, released_year, githut_rank, pypl_rank, tiobe_rank) VALUES (${newId}, '${language}', ${released_year}, ${githut_rank}, ${pypl_rank}, ${tiobe_rank})`)
    await client.end();
    return result.rows;
  };//add a new language to the database 

const updateLanguage = async (language, released_year, githut_rank, pypl_rank, tiobe_rank) => {
  await client.connect();
  const result = await client.query(`UPDATE programming_languages SET name='${language}', released_year=${released_year}, githut_rank=${githut_rank}, pypl_rank=${pypl_rank}, tiobe_rank=${tiobe_rank}, updated_at=NOW() WHERE name='${language}'`);
  await client.end();
  return result.rows;
};

const deleteLanguage = async (id) => {
await client.connect();
const result = await client.query(`DELETE FROM programming_languages WHERE id=${id}`);
await client.end();
return result.rows;
};
app.get('/get-languages', async (req, res) => {
  const languages = await getLanguages();
  res.send(languages);
});

app.get('/get-language/:id', async (req, res) => {
  const language = await getLanguage(req.params.id);
  res.send(language);
});

app.post('/add-language', async (req, res) => {
  const { language, released_year, githut_rank, pypl_rank, tiobe_rank } = req.body;
  const newLanguage = await addLanguage(language, released_year, githut_rank, pypl_rank, tiobe_rank);
  res.send(newLanguage);
}); //add row

app.put('/update-language/:language', async (req, res) => {
  const { language, released_year, githut_rank, pypl_rank, tiobe_rank } = req.body;
  const updatedLanguage = await updateLanguage(req.params.language, released_year, githut_rank, pypl_rank, tiobe_rank);
  res.send(updatedLanguage);
 }); // update row


app.delete('/delete-language/:id', async (req, res) => {
  const deletedLanguage = await deleteLanguage(req.params.id);
  res.send(deletedLanguage);
}); //delete a row

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

