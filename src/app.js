import { Store } from './Store.js';

const store = new Store([
  { name: 'Мышь беспроводная', price: 4500, qty: 2 },
  { name: 'Механическая клавиатура', price: 18000, qty: 1 }
]);

const form = document.getElementById('add-product-form');
const nameInput = document.getElementById('product-name');
const priceInput = document.getElementById('product-price');
const qtyInput = document.getElementById('product-qty');

const nameError = document.getElementById('name-error');
const priceError = document.getElementById('price-error');
const qtyError = document.getElementById('qty-error');

const productsList = document.getElementById('products-list');
const totalAmount = document.getElementById('total-amount');

function render() {
  productsList.innerHTML = '';
  const items = store.getItems();

  if (items.length === 0) {
    productsList.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #777;">Список товаров пуст</td></tr>`;
  } else {
    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.dataset.id = item.id;

      tr.innerHTML = `
        <td>${escapeHtml(item.name)}</td>
        <td>${item.price.toFixed(2)} ₸</td>
        <td>
          <input type="number" class="qty-input" data-action="update-qty" value="${item.qty}" min="1">
        </td>
        <td>${(item.price * item.qty).toFixed(2)} ₸</td>
        <td>
          <button class="delete-btn" data-action="delete">Удалить</button>
        </td>
      `;

      productsList.appendChild(tr);
    });
  }

  totalAmount.textContent = `${store.total().toFixed(2)} ₸`;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, match => {
    const escape = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return escape[match];
  });
}

function clearErrors() {
  nameError.textContent = '';
  priceError.textContent = '';
  qtyError.textContent = '';

  nameInput.classList.remove('invalid');
  priceInput.classList.remove('invalid');
  qtyInput.classList.remove('invalid');
}

function validateForm(name, price, qty) {
  let isValid = true;
  clearErrors();

  if (!name || name.trim() === '') {
    nameError.textContent = 'Название товара не может быть пустым';
    nameInput.classList.add('invalid');
    isValid = false;
  }

  if (isNaN(price) || price <= 0) {
    priceError.textContent = 'Цена должна быть числом больше 0';
    priceInput.classList.add('invalid');
    isValid = false;
  }

  if (isNaN(qty) || !Number.isInteger(qty) || qty <= 0) {
    qtyError.textContent = 'Количество должно быть целым положительным числом';
    qtyInput.classList.add('invalid');
    isValid = false;
  }

  return isValid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = nameInput.value;
  const price = parseFloat(priceInput.value);
  const qty = parseInt(qtyInput.value, 10);

  if (validateForm(name, price, qty)) {
    store.add({ name, price, qty });
    form.reset();
    clearErrors();
    render();
  }
});

productsList.addEventListener('click', (event) => {
  const target = event.target;
  if (target.dataset.action === 'delete') {
    const tr = target.closest('tr');
    if (tr) {
      store.remove(tr.dataset.id);
      render();
    }
  }
});

productsList.addEventListener('change', (event) => {
  const target = event.target;
  if (target.dataset.action === 'update-qty') {
    const tr = target.closest('tr');
    if (tr) {
      const newQty = parseInt(target.value, 10);
      if (!isNaN(newQty) && newQty > 0) {
        store.updateQty(tr.dataset.id, newQty);
      }
      render();
    }
  }
});

render();