# SQL Node Project

### Introduction

In this tutorial, we’ll learn how to build a REST API using PostgreSQL as our database and Node.js (JavaScript) as our programming language.

### Learning Objectives

Students should get **hands-on experience** with:

- Understanding REST Principles 
- HTTP Methods and CRUD Operations
- Connecting to a SQL database
- Building a fully functional backend system for user interactions

### Creating the Database

Follow the below steps and you'll be ready to get going on the codealong!

1. We will be using Render to create a database that will be hosted on a server. Render is a cloud computing platform that allows you to deploy your applications to the web. You can go to https://dashboard.render.com/billing#plan to sign up. You can connect to your Github or use your AC email.
2. Click on New Postgres Database. Add a name (sql_postgres_practice), select Free, and click Create Database. ** Note, these databases do expire. This is just for practice purposes.
3. Now, we have an empty database! Scroll to the Connections section. 


### Connecting to the Database
4. Open pgAdmin. Right click on Servers (or Server Groups) and click Register Server
5. We will now need to enter the information to connect to our database server. Under General, for the name of the server, use sql_postgres_practice. 
6. Switch to the Connection tab. For the user, enter sql_postgres_practice_user. This should be listed as the Username in the Connections section in Render. In Render, copy the password and add that to pgAdmin. Also, select the "Save Password" button. 
7. For the hostname/address, select the External Database URL. You will need to remove the first part of the URL as well as the path at the end. For example, if the copied URL from Render looks like postgres://sql_postgres_practice_user:HMoP9Guq0Y53ieEeccuDj453ybRNc4w7@dpg-clnlpe4g7mts73a6t65g-a.oregon-postgres.render.com/sql_postgres_practice. You will only use what is after the @ sign, and remove what is after the /. Your final URL should look like dpg-clnlpe4g7mts73a6t65g-a.oregon-postgres.render.com 
8. Enter the URL into the hostname/address and click Save. You should now see your Server!
9. Click on the Server, then Databases. Then click on the sql_postgres_practice database. You will then select Schemas, public, and then Tables. 
10. We have successful created a database that is running on a server, AND we have connected to that database securely using pgAdmin!

### Adding Data

 Let’s add the programming_languages table. First, right click on the Tables section in your DB in pgAdmin, and then select Query Tool. 

``` sql

CREATE TABLE programming_languages
(
  id            SERIAL NOT NULL,
  name          VARCHAR(255) NOT NULL ,
  released_year INT NOT NULL ,
  githut_rank   INT NULL ,
  pypl_rank     INT NULL ,
  tiobe_rank    INT NULL ,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (id)
)

```

4. Click the Play button to run the query.
5. You should be able to right click on the programming_languages table and select View All Data to see all of your columns!
6. Next, we’ll add 16 popular programming languages to our programming_languages table. Right click on the programming_languages table and select Query tool to run the following:

``` sql

INSERT INTO programming_languages(id,name,released_year,githut_rank,pypl_rank,tiobe_rank) 
VALUES 
(1,'JavaScript',1995,1,3,7),
(2,'Python',1991,2,1,3),
(3,'Java',1995,3,2,2),
(4,'TypeScript',2012,7,10,42),
(5,'C#',2000,9,4,5),
(6,'PHP',1995,8,6,8),
(7,'C++',1985,5,5,4),
(8,'C',1972,10,5,1),
(9,'Ruby',1995,6,15,15),
(10,'R',1993,33,7,9),
(11,'Objective-C',1984,18,8,18),
(12,'Swift',2015,16,9,13),
(13,'Kotlin',2011,15,12,40),
(14,'Go',2009,4,13,14),
(15,'Rust',2010,14,16,26),
(16,'Scala',2004,11,17,34);

```

