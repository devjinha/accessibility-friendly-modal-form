# 접근성 친화적 모달 폼

React와 TypeScript를 사용하여 구현한 접근성을 지원하는 모달 폼 컴포넌트입니다.

![접근성 모달폼](preview.gif)

## 기술 스택

- React - UI 컴포넌트 구현
- TypeScript - 타입 안전성 보장
- Vite - 개발 환경 및 빌드 도구

## 프로젝트 실행 방법

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 클론
git clone https://github.com/devjinha/accessibility-friendly-modal-form
cd accessibility-friendly-modal-form

# 의존성 설치
npm install
```

### 2. 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속하여 확인할 수 있습니다.

### 3. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

미리보기 서버가 실행되면 `http://localhost:4173`으로 접속하여 프로덕션 빌드 결과를 확인할 수 있습니다.

## 구현된 기능

### 핵심 기능

- Hook 기반 모달: `useModal` 훅을 사용한 모달 관리
- 선언적 호출: `openFormModal()` 함수를 통한 모달 열기
- 완전한 접근성 지원: WCAG 가이드라인 준수

### 폼 필드

- 이름/닉네임 (필수) - 2글자 이상 입력 검증
- 이메일 (필수) - 이메일 형식 검증
- FE 경력 연차 (필수) - 0-3년, 4-7년, 8년 이상 선택
- GitHub 링크 (선택) - 텍스트 입력

### 접근성 기능

#### 모달 제어

- ESC 키 또는 오버레이 클릭으로 모달 닫기
- 포커스 관리: 모달 열기 시 제목으로 포커스 이동, 닫기 시 트리거 버튼으로 복원
- Tab 키 트랩: 모달 내에서만 포커스 순환
- 배경 스크롤 방지: 모달 열린 상태에서 배경 스크롤 차단

#### 폼 접근성

- 키보드 네비게이션: 모든 폼 요소를 키보드로 조작 가능
- 실시간 유효성 검사: 입력 중 실시간 검증 및 오류 표시
- 스크린리더 지원: aria-live 영역을 통한 오류 메시지 즉시 전달
- 접근성 속성: aria-modal, aria-labelledby, aria-describedby 완벽 구현

#### UI/UX

- 반응형 디자인: 다양한 화면 크기 지원
- 내부 스크롤: 모달 내용이 길어질 때 내부 스크롤 지원
- 로딩 상태: 제출 중 상태 표시
- 결과 표시: 제출 완료 후 입력 데이터 표시

## 프로젝트 구조

```
src/
├── components/
│   ├── Modal.tsx          # 모달 기본 컴포넌트
│   └── FormModal.tsx      # 폼 모달 컴포넌트
├── hooks/
│   └── useModal.tsx       # 모달 관리 훅
├── utils/
│   └── focusManager.ts    # 포커스 관리 유틸리티
├── ModalFormPage.tsx      # 메인 페이지
└── main.tsx              # 앱 진입점
```

## 사용 예시

### Hook 기반 사용법

```tsx
import { useModal } from "./hooks/useModal";

const MyComponent = () => {
  const { openModal, ModalComponent } = useModal();

  const handleClick = async () => {
    const result = await openModal(buttonRef);
    if (result) {
      console.log("제출된 데이터:", result);
    }
  };

  return (
    <>
      <button ref={buttonRef} onClick={handleClick}>
        모달 열기
      </button>
      <ModalComponent />
    </>
  );
};
```

### 선언적 호출 사용법

```tsx
import { openFormModal } from "./hooks/useModal";

const handleClick = async () => {
  const result = await openFormModal();
  if (result) {
    console.log("제출된 데이터:", result);
  } else {
    console.log("모달이 취소되었습니다.");
  }
};
```

## 주요 특징

### 타입 안전성

모든 폼 데이터와 상태에 대한 완전한 TypeScript 타입 정의로 컴파일 타임 오류를 방지합니다.

### 성능 최적화

useCallback을 통한 불필요한 리렌더링 방지와 메모이제이션을 통한 최적화된 이벤트 핸들러를 구현했습니다.

### 접근성 우선 설계

WCAG 2.1 AA 수준의 접근성을 준수하며, 스크린리더 사용자를 위한 완벽한 지원과 키보드만으로 모든 기능을 사용할 수 있도록 설계했습니다.

## 검증된 요구사항

- 모달 닫기 (ESC 키, 오버레이 클릭)
- 포커스 흐름 관리 (열기/닫기 시 포커스 이동)
- Tab 키 네비게이션 (모달 내 포커스 트랩)
- 키보드 전용 폼 조작
- 실시간 유효성 검사 및 스크린리더 지원
- 배경 스크롤 방지
- 모달 내부 스크롤 지원
- 접근성 속성 완벽 구현
- 선언적 호출 지원 (openFormModal())

## 반응형 지원

데스크톱, 태블릿, 모바일 모든 기기에서 완벽하게 동작하며, 터치 디바이스에서의 접근성을 고려하여 다양한 화면 크기에 최적화된 레이아웃을 제공합니다.

모든 요구사항이 구현되어 프로덕션 환경에서 사용 가능합니다.
