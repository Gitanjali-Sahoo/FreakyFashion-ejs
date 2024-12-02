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

    //Check if product publish date is in future then it will not show in the home page
    product.hide = productCreatedAt > currentDate;
    // Check if the product is created within the last 7 days
    product.isNew = daysDifference < 7;
    // Filter out the products that are marked to be hidden
  });
  const visibleProducts = rows.filter((product) => !product.hide);
  res.render("index", {
    title: "Freaky Fashion",
    products: visibleProducts,
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
  res.json(rows);
});

//Delete a product from database by using product id. when FE will send http request to backend.
router.delete("/api/products/:id", (req, res) => {
  productId = req.params.id;
  const select = db.prepare(`
   DELETE FROM products WHERE id = ?`);
  const row = select.run(productId);
  console.log("delete this rows" + row);
  // If no rows were affected, the ID did not exist
  if (row.changes === 0) {
    res.status(404).json({ error: "Product not found" });
  } else {
    res.status(200).json({ message: "Product deleted successfully" });
  }
});

// Post method for inserting data into database
router.post("/api/products/new", (req, res) => {
  const newProduct = {
    productName: req.body.name,
    productBrand: req.body.brand,
    productDescription: req.body.description,
    productImage: req.body.image,
    productSku: req.body.sku,
    productPrice: req.body.price,
    urlSlug: generateSlug(req.body.name),
    date: req.body.date,
  };
  const insert = db.prepare(`
    INSERT INTO products(
           productName,
           productBrand,
           productPrice,
           productImage,
           productSku,
           productDescription ,
           urlSlug,
           createdAt
    ) VALUES (
     @productName,
      @productBrand,
      @productPrice,
      @productImage,
      @productSku,
      @productDescription,
      @urlSlug,
      @date)`);

  // insert.run(newProduct);
  // res.status(201).send({ message: "Product has inserted into the database" });
  try {
    insert.run(newProduct);
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ error: "Failed to add product." });
  }
});

// Generate slug
function generateSlug(input) {
  return input
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing whitespace
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-"); // Remove consecutive dashes
}
module.exports = router;
