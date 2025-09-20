import React, { useState, useRef, useCallback, useEffect } from "react";
import Modal from "./Modal";

interface FormData {
  name: string;
  email: string;
  experience: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  experience?: string;
  message?: string;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const FormModal = ({ isOpen, onClose, onSubmit }: FormModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    experience: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const handleInputChange = useCallback(
    (field: keyof FormData) =>
      (
        event: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const value = event.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
          validateField(field, value);
        }
      },
    [errors]
  );

  const validateField = useCallback(
    (field: keyof FormData, value: string): boolean => {
      let isValid = true;
      let errorMessage = "";

      switch (field) {
        case "name":
          if (!value.trim()) {
            errorMessage = "이름을 입력해주세요.";
            isValid = false;
          } else if (value.trim().length < 2) {
            errorMessage = "이름은 2글자 이상 입력해주세요.";
            isValid = false;
          }
          break;
        case "email":
          if (!value.trim()) {
            errorMessage = "이메일을 입력해주세요.";
            isValid = false;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errorMessage = "올바른 이메일 형식을 입력해주세요.";
            isValid = false;
          }
          break;
        case "experience":
          if (!value) {
            errorMessage = "FE 경력 연차를 선택해주세요.";
            isValid = false;
          }
          break;
      }

      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
      return isValid;
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const fields: (keyof FormData)[] = [
      "name",
      "email",
      "experience",
      "message",
    ];
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  }, [formData, validateField]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (isSubmitting) return;

      setIsSubmitting(true);

      if (validateForm()) {
        try {
          await onSubmit(formData);
          setFormData({ name: "", email: "", experience: "", message: "" });
          setErrors({});
        } catch (error) {
          console.error("Form submission error:", error);
        }
      } else {
        const firstErrorField = Object.keys(errors).find(
          (field: string) => errors[field as keyof FormErrors]
        );
        if (firstErrorField) {
          const element = document.querySelector(
            `[name="${firstErrorField}"]`
          ) as HTMLElement;
          element?.focus();
        }

        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.focus();
          }
        }, 100);
      }

      setIsSubmitting(false);
    },
    [formData, validateForm, onSubmit, isSubmitting, errors]
  );

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", experience: "", message: "" });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const LiveRegion = () => {
    const errorMessages = (Object.values(errors) as string[]).filter(Boolean);
    const hasErrors = errorMessages.length > 0;

    return (
      <div
        ref={errorRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        {hasErrors && (
          <div>
            폼 검증 오류가 {errorMessages.length}개 있습니다:{" "}
            {errorMessages.join(", ")}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="신청 폼">
      <LiveRegion />
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="name"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            이름/닉네임 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange("name")}
            onBlur={(e) => validateField("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: `2px solid ${errors.name ? "#dc2626" : "#d1d5db"}`,
              borderRadius: "4px",
            }}
            autoComplete="name"
          />
          {errors.name && (
            <div
              id="name-error"
              role="alert"
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            이메일 *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            onBlur={(e) => validateField("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: `2px solid ${errors.email ? "#dc2626" : "#d1d5db"}`,
              borderRadius: "4px",
            }}
            autoComplete="email"
          />
          {errors.email && (
            <div
              id="email-error"
              role="alert"
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="experience"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            FE 경력 연차 *
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange("experience")}
            onBlur={(e) => validateField("experience", e.target.value)}
            aria-invalid={!!errors.experience}
            aria-describedby={
              errors.experience ? "experience-error" : undefined
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              border: `2px solid ${errors.experience ? "#dc2626" : "#d1d5db"}`,
              borderRadius: "4px",
              backgroundColor: "white",
            }}
          >
            <option value="">경력 연차를 선택해주세요</option>
            <option value="0-3년">0-3년</option>
            <option value="4-7년">4-7년</option>
            <option value="8년 이상">8년 이상</option>
          </select>
          {errors.experience && (
            <div
              id="experience-error"
              role="alert"
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.experience}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label
            htmlFor="message"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            GitHub 링크(선택)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange("message")}
            onBlur={(e) => validateField("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: `2px solid ${errors.message ? "#dc2626" : "#d1d5db"}`,
              borderRadius: "4px",
              resize: "vertical",
            }}
          />
          {errors.message && (
            <div
              id="message-error"
              role="alert"
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.message}
            </div>
          )}
        </div>

        <div
          style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: "0.75rem 1.5rem",
              border: "2px solid #d1d5db",
              borderRadius: "4px",
              backgroundColor: "white",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "0.75rem 1.5rem",
              border: "2px solid #3b82f6",
              borderRadius: "4px",
              backgroundColor: "#3b82f6",
              color: "white",
              cursor: "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "제출 중..." : "제출"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
