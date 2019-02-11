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

function pornireMagazin(){
    getMenu();
    getProduse();
}


async function getMenu(){
    var links_menu = document.getElementById('links_menu');
    var target_links = "";
    var linkuri_meniu = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/meniu/.json`));
    for(var link in linkuri_meniu){
        target_links += `<li><a href="#">${linkuri_meniu[link].text_link}</a></li>`;
    }
    links_menu.innerHTML = target_links;
}
async function getProduse(){
    var lista_produse_target = document.getElementById('lista_produse');
    var produse = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse/.json`));
    var lista_produse_final = "";
    for(var produs in produse){
        lista_produse_final +=
        `
            <div class="col-md-4 col-xs-6">
                <div class="product">
                    <div class="product-img">
                        <img class="produs" src="${produse[produs].imagine_produs}" alt="">
                        <div class="product-label">
                            ${verificaReducere(produse[produs].reducere_produs)}
                            ${verificaProdusNou(produse[produs])}
                        </div>
                    </div>
                    <div class="product-body">
                        <p class="product-category">${produse[produs].categorie_produs}</p>
                        <h3 class="product-name"><a href="#">${produse[produs].nume_produs}</a></h3>
                        <h4 class="product-price">${produse[produs].pret_nou_produs} RON <del class="product-old-price">$ ${produse[produs].pret_vechi_produs} RON</del></h4>
                        <div class="product-btns">
                            <button class="add-to-wishlist"><i class="far fa-heart"></i><span class="tooltipp">add to wishlist</span></button>
                            <button class="add-to-compare"><i class="fas fa-compress-arrows-alt"></i><span class="tooltipp">add to compare</span></button>
                            <a href="product.html?id=${produse[produs].id_produs}" onclick="getProductDetails();" class="quick-view" target="_blank"><i class="fas fa-eye"></i></a>
                        </div>
                    </div>
                    <div class="add-to-cart">
                        <button onclick="adaugaProdusCos('${produse[produs].id_produs}');" class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i> Adauga in cos</button>
                    </div>
                </div>
            </div>

        `;
    }
    lista_produse_target.innerHTML += lista_produse_final;
    await getProduseCos();
}

