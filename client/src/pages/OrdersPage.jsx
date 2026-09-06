import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { ClipboardList, Clock, CheckCircle, Truck, XCircle, Package } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await axiosClient.get('/orders/my-orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Lỗi lấy lịch sử đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Pending Approval
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" /> Delivering
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white border border-[#e8dfd5] rounded-full text-[#1c1512]">
          <ClipboardList className="w-6 h-6 stroke-[1.8]" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-black text-[#1c1512]">My Order History</h1>
          <p className="text-xs text-[#78695d]">Track your coffee & food orders at Brewista</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#78695d]">Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#e8dfd5] text-[#78695d] space-y-2">
          <Package className="w-12 h-12 mx-auto text-[#c4ab99]" />
          <p className="font-semibold text-[#1c1512]">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-[#e8dfd5] rounded-3xl p-6 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f4efe6] pb-4">
                <div>
                  <span className="text-[11px] text-[#78695d] block">Order ID</span>
                  <span className="font-bold text-[#1c1512] text-xs">{order._id}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#78695d]">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </span>
                  {renderStatusBadge(order.status)}
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-[#f4efe6] text-[#1c1512] font-bold flex items-center justify-center text-[10px]">
                        {item.quantity}x
                      </span>
                      <span className="font-bold text-[#1c1512]">{item.name}</span>
                      <span className="text-[#78695d]">(Size {item.selectedSize})</span>
                      {item.selectedToppings && item.selectedToppings.length > 0 && (
                        <span className="text-[#78695d]">+ {item.selectedToppings.join(', ')}</span>
                      )}
                    </div>
                    <span className="font-bold text-[#1c1512]">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#f4efe6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="text-[#78695d] space-y-0.5">
                  <p><strong className="text-[#1c1512]">Phone:</strong> {order.phone}</p>
                  <p><strong className="text-[#1c1512]">Address:</strong> {order.address}</p>
                  {order.note && <p><strong className="text-[#1c1512]">Note:</strong> {order.note}</p>}
                </div>

                <div className="text-right">
                  <span className="text-[#78695d] block uppercase font-bold text-[10px]">Total Amount</span>
                  <span className="font-black text-xl text-[#8b5a2b]">
                    {order.totalAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
