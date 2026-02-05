import manitoLogo from "../../shared/assets/manitoLogo.svg";

function LandingFooter() {
  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-10 border border-transparent border-t-border bg-chat-tertiary-bg w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-[calc(100%+5rem)] lg:w-screen -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14">
      <img
        src={manitoLogo}
        alt="Manito Logo"
        className="cursor-pointer h-6 sm:h-auto"
      />
    </footer>
  );
}

export default LandingFooter;
