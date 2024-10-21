const cart = [];
function addToCart(name, price, quantityId, button) {
    const quantity = parseInt(document.getElementById(quantityId).value);
    const productElement = button.parentElement;
    const additionalElements = productElement.querySelectorAll('.additional:checked');
    const additionalItems = Array.from(additionalElements).map(item => ({
        name: item.dataset.name,
        price: parseFloat(item.value)
    }));
    const cartItem = {
        name,
        price,
        quantity,
        additionals: additionalItems
    };
    cart.push(cartItem);
    renderCart();
    // Mostrar mensagem de sucesso
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = `${name} foi adicionado ao carrinho!`;
    document.body.appendChild(messageDiv);

    // Esconder a mensagem após 3 segundos
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 3000);
}

function renderCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsElement.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const additionalText = item.additionals.map(add => `${add.name} (+R$${add.price.toFixed(2)})`).join(', ');
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - R$${item.price.toFixed(2)} x ${item.quantity} ${additionalText ? `(${additionalText})` : ''}`;
        cartItemsElement.appendChild(listItem);
        total += item.price * item.quantity;
        item.additionals.forEach(add => {
            total += add.price * item.quantity;
        });
    });

    totalPriceElement.textContent = `Total: R$${total.toFixed(2)}`;
}

document.querySelectorAll('input[name="delivery"]').forEach(input => {
    input.addEventListener('change', () => {
        const deliveryInfo = document.getElementById('delivery-info');
        if (input.value === 'entrega') {
            deliveryInfo.style.display = 'block';
        } else {
            deliveryInfo.style.display = 'none';
        }
    });
});

function sendCartToWhatsApp() {
    let message = 'Carrinho de Compras:\n\n';
    let total = 0;

    cart.forEach(item => {
        const additionalText = item.additionals.map(add => `${add.name} (+R$${add.price.toFixed(2)})`).join(', ');
        message += `Produto: ${item.name}\nPreço: R$${item.price.toFixed(2)} x ${item.quantity} ${additionalText ? `(${additionalText})` : ''}\n\n`;
        total += item.price * item.quantity;
        item.additionals.forEach(add => {
            total += add.price * item.quantity;
        });
    });

    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    if (deliveryOption === 'entrega') {
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const pagamento = document.getElementById('pagamento').value;
        if (!name || !address || !pagamento) {
            alert('Por favor, preencha todos os campos de entrega.');
            return;
        }
        message += `Total da compra: R$${(total + 10).toFixed(2)}\n\n`;
        message += `Tipo de Entrega: ${deliveryOption}\nNome: ${name}\nEndereço: ${address}\n Forma de Pagamento: ${pagamento}`;
        total += 10; // Taxa de entrega
    } else {
        message += `Total da compra: R$${total.toFixed(2)}\n\n`;
        message += `Tipo de Entrega: ${deliveryOption}`;
    }

    const phoneNumber = '5564992952748';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
function searchProducts() {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const name = product.getAttribute('data-name').toLowerCase();
        const title = product.querySelector('h2').textContent.toLowerCase();
        if (name.includes(input) || title.includes(input)) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
}
