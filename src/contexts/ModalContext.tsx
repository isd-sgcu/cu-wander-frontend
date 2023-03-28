import { createContext, useState } from "react";
import Modal from "../components/Modal";

interface ModalProps {
  title: string;
  subtitle: string;
  body?: React.ReactNode;
  type: "default" | "single" | "multiple";
  choices?: {
    title: string;
    primary: boolean;
    action: () => void;
  }[];
}

export const ModalState = createContext<{
  showModalHandler: (content: ModalProps) => void;
  showModal: boolean;
  setPromptModal: (showModal: boolean) => void;
  modalContent: ModalProps;
}>({
  showModalHandler: (content: ModalProps) => {},
  showModal: false,
  setPromptModal: (showModal: boolean) => {},
  modalContent: {
    title: "",
    subtitle: "",
    body: <></>,
    type: "default",
  },
});

const ModalContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showModal, setPromptModal] = useState<boolean>(false);

  const [modalContent, setModalContent] = useState<ModalProps>({
    title: "",
    subtitle: "",
    body: <></>,
    type: "default",
  });

  const showModalHandler = (content: ModalProps) => {
    setPromptModal(true);
    setModalContent(content);
  };

  return (
    <ModalState.Provider
      value={{ showModalHandler, showModal, setPromptModal, modalContent }}
    >
      <Modal />
      {children}
    </ModalState.Provider>
  );
};

export default ModalContext;
