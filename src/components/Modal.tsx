import React, { useEffect, useRef, useCallback } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  initialFocusRef,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const focusElement = initialFocusRef?.current || titleRef.current;
      if (focusElement) {
        focusElement.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialFocusRef]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    },
    [isOpen, handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleKeyDownModal = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        ref={modalRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        onKeyDown={handleKeyDownModal}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <h2
          ref={titleRef}
          id="modal-title"
          style={{
            margin: "0 0 1.5rem 0",
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
          tabIndex={-1}
        >
          {title}
        </h2>
        <div id="modal-description" style={{ display: "none" }}>
          이름/닉네임, 이메일, FE 경력 연차, GitHub 링크 등의 정보를 입력하는
          폼입니다. GitHub 링크는 선택 입력 항목입니다. 그 외 모든 필드는 필수
          입력 항목입니다.
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
