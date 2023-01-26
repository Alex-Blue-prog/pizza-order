const c = el => document.querySelector(el);
const cs = els => document.querySelectorAll(els);

let modalQt = 1;
let cart = [];
// let modalKey = 0;

pizzaJson.forEach((item, index) => {
    
    //create all the pizzas
    let pizzaItem = c(".models .pizza-item").cloneNode(true);

    // pizzaItem.setAttribute("data-key", index); //set key
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
    pizzaItem.id = item.id; //my code
    c(".pizza-area").append(pizzaItem);

    //add event to show modal
    pizzaItem.querySelector("a").addEventListener("click", (e)=> {
        e.preventDefault();
        modalQt = 1;

        // let key = e.currentTarget.closest(".pizza-item").getAttribute('data-key'); //get key
        // modalKey = key;

        //put current clicked pizza info to the modal
        c(".pizzaWindowArea img").src = item.img;
        c(".pizzaInfo h1").innerHTML = item.name;
        c(".pizzaInfo--desc").innerHTML = item.description;
        c(".pizzaInfo--actualPrice").innerHTML = `R$ ${item.price.toFixed(2)}`;
        c(".pizzaWindowArea").setAttribute("data-id", item.id); //my code

        //put pizza sizes
        cs(".pizzaInfo--size").forEach((value, index) => {

            value.querySelector("span").innerHTML = item.sizes[index];
        });

        //remove selected size
        c(".pizzaInfo--size.selected").classList.remove("selected");
        //add selected size to the last item
        cs(".pizzaInfo--size")[cs(".pizzaInfo--size").length - 1].classList.add("selected");

        //pizza quantity
        c(".pizzaInfo--qt").innerHTML = modalQt;
        
        //show modal
        c(".pizzaWindowArea").style.opacity = 0;
        c(".pizzaWindowArea").style.display = "flex";
        setTimeout(()=> { c(".pizzaWindowArea").style.opacity = 1; } , 0000);
    });

  
});

//add one pizza
 c(".pizzaInfo--qtmais").addEventListener("click", ()=> {
    modalQt += 1;
    c(".pizzaInfo--qt").innerHTML = modalQt;
});

//remove one pizza
c(".pizzaInfo--qtmenos").addEventListener("click", ()=> {
    if(modalQt === 1) return;
        modalQt -= 1;
        c(".pizzaInfo--qt").innerHTML = modalQt;
});

//select pizza size
cs(".pizzaInfo--size").forEach(value => {
    value.addEventListener("click", (e) => {
        c(".pizzaInfo--size.selected").classList.remove("selected");
        e.currentTarget.classList.add("selected");
    });
});

//CLOSE MODAL
document.querySelector(".pizzaWindowArea").addEventListener("click", (e) => {
    if(["pizzaWindowArea", "pizzaInfo--cancelButton", "pizzaInfo--cancelMobileButton", "pizzaInfo--addButton"].includes(e.target.className)) {
        
        e.currentTarget.style.opacity = 0;
        setTimeout(()=> {c(".pizzaWindowArea").style.display = "none"; }, 500);
        
        //selecte the big size when the modal get closed
        // cs(".pizzaInfo--size").forEach((value, index, array) => {
        //     if(index == array.length - 1) return value.classList.add("selected");
        //     value.classList.remove("selected");
        // });
    }
});

//cart event 
c(".pizzaInfo--addButton").addEventListener("click", () => {

    let pizzaId = parseInt(c(".pizzaWindowArea").getAttribute("data-id"));
    // let getPizza = pizzaJson.find(value => value.id == pizzaId);
    let pizzaSize = c(".pizzaInfo--size.selected").textContent;

    let pizza = {
        id: pizzaId, 
        size: pizzaSize, 
        qt: modalQt
    };

    //check if the pizza is in the cart
    let getPizza = cart.findIndex(value => {
        if(value.id == pizza.id && value.size == pizza.size){
            return true;
        }
    });

    //if true just add the quantity to the existent pizza in the cart
    if(getPizza > -1) {
        cart[getPizza].qt += pizza.qt;

    } else {
        //push a new pizza
        cart.push(pizza);
    }

    // console.log(cart);
    updateCart();
});

//open mobile menu cart func
c(".menu-openner").addEventListener("click", ()=> {
    c("aside").style.left = "0px";  
});
//close mobile menu cart func
c(".menu-closer").addEventListener("click", () => {
    c("aside").style.left = "100vw";  
})

//open or close menu cart func
function updateCart() {
    c(".menu-openner span").innerHTML = cart.length;

    if(cart.length > 0) {
        c("aside").classList.add("show");

        // another way of calculate subtotal
        // let subTotal = 0;
        // cart.forEach(cartItem => {
        //     pizzaJson.forEach(pizzaItem => {
        //         if(pizzaItem.id == cartItem.id) {
        //             subTotal += pizzaItem.price * cartItem.qt;
        //         }
        //     });
        // });

        let subTotal = 0;
        let desconto = 10;
        let total = 0;

        c(".cart").innerHTML = ""; //always reset cart for avoid duplicated elements.

        //show pizzas in the cart
        cart.forEach((value, index) => {

            let getPizza = pizzaJson.find(pizzaJs => pizzaJs.id == value.id);

            //calculate price (subtotal, descont, total)
            subTotal += getPizza.price * value.qt; 
            desconto = desconto / 100 * subTotal;
            total = subTotal - desconto;

            //create clone based on the pizza id
            let cartItem = c(".cart--item").cloneNode(true);
            cartItem.querySelector("img").src = getPizza.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = `${getPizza.name} <small>(${value.size.charAt(0)})</small>`;
            cartItem.querySelector(".cart--item--qt").textContent = value.qt;

            //add pizza qt in the cart
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", () => {
                value.qt += 1;
                updateCart();
            });

            //remove pizza qt in the cart or remove the pizza element
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", () => {
                if(value.qt == 1) {
                    cart.splice(index, 1);
                    cartItem.remove();
                } else {
                    value.qt -= 1;
                }

                updateCart();
            });
            
            c(".cart").append(cartItem);
        });

        c(".subtotal").lastElementChild.textContent = `R$ ${subTotal.toFixed(2)}`;
        c(".desconto").lastElementChild.textContent = `R$ ${desconto.toFixed(2)}`;
        c(".total").lastElementChild.textContent = `R$ ${total.toFixed(2)}`;

    } else {
        c("aside").classList.remove("show");
        c("aside").style.left = "100vw";  //close menu in the mobile version

        c(".subtotal").lastElementChild.textContent = `R$ 00.00`;
        c(".desconto").lastElementChild.textContent = `R$ 00.00`;
        c(".total").lastElementChild.textContent = `R$ 00.00`;
    }
}
