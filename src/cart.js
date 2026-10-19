const PROMO_CODE = 'SAVE10';
const DISCOUNT_RATE = 0.1;
const DISCOUNT_MIN_SUBTOTAL = 20000;
const FREE_DELIVERY_FROM = 50000;
const DELIVERY_PRICE = 30000;

function assertValidQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError('Количество должно быть положительным целым числом.');
  }
}

function addToCart(cart, product, quantity) {
  assertValidQuantity(quantity);

  const existing = cart.find((item) => item.id === product.id);
  const newQuantity = (existing ? existing.quantity : 0) + quantity;

  if (newQuantity > product.stock) {
    throw new RangeError('Нельзя добавить больше товара, чем есть на складе.');
  }

  if (!existing) {
    return [...cart, { ...product, quantity }];
  }

  return cart.map((item) =>
    item.id === product.id ? { ...item, quantity: newQuantity } : item
  );
}

function changeQuantity(cart, productId, quantity) {
  assertValidQuantity(quantity);

  const existing = cart.find((item) => item.id === productId);
  if (!existing) return [...cart];

  if (quantity > existing.stock) {
    throw new RangeError('Количество не может превышать остаток на складе.');
  }

  return cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);

  const discount =
    promoCode === PROMO_CODE && subtotal >= DISCOUNT_MIN_SUBTOTAL
      ? Math.round(subtotal * DISCOUNT_RATE)
      : 0;

  const delivery = subtotal < FREE_DELIVERY_FROM ? DELIVERY_PRICE : 0;

  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;