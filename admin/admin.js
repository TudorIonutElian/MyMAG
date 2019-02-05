var URLAdress = window.location.href;
if(URLAdress.includes('admin/index')){
    var save_product = document.querySelector('#saveProduct');
    save_product.addEventListener('click', adaugaProdus);
}

//Creare functie care ascunde produsele la add.click
    //1.1 - Definire variabile care targeteaza div-urile de la header
    var addProduct = document.getElementById('adminAddBtn');
    var productHeaderInfo = document.querySelector('.products-header-info');
    var productsHeaderBtn = document.querySelector('.products-header-btn');
    var newProductsBtns = document.getElementById('products-header-btn-new');
    var cancelProduct = document.getElementById('cancelProduct');
    var adminAddProduct = document.getElementById('admin-add-product');
    var adminProducts = document.getElementById('admin-products');  
    var productTypes = document.querySelector('.productTypes');
    

    if(URLAdress.includes('admin/index')){
        //1.2 - Click ce va ascunde buttonul Adaugare Produs
        if(adminAddProduct.style.display = 'block'){
            adminAddProduct.style.display = 'none';
            clearInputFields();
        }
        addProduct.addEventListener("click", function(){
            this.style.display = 'none';
            adminProducts.style.display = 'none';
            adminAddProduct.style.display = 'block';
            productHeaderInfo.innerHTML = 'Adaugare produs';
            newProductsBtns.style.display = 'block';
            clearInputFields();
        });
        //1.3 - Click ce face reversul click-ului 1.2
        cancelProduct.addEventListener('click', function(){
            adminProducts.style.display = 'block';
            addProduct.style.display = 'block';
            adminAddProduct.style.display = 'none';
            newProductsBtns.style.display = 'none';
            productHeaderInfo.innerHTML = 'Gestionare produse';
            clearInputFields();
        });
    }

async function showProductsData(){
    let tbodyProducts = document.querySelector('#tbody_product-list');
    var total_produse = document.querySelector('#total_produse');
    var response_prods = await ajax("get", `https://mymag-31b68.firebaseio.com/magazin/.json`);
    
    var produseAdmin = JSON.parse(response_prods);

    //Setare suma totala a produselor la valoarea 0
    var sumaTotalaProduse = 0;
    
    var randProdus = "";
    for(var produs in produseAdmin){
        randProdus += 
        `
            <tr>
                <td class="td-img">
                    <img src="../styles/img/${produseAdmin[produs].imagine_produs}.jpg" alt="">
                </td>
                <td class="td-name">${produseAdmin[produs].nume_produs}</td>
                <td class="td-price">${produseAdmin[produs].pret_produs} lei</td>
                <td class="td-qty">${produseAdmin[produs].stock_produs}</td>
                <td class="td-del"><a href='../admin/stergeprodus.html?id=${produseAdmin[produs].id_produs}'>Remove</a></td>
                <td class="td-edit"><a href='../admin/stergeprodus.html?id=${produseAdmin[produs].id_produs}'>Editeaza</a></td>
            </tr>
        `;
        //Calculeaza valoarea totala a produselor existente in baza de date
        sumaTotalaProduse += produseAdmin[produs].pret_produs;
    }

    tbodyProducts.innerHTML = randProdus;
    var numar_produse = Object.keys(produseAdmin).length;
    //Calculeaza suma totala a produselor
    if(produseAdmin){
        total_produse.innerHTML = `Total produse in baza de date : <strong>${numar_produse}</strong> in valoare totala de : <strong>${sumaTotalaProduse.toFixed(2)}</strong> lei`;
    }
    
    var nextProductID = (numar_produse + 1);
}


async function adaugaProdus(){
    //Preluare produse din baza de date
    var response_prods  = await ajax("GET", `https://mymag-31b68.firebaseio.com/magazin.json`);
    //aplicare JSON.parse pe produse
    var produseAdmin    = JSON.parse(response_prods);
    //preluare numar de produse
    if(produseAdmin){
        var numar_produse   = Object.keys(produseAdmin).length;
        //setare numar nou produse
        var numar_nou       = (numar_produse + 1);
    }

    //Serare valori produs nou
    var produs_nou = {};
        produs_nou.imagine_produs   = document.getElementById('linkImagine').value;
        produs_nou.descriere_produs = document.getElementById('descriereProdus').value;
        produs_nou.nume_produs      = document.getElementById('numeProdus').value;
        produs_nou.pret_produs      = Number(document.getElementById('pretProdus').value);
        produs_nou.stock_produs     = Number(document.getElementById('cantitateProdus').value);
        produs_nou.id_produs        = document.getElementById('numeProdus').value.replace(/\s+/g, '_').toLowerCase();

    var new_product_final = JSON.stringify(produs_nou);

    await ajax("PUT", `https://mymag-31b68.firebaseio.com/magazin/${produs_nou.id_produs}.json`, new_product_final);
    
    //Afiseaza produsele
        adminAddProduct.style.display = 'none';
        adminProducts.style.display = 'block';
        addProduct.style.display = 'block';
        adminAddProduct.style.display = 'none';
        newProductsBtns.style.display = 'none';
        productHeaderInfo.innerHTML = 'Gestionare produse';
    showProductsData();
}

function clearInputFields(){
    var allInputs = document.querySelectorAll('input[type=text]');
    for(var input in allInputs){
        input.value = "";
    }
}


