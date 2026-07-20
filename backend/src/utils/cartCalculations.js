export const calculateCartTotals = (
  cart,
  coupon = null,
  offer = null
) => {
  let subtotal = 0;
  let discount = 0;

  // Product totals
  for (const item of cart.products) {
    item.subtotal = item.price * item.quantity;
    subtotal += item.subtotal;

    if (item.originalPrice > item.price) {
      discount +=
        (item.originalPrice - item.price) *
        item.quantity;
    }
  }

  // Offer
  let offerDiscount = 0;

  if (
    offer &&
    offer.status === "Active" &&
    new Date(offer.expiryDate) > new Date()
  ) {
    if (offer.offerType === "Percentage") {
      offerDiscount = (subtotal * offer.value) / 100;
    }

    if (offer.offerType === "Flat") {
      offerDiscount = offer.value;
    }

    offerDiscount = Math.min(
      offerDiscount,
      subtotal
    );
  }

  const afterOffer = subtotal - offerDiscount;

  // Coupon
  let couponDiscount = 0;

  if (
    coupon &&
    coupon.status === "Active" &&
    new Date(coupon.expirydate) > new Date() &&
    afterOffer >= (coupon.minimumOrderAmount || 0)
  ) {
    if (coupon.maximumDiscount) {
      couponDiscount =
        (afterOffer * coupon.discount) / 100;

      couponDiscount = Math.min(
        couponDiscount,
        coupon.maximumDiscount
      );
    } else {
      couponDiscount = coupon.discount;
    }

    couponDiscount = Math.min(
      couponDiscount,
      afterOffer
    );
  }

  // Shipping
  let shipping = afterOffer > 500 ? 0 : 50;

  if (offer?.offerType === "FreeShipping") {
    shipping = 0;
  }

  // Tax
  const tax =
    (afterOffer - couponDiscount) * 0.18;

  const finalTotal =
    afterOffer -
    couponDiscount +
    shipping +
    tax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    offerDiscount: Number(
      offerDiscount.toFixed(2)
    ),
    couponDiscount: Number(
      couponDiscount.toFixed(2)
    ),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2)),
  };
};