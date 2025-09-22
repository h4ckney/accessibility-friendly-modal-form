import "modern-normalize";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ModalFormPage, { openFormModal } from "./ModalFormPage";

// 선언적 호출 사용 예시
const handleDeclarativeCall = async (): Promise<void> => {
  try {
    const result = await openFormModal();
    if (result) {
      console.log("폼 제출 완료:", result);
      alert(`제출 완료!\n이름: ${result.name}\n이메일: ${result.email}\n경력: ${result.career}\nGitHub: ${result.github || '없음'}`);
    } else {
      console.log("폼 취소됨");
    }
  } catch (error) {
    console.error("모달 오류:", error);
  }
};

// 전역 함수로 등록하여 콘솔에서 테스트 가능
(window as any).openFormModal = openFormModal;
(window as any).handleDeclarativeCall = handleDeclarativeCall;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ padding: "20px" }}>
      <h1>접근성 친화적 모달 폼</h1>
      <p>아래 버튼을 클릭하거나 콘솔에서 <code>handleDeclarativeCall()</code>을 실행해보세요!</p>
      <button onClick={handleDeclarativeCall} style={{ marginBottom: "20px", padding: "10px 20px" }}>
        선언적 호출로 모달 열기
      </button>
      <ModalFormPage />
    </div>
  </StrictMode>
);
