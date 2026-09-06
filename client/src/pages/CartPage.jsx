import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import { Trash2, ShoppingBag, ArrowLeft, Phone, MapPin, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalAmount } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setLoading(true);

    try {
      const itemsPayload = cartItems.map((item) => ({
        drinkId: item.drinkId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedToppings: item.selectedToppings
      }));

      const res = await axiosClient.post('/orders', {
        items: itemsPayload,
        phone,
        address,
        note
      });

      setOrderSuccess(res.data);
      clearCart();
    } catch (err) {
      setErrorMsg(err.message || 'Order failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-[#e8dfd5] rounded-3xl text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 bg-[#f4efe6] text-[#8b5a2b] border border-[#e8dfd5] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-black text-[#1c1512]">Order Placed Successfully!</h2>
          <p className="text-xs text-[#78695d]">Thank you for ordering at Brewista. Your coffee & food are being prepared.</p>
        </div>

        <div className="p-4 bg-[#faf7f2] rounded-2xl text-left text-xs space-y-2 border border-[#e8dfd5]">
          <div className="flex justify-between">
            <span className="text-[#78695d]">Order ID:</span>
            <span className="font-bold text-[#1c1512]">{orderSuccess.data?._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#78695d]">Total Amount:</span>
            <span className="font-bold text-[#8b5a2b]">{orderSuccess.data?.totalAmount?.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/orders"
            className="flex-1 py-3 bg-[#f4efe6] hover:bg-[#e8dfd5] text-[#1c1512] font-bold rounded-full text-xs transition-all"
          >
            My Orders
          </Link>
          <Link
            to="/"
            className="flex-1 py-3 bg-[#1c1512] hover:bg-[#3d2c25] text-white font-bold rounded-full text-xs transition-all"
          >
            Continue Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2.5 rounded-full bg-[#f4efe6] border border-[#e8dfd5] text-[#1c1512] hover:bg-[#e8dfd5] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-serif text-3xl font-black text-[#1c1512]">Your Order Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#e8dfd5] text-[#78695d] space-y-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-[#c4ab99]" />
          <p className="font-semibold text-base text-[#1c1512]">Your order cart is currently empty.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-full bg-[#1c1512] hover:bg-[#3d2c25] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Explore Brewista Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="p-5 bg-white border border-[#e8dfd5] rounded-3xl flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img
                      src={`http://localhost:3000/public/images/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-[#faf7f2]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#faf7f2] flex items-center justify-center text-[#8b6e58]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="font-bold text-[#1c1512] text-base">{item.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-[#78695d]">
                      <span className="px-2 py-0.5 rounded bg-[#f4efe6] border border-[#e8dfd5] font-semibold text-[#1c1512]">
                        Size {item.selectedSize}
                      </span>
                      {item.selectedToppings && item.selectedToppings.length > 0 && (
                        <span>+ {item.selectedToppings.join(', ')}</span>
                      )}
                    </div>
                    <span className="font-extrabold text-[#8b5a2b] text-sm block">
                      {item.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-[#f4efe6] border border-[#e8dfd5] rounded-full p-1">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-white text-[#1c1512] font-bold flex items-center justify-center text-sm shadow-sm"
                    >
                      -
                    </button>
                    <span className="font-bold text-[#1c1512] text-xs px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-white text-[#1c1512] font-bold flex items-center justify-center text-sm shadow-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 text-[#78695d] hover:text-rose-600 rounded-full transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#e8dfd5] rounded-3xl p-6 space-y-6 h-fit shadow-md">
            <h2 className="font-serif font-bold text-lg text-[#1c1512] border-b border-[#f4efe6] pb-3">Delivery Information</h2>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#1c1512] uppercase tracking-wider block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8b7a6d] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="0901234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#faf7f2] border border-[#e8dfd5] rounded-xl text-[#1c1512] text-xs focus:outline-none focus:border-[#1c1512]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#1c1512] uppercase tracking-wider block mb-1">Delivery Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8b7a6d] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="123 Coffee Street, Brooklyn, NY"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#faf7f2] border border-[#e8dfd5] rounded-xl text-[#1c1512] text-xs focus:outline-none focus:border-[#1c1512]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#1c1512] uppercase tracking-wider block mb-1">Order Notes</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#8b7a6d] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Less sugar, extra ice..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#faf7f2] border border-[#e8dfd5] rounded-xl text-[#1c1512] text-xs focus:outline-none focus:border-[#1c1512]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#f4efe6] space-y-2">
                <div className="flex justify-between text-xs text-[#78695d]">
                  <span>Subtotal:</span>
                  <span>{getTotalAmount().toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-xs text-[#78695d]">
                  <span>Delivery Fee:</span>
                  <span className="text-emerald-700 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#1c1512] pt-2 border-t border-[#f4efe6]">
                  <span>Total Amount:</span>
                  <span className="text-[#8b5a2b]">{getTotalAmount().toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#1c1512] hover:bg-[#3d2c25] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm & Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
