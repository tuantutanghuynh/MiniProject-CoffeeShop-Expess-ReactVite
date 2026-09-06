import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { ShieldCheck, Coffee, FolderPlus, ShoppingBag, Plus, Trash2, Edit } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('drinks');

  const [drinks, setDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drinkModalOpen, setDrinkModalOpen] = useState(false);
  const [editingDrinkId, setEditingDrinkId] = useState(null);
  const [drinkForm, setDrinkForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    sizes: '[{"name":"S","extraPrice":0},{"name":"M","extraPrice":5000},{"name":"L","extraPrice":10000}]',
    toppings: '[{"name":"Whipped Cream","price":5000},{"name":"Extra Shot Espresso","price":10000}]'
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resDrinks, resCats, resOrders] = await Promise.all([
        axiosClient.get('/drinks'),
        axiosClient.get('/categories'),
        axiosClient.get('/orders')
      ]);

      const drinksList = Array.isArray(resDrinks) ? resDrinks : (resDrinks?.data || []);
      const catsList = Array.isArray(resCats) ? resCats : (resCats?.data || []);
      const ordersList = Array.isArray(resOrders) ? resOrders : (resOrders?.data || []);

      setDrinks(drinksList);
      setCategories(catsList);
      setOrders(ordersList);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDrink = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', drinkForm.name);
      formData.append('price', drinkForm.price);
      formData.append('category', drinkForm.category);
      formData.append('description', drinkForm.description);
      formData.append('sizes', drinkForm.sizes);
      formData.append('toppings', drinkForm.toppings);
      if (selectedFile) formData.append('image', selectedFile);

      if (editingDrinkId) {
        await axiosClient.put(`/drinks/${editingDrinkId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axiosClient.post('/drinks', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setDrinkModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error saving drink item.');
    }
  };

  const handleDeleteDrink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axiosClient.delete(`/drinks/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error deleting drink item.');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCatId) {
        await axiosClient.put(`/categories/${editingCatId}`, catForm);
      } else {
        await axiosClient.post('/categories', catForm);
      }
      setCatModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error saving category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axiosClient.delete(`/categories/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error deleting category.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosClient.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert(err.message || 'Error updating order status.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-[#e8dfd5] rounded-3xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-[#1c1512] text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-black text-[#1c1512]">Brewista Admin Control</h1>
            <p className="text-xs text-[#78695d]">Manage specials menu, categories and customer orders</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#faf7f2] p-1 rounded-full border border-[#e8dfd5]">
          <button
            onClick={() => setActiveTab('drinks')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'drinks' ? 'bg-[#1c1512] text-white shadow-md' : 'text-[#78695d] hover:text-[#1c1512]'
            }`}
          >
            <Coffee className="w-4 h-4" /> Specials ({drinks.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'categories' ? 'bg-[#1c1512] text-white shadow-md' : 'text-[#78695d] hover:text-[#1c1512]'
            }`}
          >
            <FolderPlus className="w-4 h-4" /> Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-[#1c1512] text-white shadow-md' : 'text-[#78695d] hover:text-[#1c1512]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders ({orders.length})
          </button>
        </div>
      </div>

      {activeTab === 'drinks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-[#1c1512]">Specials Menu</h2>
            <button
              onClick={() => {
                setEditingDrinkId(null);
                setDrinkForm({
                  name: '',
                  price: '',
                  category: categories[0]?._id || '',
                  description: '',
                  sizes: '[{"name":"S","extraPrice":0},{"name":"M","extraPrice":5000},{"name":"L","extraPrice":10000}]',
                  toppings: '[{"name":"Whipped Cream","price":5000},{"name":"Extra Shot Espresso","price":10000}]'
                });
                setSelectedFile(null);
                setDrinkModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#1c1512] hover:bg-[#3d2c25] text-white font-bold rounded-full text-xs flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Item
            </button>
          </div>

          <div className="bg-white border border-[#e8dfd5] rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-[#1c1512]">
              <thead className="bg-[#faf7f2] text-[#78695d] font-bold border-b border-[#e8dfd5] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4efe6]">
                {drinks.map((drink) => (
                  <tr key={drink._id} className="hover:bg-[#faf7f2] transition-colors">
                    <td className="p-4">
                      {drink.image ? (
                        <img src={`http://localhost:3000/public/images/${drink.image}`} alt={drink.name} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#faf7f2] flex items-center justify-center text-[#8b6e58]"><Coffee className="w-6 h-6" /></div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-[#1c1512]">{drink.name}</td>
                    <td className="p-4 text-[#8b5a2b] font-semibold">{drink.category?.name || 'N/A'}</td>
                    <td className="p-4 font-bold text-[#1c1512]">{drink.price.toLocaleString('vi-VN')} đ</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingDrinkId(drink._id);
                          setDrinkForm({
                            name: drink.name,
                            price: drink.price,
                            category: drink.category?._id || drink.category,
                            description: drink.description || '',
                            sizes: JSON.stringify(drink.sizes || []),
                            toppings: JSON.stringify(drink.toppings || [])
                          });
                          setDrinkModalOpen(true);
                        }}
                        className="p-2 bg-[#f4efe6] hover:bg-[#e8dfd5] text-[#1c1512] rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDrink(drink._id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-[#1c1512]">Menu Categories</h2>
            <button
              onClick={() => {
                setEditingCatId(null);
                setCatForm({ name: '', description: '' });
                setCatModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#1c1512] hover:bg-[#3d2c25] text-white font-bold rounded-full text-xs flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="p-5 bg-white border border-[#e8dfd5] rounded-3xl flex justify-between items-start shadow-sm">
                <div>
                  <h3 className="font-bold text-[#1c1512] text-base">{cat.name}</h3>
                  <p className="text-xs text-[#78695d] mt-1">{cat.description || 'No description'}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingCatId(cat._id);
                      setCatForm({ name: cat.name, description: cat.description || '' });
                      setCatModalOpen(true);
                    }}
                    className="p-2 text-[#1c1512] hover:bg-[#f4efe6] rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#1c1512]">Customer Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="p-6 bg-white border border-[#e8dfd5] rounded-3xl space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#f4efe6] pb-3">
                  <div>
                    <span className="text-xs text-[#78695d] block">Order #{order._id}</span>
                    <span className="text-xs text-[#1c1512] font-medium">Customer: {order.user?.fullname} ({order.user?.email})</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['pending', 'confirmed', 'shipping', 'completed', 'cancelled'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateOrderStatus(order._id, st)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                          order.status === st
                            ? 'bg-[#1c1512] text-white shadow-sm'
                            : 'bg-[#faf7f2] text-[#78695d] border border-[#e8dfd5] hover:bg-[#e8dfd5]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-[#78695d] flex justify-between items-center">
                  <span>Total: <strong className="text-[#8b5a2b] text-sm">{order.totalAmount.toLocaleString('vi-VN')} đ</strong></span>
                  <span>Phone: {order.phone} | Address: {order.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {drinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c1512]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveDrink} className="bg-[#faf7f2] border border-[#e8dfd5] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#1c1512]">{editingDrinkId ? 'Update Item' : 'Add New Item'}</h3>
            
            <input
              type="text" required placeholder="Item Name" value={drinkForm.name}
              onChange={(e) => setDrinkForm({ ...drinkForm, name: e.target.value })}
              className="w-full p-3 bg-white border border-[#e8dfd5] rounded-xl text-xs text-[#1c1512]"
            />
            
            <input
              type="number" required placeholder="Price (VND)" value={drinkForm.price}
              onChange={(e) => setDrinkForm({ ...drinkForm, price: e.target.value })}
              className="w-full p-3 bg-white border border-[#e8dfd5] rounded-xl text-xs text-[#1c1512]"
            />

            <select
              value={drinkForm.category}
              onChange={(e) => setDrinkForm({ ...drinkForm, category: e.target.value })}
              className="w-full p-3 bg-white border border-[#e8dfd5] rounded-xl text-xs text-[#1c1512]"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <textarea
              placeholder="Description" value={drinkForm.description}
              onChange={(e) => setDrinkForm({ ...drinkForm, description: e.target.value })}
              className="w-full p-3 bg-white border border-[#e8dfd5] rounded-xl text-xs text-[#1c1512] h-20"
            />

            <div>
              <label className="text-[10px] text-[#78695d] uppercase font-bold block mb-1">Image File</label>
              <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-xs text-[#78695d]" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setDrinkModalOpen(false)} className="px-4 py-2 bg-white text-[#78695d] rounded-full text-xs font-bold border border-[#e8dfd5]">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#1c1512] text-white rounded-full text-xs font-extrabold">Save Item</button>
            </div>
          </form>
        </div>
      )}

      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c1512]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveCategory} className="bg-[#faf7f2] border border-[#e8dfd5] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#1c1512]">{editingCatId ? 'Update Category' : 'Add Category'}</h3>
            
            <input
              type="text" required placeholder="Category Name" value={catForm.name}
              onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
              className="w-full p-3 bg-white border border-[#e8dfd5] rounded-xl text-xs text-[#1c1512]"
            />
            
            <textarea
              placeholder="Description" value={catForm.description}
              onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
              className="w-full p-3 bg-white border border-[#e8dfd5] rounded-xl text-xs text-[#1c1512] h-20"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCatModalOpen(false)} className="px-4 py-2 bg-white text-[#78695d] rounded-full text-xs font-bold border border-[#e8dfd5]">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#1c1512] text-white rounded-full text-xs font-extrabold">Save Category</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
