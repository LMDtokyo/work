import Sidebar from "../../../widgets/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const App = () => {
  return (
    <div className="bg-chat-bg w-full h-svh flex gap-2 justify-center items-start overflow-hidden relative p-2">
      <Sidebar />
      <Outlet />
    </div>
  );
};
