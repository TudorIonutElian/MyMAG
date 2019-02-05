//Creare functie care preia id-ul produsului pentru a il sterge
async function stergeProdus(produs){
    //Preluare detalii produs
    var cautaProdus = JSON.parse(await ajax("get", `https://mymag-31b68.firebaseio.com/magazin/${produs}.json`));
    
    //Modificare textul pentru afisarea intrebarii
    let responseMessage = document.getElementById('response-message');
    responseMessage.innerHTML = `Esti sigur ca doresti sa stergi produsul <span> ${cautaProdus.nume_produs} </span> din baza  de date ?`;
    
    var stergeOk        = document.querySelector('#stergeOk');
    var stergeCancel    = document.querySelector('#stergeCancel');

    stergeOk.addEventListener('click', async function(){
        await ajax("DELETE", `https://mymag-31b68.firebaseio.com/magazin/${cautaProdus.id_produs}.json`);
        setTimeout(function(){location.href = 'index.html'}, 5);
    });
    stergeCancel.addEventListener('click', function(){
        setTimeout(function(){location.href = 'index.html'}, 5);
    });
}

var id_produs = window.location.search.substr(4);

stergeProdus(id_produs);
