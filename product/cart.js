var tableBody_products = document.getElementById('tableBody_products');
var total_produse_cos  = document.getElementById('total_produse_cos');


async function preluareProduseCos(){
    var produseCos = JSON.parse(await ajax("GET", `https://mymag-31b68.firebaseio.com/cos.json`, true));
    var numar_produse_cos   = Object.keys(produseCos).length;
    var randProduseCos = "";
    var suma_totala_produse_cos = 0;
    for(var produs in produseCos){
        randProduseCos += `
            <tr>
                <td class="td-img">
                    <img src="../styles/img/${produseCos[produs].imagine_produs}.jpg" alt="">
                </td>
                <td class="td-name">${produseCos[produs].nume_produs}</td>
                <td class="td-price">${produseCos[produs].pret_produs}</td>
                <td class="td-qty">${produseCos[produs].cantitate_produs}</td>
                <td class="td-del"><a href="stergedincos.html?id=${produseCos[produs].id_produs}">Sterge din cos</a></td>
            </tr>
        `;
        tableBody_products.innerHTML = randProduseCos;
        suma_totala_produse_cos += produseCos[produs].pret_produs;
    }
    if(produseCos){
        total_produse_cos.innerHTML += `Total produse in cos : <strong>${numar_produse_cos}</strong> in valoare totala de <strong>${suma_totala_produse_cos.toFixed(2)}</strong> lei`;
    }
}
