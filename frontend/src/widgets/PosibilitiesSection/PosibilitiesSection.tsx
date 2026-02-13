import PosibilityItemsList from "../PosibilityItemsList/PosibilityItemsList";

function PosibilitiesSection() {
  return (
    <div
      id="posibilities"
      className="flex flex-col items-center relative px-2 sm:px-0"
    >
      <h2 className="text-center text-xl min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-font w-full sm:w-[90%] md:w-[85%] lg:w-220 mb-4 sm:mb-5 z-99 leading-tight">
        Вся история коммуникаций и договорённостей с клиентом{" "}
        <span className="text-contrast">всегда под рукой</span>
      </h2>
      <h3 className="text-center text-secondary-font text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-14 z-99 px-2">
        Объедините все каналы связи и управляйте клиентами из единого интерфейса
      </h3>
      <PosibilityItemsList />
    </div>
  );
}

export default PosibilitiesSection;
