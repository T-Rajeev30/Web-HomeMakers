import { get, post, patch, del } from "./client";
import { EP } from "./endpoints";

export const catalog = {
  cooks: (p) => get(EP.cooks, p), // raw {items,total,page,limit}
  menu: (id) => get(EP.cookMenu(id)), // raw {cook, menu:{...}}
  cuisines: () => get(EP.cuisines), // raw string[]
  home: (p) => get(EP.home, p), // wrapped
  search: (p) => get(EP.search, p), // wrapped
};

export const cart = {
  get: () => get(EP.cart),
  add: (cookId, dishId, qty = 1, replace = false) =>
    post(EP.cartItems, { cookId, dishId, qty, replace }),
  setQty: (dishId, qty) => patch(EP.cartItem(dishId), { qty }),
  remove: (dishId) => del(EP.cartItem(dishId)),
  clear: () => del(EP.cart),
};

export const addresses = {
  list: () => get(EP.addresses),
  create: (body) => post(EP.addresses, body), // no lat/lng — placeId or text only
  update: (id, body) => patch(EP.address(id), body),
  remove: (id) => del(EP.address(id)),
  makeDefault: (id) => patch(EP.addressDefault(id)),
};

export const checkout = {
  preview: (addressId, couponCode) =>
    post(EP.checkout, { addressId, ...(couponCode && { couponCode }) }),
};

export const payment = {
  createOrder: (body) => post(EP.payCreate, body), // {addressId, couponCode?, customerName?, notes?, orderType?, scheduledFor?}
  verify: (body) => post(EP.payVerify, body),
};

export const orders = {
  mine: () => get(EP.ordersMine), // raw
  one: (id) => get(EP.order(id)), // raw
  cancel: (id) => post(EP.orderCancel(id)), // only while status==='pending'
  placeNoPayment: (body) => post(EP.cartCheckout, body),
};

export const tracking = { get: (id) => get(EP.delivery(id)) };

export const wishlist = {
  list: () => get(EP.wishlist),
  add: (dishId) => post(EP.wishlist, { dishId }),
  remove: (dishId) => del(EP.wishlistItem(dishId)),
};

export const coupons = {
  list: () => get(EP.coupons),
  validate: (body) => post(EP.couponVal, body),
};

export const reviews = {
  forCook: (cookId, p) => get(EP.reviewsFor(cookId), p),
  submit: (orderId, body) => post(EP.reviewOrder(orderId), body),
};

export const misc = {
  prefs: () => get(EP.prefs),
  savePrefs: (body) => patch(EP.prefs, body),
  faqs: (category) => get(EP.faqs, { category }),
  refCode: () => get(EP.refCode),
  health: () => get(EP.health),
};
