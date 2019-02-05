var productList = document.getElementById('product-list');


/* -- Functie generala AJAX -- */
function ajax(method, url, body){
    return new Promise(function(resolve, reject){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4){
                if(this.status === 200) {
                    resolve(this.responseText)
                }else{
                    reject(new Error("Conexiunea a esuat. Va rugam incercati din nou!"));
                }
            }
        };
        xhttp.open(method, url, true);
        xhttp.send(body);
    });
}

/* Product Details Page FUNCTIONS */

async function productDetails(id_produs){
    /* --returneaza id-url produsului */
    var productDetailsArea = document.getElementById('product_details');
    var id_produs = window.location.search.substr(4);
    var product         = JSON.parse(await ajax("get", `https://mymag-31b68.firebaseio.com/magazin/${id_produs}.json`));
    var productDetails = "";
    productDetails += 
    `
    <div class="col-6">
        <img class="img-thumbnail product product-image" src="../styles/img/${product.imagine_produs}.jpg" alt="">
    </div>

    <div class="col-6 product-rows">
        <div class="product-rows_title">${product.nume_produs}</div>
        <div class="product-rows_desc">${product.descriere_produs}</div>
        <div class="product-rows_price"><span>Pret:</span> ${product.pret_produs} lei</div>
        <div class="product-rows_stock"><span>In stoc:</span> ${product.stock_produs} bucati</div>
        <div class="product-rows_qty">
            Cantitate 
            <span>
                <input type="number" name="quantity" min="1" max="5">
            </span>
        </div>
        <div>
            <a href="?id=${product.id_produs}" id="addToBasket" class="btn btn-primary">
                <span><i class="fas fa-shopping-basket fa-1x"></i></span>
                Adauga in cos
            </a>
        </div>
    </div>
    `;
    productDetailsArea.innerHTML = productDetails;
}

/* --- General Products Loading AREA FUNCTIONALITY -- */
async function loadProducts(){
    var response = await ajax("get","https://mymag-31b68.firebaseio.com/magazin/.json")
    magazin = JSON.parse(response);
    afiseazaProduse(magazin);
}

function afiseazaProduse(listaProduse){
    /* -- Parsare lista produse din baza de date --*/
        for (var produs in listaProduse){
            /* -- aici vor ajunge produsele afisate --*/
            var productList = document.getElementById('product-list');
            var parseProducts;

            parseProducts = 
            `
            <div class="col-sm-12 col-md-3 product">
                <div class="product-top">
                    <img class="img-thumbnail product product-image" src="styles/img/${listaProduse[produs].imagine_produs}.jpg" alt="">
                </div>
                <div class="product-title">
                    ${listaProduse[produs].nume_produs}
                </div>
                <div class="product-bottom">
                    <div class="product-price"> ${listaProduse[produs].pret_produs}<span>lei</span></div>
                    <div class="product-details">
                        <a href="product/product-details.html?id=${listaProduse[produs].id_produs}" class="btn btn-details">Detalii</a>
                    </div>
                </div>
            </div>
            `;
            productList.innerHTML += parseProducts;
        }
    /* -- aici vor ajunge produsele afisate --*/
    
}