const pug = require('pug');
const multer = require('multer');
const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();
const upload = multer();

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
    const html = fn();
    res.send(html);
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

app.get('/update-cobj', async (req, res) => {
    try {

        const fn = pug.compileFile('./views/updates.pug');
        const html = fn();
        res.send(html);
    } catch (error) {
        renderError(error, res)
    }
});

app.post('/update-cobj', upload.none(), async(req, res) => {
    try {
        newPet = await axios.post(
            `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`,
            { 'properties': req.body },
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`
                }
            }
        );
        res.redirect('/');
    } catch (error) {
        renderError(error, res)
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));