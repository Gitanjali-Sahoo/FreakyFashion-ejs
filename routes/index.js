var express = require("express");
var router = express.Router();

const Database = require("better-sqlite3");
const db = new Database("./db/product-manager.db", {
  fileMustExist: true,
  verbose: console.log,
});

/* GET home page. */
router.get("/", function (req, res, next) {
  const select = db.prepare(`
    SELECT id,
           productName,
           productBrand,
           productPrice,
           productImage,
           productSku,
           productDescription ,
           urlSlug,
           createdAt FROM products`);
  const rows = select.all();

  // Get current date for comparing product age
  const currentDate = new Date();

  // Loop through each product and asign the isNew tag to product
  rows.forEach((product) => {
    const productCreatedAt = new Date(product.createdAt);
    const timeDifference = currentDate - productCreatedAt;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    // Check if the product is created within the last 7 days
    product.isNew = daysDifference < 7;
  });

  res.render("index", {
    title: "Freaky Fashion",
    products: rows,
    message: "",
    searchedQuery: "",
  });
});

// Filter product using query
router.get("/search", (req, res) => {
  const searchedQuery = req.query.search || "";
  let rows;
  let select;
  if (searchedQuery) {
    select = db.prepare(`
 SELECT id,
           productName,
           productBrand,
           productPrice,
           productImage,
           productSku,
           productDescription ,
           urlSlug,
           createdAt FROM products WHERE productBrand LIKE TRIM(CONCAT(?, '%')) OR productName LIKE TRIM(CONCAT(?, '%'))
`);
    rows = select.all(searchedQuery, searchedQuery);
  } else {
    // select = db.prepare(`
    //   SELECT id,
    //          productName,
    //          productBrand,
    //          productPrice,
    //          productImage,
    //          productSku,
    //          productDescription,
    //          urlSlug,
    //          createdAt FROM products`);
    // rows = select.all();
    res.redirect("/");
  }
  const currentDate = new Date();

  // Loop through each product and asign the isNew tag to product
  rows.forEach((product) => {
    const productCreatedAt = new Date(product.createdAt);
    const timeDifference = currentDate - productCreatedAt;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    // Check if the product is created within the last 7 days
    product.isNew = daysDifference < 7;
  });

  // If no products are found, set the message
  const message = rows.length === 0 ? "No products found for your search." : "";
  console.log(message);
  console.log("Searched query:", searchedQuery); // Debugging line
  res.render("index", {
    products: rows,
    message: message,
    searchedQuery: searchedQuery,
  });
});

// Get Checkout page
router.get("/checkout", (req, res) => {
  res.render("checkout", {
    title: "Checkout",
  });
});

//product-details routing using urlSlug
router.get("/products/:urlSlug", (req, res) => {
  const urlSlug = req.params.urlSlug;
  console.log(urlSlug);
  const select = db.prepare(`
 SELECT id,
           productName,
           productBrand,
           productPrice,
           productImage,
           productSku,
           productDescription ,
           urlSlug,
           createdAt FROM products WHERE urlSlug = ?
    `);
  const rows = select.get(urlSlug);
  const selectAll = db.prepare(`
    SELECT id,
           productName,
           productBrand,
           productPrice,
           productImage,
           productSku,
           productDescription ,
           urlSlug,
           createdAt FROM products`);
  const allRows = selectAll.all();
  res.render("product-details", {
    productDetails: rows,
    products: allRows,
  });
});

//Admin page
router.get("/admin/products", (req, res) => {
  res.render("admin/products/index", {
    title: "Adminstations",
  });
});

// New product
router.get("/admin/products/new", function (request, response) {
  response.render("admin/products/new", { title: "Administration" });
});

// Load all products in admin page products table using api
router.get("/api/products", (req, res) => {
  const select = db.prepare(`
    SELECT id,
           productName,
           productBrand,
           productPrice,
           productImage,
           productSku,
           productDescription ,
           urlSlug,
           createdAt FROM products`);

  const rows = select.all();
  console.log(`Your response is here ${rows}`);
  res.json(rows);
});
module.exports = router;
