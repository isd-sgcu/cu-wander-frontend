import { useIonViewWillEnter } from "@ionic/react";
import { useContext } from "react";
import { ModalState } from "../contexts/ModalContext";
import { showTabBar } from "../utils/tab";

const Modal: React.FC = () => {
  useIonViewWillEnter(() => {
    showTabBar();
  });

  const {
    showModal,
    setPromptModal,
    modalContent: content,
  } = useContext(ModalState);

  return (
    <>
      {/* background */}
      <div
        className={`bg-black fixed top-0 left-0 right-0 bottom-0 duration-300 z-40 flex ${
          showModal
            ? "bg-opacity-40"
            : "bg-opacity-0 pointer-events-none hidden"
        }`}
        id="modal-background"
        onClick={() => {
          if (!content.preventClose && !content.onClose) {
            setPromptModal(false);
          }
          if (content.onClose) content.onClose();
        }}
      ></div>

      <div
        className={`fixed flex justify-center items-center left-7 right-7 top-0 bottom-0 pointer-events-none z-50 duration-200 ${
          showModal ? "opacity-100" : "opacity-0 pointer-events-none hidden"
        }`}
      >
        {/* modal body */}
        <div className="bg-white w-full rounded-2xl text-black overflow-hidden pointer-events-auto text-center font-noto relative flex flex-col justify-between">
          {content.type === "default" && (
            <div
              onClick={() => setPromptModal(false)}
              className="absolute top-0 right-0 p-5"
            >
              <img src="assets/icon/close.svg" alt="close" />
            </div>
          )}
          <div
            className={`px-5 w-full ${
              content.type === "default" ? "py-8" : "py-6"
            }`}
          >
            <h2 className="font-bold text-lg mb-2">{content.title}</h2>
            <p>{content.subtitle}</p>
          </div>
          {content.body && <div className="pb-10">{content.body}</div>}
          {content.hasOwnProperty("choices") && (
            <div
              className={`w-full flex items-center justify-center ${
                content.type === "single" ? "h-10 mb-4" : "h-12"
              }`}
            >
              {content.choices!.map((choice, idx) => {
                return (
                  <div
                    key={idx}
                    className={`w-full flex items-center justify-center ${
                      content.type === "single" ? "h-10 mb-4" : "h-12"
                    }`}
                  >
                    <div
                      className={`h-full ${
                        content.type === "multiple"
                          ? "w-full border-t-[2px]"
                          : "bg-green-500 rounded-lg px-6"
                      } border-gray-200 grid place-content-center ${
                        choice.primary
                          ? content.type === "single"
                            ? "text-white font-semibold"
                            : "text-green-500 font-semibold"
                          : content.type === "single"
                          ? "text-white font-semibold"
                          : "text-gray-500 font-medium"
                      }`}
                      onClick={() => choice.action()}
                    >
                      {choice.title}
                    </div>
                    {content.type !== "single" && idx % 2 === 0 ? (
                      <div className="w-[2.5px] h-full bg-gray-200"></div>
                    ) : null}
                    {}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
