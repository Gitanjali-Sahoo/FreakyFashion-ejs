// sending data to backend by using fetch api
const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(event.target);
  const data = {
    name: formData.get("name"),
    brand: formData.get("brand"),
    description: formData.get("description"),
    image: formData.get("image"),
    sku: formData.get("sku"),
    price: formData.get("price"),
  };

  console.log(data);
  // Use Fetch API to send data to the backend
  fetch("/api/products/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      form.reset();
      location.href = "/admin/products";
    })
    .catch((error) => {
      console.error("Error adding product:", error);
      alert("An unexpected error occurred while adding the product.");
    });
});
