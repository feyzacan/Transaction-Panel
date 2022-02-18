const state = {
    userList: [],
    transaction: []
}
// UPDATE USERLIST
function Li(list, subscriber) {
    subscriber.innerHTML = ""
    list.forEach(function (item) {
        // CREATE NEW LIST ELEMENT
        const newLi = document.createElement("li")
        // CREATE A LIST OF USERNAMES AND BALANCES
        newLi.innerHTML = `<div class="ms-2 me-auto">${item.name}</div><div class="me-4">${item.balance}</div>
        <button class="btn btn-danger btn-sm" onclick="removeUser(${item.id})">Del</button>`
        newLi.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
        // RENDER THE LIST ON THE USER AREA
        subscriber.appendChild(newLi)
    })
}

// UPDATE HISTORYLIST
function Hi(list, subscriber, addition) {
    //DELETION
    if (subscriber === "del") {
        // CREATE NEW ELEMENT FOR DELETION
        const newDel = document.createElement("li")
        // CREATE DELETION INFORMATION
        newDel.innerHTML = `<div class="ms-2 me-auto">
        ${list} is removed from the user list.</div>`
        newDel.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
        let history = document.getElementById("history-list")
        // RENDER THE DELETION OPERATION ON HISTORY AREA
        history.appendChild(newDel)
        // TRANSACTION
    } else if (list === "addTransaction") {
        let fromWho = document.getElementById("fromWho")
        let toWho = document.getElementById("toWho")
        let value = document.getElementById("value").value
        let fromWhoName = fromWho.options[fromWho.selectedIndex].value
        let toWhoName = toWho.options[toWho.selectedIndex].value
        const historyList = document.getElementById("history-list")
        // CREATE NEW ELEMENT FOR TRANSACTION
        const newLi = document.createElement("li")
        // CREATE TRANSACTION INFORMATION
        newLi.innerHTML = `<div class="ms-2 me-auto">
        ${fromWhoName} sent to ${toWhoName} : ${value}</div><button class="btn btn-danger btn-sm" id="cancelButton" onclick="cancelTransaction(this.id)">Cancel</button>`
        newLi.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
        // RENDER THE TRANSACTION OPERATION ON HISTORY AREA
        historyList.appendChild(newLi)
    }
    // OTHER OPERATIONS
    else {
        // CREATE NEW ELEMENT
        const newHi = document.createElement("li")
        // CREATE NEW ELEMENT
        newHi.innerHTML = `<div class="ms-2 me-auto">
        ${list} is registered as a new user. Current Balance: ${addition}</div>`
        newHi.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
        // RENDER THE IT ON HISTORY AREA
        subscriber.appendChild(newHi)
    }
}

function removeUser(id) {
    // DELETING USER
    const name = state.userList.filter((item) => item.id === id)[0].name
    // RENDER IT ON HISTORY AREA
    Hi(name, "del")
    // UPDATE USERLIST
    state.userList = state.userList.filter((item) => item.id !== id)
    updateUserList()
    updateSelectList()
}

function renderUserList(action, action2) {
    const userList = document.getElementById("user-list")
    const historyList = document.getElementById("history-list")
    // RENDER ON USERLIST AND HISTORY AREA
    Li(state.userList, userList)
    if (action === addTransaction) {
        Hi(addTransaction)
    } else {
        Hi(action, historyList, action2)
    }
}

function updateUserList() {
    const subscriber = document.getElementById("user-list")
    subscriber.innerHTML = ""
    if (subscriber.getAttribute("id") === "user-list") {
        // UPDATE USERLIST
        Li(state.userList, subscriber)
    }
}

// STATE SETTING
function setState(stateName, newValue) {
    state[stateName] = newValue
}

let userId = 1000
function addUser() {
    const userName = document.getElementById("userName").value
    const userBalance = document.getElementById("userBalance").value;
    // CREATE NEW USER CONSIDERING TO THE FORM AND CREATE AN ID
    if (userName && userBalance) {
        userId++
        setState("userList", [
            ...state.userList,
            {
                id: userId,
                name: userName,
                balance: userBalance
            },
        ])
        renderUserList(userName, userBalance)
        updateSelectList()
        // ERROR HANDLING
    } else { alert("Please make sure to fill the 'Name' and 'Balance' sections properly.") }
}

let transId = 0
function addTransaction() {
    transId++
    let fromWho = document.getElementById("fromWho")
    let toWho = document.getElementById("toWho")
    let value = document.getElementById("value").value
    let fromWhoId = fromWho.options[fromWho.selectedIndex].id
    let toWhoId = toWho.options[toWho.selectedIndex].id
    // CREATE NEW TRANSACTION ARRAY AND CREATE AN ID
    setState("transaction", [
        ...state.transaction, { transId, fromWhoId, toWhoId, value }
    ])
    if (fromWhoId && toWhoId && value && fromWhoId != toWhoId) {
        // UPDATE BALANCES OF TO THE PARTIES
        state.userList.forEach(function (item) {
            if (item.id == fromWhoId) {
                item.balance = parseInt(item.balance) - parseInt(value)
            }
            if (item.id == toWhoId) {
                item.balance = parseInt(item.balance) + parseInt(value)
            }
        })
        updateUserList()
        renderUserList("addTransaction")
        let button = document.getElementById("cancelButton")
        button.id = transId
        //ERROR HANDLING
    } else if (fromWhoId && toWhoId && value && fromWhoId == toWhoId) {
        alert("Sender and Recipient cannot be the same.")
    } else {
        alert("Please make sure to fill the transaction form properly.")
    }
}

function cancelTransaction(id) {
    const canceledTransaction = state.transaction.filter((item) => item.transId == id)[0]
    let fromWhoId = canceledTransaction.fromWhoId
    let toWhoId = canceledTransaction.toWhoId
    let value = canceledTransaction.value
    // CHECK IF USERS EXIST
    let sender = state.userList.filter(item => item.id == fromWhoId)[0]
    let recipient = state.userList.filter(item => item.id == toWhoId)[0]
    // ERROR HANDLING
    if (!sender || !recipient) {
        alert("Cannot be canceled the transaction! Sender or recipient account does not exist!")
    } else {
        sender.balance = parseInt(sender.balance) + parseInt(value)
        recipient.balance = parseInt(recipient.balance) - parseInt(value)
        let cancelledButton = document.getElementById(id)
        cancelledButton.disabled = true
        cancelledButton.innerText = "Canceled"
    }
    updateUserList()
}

function updateSelectList() {
    let fromWho = document.getElementById("fromWho")
    let toWho = document.getElementById("toWho")
    // FIND USERS FROM USERLIST
    const elements = state.userList.map(function (item) {
        const { name, id, balance } = item
        return selectName = `<option name="${name} balance="${balance}" id="${id}">${name} </option>`
    })
    // RENDER USERS TO SELECTLIST
    fromWho.innerHTML = `<option disabled selected>Please Select Sender</option>` + elements.join("")
    toWho.innerHTML = `<option disabled selected>Please Select Recipient</option>` + elements.join("")
}




