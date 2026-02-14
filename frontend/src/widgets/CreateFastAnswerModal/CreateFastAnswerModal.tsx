import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import PrimaryInput from "../../shared/ui/PrimaryInput/PrimaryInput";

interface ICreateFastAnswerModal {
  setIsModalOpen: (value: boolean) => void;
}

interface FormData {
  patternTitle: string;
  patternText: string;
}

function CreateFastAnswerModal({ setIsModalOpen }: ICreateFastAnswerModal) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const closeModal = () => setIsModalOpen(false);

  const onSubmit = () => {
    // TODO
  };

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 bg-chat-secondary-bg border border-chat-primary-border rounded-3xl pb-7 p-5 sm:p-7 md:p-9 px-4 sm:px-6 md:px-8 z-99 animate-fade-in-bottom w-full sm:w-150">
        <div className="flex gap-2 sm:gap-4 items-center">
          <span
            onClick={() => setIsModalOpen(false)}
            className="text-secondary-font cursor-pointer rounded-full hover:bg-chat-tertiary-bg hover:text-primary-font p-1 duration-100"
          >
            <ChevronLeft width={24} height={24} className="w-4 sm:w-5 md:w-6" />
          </span>
          <h2 className="text-primary-font text-base sm:text-lg md:text-xl font-semibold">
            Создание шаблона
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 justify-center mb-1"
        >
          <div>
            <PrimaryInput
              {...register("patternTitle")}
              label="Название шаблона"
              placeholder="Придумайте название шаблона"
              disabled={false}
              autoFocus
            />
            {errors.patternTitle && (
              <p className="text-red-400 text-sm mt-1 ml-4">
                {errors.patternTitle.message}
              </p>
            )}
          </div>
          <div>
            <PrimaryInput
              {...register("patternText")}
              label="Текст шаблона"
              placeholder="Придумайте текст шаблона"
              disabled={false}
            />
            {errors.patternText && (
              <p className="text-red-400 text-sm mt-1 ml-4">
                {errors.patternText.message}
              </p>
            )}
          </div>
          <button className="text-primary-font text-sm sm:text-base bg-contrast rounded-full py-2 sm:py-3 px-6 cursor-pointer mt-4">
            Добавить
          </button>
        </form>
      </div>
      <div
        onClick={closeModal}
        className="fixed top-0 left-0 w-full h-full z-40 animate-fade-in"
      />
    </>
  );
}

export default CreateFastAnswerModal;
