import React, { useState, useCallback } from "react";
import FormModal from "../components/FormModal";

interface FormData {
  name: string;
  email: string;
  experience: string;
  message: string;
}

interface UseModalReturn {
  isOpen: boolean;
  openModal: (
    triggerRef?: React.RefObject<HTMLElement | null>
  ) => Promise<FormData | null>;
  closeModal: () => void;
  ModalComponent: React.FC;
}

export const useModal = (): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<
    ((value: FormData | null) => void) | null
  >(null);
  const [triggerRef, setTriggerRef] =
    useState<React.RefObject<HTMLElement | null> | null>(null);

  const openModal = useCallback(
    (
      triggerRef?: React.RefObject<HTMLElement | null>
    ): Promise<FormData | null> => {
      return new Promise((resolve) => {
        setTriggerRef(triggerRef || null);
        setResolvePromise(() => resolve);
        setIsOpen(true);
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);

    if (triggerRef?.current) {
      setTimeout(() => {
        triggerRef.current?.focus();
      }, 0);
    }

    if (resolvePromise) {
      resolvePromise(null);
      setResolvePromise(null);
    }
  }, [resolvePromise, triggerRef]);

  const handleSubmit = useCallback(
    (data: FormData) => {
      setIsOpen(false);

      if (triggerRef?.current) {
        setTimeout(() => {
          triggerRef.current?.focus();
        }, 0);
      }

      if (resolvePromise) {
        resolvePromise(data);
        setResolvePromise(null);
      }
    },
    [resolvePromise, triggerRef]
  );

  const ModalComponent = useCallback(
    () => (
      <FormModal isOpen={isOpen} onClose={closeModal} onSubmit={handleSubmit} />
    ),
    [isOpen, closeModal, handleSubmit]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    ModalComponent,
  };
};

class ModalManager {
  private static instance: ModalManager;
  private container: HTMLDivElement | null = null;
  private root: any = null;
  private resolvePromise: ((value: FormData | null) => void) | null = null;

  private constructor() {
    this.createContainer();
  }

  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  private createContainer(): void {
    if (typeof document === "undefined") return;

    this.container = document.createElement("div");
    this.container.id = "modal-root";
    document.body.appendChild(this.container);
  }

  private async renderModal(
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (data: FormData) => void
  ): Promise<void> {
    if (!this.container) return;

    const { createRoot } = await import("react-dom/client");

    if (this.root) {
      this.root.unmount();
    }

    this.root = createRoot(this.container);

    const modalElement = React.createElement(FormModal, {
      isOpen,
      onClose,
      onSubmit,
    });

    this.root.render(modalElement);
  }

  private cleanup(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  async open(): Promise<FormData | null> {
    return new Promise((resolve) => {
      const previousFocus = document.activeElement;

      this.resolvePromise = resolve;

      const handleClose = () => {
        this.cleanup();

        if (previousFocus instanceof HTMLElement) {
          setTimeout(() => {
            previousFocus.focus();
          }, 0);
        }

        if (this.resolvePromise) {
          this.resolvePromise(null);
          this.resolvePromise = null;
        }
      };

      const handleSubmit = (data: FormData) => {
        this.cleanup();

        if (previousFocus instanceof HTMLElement) {
          setTimeout(() => {
            previousFocus.focus();
          }, 0);
        }

        if (this.resolvePromise) {
          this.resolvePromise(data);
          this.resolvePromise = null;
        }
      };

      this.renderModal(true, handleClose, handleSubmit);
    });
  }
}

export const openFormModal = (): Promise<FormData | null> => {
  const modalManager = ModalManager.getInstance();
  return modalManager.open();
};
