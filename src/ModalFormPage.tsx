import { useEffect, useRef, useState } from "react";

const ModalFormPage = () => {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState<{ name: string; email: string; career: string, github: string } | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    dialogRef.current?.close();     
    setOpen(false);
    openerRef.current?.focus()
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

  const onDialogKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Escape") handleClose();
  };


  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      (firstFieldRef.current ?? dialogRef.current)?.focus({ preventScroll: true });
    });
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

      <div
        ref={overlayRef}
        style={{
          display: open ? "block" : "none",
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)"
        }}
        onMouseDown={(e) => e.target === overlayRef.current && handleClose()}
        aria-hidden={!open ? true : undefined}
      >
        {open && (
          <div
            ref={dialogRef}
            tabIndex={-1}
            id="modal-form"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            onKeyDown={onDialogKeyDown}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: "60%", height: "60%", backgroundColor: "white", borderRadius: "10px", padding: "16px",
              overflowY: "auto"
            }}
          >
            <h2 id="modal-title">신청 폼</h2>
            <p id="modal-description">이메일과 FE 경력 연차등 간단한 정보를 입력해주세요.</p>

            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "16px"}}>
              <label htmlFor="name">이름/닉네임</label>
              <input ref={firstFieldRef} type="text" name="name" required id="name"  />

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

          </div>
        )}
      </div>
    </>
  );
};

export default ModalFormPage;