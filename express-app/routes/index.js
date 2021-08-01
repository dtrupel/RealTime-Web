const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const broadcast = require('../wss').broadcast;

/* GET home page. */
router.get('/', async function(req, res, next) {

    // Initialize data fetched from gitlab
    const data = await fetch("https://gitlab.lnu.se/api/v4/projects/13853/issues", {method: 'GET', headers: {
            'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN,
            'Content-Type': "application/json"
        }}).
    then(res => {
        return res.json();
    }).
    catch(err => {
        console.log(err);
    });

    console.log(data);

    // Prepare an array of JSON objects
    let issuesData = issuesFromData(data);

    //Render response with issues
    res.render('index', {issues: issuesData, title: 'Express' });

});

router.post('/hook', (req, res, next) => {

    // Security layer 1 - Check if the request is coming with x-gitlab-token header
    const tkn = req.header('x-gitlab-token');
    if(tkn === null || tkn === undefined) {
        return res.sendStatus(400);
    }

    // Security layer 2 - Check if the token contains the correct secret value
    if(tkn !== process.env.SECRET_TOKEN) {
        return res.sendStatus(403);
    }

    console.log(req);

    const data = generateData(req.body['user'], req.body['object_attributes']);
    broadcast(JSON.stringify(data));
    res.sendStatus(200);

})

const issuesFromData = (data) => {

    let issueArray = []
    for(let i = 0; i < data.length; i++) {
        issueArray[i] = generateData(data[i]['author'], data[i])
    }

    return issueArray;
}

const generateData = (userData, issueData) => {

    return {
        id: issueData["id"],
        name: userData["name"],
        username: userData["username"],
        title: issueData["title"],
        description: issueData["description"],
        createdAt: issueData["created_at"],
        action: issueData["action"]
    }
}

module.exports = router;
