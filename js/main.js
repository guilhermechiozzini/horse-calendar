const today = new Date();
var dayToday = today.getDate();
var monthToday = today.getMonth() + 1;

dayToday = dayToday < 10? "0"+ dayToday:dayToday;
monthToday = monthToday < 10? "0"+ monthToday:dayTmonthTodayoday;

document.getElementById("date").value = today.getFullYear() + "-" + monthToday + "-" + dayToday; 
document.getElementById("year").value = today.getFullYear();
const request = window.indexedDB.open("HorseCalendar", 3);
let dbPayment;
request.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
    console.error(`Database error: ${event.target.errorCode}`);
};



request.onupgradeneeded = (event) => {
    dbPayment = event.target.result;
    const objectStore = dbPayment.createObjectStore("payments", { keyPath:["mes","ano"] });

    objectStore.createIndex("data", "data", { unique: false });
    objectStore.createIndex("valor", "valor", { unique: false });
    objectStore.createIndex("ano", "ano", { unique: false });
    objectStore.createIndex("mes", "mes", { unique: false });

    objectStore.transaction.oncomplete = function(event) {
        // Armazenando valores no novo objectStore.
        var clientesObjectStore = dbPayment.transaction("payments", "readwrite").objectStore("payments");
    }
};
request.onsuccess = (event) => {
    // console.log("success");
    // db = event.target.result;
    // var transaction = db.transaction(["payments"]);
    // var objectStore = transaction.objectStore("payments");
    // var request = objectStore.get("2023-07-15");
    // request.onerror = function(event) {
    // // Tratar erro!
    // };
    // request.onsuccess = function(event) {
    // // Fazer algo com request.result!
    //     if (request.result != undefined)
    //         console.log(request.result.mes);
    // };
    RestoreData();
};

window.onload = function() {
    var buttonAddPayment = document.getElementById("addPayment");
    buttonAddPayment.onclick = function(){
        console.log("clicado");
        let addObject = {};
        addObject.data = document.getElementById("date").value;
        addObject.valor = document.getElementById("value").value;
        addObject.ano = document.getElementById("year").value;
        addObject.mes = document.getElementById("month").value;
        console.log(addObject.mes);
        
        transactionAdd = dbPayment.transaction("payments", "readwrite");
        clientesObjectStore = transactionAdd.objectStore("payments");

        transactionAdd.oncomplete = function(event){
            console.log("adicionado");
        };
        requestAdd = clientesObjectStore.add(addObject);
        RestoreData();
    };

};   

function RestoreData(){
    var tablePayments = document.getElementById("paymentTable");
    var tBody = tablePayments.getElementsByTagName("tbody")[0];
    if(tBody != undefined)
        tablePayments.removeChild(tBody);
    tBody = tablePayments.createTBody();

    var result = dbPayment.transaction("payments").objectStore("payments").getAll();
    result.onsuccess = function(event) {
        result.result.forEach(element => {
        var row = tBody.insertRow();
        var cell1 = row.insertCell(-1);
        var cell2 = row.insertCell(-1);
        var cell3 = row.insertCell(-1);
        var cell4 = row.insertCell(-1);
        var cell5 = row.insertCell(-1);
        cell1.innerHTML = element.data;
        cell2.innerHTML = element.mes;
        cell3.innerHTML = element.ano;
        cell4.innerHTML = element.valor;
        cell5.classList.add("row-action");
        cell5.innerHTML = "<span class=\"delete-button\" onClick=\"DeletePayment('"+element.mes+"', '"+element.ano+"');\"> <span>";
        });
    };
}
const originUrl = window.location.origin;
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register(originUrl + "/horse-calendar/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }

function DeletePayment(month, year) {
    let transaction = dbPayment.transaction("payments", "readwrite");
    let request = transaction.objectStore("payments").delete([month,year]);

    transaction.oncomplete = () => {
    RestoreData();    
  };
}