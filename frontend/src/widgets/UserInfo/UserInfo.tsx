import { LogOut } from "lucide-react";

function UserInfo() {
  return (
    <div className="flex justify-between w-full items-center bg-chat-secondary-bg border border-primary-border px-6 py-4 rounded-2xl animate-fade-in-bottom">
      <div className="flex gap-3 items-center">
        <div className="font-semibold text-2xl w-17 h-17 flex items-center justify-center rounded-full bg-chat-tertiary-bg text-font-primary">
          A
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-font-primary text-xl">
            Александр Ковалев
          </h2>
          <p className="text-md text-font-secondary">
            alex.kovalev@example.com
          </p>
        </div>
      </div>
      <button className="rounded-lg bg-red-bg-20 p-3 hover:bg-red-bg-30 cursor-pointer duration-150">
        <LogOut className="text-red-bg" />
      </button>
    </div>
  );
}

export default UserInfo;
