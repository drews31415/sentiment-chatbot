import { Outlet } from "react-router-dom";
import { TopAppBar } from "./TopAppBar";
import { BottomNavBar } from "./BottomNavBar";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <TopAppBar />
      <div className="flex-grow flex flex-col relative">
        <Outlet />
      </div>
      <BottomNavBar />
    </div>
  );
}
