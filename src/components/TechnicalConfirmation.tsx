import { useId, useLayoutEffect, useRef } from "react";
import RetroIcon from "./RetroIcon";

export default function TechnicalConfirmation({ onDismiss, onConfirm }: {
  onDismiss: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const messageId = useId();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    // Native modality makes the rest of the page inert and contains Tab focus.
    dialog?.showModal();
    cancelRef.current?.focus();
    return () => {
      if (dialog?.open) dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="technical-confirmation"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onDismiss(); }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onDismiss();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
          const current = buttons.findIndex((button) => button === document.activeElement);
          buttons[current === 0 ? 1 : 0]?.focus();
        }
      }}
    >
      <header className="technical-confirmation-title"><RetroIcon name="help" size={24} /><h2 id={titleId}>Are you sure?</h2></header>
      <div className="technical-confirmation-body">
        <p id={messageId}>You're entering nerd territory. Things are about to get considerably more technical. Continue?</p>
        <div className="technical-confirmation-actions">
          <button type="button" className="bevel-button" ref={cancelRef} onClick={onDismiss}>Never mind</button>
          <button type="button" className="bevel-button" onClick={onConfirm}>I'm sure</button>
        </div>
      </div>
    </dialog>
  );
}