function verificaReducere(product){
    if(product > 0){
        return `<span class="sale">${product}</span>`;
    }else{
        return `<span class="no-sale"></span>`;
    }
}
function verificaProdusNou(product){
    if(product.promotie === true){
        return `<span class="new">REDUCERE</span>`;
    }else{
        return `<span class="old"></span>`;
    }
}
function loadAdmin(){
    getProduseAdmin();
}
async function getProduseAdmin(){
    var produse = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse/.json`));
    var lista_produse_admin = document.getElementById('lista-produse-admin');
    var produse_admin = "";
    
    var numar_produse   = Object.keys(produse).length;
    for(var produs in produse){
        produse_admin +=
        `
        <tr>
            <td>${produse[produs].nume_produs}</td>
            <td>${produse[produs].pret_nou_produs}</td>
            <td>${produse[produs].pret_vechi_produs}</td>
            ${verificaPromotie(produse[produs])}
            ${verificaReducereAdmin(produse[produs])}
            <td>${produse[produs].stock_produs}</td>
            <td><a class="admin-btn-delete" href="stergeprodus.html?id=${produse[produs].id_produs}">Sterge</a></td>
            <td><a class="admin-btn-edit" href="editeazaprodus.html?id=${produse[produs].id_produs}">Editeaza</a></td>
        </tr>
        `;
    }
    lista_produse_admin.innerHTML = produse_admin;        
}
function verificaPromotie(product){
    if(product.promotie === true){
        return `<td>DA</td>`;
    }else{
        return `<td>NU</td>`;
    }
}

function verificaReducereAdmin(product){
    if(product.reducere_produs > 0){
        return `<td>${product.reducere_produs} %</td>`;
    }else{
        return `<td>Nu exista reduceri.</td>`;
    }
}
var sectiuni_admin = document.getElementById('sections-admin');

function vizualizareProduse(){
    var arata_produse = document.getElementById('viewProducts');
    var section_produse_admin = document.getElementById('section-lista-produse');
    arata_produse.addEventListener("click", function(){
        sectiuni_admin.style.display = 'none';
        section_produse_admin.style.display = 'block';
    });
}

function adaugaProdus(){
    var add_product = document.getElementById('addProduct');
    var adauga_produs = document.getElementById('section-adauga-produse');
    add_product.addEventListener("click", function () {
        sectiuni_admin.style.display = 'none';
        adauga_produs.style.display = 'block';
    })
}

function meniuManagementView(){
    var meniuManagementViewTab = document.getElementById('meniuManagementView');
    var section_produse_admin = document.getElementById('sections-admin');
    var section_menu_management = document.getElementById('section-meniu-management');
    meniuManagementViewTab.addEventListener("click", function(){
        section_produse_admin.style.display = 'none';
        section_menu_management.style.display = 'block';
    })
}
async function adaugaProdusCos(produs){
    var produs_nou_cos = {
        "id_produs": `${produs}`,
        "cantitate": 1
    }
    var getProduseCos = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/cos.json`));
    //Verificare produs in baza de date
    var qtyProd = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse/${produs}/stock_produs.json`));
    if( getProduseCos.hasOwnProperty(produs) ) {
        //Produs identificat in baza de date
        var cantitate_cos = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/cos/${produs}.json`));
        //Preluare cantitate existenta in cos
        var cantitate_in_cos = cantitate_cos.cantitate;
        if(cantitate_in_cos < qtyProd){
            cantitate_in_cos++;
            produs_nou_cos.cantitate = cantitate_in_cos;
            await ajax("PUT", `https://mymag-31b68.firebaseio.com/cos/${produs}/cantitate.json`, JSON.stringify(produs_nou_cos.cantitate));
        }else if(cantitate_in_cos = qtyProd){
            alert(`Nu puteti adauga mai mult produse, Numarul maxim pe care il puteti cumpara este ${qtyProd}`);
        }

    }else{
        if(produs_nou_cos.cantitate > qtyProd){
            alert('Nu exista atatea produse in stock!');
        }else if(produs_nou_cos.cantitate <= qtyProd){
            await ajax("PUT", `https://mymag-31b68.firebaseio.com/cos/${produs}.json`, JSON.stringify(produs_nou_cos));
            setTimeout(function(){
                location.reload();
            }, 20);
        }
    }
}
async function getProduseCos(){
    var produse_in_cos = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/cos/.json`));
    var cos_numar_output = document.getElementById('cos_numar_output');
    var numar_total_produse_cos = Object.keys(produse_in_cos).length;
    cos_numar_output.innerHTML = numar_total_produse_cos;
}

async function getFinalOrder(){
    var produse_in_cos      = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/cos/.json`));
    var produse_in_magazin  = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse.json`));
    
    var order_products_list     = document.getElementById('order-products');
    var sumaTotalaCumparaturi   = document.getElementById('sumaTotalaCumparaturi');
    var order_products_items    = "";
    var sumaFinala = 0;
    for(var produs in produse_in_cos){
        order_products_items +=
        `<div class="order-col">
            <div>${produse_in_cos[produs].cantitate} x ${produse_in_magazin[produs].nume_produs}</div>
            <div>${(produse_in_cos[produs].cantitate * produse_in_magazin[produs].pret_nou_produs).toFixed(2)} RON</div>
        </div>`;
        sumaFinala += produse_in_cos[produs].cantitate * produse_in_magazin[produs].pret_nou_produs;
    }
    order_products_list.innerHTML   = order_products_items;
    sumaTotalaCumparaturi.innerHTML = `${sumaFinala.toFixed(2)} RON`;    
}
async function getProductDetails(){
    var product = document.getElementById('product');
    var url = new URL(location.href);
    var id = url.searchParams.get("id");
    var response = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse/${id}/.json`));

    var new_product =
    `<!-- container -->
    <div class="container">
        <!-- row -->
        <div class="row">
            <!-- Product main img -->
            <div class="col-md-5 col-md-push-2">
                <div id="product-main-img">
                    <div class="product-preview">
                        <img src="${response.imagine_produs}" alt="">
                    </div>
                </div>
            </div>
            <!-- /Product main img -->

            <!-- Product thumb imgs -->
            <div class="col-md-2  col-md-pull-5">
                <div id="product-imgs">
                    <div class="product-preview">
                        <img src="${response.imagine_produs}" alt="">
                    </div>
                </div>
            </div>
            <!-- /Product thumb imgs -->

            <!-- Product details -->
            <div class="col-md-5">
                <div class="product-details">
                    <h2 class="product-name">${response.nume_produs}</h2>
                    <div>
                        <h3 class="product-price">${response.pret_nou_produs} RON <del class="product-old-price">${response.pret_vechi_produs} RON</del></h3>
                        <span class="product-available">In Stock</span>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                    <div class="add-to-cart">
                        <div class="qty-label">
                            Qty
                            <div class="input-number">
                                <input type="number">
                                <span class="qty-up">+</span>
                                <span class="qty-down">-</span>
                            </div>
                        </div>
                        <button onclick="adaugaProdusCos('${response.id_produs}');"class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i>Adauga in cos</button>
                    </div>

                    <ul class="product-links">
                        <li>Share:</li>
                        <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                        <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                        <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
                        <li><a href="#"><i class="fa fa-envelope"></i></a></li>
                    </ul>

                </div>
            </div>
            <!-- /Product details -->
        </div>
        <!-- /row -->
    </div>
    <!-- /container -->
    `;
    product.innerHTML = new_product;
}

async function adaugareProdus(){
    var allProducts         = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse.json`));
    var productTitle        = document.getElementById('productTitle').value;
    var productID           = document.getElementById('productTitle').value.replace(/\s+/g, '_').toLowerCase();
    var productCategory     = document.getElementById('productCategory').value;
    var productDescription  = document.getElementById('productDescription').value;
    var productImage        = document.getElementById('productImage').value;
    var productPretNou      = document.getElementById('productPretNou').value;
    var productPretVechi    = document.getElementById('productPretVechi').value;
    var productPromotie     = document.getElementById('productTitle').value;
    var productReducere     = document.getElementById('productReducere').value;
    var productStock        = document.getElementById('productStock').value;


    var creare_produs_nou = {
        "categorie_produs": productCategory,
        "descriere_produs": productDescription,
        "id_produs": productID,
        "imagine_produs": productImage,
        "nume_produs": productTitle,
        "pret_nou_produs": productPretNou,
        "pret_vechi_produs": productPretVechi,
        "promotie": productPromotie,
        "reducere_produs": productReducere,
        "stock_produs": productStock
    }

    if(allProducts.hasOwnProperty(creare_produs_nou.id_produs)) {
        console.log('Eroare, produsul exista deja in baza de date');
    }else{
        var finalProduct = JSON.stringify(creare_produs_nou);
        await ajax("PUT", `https://mymag-31b68.firebaseio.com/produse/${creare_produs_nou.id_produs}.json`, finalProduct);
    }

}