import { cartRepository } from './cart.repository';
import type { AddToCartInput, UpdateCartItemInput } from './cart.schema';

export const cartService = {

  getCart: async (userId?: string, sessionToken?: string) => {
    let cart = await cartRepository.findActiveCart(userId, sessionToken);
    if (!cart) cart = await cartRepository.createCart(userId, sessionToken);

    const items = cart.cart_item.map(item => ({
      cartItemId: item.cart_item_id,
      variantId:  item.variant_id,
      quantity:   item.quantity,
      unitPrice:  item.unit_price,
      lineTotal:  Number(item.unit_price) * item.quantity,
      product: {
        name:  item.product_variant.product.name,
        slug:  item.product_variant.product.slug,
        image: item.product_variant.product.product_image[0]?.url ?? null,
      },
      availableStock: item.product_variant.stock_qty - item.product_variant.stock_reserved,
    }));

    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

    return { cartId: cart.cart_id, items, subtotal };
  },

  addItem: async (input: AddToCartInput, userId?: string, sessionToken?: string) => {
    const cart = await cartRepository.findActiveCart(userId, sessionToken)
      ?? await cartRepository.createCart(userId, sessionToken);

    const variant = await cartRepository.findVariant(input.variantId);
    if (!variant) {
      const err: any = new Error('Variante no encontrada');
      err.statusCode = 404;
      err.code = 'VARIANT_NOT_FOUND';
      throw err;
    }

    const available = variant.stock_qty - variant.stock_reserved;
    if (available < input.quantity) {
      const err: any = new Error('Stock insuficiente');
      err.statusCode = 409;
      err.code = 'STOCK_INSUFFICIENT';
      throw err;
    }

    const unitPrice = Number(variant.product.base_price) + Number(variant.price_modifier);
    await cartRepository.addItem(cart.cart_id, input.variantId, input.quantity, unitPrice);

    return cartService.getCart(userId, sessionToken);
  },

  updateItem: async (cartItemId: string, input: UpdateCartItemInput, userId?: string, sessionToken?: string) => {
    const cart = await cartRepository.findActiveCart(userId, sessionToken);
    if (!cart) {
      const err: any = new Error('Carrito no encontrado');
      err.statusCode = 404;
      err.code = 'CART_NOT_FOUND';
      throw err;
    }

    const item = await cartRepository.findCartItemById(cartItemId);
    if (!item || item.cart_id !== cart.cart_id) {
      const err: any = new Error('Item no encontrado');
      err.statusCode = 404;
      err.code = 'CART_ITEM_NOT_FOUND';
      throw err;
    }

    const variant = await cartRepository.findVariant(item.variant_id);
    if (!variant) {
      const err: any = new Error('Variante no encontrada');
      err.statusCode = 404;
      err.code = 'VARIANT_NOT_FOUND';
      throw err;
    }

    const available = variant.stock_qty - variant.stock_reserved;
    if (available < input.quantity) {
      const err: any = new Error('Stock insuficiente');
      err.statusCode = 409;
      err.code = 'STOCK_INSUFFICIENT';
      throw err;
    }

    await cartRepository.updateItem(cartItemId, input.quantity);
    return cartService.getCart(userId, sessionToken);
  },

  deleteItem: async (cartItemId: string, userId?: string, sessionToken?: string) => {
    const cart = await cartRepository.findActiveCart(userId, sessionToken);
    if (!cart) {
      const err: any = new Error('Carrito no encontrado');
      err.statusCode = 404;
      err.code = 'CART_NOT_FOUND';
      throw err;
    }

    const item = await cartRepository.findCartItemById(cartItemId);
    if (!item || item.cart_id !== cart.cart_id) {
      const err: any = new Error('Item no encontrado');
      err.statusCode = 404;
      err.code = 'CART_ITEM_NOT_FOUND';
      throw err;
    }

    await cartRepository.deleteItem(cartItemId);
    return cartService.getCart(userId, sessionToken);
  },

  applyCoupon: async (code: string) => {
    const coupon = await cartRepository.findCoupon(code);
    if (!coupon) {
      const err: any = new Error('Cupón inválido o expirado');
      err.statusCode = 404;
      err.code = 'COUPON_NOT_FOUND';
      throw err;
    }

    if (coupon.expires_at && coupon.expires_at < new Date()) {
      const err: any = new Error('Cupón expirado');
      err.statusCode = 409;
      err.code = 'COUPON_EXPIRED';
      throw err;
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      const err: any = new Error('Cupón agotado');
      err.statusCode = 409;
      err.code = 'COUPON_EXHAUSTED';
      throw err;
    }

    return {
      couponId:      coupon.coupon_id,
      code:          coupon.code,
      discountType:  coupon.discount_type,
      discountValue: coupon.discount_value,
    };
  },
};