import { cn } from "../lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, X, MoreHorizontal, Share } from "lucide-react";

export function TopAppBar() {
  const location = useLocation();
  const isCapture = location.pathname === "/capture";
  const isInsight = location.pathname === "/insight";

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-md bg-gradient-to-b from-surface to-transparent">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {isCapture || isInsight ? (
            <Link to="/" aria-label="닫기" className="p-2 text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <X size={24} />
            </Link>
          ) : (
            <button aria-label="메뉴" className="p-2 text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <Menu size={24} />
            </button>
          )}
          <h1 className="font-serif text-2xl italic text-primary font-semibold tracking-tight">소확행</h1>
        </div>
        <div className="flex items-center gap-2">
          {isCapture ? (
            <button aria-label="더보기" className="p-2 text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <MoreHorizontal size={24} />
            </button>
          ) : isInsight ? (
            <button aria-label="공유" className="p-2 text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <Share size={24} />
            </button>
          ) : (
            <button aria-label="알림" className="p-2 text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <Bell size={24} />
            </button>
          )}
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
    </header>
  );
}
