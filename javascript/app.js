var URLAdress = window.location.href;
var productList = document.getElementById('product-list');

/* --- General Products Loading AREA FUNCTIONALITY -- */
function loadProducts(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var allProducts = JSON.parse(this.responseText);
            var parseProducts = "";
            for (product in allProducts){
                
                parseProducts += 
                    `
                    <div class="col-sm-12 col-md-3 product">
                        <div class="product-top">
                            <img class="img-thumbnail product product-image" src="${allProducts[product].imagine_produs}" alt="">
                        </div>
                        <div class="product-title">
                            ${allProducts[product].nume}
                        </div>
                        <div class="product-bottom">
                            <div class="product-price"> ${allProducts[product].pret}<span>lei</span></div>
                            <div class="product-details">
                                <a href="product-details.html" class="btn btn-details">Detalii</a>
                            </div>
                        </div>
                    </div>
                    `
                    ;
                    
            }
            productList.innerHTML = parseProducts;
            
        }
    };
    xhttp.open("GET", `https://mymag-31b68.firebaseio.com/produse.json`, true);
    xhttp.send();
}


var addToBasket = document.getElementById('addToBasket');


/* --- ADMIN AREA FUNCTIONALITY -- */
//Creare functie care ascunde produsele la add.click
    //1.1 - Definire variabile care targeteaza div-urile de la header
    var addProduct = document.getElementById('adminAddBtn');
    var productHeaderInfo = document.querySelector('.products-header-info');
    var productsHeaderBtn = document.querySelector('.products-header-btn');
    var newProductsBtns = document.getElementById('products-header-btn-new');
    var cancelProduc = document.getElementById('cancelProduct');
    var adminAddProduct = document.getElementById('admin-add-product');
    var adminProducts = document.getElementById('admin-products');  
    

    if(URLAdress.includes('admin')){
         //1.2 - Click ce va ascunde buttonul Adaugare Produs
         if(adminAddProduct.style.display = 'block'){
            adminAddProduct.style.display = 'none';
        }
        addProduct.addEventListener("click", function(){

            this.style.display = 'none';
            adminProducts.style.display = 'none';
            adminAddProduct.style.display = 'block';
            productHeaderInfo.innerHTML = 'Adaugare produs';
            newProductsBtns.style.display = 'block';
            
        });
        //1.3 - Click ce face reversul click-ului 1.2
        cancelProduct.addEventListener('click', function(){

            adminProducts.style.display = 'block';
            addProduct.style.display = 'block';
            adminAddProduct.style.display = 'none';
            newProductsBtns.style.display = 'none';
            productHeaderInfo.innerHTML = 'Gestionare produse';
        });
    }



