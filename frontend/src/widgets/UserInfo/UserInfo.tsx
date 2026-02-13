import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../../shared/context/auth";

function UserInfo() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getInitial = () => {
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    return user?.email?.split("@")[0] || "Пользователь";
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center justify-between w-full bg-chat-secondary-bg border border-chat-primary-border px-4 sm:px-6 py-3 sm:py-4 rounded-2xl animate-fade-in-bottom">
      <div className="flex gap-3 items-center">
        <div className="font-semibold text-lg sm:text-xl md:text-2xl w-13 h-13 md:w-15 md:h-15 lg:w-17 lg:h-17 flex items-center justify-center border border-chat-secondary-border rounded-full bg-chat-tertiary-bg text-primary-font">
          {getInitial()}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-primary-font text-base sm:text-lg md:text-xl">
            {getDisplayName()}
          </h2>
          <p className="text-sm sm:text-base text-secondary-font">
            Тариф: <span className="text-primary-font">Premium</span>
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-full bg-red-bg-20 p-2 md:px-4 md:py-2 hover:bg-red-bg-30 w-full border border-red-bg/30 sm:w-auto cursor-pointer duration-150 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoggingOut ? (
          <Loader2 className="text-red-bg animate-spin w-4" />
        ) : (
          <div className="flex gap-2 items-center justify-center w-full">
            <LogOut className="text-red-bg w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-105 duration-150" />
            <span className="text-red-bg font-semibold text-sm sm:text-base">
              Выйти
            </span>
          </div>
        )}
      </button>
    </div>
  );
}

export default UserInfo;
