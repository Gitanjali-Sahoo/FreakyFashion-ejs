const loadProductBtn = document.querySelector("button");
const tableBody = document.querySelector("tbody");

// Function to clear existing rows in the table body
function clearTable() {
  tableBody.innerHTML = ""; // This clears all existing rows
}

//Delete a row when delete icon is clicked
function deleteProduct(productId, tableRow) {
  fetch(`/api/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        tableRow.remove();
      } else {
        console.log("Error deleting product");
      }
    })
    .catch((error) => {
      console.log("Error deleting product:", error);
    });
}

// Event listener to load all products from backend when the button is clicked
loadProductBtn.addEventListener("click", () => {
  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      // Clear existing rows before loading new data
      clearTable();

      products.forEach((product) => {
        const row = document.createElement("tr");

        row.innerHTML = `
              <td>${product.productName}</td>
              <td>${product.productSku}</td>
              <td>${product.productPrice}</td>
              <td> <a href="#" class="delete-icon"><i class="bi bi-trash3-fill"></i></a></td>
            `;

        tableBody.appendChild(row);

        const deleteButton = row.querySelector(".delete-icon");
        deleteButton.addEventListener("click", (event) => {
          //to prevent the <a> tag from navigating or reloading the page
          event.preventDefault();
          deleteProduct(product.id, row);
        });
      });
    })
    .catch((error) => {
      console.log("Error fetching products:", error);
    });
});
