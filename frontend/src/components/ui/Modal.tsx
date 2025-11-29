import { ReactNode, useEffect } from 'react';
import { modalStyles, modalClasses } from '../../styles/modalStyles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={modalClasses.overlay}
      style={modalStyles.overlay}
      onClick={onClose}
    >
      <div
        className={modalClasses.content}
        style={modalStyles.content}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalClasses.header} style={modalStyles.header}>
          {title && (
            <h2 className={modalClasses.title} style={modalStyles.title}>
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className={modalClasses.closeButton}
            style={modalStyles.closeButton}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={modalClasses.body}>
          {children}
        </div>
      </div>
    </div>
  );
};

