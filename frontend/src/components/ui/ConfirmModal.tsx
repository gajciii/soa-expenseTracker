import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p style={{ color: 'var(--color-text-white)' }}>{message}</p>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary" size="md">
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} variant={variant} size="md">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};





