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
  //Setting category on first load to default of first category in array
  selectedCategory = categories[0];
  injectCategories();
  updatePrices(products);
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
    let category = getProductCategory(product.category_id);
    return `
      <div class="wrapper">
        <div class="product">
          <div class="product-name">${product.name}</div>
          <div class="product-details">
            <div>Originial: <s>${product.price}</s></div>
            <div>Sale Price: <span class="sale-price">${product.discountedPrice}</span></div>
            <div class="product-category"><small>Category: ${category.name}<small></div>
          </div>
          <div class="ribbon-wrapper-red"><div class="ribbon-red">${selectedCategory.discount * 100}% off</div></div>
       </div>​
    </div>`;
  }).join("");
  productDiv.innerHTML = outputProducts;
}

function getSelectedCategory() {
  return categories.find((category) => {
      return category.season_discount === seasonsSelect.value;
  });
}

function getProductCategory (pCategoryId) {
  return categories.find((category) => {
      return category.id === pCategoryId;
  });
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
