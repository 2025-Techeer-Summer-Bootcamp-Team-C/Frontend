import { createContext, useContext, useState, lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Lazy load modal components for better performance
const PersonalInfoForm = lazy(
  () => import("@/components/forms/PersonalInfoForm")
);
const AddressManagement = lazy(
  () => import("@/components/forms/AddressManagement")
);

type ModalType = "personalInfo" | "addresses" | null;

type ModalContextType = {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  modalType: ModalType;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (type: ModalType) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  // Mock user data for forms
  const mockUserData = {
    name: "홍길동",
    username: "hong_gildong",
    email: "user@example.com",
    phone: "010-1234-5678",
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType }}>
      {children}

      <Dialog
        open={modalType !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }
          >
            {modalType === "personalInfo" && (
              <PersonalInfoForm
                initialData={mockUserData}
                onClose={closeModal}
                onSubmit={async (data) => {
                  console.log("개인정보 업데이트:", data);
                  // 실제로는 auth context나 API 호출
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }}
              />
            )}
            {modalType === "addresses" && (
              <AddressManagement onClose={closeModal} />
            )}
          </Suspense>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
