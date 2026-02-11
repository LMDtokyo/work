import Sidebar from "../../../widgets/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const App = () => {
  return (
    <div className="bg-chat-primary-bg w-full h-svh flex gap-2 items-start overflow-hidden relative p-2">
      <Sidebar />
      <Outlet />
    </div>
  );
};
