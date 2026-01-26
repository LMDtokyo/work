import PricesCalculator from "../PricesCalculator/PricesCalculator";

function PricesSection() {
  return (
    <div
      id="prices"
      className="flex flex-col items-center w-full my-50 relative"
    >
      <h2 className="text-center text-5xl font-bold text-font-primary w-220 mb-5 z-99">
        Агрегатор{" "}
        <span className="bg-linear-to-r from-button-gradient-start to-button-gradient-end bg-clip-text text-transparent">
          Торговых площадок
        </span>
      </h2>
      <h3 className="text-center text-font-primary font-semibold text-xl mb-14 z-99">
        Объедините все каналы связи и управляйте клиентами из единого интерфейса
      </h3>
      <PricesCalculator />
      <div className="w-[60%] h-120 bg-glare absolute -left-100 bottom-0 blur-[200px] rotate-45 rounded-full z-0 duration-200"></div>
    </div>
  );
}

export default PricesSection;
