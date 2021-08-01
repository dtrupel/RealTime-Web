const ws = new WebSocket('ws://localhost:8080');

// Open connection
ws.addEventListener('open', function (event) {
    console.log('Connection opened');
});

// Listen for messages
ws.addEventListener('message', function (event) {

    console.log('Message from server ', event.data);

    let issue = JSON.parse(event.data);
    let result = resolveUpdate(issue);

    if(result === 0)
        console.log("Update successful.");
    else
        console.log("Update failed.");

});

const resolveUpdate = data => {

    const addIssue = data => {

        let table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('table-dark');

        const createRow = (data, label) => {

            let row = document.createElement('tr');
            let rowLabel = document.createElement('th');
            rowLabel.scope = "col";
            rowLabel.innerHTML = label;
            let rowValue = document.createElement('td')
            rowValue.innerHTML = data;
            row.appendChild(rowLabel);
            row.appendChild(rowValue);
            return row;

        }

        table.appendChild(createRow(data.id, "ID"));
        table.appendChild(createRow(data.name, "Author's name"));
        table.appendChild(createRow(data.username, "Author's username"));
        table.appendChild(createRow(data.title, "Title"));
        table.appendChild(createRow(data.description, "Description"));

        let container = document.createElement('div');
        container.classList.add('container');
        container.appendChild(table);
        document.body.prepend(container);

    }

    const updateIssue = data => {

        const findById = id => {
            let tables = document.getElementsByTagName('table');
            for (let i = 0; i < tables.length; i++) {
                if(id.toString() === tables[i].children[0].children[0].children[1].innerText) {
                    return tables[i];
                }
            }
        }

        let table = findById(data.id);
        console.log(table);
        table.children[0].children[1].children[1]['innerText'] = data.name;
        table.children[0].children[2].children[1]['innerText'] = data.username;
        table.children[0].children[3].children[1]['innerText'] = data.title;
        table.children[0].children[4].children[1]['innerText'] = data.description;

    }

    console.log(data['action'])

    switch(data["action"]) {
        case "open":
            addIssue(data);
            break;
        case "update":
            updateIssue(data);
            break;
        default:
            return 1;
    }
    return 0;
}