7. You should receive a message like “16 rows inserted.” Then, the data from our three sources is collected and added to the table in bulk by the INSERT statement, creating 16 rows, one for each programming language. We’ll return to this when we fetch data for the GET API endpoint. If we click on the programming_languages table, view all rows, we’ll see the rows that we just added. Note: You can learn more about language rankings: githut_rank(https://madnight.github.io/githut/#/pull_requests/2023/3), pypl_rank(https://pypl.github.io/), tiobe_rank (https://www.tiobe.com/tiobe-index/).



### Creating the Web Server and API

1. Open your project's code repository.
2. Run `npm init` to initialize the package.json.
3. Run the following command, `npm install express` to add Express.
4. Create the following file structure
![Project Structure](./images/projectStructureImage.png) 
5. Note: Inside the .gitignore file, you should add /node_modules. This will keep you from pushing the node modules to your github ever time. You can learn more here: https://www.freecodecamp.org/news/gitignore-what-is-it-and-how-to-add-to-repo/



### Linking the DB and the API
1. We will need to link our Node.js server with our database to create our API. We’ll use the node-postgres package to interact with the postgres database. More here: https://node-postgres.com/
2. We need to install the node-postgres module using the command below at the project root directory: `npm install pg`
3. Next, we’ll create the config.js file on the root of the project with the following contents:

``` javascript

const config = {
  user: 'sql_postgres_practice_user',
  host: '[database.server.com] Replace with your URL',
  database: 'sql_postgres_practice',
  password: 'Replace with your password',
  port: 5432,
  ssl: true
}
module.exports = config;

```

4. The `module.exports` is how you create your own module in Node! This gives you the opportunity to import this object into different files in your program. It is a reusable piece of code that you can use where you need. 
5. Add the `config.js` file to your `.gitignore` file. We don't want a file with passwords to be added to Github!



### Building the API

Now, let's write the code that starts our application. In the index.js file, add the following code:

``` javascript
const express = require('express'); //external module for using express

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

```

1. This code should look familiar. We are adding express and building our application. Now we need to add the code that will allow us to connect to our database. 

``` javascript
const express = require('express'); //external module for using express
const Client = require('pg') //external module for using postgres with node
const config = require('./config.js'); // internal module for connecting to our config file

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client(config); //creating our database Client with our config values
 
await client.connect() //connecting to our database


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

await client.end() //ending the connection to our database

```

2. This code uses a Client, which is an object that allows us to connect with our database. We have to enter the config object to securely connect to the proper database, and then we need to establish a connection.

3. Now, we need to build our route and helper function to get our data. We are going to create a GET request to get all of the programming languages.


``` javascript
const express = require('express'); //external module for using express
const { Client } = require('pg') //external module for using postgres with node
const config = require('./config.js'); // internal module for connecting to our config file

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client(config); //creating our database Client with our config values

//NEW CODE
const getLanguages = async () => {
  await client.connect() //connecting to our database
  const result = await client.query('SELECT * FROM programming_languages');
  console.log(result.rows);
  await client.end() //ending the connection to our database
  return result.rows;
}

app.get('/get-languages', async (req, res) => {
  const languages = await getLanguages();
  res.send(languages);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

### Testing

Now we get to test our application with Postman! Let's open Postman and enter a GET request to `localhost:3000/get-languages`. We should see our list of languages!

### Getting a specific language in our database

``` javascript
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

app.get('/get-languages', async (req, res) => {
  const languages = await getLanguages();
  res.send(languages);
});


//NEW CODE
const getLanguage = async (id) => {
  await client.connect() //connecting to our database
  const result = await client.query(`SELECT * FROM programming_languages WHERE id = ${id}`)
  console.log(result.rows);
  await client.end() //ending the connection to our database
  return result.rows;
}

app.get('/get-language/:id', async (req, res) => {
  const language = await getLanguage(req.params.id);
  res.send(language);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

```

### Testing

Now we get to test our application with Postman! Let's open Postman and enter a GET request to `localhost:3000/get-language/:id`. We should see our list of languages!


### Next Steps
For your lab, you will build on this project by adding a POST for adding a new language and a DELETE for removing a language. 
