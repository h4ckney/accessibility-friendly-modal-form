import { useEffect, useRef, useState } from "react";

const ModalFormPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{ name: string; email: string; career: string, github: string } | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleClose = () => {
    dialogRef.current?.close();
    setOpen(false);
    openerRef.current?.focus();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setFormData({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      career: String(form.get("career") || ""),
      github: String(form.get("github") || ""),
    });
    handleClose();
  };

  const onDialogKeyDown: React.KeyboardEventHandler<HTMLDialogElement> = (e) => {
    if (e.key === "Escape") {
      handleClose();
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

  return (
    <>
      <button
        ref={openerRef}
        onClick={() => setOpen(true)}
        aria-label="모달 열기"
        aria-expanded={open}
        aria-controls="modal-form"
      >
        신청 폼 작성하기
      </button>

      <dialog
        ref={dialogRef}
        onKeyDown={onDialogKeyDown}
        onClose={handleClose}
        style={{
          width: "60%", 
          height: "60%", 
          backgroundColor: "white", 
          borderRadius: "10px", 
          padding: "16px",
          overflowY: "auto",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
      >
        <h2 id="modal-title" ref={titleRef} tabIndex={-1}>신청 폼</h2>
        <p id="modal-description">이메일과 FE 경력 연차등 간단한 정보를 입력해주세요.</p>

        <form id="modal-form" onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "16px"}}>
          <label htmlFor="name">이름/닉네임</label>
          <input type="text" name="name" required id="name"  />

          <label htmlFor="email">이메일</label>
          <input type="email" name="email" required id="email" />

          <label htmlFor="career">FE 경력 연차</label>
          <select name="career" required id="career" aria-invalid={!!formData?.career}>
            <option value="">선택해주세요.</option>
            <option value="0-3">0-3</option>
            <option value="4-7">4-7</option>
            <option value="8+">8년이상</option>
          </select>

          <label htmlFor="github">GitHub 링크 (선택)</label>
          <input type="url" name="github" id="github" />
        </form>

        <div style={{display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "16px"}}>
          <button type="button" onClick={handleClose}>취소하기</button>
          <button type="submit" form="modal-form">제출하기</button>
        </div>
      </dialog>
    </>
  );
};

export default ModalFormPage;