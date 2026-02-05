import React from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";

interface IPlatformLink extends Omit<NavLinkProps, "children"> {
  to: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

/**
 * PlatformLink - компонент для навигации к чатам платформ
 */
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
        `duration-100 p-1.5 transition-colors flex items-center justify-center ${
          isActive
            ? "bg-primary-border"
            : "hover:bg-primary-border hover:bg-opacity-80"
        } ${className}`
      }
      {...props}
    >
      {icon}
    </NavLink>
  );
}

export default PlatformLink;
