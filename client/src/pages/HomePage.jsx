import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useCartStore } from '../store/useCartStore';
import { 
  Coffee, Utensils, Armchair, Wifi, Plus, ArrowRight, Check, 
  ChevronLeft, ChevronRight, Sparkles, Heart, Award, Leaf, Flame
} from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho Filter & Search
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modal chọn Size & Toppings khi bấm thêm món
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [chosenSize, setChosenSize] = useState('M');
  const [chosenToppings, setChosenToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDrinks();
  }, [selectedCategory, searchKeyword]);

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Lỗi lấy danh mục:', err);
    }
  };

  const fetchDrinks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.categoryId = selectedCategory;
      if (searchKeyword) params.keyword = searchKeyword;

      const res = await axiosClient.get('/drinks', { params });
      setDrinks(res.data || []);
    } catch (err) {
      console.error('Lỗi lấy danh sách đồ uống:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOptionModal = (drink) => {
    setSelectedDrink(drink);
    setChosenSize(drink.sizes && drink.sizes.length > 0 ? drink.sizes[0].name : 'M');
    setChosenToppings([]);
    setQuantity(1);
  };

  const handleAddToCartConfirm = () => {
    if (!selectedDrink) return;
    addToCart(selectedDrink, chosenSize, chosenToppings, quantity);
    setSelectedDrink(null);

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const toggleTopping = (topName) => {
    if (chosenToppings.includes(topName)) {
      setChosenToppings(chosenToppings.filter((t) => t !== topName));
    } else {
      setChosenToppings([...chosenToppings, topName]);
    }
  };

  const calculateModalPrice = () => {
    if (!selectedDrink) return 0;
    let base = selectedDrink.price;
    if (chosenSize && selectedDrink.sizes) {
      const sz = selectedDrink.sizes.find((s) => s.name === chosenSize);
      if (sz) base += sz.extraPrice;
    }
    if (chosenToppings && selectedDrink.toppings) {
      chosenToppings.forEach((tn) => {
        const tp = selectedDrink.toppings.find((t) => t.name === tn);
        if (tp) base += tp.price;
      });
    }
    return base * quantity;
  };

  return (
    <div className="space-y-24 pb-12">
      
      {/* 1. HERO SECTION (BREWISTA STYLE FROM IMAGE) */}
      <section className="relative pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT HERO COLUMN */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="font-script text-2xl text-[#8b5a2b]">Good Coffee, Good Vibes</span>
              <Sparkles className="w-4 h-4 text-[#c49871]" />
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#1c1512] leading-[1.15] tracking-tight">
              Start Your Day <br />
              the <span className="italic font-normal text-[#8b5a2b]">Right Way</span>
            </h1>

            <p className="text-[#6b584b] text-base leading-relaxed max-w-lg">
              We serve freshly brewed coffee, delicious food, and good vibes – every single day.
            </p>

            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <a
                href="#menu"
                className="px-6 py-3.5 rounded-full bg-[#1c1512] hover:bg-[#3d2c25] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>EXPLORE MENU</span>
                <Coffee className="w-4 h-4" />
              </a>

              <a
                href="#reservation"
                className="px-6 py-3.5 rounded-full bg-transparent border-2 border-[#1c1512] text-[#1c1512] hover:bg-[#1c1512] hover:text-white font-bold text-xs tracking-wider uppercase transition-all active:scale-95"
              >
                BOOK A TABLE
              </a>
            </div>
          </div>

          {/* RIGHT HERO COLUMN (COFFEE SAUCER IMAGE & CHALK SIGN) */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl bg-[#eadecc] border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop"
                alt="Brewista Fresh Coffee"
                className="w-full h-full object-cover"
              />

              {/* MINI CHALK SIGN CARD IN IMAGE */}
              <div className="absolute bottom-6 right-6 bg-[#211915] text-[#e3d7cb] border border-[#3b2e27] p-3 rounded-xl shadow-xl transform rotate-3 max-w-[140px] text-center">
                <span className="font-script text-lg text-[#d9a87e] block">~ Life ~</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest block text-white">HAPPENS</span>
                <span className="font-serif italic text-xs text-[#c49871] block">COFFEE HELPS ♡</span>
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING 4 FEATURE CARDS BANNER */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#f4efe6] p-6 rounded-2xl border border-[#e8dfd5]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#faf7f2] flex items-center justify-center text-[#1c1512] shrink-0 border border-[#e8dfd5]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1512] uppercase tracking-wider">FRESHLY BREWED COFFEE</h4>
              <p className="text-[11px] text-[#78695d]">Made with premium quality beans</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#faf7f2] flex items-center justify-center text-[#1c1512] shrink-0 border border-[#e8dfd5]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1512] uppercase tracking-wider">DELICIOUS FOOD OPTIONS</h4>
              <p className="text-[11px] text-[#78695d]">From breakfast to dessert & more</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#faf7f2] flex items-center justify-center text-[#1c1512] shrink-0 border border-[#e8dfd5]">
              <Armchair className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1512] uppercase tracking-wider">COZY AMBIENT SPACE</h4>
              <p className="text-[11px] text-[#78695d]">Perfect place to relax, work or meet</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#faf7f2] flex items-center justify-center text-[#1c1512] shrink-0 border border-[#e8dfd5]">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1512] uppercase tracking-wider">FREE WIFI AVAILABLE</h4>
              <p className="text-[11px] text-[#78695d]">Stay connected while you sip & relax</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "OUR SPECIALS" MENU SECTION */}
      <section id="menu" className="space-y-8">
        <div className="text-center space-y-2">
          <span className="font-script text-2xl text-[#8b5a2b]">-- Our Specials --</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1c1512]">
            Handcrafted with <span className="italic font-normal text-[#8b5a2b]">love</span>, Just for you.
          </h2>
        </div>

        {/* CATEGORY TABS & SEARCH BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === ''
                  ? 'bg-[#1c1512] text-white shadow-md'
                  : 'bg-[#f4efe6] text-[#6b584b] hover:bg-[#e8dfd5] hover:text-[#1c1512]'
              }`}
            >
              All Specials
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat._id
                    ? 'bg-[#1c1512] text-white shadow-md'
                    : 'bg-[#f4efe6] text-[#6b584b] hover:bg-[#e8dfd5] hover:text-[#1c1512]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search specials..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-[#f4efe6] border border-[#e8dfd5] rounded-full text-xs text-[#1c1512] placeholder-[#8b7a6d] focus:outline-none focus:border-[#1c1512]"
          />
        </div>

        {/* DRINKS SPECIALS CARDS GRID */}
        {loading ? (
          <div className="text-center py-16 text-[#8b7a6d]">Loading specials...</div>
        ) : drinks.length === 0 ? (
          <div className="text-center py-12 text-[#8b7a6d]">No items found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {drinks.map((drink) => (
              <div
                key={drink._id}
                className="bg-white border border-[#e8dfd5] rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#faf7f2]">
                    <img
                      src={drink.image ? `http://localhost:3000/public/images/${drink.image}` : 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop'}
                      alt={drink.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#1c1512] line-clamp-1">{drink.name}</h3>
                    <p className="text-[11px] text-[#78695d] line-clamp-2 mt-0.5 leading-snug">
                      {drink.description || 'Rich espresso with steamed milk and velvet foam.'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f4efe6] mt-3 flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#1c1512]">
                    {drink.price.toLocaleString('vi-VN')} đ
                  </span>
                  <button
                    onClick={() => handleOpenOptionModal(drink)}
                    className="w-7 h-7 rounded-full bg-[#1c1512] hover:bg-[#8b5a2b] text-white flex items-center justify-center transition-colors shadow-sm"
                    title="Add to order"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. ABOUT US & RESERVATION SECTION (3 CARDS LAYOUT FROM IMAGE) */}
      <section id="about" className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* CARD 1: COZY INTERIOR IMAGE WITH BADGE */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
              alt="Cozy Coffee Shop Ambient"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 w-24 h-24 rounded-full bg-white/90 backdrop-blur-sm border border-white flex flex-col items-center justify-center text-center p-2 shadow-lg">
              <Coffee className="w-5 h-5 text-[#8b5a2b]" />
              <span className="text-[9px] font-extrabold text-[#1c1512] uppercase tracking-wider mt-1">PREMIUM QUALITY BEANS</span>
            </div>
          </div>

          {/* CARD 2: ABOUT US LIGHT BEIGE BANNER */}
          <div className="bg-[#f4efe6] border border-[#e8dfd5] rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="font-script text-xl text-[#8b5a2b]">-- About Us --</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1c1512] leading-tight">
                More than just coffee. It's an <span className="italic font-normal text-[#8b5a2b]">experience</span>.
              </h3>
              <p className="text-xs text-[#6b584b] leading-relaxed">
                At Brewista, we believe coffee brings people together. Our cozy space, friendly faces, and carefully crafted menu create the perfect place to relax and enjoy.
              </p>
            </div>

            <button className="px-6 py-3 rounded-full bg-[#1c1512] hover:bg-[#3d2c25] text-white text-xs font-bold tracking-wider uppercase transition-all w-fit flex items-center gap-2">
              <span>LEARN MORE ABOUT US</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 3: DARK OPENING HOURS & RESERVATION CARD */}
          <div className="bg-[#1c1512] text-white rounded-3xl p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#33251e] pb-3">
                <Coffee className="w-5 h-5 text-[#d9a87e]" />
                <h3 className="font-serif text-lg font-bold">Opening Hours</h3>
              </div>

              <div className="space-y-2 text-xs text-[#c4b5a8]">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-white">7:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold text-white">8:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-white">8:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>

            {/* INNER WARM GOLD RESERVATION BANNER */}
            <div className="bg-gradient-to-r from-[#8b5a2b] to-[#a66e38] rounded-2xl p-4 text-slate-950 space-y-2 shadow-md">
              <h4 className="font-serif font-bold text-sm text-white">Book Your Table</h4>
              <p className="text-[11px] text-white/90 leading-tight">
                Reserve your table and enjoy a special experience with us.
              </p>
              <a
                href="#reservation"
                className="inline-flex items-center gap-1.5 text-xs font-black text-white hover:underline pt-1"
              >
                <span>RESERVE NOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 4. BRAND VALUES GRID (ICON ROW FROM IMAGE) */}
      <section className="bg-[#f4efe6] p-8 rounded-3xl border border-[#e8dfd5]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#faf7f2] flex items-center justify-center text-[#8b5a2b] shrink-0 border border-[#e8dfd5]">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1512] uppercase tracking-wider">SUSTAINABLE SOURCING</h4>
              <p className="text-[11px] text-[#78695d]">We care for people and the planet.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#faf7f2] flex items-center justify-center text-[#8b5a2b] shrink-0 border border-[#e8dfd5]">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1512] uppercase tracking-wider">LOCALLY ROASTED</h4>
              <p className="text-[11px] text-[#78695d]">Proudly roasted in small batches.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#faf7f2] flex items-center justify-center text-[#8b5a2b] shrink-0 border border-[#e8dfd5]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1512] uppercase tracking-wider">QUALITY INGREDIENTS</h4>
              <p className="text-[11px] text-[#78695d]">Only the best for you.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#faf7f2] flex items-center justify-center text-[#8b5a2b] shrink-0 border border-[#e8dfd5]">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1512] uppercase tracking-wider">MADE WITH PASSION</h4>
              <p className="text-[11px] text-[#78695d]">Every cup is crafted with love.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INSTAGRAM GALLERY FEED SECTION */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#e8dfd5] pb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1c1512]">Follow Us @brewista.cafe</h3>
            <p className="text-xs text-[#78695d]">Tag us in your moments for a chance to be featured</p>
          </div>
          <a href="#" className="text-xs font-bold text-[#1c1512] hover:text-[#8b5a2b] flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400&auto=format&fit=crop',
          ].map((imgUrl, idx) => (
            <div key={idx} className="aspect-square rounded-2xl overflow-hidden group relative">
              <img src={imgUrl} alt="Brewista Moment" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-[#1c1512]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL CHỌN SIZE & TOPPING */}
      {selectedDrink && (
        <div className="fixed inset-0 z-50 bg-[#1c1512]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#faf7f2] border border-[#e8dfd5] rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1c1512]">{selectedDrink.name}</h3>
                <p className="text-xs text-[#78695d]">Customize your order options</p>
              </div>
              <button onClick={() => setSelectedDrink(null)} className="text-[#78695d] hover:text-[#1c1512] font-bold text-xl px-2">✕</button>
            </div>

            {selectedDrink.sizes && selectedDrink.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1c1512] uppercase tracking-wider block">Size Options</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedDrink.sizes.map((sz) => (
                    <button
                      key={sz.name}
                      onClick={() => setChosenSize(sz.name)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        chosenSize === sz.name
                          ? 'bg-[#1c1512] text-white border-[#1c1512]'
                          : 'bg-white text-[#6b584b] border-[#e8dfd5] hover:border-[#1c1512]'
                      }`}
                    >
                      <div>Size {sz.name}</div>
                      <div className="text-[10px] opacity-80">+{sz.extraPrice.toLocaleString('vi-VN')}đ</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDrink.toppings && selectedDrink.toppings.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1c1512] uppercase tracking-wider block">Toppings</label>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedDrink.toppings.map((top) => (
                    <label
                      key={top.name}
                      onClick={() => toggleTopping(top.name)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        chosenToppings.includes(top.name)
                          ? 'bg-[#f4efe6] border-[#1c1512] text-[#1c1512]'
                          : 'bg-white border-[#e8dfd5] text-[#6b584b]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded flex items-center justify-center border ${chosenToppings.includes(top.name) ? 'bg-[#1c1512] text-white' : 'border-[#c4ab99]'}`}>
                          {chosenToppings.includes(top.name) && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        {top.name}
                      </span>
                      <span>+{top.price.toLocaleString('vi-VN')}đ</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[#e8dfd5]">
              <div className="flex items-center gap-3 bg-white border border-[#e8dfd5] rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 rounded bg-[#f4efe6] font-bold text-[#1c1512]">-</button>
                <span className="font-bold text-xs px-2 text-[#1c1512]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 rounded bg-[#f4efe6] font-bold text-[#1c1512]">+</button>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#78695d] uppercase font-bold block">Total Price</span>
                <span className="font-black text-lg text-[#1c1512]">{calculateModalPrice().toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <button
              onClick={handleAddToCartConfirm}
              className="w-full py-3.5 rounded-full bg-[#1c1512] hover:bg-[#3d2c25] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              Add To Order
            </button>
          </div>
        </div>
      )}

      {/* TOAST ADD SUCCESS */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1512] text-white font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce border border-[#3b2e27]">
          <Check className="w-4 h-4 text-[#c49871] stroke-[3]" /> Added to order successfully!
        </div>
      )}
    </div>
  );
}
