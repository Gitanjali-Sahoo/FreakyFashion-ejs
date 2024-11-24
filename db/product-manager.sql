CREATE TABLE  products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productName TEXT,
    productBrand TEXT,
    productPrice TEXT,
    productImage TEXT,
    productSku TEXT,
    productDescription TEXT,
    urlSlug TEXT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (
    productName,
    productBrand,
    productPrice,
    productImage,
    productSku,
    productDescription ,
    urlSlug
) VALUES (
    'Black Tshirt',
       'H&M',
       '299',
       'https://cdn.pixabay.com/photo/2023/05/08/21/59/woman-7979850_1280.jpg',
       'ABC123',
       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consectetur ipsum suscipit, vestibulum arcu sed, condimentum eros. Sed a enim at tortor congue dapibus at sed eros. Integer accumsan malesuada velit, non tempus eros facilisis sit amet.',
       'black-tshirt'
);
