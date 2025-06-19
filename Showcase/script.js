const products = [
    {
        "id": 1,
        "name": "Lenovo Yoga",
        "price": 3000
    },
    {
        "id": 2,
        "name": "Acer Aspire",
        "price": 1800
    },
    {
        "id": 3,
        "name": "Dell Vostro",
        "price": 3400
    },
    {
        "id": 4,
        "name": "HP Pavilion",
        "price": 2900
    },
    {
        "id": 5,
        "name": "Asus Zenbook",
        "price": 3100
    },
    {
        "id": 6,
        "name": "MSI Modern",
        "price": 3500
    },
    {
        "id": 7,
        "name": "Apple MacBook",
        "price": 4200
    },
    {
        "id": 8,
        "name": "Huawei MateBook",
        "price": 2700
    },
    {
        "id": 9,
        "name": "Samsung Galaxy Book",
        "price": 2600
    },
    {
        "id": 10,
        "name": "Razer Blade",
        "price": 4700
    },
    {
        "id": 11,
        "name": "Microsoft Surface",
        "price": 3900
    },
    {
        "id": 12,
        "name": "LG Gram",
        "price": 3300
    }
];

let order = [];

function addToBasket(productId) {
    const id = Number(productId);

    const alreadyInOrder = order.some(item => item.id === id);
    if (alreadyInOrder) {
        alert("Товар уже в корзине");
        return;
    }

    const product = products.find(item => item.id === id);
    if (product) {
        order.push(product);
    } else {
        console.error("Товар не найден:", id);
    }

    renderCart();
    rerenderTotalPrice();
}

function removeFromBasket(productId) {
    order = order.filter(item => item.id !== productId);
    renderCart();
    rerenderTotalPrice();
}

function rerenderTotalPrice() {
    const totalPrice = order.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total').innerText = totalPrice;
}

function renderCart() {
    const cart = document.getElementById('basket-items');
    cart.innerHTML = '';

    order.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} — ${item.price}`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '🗑';
        removeBtn.style.marginLeft = '1rem';
        removeBtn.onclick = (event) => {
            event.stopPropagation();
            removeFromBasket(item.id);
        };

        li.appendChild(removeBtn);
        cart.appendChild(li);
    });
}