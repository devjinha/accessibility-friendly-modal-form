import React, { useRef, useState } from "react";
import { useModal, openFormModal } from "./hooks/useModal";

interface FormData {
  name: string;
  email: string;
  experience: string;
  message: string;
}

const ModalFormPage = () => {
  const { openModal, ModalComponent } = useModal();
  const [result, setResult] = useState<FormData | null>(null);
  const [declarativeResult, setDeclarativeResult] = useState<FormData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const hookButtonRef = useRef<HTMLButtonElement>(null);
  const declarativeButtonRef = useRef<HTMLButtonElement>(null);

  const handleHookModal = async () => {
    try {
      const data = await openModal(hookButtonRef);
      setResult(data);
    } catch (error) {
      console.error("Hook modal error:", error);
    }
  };

  const handleDeclarativeModal = async () => {
    setIsLoading(true);
    try {
      const data = await openFormModal();
      setDeclarativeResult(data);
    } catch (error) {
      console.error("Declarative modal error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ResultDisplay = ({
    data,
    title,
  }: {
    data: FormData | null;
    title: string;
  }) => {
    if (!data) return null;

    return (
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
        }}
      >
        <h3>{title}</h3>
        <div>
          <p>
            <strong>이름/닉네임:</strong> {data.name}
          </p>
          <p>
            <strong>이메일:</strong> {data.email}
          </p>
          <p>
            <strong>FE 경력 연차:</strong> {data.experience}
          </p>
          <p>
            <strong>GitHub 링크:</strong> {data.message}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
        }}
      >
        <header>
          <h1>신청 폼</h1>
          <p>React와 TypeScript로 구현한 모달 신청 폼입니다.</p>
        </header>

        <main>
          <div style={{ display: "grid", gap: "2rem" }}>
            <section>
              <h2>Hook 기반 모달</h2>
              <p>useModal 훅을 사용하여 모달을 관리합니다.</p>
              <button
                ref={hookButtonRef}
                onClick={handleHookModal}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                신청 폼 작성하기
              </button>
              <ResultDisplay data={result} title="Hook 모달 결과" />
            </section>

            <section>
              <h2>선언적 호출 모달</h2>
              <p>openFormModal() 함수를 직접 호출하여 모달을 열 수 있습니다.</p>
              <button
                ref={declarativeButtonRef}
                onClick={handleDeclarativeModal}
                disabled={isLoading}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: isLoading ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "로딩 중..." : "선언적 모달 열기"}
              </button>
              <ResultDisplay
                data={declarativeResult}
                title="선언적 모달 결과"
              />
            </section>
          </div>
        </main>
      </div>

      <ModalComponent />
    </div>
  );
};

export default ModalFormPage;
