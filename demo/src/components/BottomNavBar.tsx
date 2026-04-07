import { cn } from "../lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Map, Compass, User } from "lucide-react";

export function BottomNavBar() {
  const location = useLocation();
  const path = location.pathname;

  // 캡처 플로우에서는 하단 네비 숨김
  if (path === "/capture") return null;

  return (
    <nav
      aria-label="메인 네비게이션"
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-8 pb-8 pt-4 bg-surface/80 backdrop-blur-xl rounded-t-[3rem] border-t-[0.5px] border-primary/10 shadow-[0px_-12px_32px_rgba(55,58,28,0.06)] safe-area-bottom"
    >
      <Link
        to="/"
        aria-label="홈"
        aria-current={path === "/" ? "page" : undefined}
        className={cn(
          "flex flex-col items-center justify-center rounded-full px-5 py-2 active:scale-90 duration-300 ease-out transition-all",
          path === "/"
            ? "bg-surface-container text-primary"
            : "text-on-surface/60 hover:text-primary"
        )}
      >
        <Map size={24} className={cn("mb-1", path === "/" && "fill-current")} />
        <span className="font-sans text-[11px] font-medium tracking-widest">홈</span>
      </Link>

      <Link
        to="/discovery"
        aria-label="발견"
        aria-current={path === "/discovery" ? "page" : undefined}
        className={cn(
          "flex flex-col items-center justify-center rounded-full px-5 py-2 active:scale-90 duration-300 ease-out transition-all",
          path === "/discovery"
            ? "bg-surface-container text-primary"
            : "text-on-surface/60 hover:text-primary"
        )}
      >
        <Compass size={24} className={cn("mb-1", path === "/discovery" && "fill-current")} />
        <span className="font-sans text-[11px] font-medium tracking-widest">발견</span>
      </Link>

      <Link
        to="/profile"
        aria-label="프로필"
        aria-current={path === "/profile" ? "page" : undefined}
        className={cn(
          "flex flex-col items-center justify-center rounded-full px-5 py-2 active:scale-90 duration-300 ease-out transition-all",
          path === "/profile"
            ? "bg-surface-container text-primary"
            : "text-on-surface/60 hover:text-primary"
        )}
      >
        <User size={24} className={cn("mb-1", path === "/profile" && "fill-current")} />
        <span className="font-sans text-[11px] font-medium tracking-widest">프로필</span>
      </Link>
    </nav>
  );
}
