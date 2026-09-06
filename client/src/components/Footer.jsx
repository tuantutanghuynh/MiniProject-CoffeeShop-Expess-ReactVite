import React from 'react';
import { Coffee, MapPin, Phone, Mail, Send, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#15100e] text-[#b8aba0] pt-16 pb-8 border-t border-[#29201b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs leading-relaxed">
          
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#291f1a] flex items-center justify-center text-[#d9a377]">
                <Coffee className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-black tracking-tight text-white leading-none">
                  Brewista
                </span>
                <span className="text-[8px] font-bold tracking-[0.25em] text-[#c49871] uppercase mt-0.5">
                  COFFEE & EATERY
                </span>
              </div>
            </div>
            <p className="text-[#96877b]">
              Good coffee, great food, better together. Serving freshly brewed joy every single day.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-[#261d19] hover:bg-[#c49871] hover:text-[#15100e] flex items-center justify-center transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#261d19] hover:bg-[#c49871] hover:text-[#15100e] flex items-center justify-center transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#261d19] hover:bg-[#c49871] hover:text-[#15100e] flex items-center justify-center transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-[#96877b]">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Menu</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#reservation" className="hover:text-white transition-colors">Reservation</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wider">Our Menu</h4>
            <ul className="space-y-2 text-[#96877b]">
              <li><a href="#menu" className="hover:text-white transition-colors">Coffee & Espresso</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Breakfast & Toast</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Lunch & Bakery</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Desserts & Cakes</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Beverages & Teas</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wider">Contact Us</h4>
            <ul className="space-y-2.5 text-[#96877b]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c49871] shrink-0 mt-0.5" />
                <span>123 Coffee Street, Brooklyn, NY 11201</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c49871] shrink-0" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c49871] shrink-0" />
                <span>hello@brewista.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wider">Newsletter</h4>
            <p className="text-[#96877b]">
              Subscribe to get special offers and updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1 bg-[#241b17] border border-[#382b24] p-1 rounded-xl">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#78695d] focus:outline-none"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-lg bg-[#c49871] hover:bg-[#d9a87e] text-[#15100e] flex items-center justify-center shrink-0 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-[#241b17] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78695d]">
          <p>© {new Date().getFullYear()} Brewista Coffee & Eatery. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" /> for coffee lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
