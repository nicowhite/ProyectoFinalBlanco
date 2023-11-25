document.addEventListener("DOMContentLoaded", async () => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  try {
    const boosters = await obtenerBoosters(); 

    configurarEventListeners(boosters);
    actualizarCarrito();
  } catch (error) {
    console.error("Error:", error);
  }

  function obtenerBoosters() {
    return fetch("boosters.json").then((response) => response.json());
  }

  function agregarAlCarrito(producto) {
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      producto.cantidad = 1;
      carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
  }

  function actualizarCarrito() {
    const itemsCarrito = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("total");

    itemsCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<img src="${
        item.imagen
      }" style="width: 50px; height: 40px;" alt="">
                      ${item.nombre} - $ ${(
        item.precio * item.cantidad
      ).toFixed(2)} Cantidad: ${item.cantidad}
                      <button class="btn btn-success mas">+</button>
                      <button class="btn btn-danger menos">-</button>`;
      itemsCarrito.appendChild(li);

      total += item.precio * item.cantidad;

      const mas = li.querySelector(".mas");
      mas.addEventListener("click", () => {
        item.cantidad += 1;
        actualizarCarrito();
      });

      const menos = li.querySelector(".menos");
      menos.addEventListener("click", () => {
        if (item.cantidad > 1) {
          item.cantidad -= 1;
        } else {
          carrito = carrito.filter((cartItem) => cartItem.id !== item.id);
        }
        actualizarCarrito();
      });
    });

    totalDisplay.textContent = total.toFixed(2);
  }

  function configurarEventListeners(boosters) {
    const agregarBotones = document.querySelectorAll(".agregar");
    agregarBotones.forEach((button, index) => {
      button.addEventListener("click", () => agregarAlCarrito(boosters[index]));
    });

    const vaciarCarritoButton = document.getElementById("clear-cart-button");
    vaciarCarritoButton.addEventListener("click", vaciarCarrito);
  }

  function vaciarCarrito() {
    carrito.length = 0;
    actualizarCarrito();

    Swal.fire({
      title: "Carrito Eliminado!",
      icon: "success",
      background: "black",
    });

    localStorage.removeItem("carrito");
  }
});


