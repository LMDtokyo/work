import React from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";

interface IPlatformLink extends Omit<NavLinkProps, "children"> {
  to: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

function PlatformLink({
  to,
  icon,
  className = "",
  onClick,
  ...props
}: IPlatformLink) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `duration-100 p-1.5 max-w-14 max-h-14 md:max-w-16 md:max-h-16 transition-colors flex items-center justify-center ${
          isActive ? "bg-chat-tertiary-bg-hover" : "hover:bg-chat-tertiary-bg"
        } ${className}`
      }
      {...props}
    >
      {icon}
    </NavLink>
  );
}

export default PlatformLink;
