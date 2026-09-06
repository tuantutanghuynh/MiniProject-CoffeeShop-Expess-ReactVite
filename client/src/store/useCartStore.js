import { create } from 'zustand';

/**
 * Zustand Store Quản Lý Giỏ Hàng (Shopping Cart State)
 * Tự động tính toán giá tạm tính và lưu vào LocalStorage.
 */
export const useCartStore = create((set, get) => ({
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],

  // Thêm món ăn vào giỏ
  addToCart: (drink, selectedSize = 'M', selectedToppings = [], quantity = 1) => {
    const currentItems = get().cartItems;

    let unitPrice = drink.price;
    if (selectedSize && drink.sizes) {
      const foundSize = drink.sizes.find((s) => s.name === selectedSize);
      if (foundSize) unitPrice += foundSize.extraPrice;
    }
    if (selectedToppings && drink.toppings) {
      selectedToppings.forEach((topName) => {
        const foundTop = drink.toppings.find((t) => t.name === topName);
        if (foundTop) unitPrice += foundTop.price;
      });
    }

    const existingIndex = currentItems.findIndex(
      (item) =>
        item.drinkId === drink._id &&
        item.selectedSize === selectedSize &&
        JSON.stringify(item.selectedToppings.sort()) === JSON.stringify(selectedToppings.sort())
    );

    let updatedItems = [];
    if (existingIndex > -1) {
      updatedItems = [...currentItems];
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems = [
        ...currentItems,
        {
          cartItemId: `${drink._id}-${selectedSize}-${Date.now()}`,
          drinkId: drink._id,
          name: drink.name,
          image: drink.image,
          price: unitPrice,
          selectedSize,
          selectedToppings,
          quantity
        }
      ];
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    set({ cartItems: updatedItems });
  },

  // Cập nhật số lượng
  updateQuantity: (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }
    const updated = get().cartItems.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cartItems', JSON.stringify(updated));
    set({ cartItems: updated });
  },

  // Xóa món khỏi giỏ
  removeFromCart: (cartItemId) => {
    const updated = get().cartItems.filter((item) => item.cartItemId !== cartItemId);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    set({ cartItems: updated });
  },

  // Xóa sạch giỏ hàng khi thanh toán xong
  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cartItems: [] });
  },

  // Tính tổng tiền giỏ hàng
  getTotalAmount: () => {
    return get().cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  // Tính tổng số lượng sản phẩm
  getTotalCount: () => {
    return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}));
