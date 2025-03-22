const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const myClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Sahil@2193',
    database: 'my-db'
})

// myClient
// 	.connect()
// 	.then(() => {
// 		console.log('Connected to PostgreSQL database');
//         myClient.end();
// 	})
// 	.catch((err) => {
// 		console.error('Error connecting to PostgreSQL database', err);
// 	});

const app = express();

app.use(bodyParser.urlencoded());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});



// TODO: CRUD of todos start

app.get('/todos', (req, res) => {
    myClient.connect().then(() => {
        myClient.query('SELECT * FROM todos', (err, result) => {
            if(err) {
                console.error('Error fetching data', err);
                res.send({
                    message: `Error fetching data, ${err}`
                })
            } else {
                res.send({
                    data: result.rows,
                    message: 'Todos fetched successfully'
                })
            }
            myClient.end();

        })
    })
})

app.post('/todos', (req, res) => {
    const { name, description } = req.body;

    if(!name || !description) {
        res.send({
            message: 'name and description are required'
        })
    }

    const randonmUUID = uuidv4();

    myClient.connect().then(() => {
        const insert = `INSERT INTO todos (id, name, description) VALUES ('${randonmUUID}', '${name}', '${description}')`;
        myClient.query(insert, (err, result) => {
			if (err) {
				console.error('Error inserting data', err);
                res.send({
                    message: `Error inserting data, ${err}`
                })
			} else {
				console.log('Data inserted successfully');
                res.send({
                    message: 'Data Inserted Successfully'
                })
			}

			myClient.end();
		});
    })
})

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if(!name || !description) {
        res.send({
            message: 'name and description are required'
        })
    }

    myClient.connect().then(() => {
        const update = `UPDATE todos SET name = '${name}', description = '${description}' WHERE id = '${id}'`;
        myClient.query(update, (err, result) => {
			if (err) {
				console.error('Error updating data', err);
                res.send({
                    message: `Error updating data, ${err}`
                })
			} else {
				console.log('Data updated successfully');
                res.send({
                    message: 'Data Updated Successfully'
                })
			}

			myClient.end();
		});
    })
})

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    myClient.connect().then(() => {
        const deleteQuery = `DELETE FROM todos WHERE id = '${id}'`;
        myClient.query(deleteQuery, (err, result) => {
            if(err) {
                console.error('Error deleting data', err);
                res.send({
                    message: `Error deleting data, ${err}`
                })
            } else {
                console.log('Data deleted successfully');
                res.send({
                    message: 'Data Deleted Successfully'
                })
            }
            myClient.end();
        })
    })
})

// TODO: CRUD of todos end

// TODO: Country filter API start

app.post('/countries', (req, res) => {
    const { name } = req.body;

    if(!name) { 
        res.send({
            message: 'name is required'
        })
    }

    myClient.connect().then(() => {
        const insert = `INSERT INTO countries (name) VALUES ('${name}')`;
        myClient.query(insert, (err, result) => {
            if(err) {
                console.error('Error fetching data', err);
                res.send({
                    message: `Error fetching data, ${err}`
                })
            } else {
                res.send({
                    message: 'Country inserted successfully'
                })
            }
            myClient.end();
        })
    })
})

app.get('/countries', (req, res) => {
    myClient.connect().then(() => {
        const query = `SELECT * FROM countries`;
        myClient.query(query, (err, result) => {
            if(err) {
                console.error('Error fetching data', err);
                res.send({
                    message: `Error fetching data, ${err}`
                })
            } else {
                res.send({
                    data: result.rows,
                    message: 'Countries fetched successfully'
                })
            }
            myClient.end();
        })
    })
})

app.post('/states', (req, res) => {
    const { name, country_id } = req.body;

    if(!name || !country_id) {
        res.send({
            message: 'name and country_id are required'
        })
    }

    myClient.connect().then(() => {
        const insert = `INSERT INTO states (name, country_id) VALUES ('${name}', '${country_id}')`;
        myClient.query(insert, (err, result) => {
            if(err) {
                console.error('Error fetching data', err);
                res.send({
                    message: `Error fetching data, ${err}`
                })
            } else {
                res.send({
                    message: 'State inserted successfully'
                })
            }
            myClient.end();
        })
    })
})

app.get('/states/:country_id', (req, res) => {
    const { country_id } = req.params;

    if(!country_id) {
        res.send({
            message: 'Country Id is required'
        })
    }

    myClient.connect().then(() => {
        const query = `SELECT * FROM states WHERE id = '${country_id}'`;
        myClient.query(query, (err, result) => {
            if(err) {
                console.error('Error fetching data', err);
                res.send({
                    message: `Error fetching data, ${err}`
                })
            } else {
                res.send({
                    data: result.rows,
                    message: 'States belonging to countries fetched successfully'
                })
            }
            myClient.end();
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});