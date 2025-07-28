import { createContext, useContext, useState, lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Lazy load modal components for better performance
const PersonalInfoForm = lazy(
  () => import("@/components/forms/PersonalInfoForm")
);
const AddressManagement = lazy(
  () => import("@/components/forms/AddressManagement")
);
const PhotoSelectionModal = lazy(
  () => import("@/components/modals/PhotoSelectionModal")
);

type ModalType = "personalInfo" | "addresses" | "photoSelection" | null;

type PersonalInfoData = {
  name: string;
  username: string;
  email: string;
  phone: string;
};

type Address = {
  id: string;
  name: string;
  recipient: string;
  zipcode: string;
  address1: string;
  address2?: string;
  phone: string;
  isDefault: boolean;
};

type ModalContextType = {
  openModal: (
    type: ModalType,
    initialData?: PersonalInfoData,
    onSubmitCallback?: (data: PersonalInfoData) => void,
    onAddressCallback?: (addresses: Address[]) => void,
    initialAddresses?: Address[],
    onPhotoSelectionCallback?: (selectedPhoto: File | string | number) => void
  ) => void;
  closeModal: () => void;
  modalType: ModalType;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [initialData, setInitialData] = useState<PersonalInfoData | null>(null);
  const [submitCallback, setSubmitCallback] = useState<
    ((data: PersonalInfoData) => void) | null
  >(null);
  const [addressCallback, setAddressCallback] = useState<
    ((addresses: Address[]) => void) | null
  >(null);
  const [initialAddresses, setInitialAddresses] = useState<Address[]>([]);
  const [photoSelectionCallback, setPhotoSelectionCallback] = useState<
    ((selectedPhoto: File | string | number) => void) | null
  >(null);

  const openModal = (
    type: ModalType,
    data?: PersonalInfoData,
    onSubmitCallback?: (data: PersonalInfoData) => void,
    onAddressCallback?: (addresses: Address[]) => void,
    initialAddressData?: Address[],
    onPhotoSelectionCallback?: (selectedPhoto: File | string | number) => void
  ) => {
    setModalType(type);
    setInitialData(data || null);
    setSubmitCallback(() => onSubmitCallback || null);
    setAddressCallback(() => onAddressCallback || null);
    setInitialAddresses(initialAddressData || []);
    setPhotoSelectionCallback(() => onPhotoSelectionCallback || null);
  };

  const closeModal = () => {
    setModalType(null);
    setInitialData(null);
    setSubmitCallback(null);
    setAddressCallback(null);
    setInitialAddresses([]);
    setPhotoSelectionCallback(null);
  };

  // Default data for forms when no initial data is provided
  const defaultUserData = {
    name: "",
    username: "",
    email: "",
    phone: "",
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
        <DialogContent className="sm:max-w-[600px] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>Modal</DialogTitle>
          </VisuallyHidden>
          <Suspense
            fallback={
              <>
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              </>
            }
          >
            {modalType === "personalInfo" && (
              <PersonalInfoForm
                initialData={initialData || defaultUserData}
                onClose={closeModal}
                onSubmit={async (data) => {
                  console.log("개인정보 업데이트:", data);

                  // ProfileSection의 setPersonalInfo 콜백 호출
                  if (submitCallback) {
                    submitCallback(data);
                  }

                  // Mock delay
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }}
              />
            )}
            {modalType === "addresses" && (
              <AddressManagement
                onClose={closeModal}
                onAddressUpdate={addressCallback}
                initialAddresses={initialAddresses}
              />
            )}
            {modalType === "photoSelection" && (
              <PhotoSelectionModal
                onClose={closeModal}
                onPhotoSelect={photoSelectionCallback}
              />
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
