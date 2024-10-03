const pug = require('pug');
const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env['HUBSPOT_API'];
const CUSTOM_OBJECT = '2-134136663';

function renderError(error, res) {
    console.log(error);
    const fn = pug.compileFile('./views/error.pug');
    const html = fn({ data });
    res.render(html);
}

app.get('/', async (req, res) => {
    try {
        const hsPetsIds = await  axios.get(
            `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}?limit=100&archived=false&properties=name&properties=kind&properties=age
            `,
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`
                }
            }
        );
        const data = hsPetsIds.data.results;
        const fn = pug.compileFile('./views/homepage.pug');
        const html = fn({ data });
        res.send(html);
    } catch (error) {
        renderError(error, res)
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    try {
        const fn = pug.compileFile('./views/updates.pug');
        const html = fn();
        res.send(html);
    } catch (error) {
        renderError(error, res)
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

/**
* * This is sample code to give you a reference for how you should structure your calls.

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));