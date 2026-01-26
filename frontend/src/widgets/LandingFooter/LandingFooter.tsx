import manitoLogo from "../../shared/assets/manitoLogo.svg";

function LandingFooter() {
  return (
    <footer className="py-8 px-10 border border-transparent border-t-border bg-chat-tertiary-bg w-screen -mx-14">
      <img src={manitoLogo} alt="Manito Logo" className="cursor-pointer" />
    </footer>
  );
}

export default LandingFooter;
