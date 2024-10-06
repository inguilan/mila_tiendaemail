document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let cart = [];

    // Función para añadir productos al carrito
    const addToCart = (productName, productPrice) => {
        const productIndex = cart.findIndex(product => product.name === productName);
        
        if (productIndex !== -1) {
            cart[productIndex].quantity += 1;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }
        
        renderCart();
    };

    // Renderizar el carrito
    const renderCart = () => {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
        } else {
            cart.forEach(product => {
                const item = document.createElement('p');
                item.textContent = `${product.name} - $${product.price} x ${product.quantity}`;
                cartItemsContainer.appendChild(item);
            });
        }

        const totalPrice = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
        totalPriceElement.textContent = totalPrice.toFixed(2);
    };

    // Añadir funcionalidad a los botones de "Añadir al Carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            addToCart(productName, productPrice);
        });
    });

    // Enviar el pedido por email usando EmailJS
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Verificar que el carrito no esté vacío antes de enviar
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Por favor, añade productos antes de enviar el pedido.');
            return; // Salir de la función si el carrito está vacío
        }

        // Recoger los detalles del pedido
        let orderDetails = '';
        cart.forEach(product => {
            orderDetails += `${product.name} - $${product.price} x ${product.quantity}\n`;
        });

        // Pasar los detalles al campo oculto en el formulario
        document.getElementById('order-details').value = orderDetails;

        // Configurar EmailJS para enviar el formulario
        emailjs.sendForm('service_3hnfhcd', 'template_ow83ypj', '#order-form')
            .then((response) => {
                alert('Pedido enviado con éxito!');
                console.log('SUCCESS!', response.status, response.text);
                // Vaciar el carrito después de enviar
                cart = [];
                renderCart();
            }, (error) => {
                alert('Error al enviar el pedido: ' + error.text);
                console.log('FAILED...', error);
            });
    });
});
