import React from "react";
import { Mail, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-50 mt-12 border-t border-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 space-y-2">
        <p className="text-blue-800 font-semibold text-lg">ParkIt</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-500">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" /> iratuzibeniegiramata@gmail.com 
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> Kigali, Rwanda
          </span>
        </div>
        <p>© {new Date().getFullYear()} ParkIt. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
