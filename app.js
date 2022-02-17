const state = {
    userList: []
    // transaction: []
    // state de transaction arrayi oluşturabilirsin her işlem yaptığın
    // bu array güncellenir ve tek bir render donksiyonu ile işi halletmiş olursun
}

function Li(list, subscriber) {
    list.forEach(function (item) {
        const newLi = document.createElement("li")
        newLi.innerHTML = `<div class="ms-2 me-auto">${item.name}</div><div class="me-4">${item.balance}</div>
        <button class="btn btn-danger btn-sm" onclick="removeUser(${item.id})">Del</button>`
        newLi.setAttribute("id", item.id)
        newLi.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
        subscriber.appendChild(newLi)
    })
}

function Hi(list, subscriber) {
    if (subscriber === "del") {
        const newDel = document.createElement("li")
        newDel.innerHTML = `<div class="ms-2 me-auto">
        ${list} is removed from the user list.</div>`
        newDel.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
        let history = document.getElementById("history-list")
        console.log(newDel)
        history.appendChild(newDel)
    } else {
        list.forEach(function (item) {
            const newHi = document.createElement("li")
            newHi.innerHTML = `<div class="ms-2 me-auto">
        ${item.name} is registered as a new user. Current Balance: ${item.balance}</div>`
            newHi.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
            subscriber.appendChild(newHi)
        })
    }
}

function removeUser(id) {
    const name = state.userList.filter((item) => item.id === id)[0].name
    Hi(name, "del")

    // silme işlemini bu şekilde yapabilirsin daha az kod
    state.userList = state.userList.filter((item) => item.id !== id)
    updateUserList()
    updateSelectList()
}

function renderUserList() {
    const subscribers = [document.getElementById("user-list"), document.getElementById("history-list")];
    subscribers.forEach(function (subscriber) {
        subscriber.innerHTML = ""
        if (subscriber.getAttribute("id") === "user-list") {
            Li(state.userList, subscriber)
        } else if (subscriber.getAttribute("id") === "history-list") {
            Hi(state.userList, subscriber)
        }
    })
}

function updateUserList() {
    const subscriber = document.getElementById("user-list")
    subscriber.innerHTML = ""
    if (subscriber.getAttribute("id") === "user-list") {
        Li(state.userList, subscriber)
    }
}

function setState(stateName, newValue) {
    state[stateName] = newValue;
    renderUserList();
}

let userId = 0
function addUser() {
    const userName = document.getElementById("userName").value
    userId++
    const userBalance = document.getElementById("userBalance").value;
    setState("userList", [
        ...state.userList,
        {
            id: userId,
            name: userName,
            balance: userBalance
        },
    ])
    renderUserList()
    updateSelectList()
}

function updateSelectList() {
    let fromWho = document.getElementById("fromWho")
    let toWho = document.getElementById("toWho")
    toWho.innerHTML = `<option selected>Please Select Recipient</option>`
    fromWho.innerHTML = `<option selected>Please Select Sender</option>`
    const elements = state.userList.map(function (item) {
        const {name, id, balance} = item
        return selectName = `<option name="${name} balance="${balance}" id="${id}">${name} </option>`
        
    })
    toWho.innerHTML = elements.join("")
    fromWho.innerHTML = elements.join("")
}


function transaction() {




    let fromWho = document.getElementById("fromWho")
    let toWho = document.getElementById("toWho")
    let value = document.getElementById("value")
    let fromWhoName = fromWho.options[fromWho.selectedIndex].value
    let toWhoName = toWho.options[toWho.selectedIndex].value
    let fromWhoId = fromWho.options[fromWho.selectedIndex].id
    let toWhoId = toWho.options[toWho.selectedIndex].id
    let transactionValue = value.value

    if (fromWhoName != "Please Select Sender" && toWhoName != "Please Select Recipient" && fromWhoName != toWhoName) {

        state.userList.forEach(function (item) {
            if (item.id == fromWhoId) {
                item.balance = parseInt(item.balance) - parseInt(transactionValue)
            }
            if (item.id == toWhoId) {
                item.balance = parseInt(item.balance) + parseInt(transactionValue)
            }
        })

        if (fromWhoId && toWhoId && transactionValue) {
            const historyList = document.getElementById("history-list")
            const newLi = document.createElement("li")
            newLi.innerHTML = `<div class="ms-2 me-auto">
        ${fromWhoName} sent to ${toWhoName} : ${transactionValue}</div><button class="btn btn-danger btn-sm">Cancel</button>`
            newLi.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
            historyList.appendChild(newLi)
        }
        updateUserList()
    }
}



