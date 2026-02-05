import PosibilityItemsList from "../PosibilityItemsList/PosibilityItemsList";

function PosibilitiesSection() {
  return (
    <div
      id="posibilities"
      className="flex flex-col items-center relative px-2 sm:px-0"
    >
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-font-primary w-full sm:w-[90%] md:w-[85%] lg:w-220 mb-4 sm:mb-5 z-99 leading-tight">
        Вся история коммуникаций и договорённостей с клиентом{" "}
        <span className="bg-linear-to-r from-button-gradient-start to-button-gradient-end bg-clip-text text-transparent">
          всегда под рукой
        </span>
      </h2>
      <h3 className="text-center text-font-primary font-semibold text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-14 z-99 px-2">
        Объедините все каналы связи и управляйте клиентами из единого интерфейса
      </h3>
      <PosibilityItemsList />
      <div className="w-[80%] sm:w-[70%] md:w-[60%] h-40 sm:h-60 md:h-80 lg:h-93 bg-glare absolute top-40 sm:top-50 md:top-55 blur-[100px] sm:blur-[150px] md:blur-[200px] rounded-full z-0 duration-200"></div>
    </div>
  );
}

export default PosibilitiesSection;
