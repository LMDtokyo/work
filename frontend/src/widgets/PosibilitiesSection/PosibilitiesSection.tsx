import PosibilityItemsList from "../PosibilityItemsList/PosibilityItemsList";

function PosibilitiesSection() {
  return (
    <div id="posibilities" className="flex flex-col items-center relative">
      <h2 className="text-center text-5xl font-bold text-font-primary w-220 mb-5 z-99">
        Вся история коммуникаций и договорённостей с клиентом{" "}
        <span className="bg-linear-to-r from-button-gradient-start to-button-gradient-end bg-clip-text text-transparent">
          всегда под рукой
        </span>
      </h2>
      <h3 className="text-center text-font-primary font-semibold text-xl mb-14 z-99">
        Объедините все каналы связи и управляйте клиентами из единого интерфейса
      </h3>
      <PosibilityItemsList />
      <div className="w-[60%] h-93 bg-glare absolute top-55 blur-[200px] rounded-full z-0 duration-200"></div>
    </div>
  );
}

export default PosibilitiesSection;
