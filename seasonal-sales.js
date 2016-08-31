let products;
let categories;
let productDiv = document.getElementById("products");
let seasonsSelect = document.getElementById("seasons");
var lookupCategories = {};
let selectedCategory = {};

function loadProducts() {
  let data = JSON.parse(this.response);
  products = data.products;
}

function failProducts() {
  console.log("Error on products get!");
}

function loadCatergories() {
  let data = JSON.parse(this.response);
  categories = data.categories;

  for (var i = 0, len = categories.length; i < len; i++) {
      lookupCategories[categories[i].id] = categories[i];
  }
  console.log(lookupCategories);
  selectedCategory = categories[0];
  updatePrices(products);
  injectCategories();
}

function failCategories() {
  console.log("Error on products get!");
}

var getProducts = new XMLHttpRequest();
getProducts.addEventListener("load", loadProducts);
getProducts.addEventListener("error", failProducts);
getProducts.open("GET", "products.json");
getProducts.send();

var getCategories = new XMLHttpRequest();
getCategories.addEventListener("load", loadCatergories);
getCategories.addEventListener("error", failCategories);
getCategories.open("GET", "categories.json");
getCategories.send();

function injectCategories() {
  let catHTML = categories.map((category)=>{
    return `<option value=${category.season_discount}>${category.season_discount}</option>`;
  }).join("");
  seasonsSelect.innerHTML = catHTML;
}

function displayProducts(currentProducts) {
  let outputProducts = currentProducts.map((product)=> {
    let category_id = selectedCategory.id;
    let category = lookupCategories[category_id];
    return `
      <div class="wrapper">
      <div class="product">
      <div class="product-name">${product.name}</div>
      <div class="product-details">
        <div>Originial: <s>${product.price}</s></div>
        <div>Sale Price: <span class="sale-price">${product.discountedPrice}</span></div>
        <div class="product-category"><small>Category: ${lookupCategories[product.category_id].name}<small></div>
      </div>
        <div class="ribbon-wrapper-red"><div class="ribbon-red">${category.discount * 100}% off</div></div>
       </div>​

    </div>`;
  }).join("");
  productDiv.innerHTML = outputProducts;
}

function getSelectedCategory() {
  let selectedValue = seasonsSelect.value;
  for (var i = 0; i < categories.length; i++) {
    if(categories[i].season_discount === selectedValue){
      selectedCategory = categories[i];
      break;
    }
  }
  return selectedCategory;
}

function updatePrices() {
  selectedCategory = getSelectedCategory();
  var mapProducts = JSON.parse(JSON.stringify(products));;
  mapProducts.map((product)=> {
    product.discountedPrice = (product.price - (product.price * selectedCategory.discount)).toFixed(2);
    return product;
  });
  displayProducts(mapProducts);
}

seasonsSelect.addEventListener('change', updatePrices);
