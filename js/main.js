const request = window.indexedDB.open("PaymentCalendar", 3);
let db;
request.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
    console.error(`Database error: ${event.target.errorCode}`);
};



request.onupgradeneeded = (event) => {
    console.log("whatt");
    db = event.target.result;
    const objectStore = db.createObjectStore("payments", { keyPath: "data" });

    objectStore.createIndex("data", "data", { unique: false });
    objectStore.createIndex("valor", "valor", { unique: false });
    objectStore.createIndex("mes", "mes", { unique: false });

    
    objPayment = {"data":"2023-07-15", "valor": 450.00, "mes":"july"};

    objectStore.transaction.oncomplete = function(event) {
        // Armazenando valores no novo objectStore.
        var clientesObjectStore = db.transaction("payments", "readwrite").objectStore("payments");
        clientesObjectStore.add(objPayment);
    }
};
request.onsuccess = (event) => {
    console.log("success");
    db = event.target.result;
    var transaction = db.transaction(["payments"]);
    var objectStore = transaction.objectStore("payments");
    var request = objectStore.get("2023-07-15");
    request.onerror = function(event) {
    // Tratar erro!
    };
    request.onsuccess = function(event) {
    // Fazer algo com request.result!
    console.log(request.result.mes);
    };
    RestoreData();
};

window.onload = function() {
    var buttonAddPayment = document.getElementById("addPayment");

    buttonAddPayment.onclick = function(){
        console.log("clicado");
        let addObject = {};
        addObject.data = document.getElementById("date").value;
        addObject.valor = document.getElementById("value").value;
        addObject.mes = document.getElementById("month").value;
        
        transactionAdd = db.transaction("payments", "readwrite");
        clientesObjectStore = transactionAdd.objectStore("payments");

        transactionAdd.oncomplete = function(event){
            console.log("adicionado");
        };
        requestAdd = clientesObjectStore.add(addObject);
    };

};   

function RestoreData(){
    var result = db.transaction("payments").objectStore("payments").getAll();
    result.onsuccess = function(event) {
        result.result.forEach(element => {
        console.log(element);
        });
    };
}
const currentUrl = window.location.href;
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register(currentUrl + "serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }