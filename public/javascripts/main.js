const loadProductBtn = document.querySelector("button");
const tableBody = document.querySelector("tbody");

// Function to clear existing rows in the table body
function clearTable() {
  tableBody.innerHTML = ""; // This clears all existing rows
}

// Event listener to load products when the button is clicked
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
      });
    })
    .catch((error) => {
      console.log("Error fetching products:", error);
    });
});
