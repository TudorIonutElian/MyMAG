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
    getProduseCos();
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
    var URLlocation = location.href;
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
    lista_produse_target.innerHTML = lista_produse_final;
}

function verificaReducere(product){
    if(product > 0){
        return `<span class="sale"> -${product}%</span>`;
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
    getMenu();
    getProduseCos();
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
            <td><a class="admin-btn-edit" href=""editprodus.html?id=${produse[produs].id_produs}">Editeaza</a></td>
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
    verificareProdusCos(produs);
}
async function getProduseCos(){
    var produse_in_cos = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/cos/.json`));
    var cos_numar_output = document.getElementById('cos_numar_output');
    var numar_total_produse_cos = Object.keys(produse_in_cos).length;
}

async function getFinalOrder(){
    var produse_in_cos      = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/cos/produse.json`));
    var produse_in_magazin  = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse.json`));
    
    var order_products_list     = document.getElementById('order-products');
    var sumaTotalaCumparaturi   = document.getElementById('sumaTotalaCumparaturi');
    var order_products_items    = "";
    var sumaFinala = 0;
    for(var produs in produse_in_cos){
        order_products_items +=
        `<div class="order-col">
            <div class="text-center">${produse_in_cos[produs].cantitate} x ${produse_in_magazin[produs].nume_produs}</div>
            <div class="text-center">${(produse_in_cos[produs].cantitate * produse_in_magazin[produs].pret_nou_produs).toFixed(2)} RON</div>
            <div class="text-center"><a href="" onclick="stergeDinCos();"><img src="img/remove-cart.png"></a></div>
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
                                <input type="number" min="1">
                            </div>
                        </div>
                        <button onclick="adaugaProdusCos('${id}');"class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i>Adauga in cos</button>
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
    var productDescription  = document.getElementById('productDescription').value;
    var productImage        = document.getElementById('productImage').value;
    var productPretNou      = document.getElementById('productPretNou').value;
    var productPretVechi    = document.getElementById('productPretVechi').value;
    var productPromotie     = document.getElementById('productTitle').value;
    var productReducere     = document.getElementById('productReducere').value;
    var productStock        = document.getElementById('productStock').value;

    var creare_produs_nou = {
        "descriere_produs": productDescription,
        "id_produs": productID,
        "imagine_produs": productImage,
        "nume_produs": productTitle,
        "pret_nou_produs": productPretNou,
        "pret_vechi_produs": productPretVechi,
        "promotie": function(productPromotie){
            if(productPromotie === "DA"){
                return "true";
            }else{
                return "false";
            }
        },
        "reducere_produs": productReducere,
        "stock_produs": productStock
    }

    if(allProducts.hasOwnProperty(creare_produs_nou.id_produs)) {
        alert.log('Eroare, produsul exista deja in baza de date');
    }else{
        await ajax("PUT", `https://mymag-31b68.firebaseio.com/produse/${creare_produs_nou.id_produs}/.json`, JSON.stringify(creare_produs_nou));
    }

}

//Functii care FUNCTIONEAZA BINE

    //Functie pentru adaugarea produselor in stock
    async function verificareProdusCos(produs){
        console.log(produs);
        var cos, stock, emptyStock, cantitate;
        //Setare cantitate standard pentru adaugare in cos
        cantitate = 1;
        //Preluare produse din cos
        cos      = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/cos.json`));
        //Preluare cantitate produs din cos
        stock    = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse/${produs}/stock_produs.json`));
        produs = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse/${produs}/id_produs.json`));
        produs_name = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse/${produs}/nume_produs.json`));
        //Creare obiect nou care sa aiba valorile produslui
        var produsNou = {
            "id": produs,
            "cantitate": cantitate
        }
        if(cos.hasOwnProperty(produs)){
            //Verificare cantitate stock
            if(stock != 0){
                //Preluare detalii produs din cos
                    produsExistent = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/cos/${produs}/.json`));
                //Setare produs nou de adaugat in cos cu aceleasi valori
                    produsNou.id = produsExistent.id;
                    produsNou.cantitate = produsExistent.cantitate;
                //Incrementare valoare noua a produsului din cos
                    produsNou.cantitate++;
                //Ajax care reintroduce produsul cu noua valoare
                    await ajax("PUT", `https://mymag-31b68.firebaseio.com/cos/${produs}/.json`, JSON.stringify(produsNou));
                //Decrementare cantitate din stock
                stock -= 1;
                //Introducere valoare noua in stock-ul produsului
                await ajax("PUT", `https://mymag-31b68.firebaseio.com/produse/${produs}/stock_produs.json`, JSON.stringify(stock));
            }else{
                alertStock(produs_name);
            }
        }else{
            //Adaugare produs in cos
            await ajax("PUT", `https://mymag-31b68.firebaseio.com/cos/${produs}/.json`, JSON.stringify(produsNou));
        }
    }
    //Functie pentru afisare mesaj de alerta cand stocul este 0
    function alertStock(product){
        var afisareStockEpuizat = document.getElementById('stock-epuizat');
        afisareStockEpuizat.innerHTML = 
        `
        <div class="container">
            <div class="row row-flex">
                <div class="col-12 col-md-6 text-center">
                    <div id="close-alert" class="close"><img src="img/close.png" alt=""></div>
                    <h4>Ne pare rau, stocul este epuizat pentru produsul <span class="stock-alert-title">${product}</span> !</h4>
                </div>
            </div>
        </div>
        `;
        afisareStockEpuizat.style.display = 'block';
        var closeAlert = document.getElementById('close-alert');
        closeAlert.addEventListener("click", function(){
            var closeDiv = this.parentElement.parentElement;
            closeDiv.style.display = 'none';
        });
    }

    //Functie pentru stergerea produselor din baza de date
    async function stergeProdus(){
        var url = location.search.substring(4);
        var confirmationOutput = document.getElementById('confirmareStergere');
        //Preluare nume produs de sters
        var produsDeSters = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/produse/${url}.json`));
        var produsDeStersNume = produsDeSters.nume_produs;
        var asking = 
        `
            <div class="col-12 col-md-2 text-center" >
                <img class="img-delete" src="${produsDeSters.imagine_produs}">
            </div>
            <div class="col-12 col-md-10 text-center">
                Sunteti sigur ca doriti sa stergeti produsul <b>${produsDeStersNume}</b> din baza de date?
                <div class="row dispay-flex">
                        <a id="confirmDeleteButton"href="" class="admin-btn-edit btn">Da, stergeti produsul</a>
                        <a id="cancelDeleteButton" href="" class="admin-btn-delete btn">Nu, anuleaza stergerea</a>
                </div>
            </div>
        `;
        confirmationOutput.innerHTML = asking;
        var cancelDeleteButton = document.getElementById('cancelDeleteButton');
        var confirmDeleteButton = document.getElementById('confirmDeleteButton');
        cancelDeleteButton.addEventListener("click", function(event){
            event.preventDefault();
            location.replace("index.html");
        });
        confirmDeleteButton.addEventListener("click", async function(event){
            event.preventDefault();
            await ajax("DELETE", `https://mymag-31b68.firebaseio.com/produse/${url}.json`, url);
            await ajax("DELETE", `https://mymag-31b68.firebaseio.com/cos/${url}.json`, url);
            location.replace("index.html");
        });
    }
