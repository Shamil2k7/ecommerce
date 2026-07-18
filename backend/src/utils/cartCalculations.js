export const calculateCartTotals = (cart, coupon = null, offer = null) => {
  let subtotal = 0;
  let discount = 0;

  // Calculate subtotal and product discount
  for (const item of cart.products) {
    item.subtotal = item.price * item.quantity;
    subtotal += item.subtotal;

    if (item.originalPrice > item.price) {
      discount +=
        (item.originalPrice - item.price) * item.quantity;
    }
  }

  // Apply offer
  let offerDiscount = 0;

  if (
    offer &&
    offer.status === "Active" &&
    new Date(offer.expiryDate) > new Date()
  ) {
    switch (offer.offerType) {
      case "Percentage":
        offerDiscount = (subtotal * offer.value) / 100;
        break;

      case "Flat":
        offerDiscount = offer.value;
        break;

      case "FreeShipping":
        offerDiscount = 0;
        break;

      default:
        offerDiscount = 0;
    }

    offerDiscount = Math.min(offerDiscount, subtotal);
  }

  const amountAfterOffer = subtotal - offerDiscount;

  // Apply coupon
  let couponDiscount = 0;

  if (
    coupon &&
    coupon.status === "Active" &&
    new Date(coupon.expirydate) > new Date() &&
    amountAfterOffer >= (coupon.minimumOrderAmount || 0)
  ) {
    if (coupon.maximumDiscount) {
      couponDiscount =
        (amountAfterOffer * coupon.discount) / 100;

      couponDiscount = Math.min(
        couponDiscount,
        coupon.maximumDiscount
      );
    } else {
      couponDiscount = coupon.discount;
    }

    couponDiscount = Math.min(
      couponDiscount,
      amountAfterOffer
    );
  }

  const amountAfterDiscount = amountAfterOffer - couponDiscount;

  // Shipping
  let shipping = amountAfterDiscount > 0 && amountAfterDiscount < 500 ? 50 : 0;

  if (offer?.offerType === "FreeShipping") {
    shipping = 0;
  }

  // Tax
  const tax = amountAfterDiscount * 0.18;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    offerDiscount: Number(offerDiscount.toFixed(2)),
    couponDiscount: Number(couponDiscount.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    finalTotal: Number(
      (amountAfterDiscount + shipping + tax).toFixed(2)
    ),
  };
};