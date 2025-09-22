import { useEffect, useRef, useState } from "react";

// 선언적 호출을 위한 Promise 기반 모달 관리
type FormData = {
  name: string;
  email: string;
  career: string;
  github: string;
};

let modalResolve: ((value: FormData | null) => void) | null = null;

const openFormModal = (): Promise<FormData | null> => {
  return new Promise<FormData | null>((resolve: (value: FormData | null) => void) => {
    modalResolve = resolve;
    // 모달 열기 이벤트 발생
    window.dispatchEvent(new CustomEvent('openModal'));
  });
};

const ModalFormPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{ name: string; email: string; career: string, github: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleClose = () => {
    dialogRef.current?.close();
    setOpen(false);
    setErrors({});
    openerRef.current?.focus();
    // 선언적 호출에서 취소 시 null 반환
    if (modalResolve) {
      modalResolve(null);
      modalResolve = null;
    }
  };

  const validateForm = (form: globalThis.FormData) => {
    const newErrors: { [key: string]: string } = {};
    
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const career = String(form.get("career") || "").trim();
    const github = String(form.get("github") || "").trim();
    
    if (!name) {
      newErrors.name = "이름을 입력해주세요.";
    }
    
    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }
    
    if (!career) {
      newErrors.career = "경력 연차를 선택해주세요.";
    }
    
    if (github && !/^https?:\/\/github\.com\/.+/.test(github)) {
      newErrors.github = "올바른 GitHub 링크를 입력해주세요.";
    }
    
    return newErrors;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = new globalThis.FormData(e.currentTarget);
    const newErrors = validateForm(form);
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const formData = {
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        career: String(form.get("career") || ""),
        github: String(form.get("github") || ""),
      };
      setFormData(formData);
      
      // 선언적 호출에서 제출 시 데이터 반환
      if (modalResolve) {
        modalResolve(formData);
        modalResolve = null;
      }
      
      handleClose();
    }
  };

  const onDialogKeyDown: React.KeyboardEventHandler<HTMLDialogElement> = (e) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "Tab") {
      // 포커스 트랩 구현
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (e.shiftKey) {
        // Shift+Tab: 이전 요소로 이동
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab: 다음 요소로 이동
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };


  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      requestAnimationFrame(() => {
        titleRef.current?.focus();
      });
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  // 선언적 호출을 위한 이벤트 리스너
  useEffect(() => {
    const handleOpenModal = () => {
      setOpen(true);
    };

    window.addEventListener('openModal', handleOpenModal);
    return () => {
      window.removeEventListener('openModal', handleOpenModal);
    };
  }, []);

  return (
    <>
      {/* <button
        ref={openerRef}
        onClick={() => setOpen(true)}
        aria-label="모달 열기"
        aria-expanded={open}
        aria-controls="modal-form"
      >
        신청 폼 작성하기
      </button> */}

      <dialog
        ref={dialogRef}
        onKeyDown={onDialogKeyDown}
        onClose={handleClose}
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{
          width: "60%", 
          height: "60%", 
          backgroundColor: "white", 
          borderRadius: "10px", 
          padding: "16px",
          overflowY: "auto",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          ...(prefersReducedMotion ? {} : {
            animation: "modalFadeIn 0.2s ease-out"
          })
        }}
      >
        <h2 id="modal-title" ref={titleRef} tabIndex={-1}>신청 폼</h2>
        <p id="modal-description">이메일과 FE 경력 연차등 간단한 정보를 입력해주세요.</p>

        <form id="modal-form" onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "16px"}}>
          <div>
            <label htmlFor="name">이름/닉네임</label>
            <input 
              type="text" 
              name="name" 
              required 
              id="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <div id="name-error" role="alert" style={{color: "red", fontSize: "14px", marginTop: "4px"}}>
                {errors.name}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="email">이메일</label>
            <input 
              type="email" 
              name="email" 
              required 
              id="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <div id="email-error" role="alert" style={{color: "red", fontSize: "14px", marginTop: "4px"}}>
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="career">FE 경력 연차</label>
            <select 
              name="career" 
              required 
              id="career" 
              aria-invalid={!!errors.career}
              aria-describedby={errors.career ? "career-error" : undefined}
            >
              <option value="">선택해주세요.</option>
              <option value="0-3">0-3</option>
              <option value="4-7">4-7</option>
              <option value="8+">8년이상</option>
            </select>
            {errors.career && (
              <div id="career-error" role="alert" style={{color: "red", fontSize: "14px", marginTop: "4px"}}>
                {errors.career}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="github">GitHub 링크 (선택)</label>
            <input 
              type="url" 
              name="github" 
              id="github"
              aria-invalid={!!errors.github}
              aria-describedby={errors.github ? "github-error" : undefined}
            />
            {errors.github && (
              <div id="github-error" role="alert" style={{color: "red", fontSize: "14px", marginTop: "4px"}}>
                {errors.github}
              </div>
            )}
          </div>
        </form>

        <div style={{display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "16px"}}>
          <button type="button" onClick={handleClose}>취소하기</button>
          <button type="submit" form="modal-form">제출하기</button>
        </div>
      </dialog>
    </>
  );
};

// prefers-reduced-motion을 고려한 애니메이션
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { openFormModal };
export default ModalFormPage;