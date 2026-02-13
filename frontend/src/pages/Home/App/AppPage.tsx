import Sidebar from "../../../widgets/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const App = () => {
  return (
    <div className="bg-chat-primary-bg w-full h-svh flex flex-col min-[450px]:flex-row gap-2 items-start overflow-hidden relative p-2">
      <Sidebar />
      <Outlet />
    </div>
  );
};
