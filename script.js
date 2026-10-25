const cart = {};
const dialog = document.getElementById("cartDialog");
const money = n => `${n} MAD`;
document.getElementById("openCart").addEventListener("click", () => dialog.showModal());
document.getElementById("closeCart").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
document.querySelectorAll(".products .card").forEach((card, id) => {
  const name = card.querySelector("h3").textContent.trim();
  const price = Number(card.querySelector("span").textContent.match(/[0-9]+/)[0]);
  const img = card.querySelector("img").getAttribute("src");
  card.querySelector(".add-cart").addEventListener("click", () => {
    if (!cart[id]) cart[id] = {name, price, img, qty: 0};
    cart[id].qty++;
    renderCart();
    if (!dialog.open) dialog.showModal();
  });
});
function renderCart() {
  const items = document.getElementById("cartItems");
  const entries = Object.entries(cart);
  items.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.textContent = "Votre panier est vide.";
    items.append(empty);
  }
  entries.forEach(([id, item]) => {
    const line = document.createElement("div"); line.className = "cart-line";
    const img = document.createElement("img"); img.src = item.img; img.alt = item.name;
    const info = document.createElement("div"); info.className = "cart-line-info";
    const title = document.createElement("strong"); title.textContent = item.name;
    const subtotal = document.createElement("small"); subtotal.textContent = money(item.price * item.qty);
    info.append(title, subtotal);
    const qty = document.createElement("div"); qty.className = "cart-qty";
    const minus = document.createElement("button"); minus.textContent = "−"; minus.setAttribute("aria-label", "Diminuer " + item.name);
    const amount = document.createElement("span"); amount.textContent = item.qty;
    const plus = document.createElement("button"); plus.textContent = "+"; plus.setAttribute("aria-label", "Augmenter " + item.name);
    minus.addEventListener("click", () => { item.qty--; if (!item.qty) delete cart[id]; renderCart(); });
    plus.addEventListener("click", () => { item.qty++; renderCart(); });
    qty.append(minus, amount, plus); line.append(img, info, qty); items.append(line);
  });
  document.getElementById("cartCount").textContent = entries.reduce((n,[,i]) => n+i.qty, 0);
  document.getElementById("cartTotal").textContent = money(entries.reduce((n,[,i]) => n+i.price*i.qty, 0));
}
document.getElementById("clearCart").addEventListener("click", () => {
  Object.keys(cart).forEach(id => delete cart[id]); renderCart();
});
renderCart();
