import SubscribeItemsList from "../SubscribeItemsList/SubscribeItemsList";

function SubscribeSection() {
  return (
    <div className="flex flex-col items-center my-40">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-font w-full sm:w-[90%] md:w-[85%] lg:w-220 mb-4 sm:mb-5 z-99 leading-tight">
        Выберите ваш{" "}
        <span className="bg-contrast bg-clip-text text-transparent">план</span>
      </h2>
      <h3 className="text-center text-secondary-font font-semibold text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-14 z-99 px-2">
        Выберите уровень доступа, который нужен вашему бизнесу
      </h3>
      <SubscribeItemsList color="landing" />
    </div>
  );
}

export default SubscribeSection;
