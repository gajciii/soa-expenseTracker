export const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)'
  },
  content: {
    backgroundColor: 'rgba(28, 15, 19, 0.95)',
    border: '1px solid var(--color-border)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
  },
  header: {
    backgroundColor: 'rgba(28, 15, 19, 0.98)',
    borderColor: 'var(--color-border)',
    zIndex: 10
  },
  title: {
    color: 'var(--color-text-white)'
  },
  closeButton: {
    color: 'var(--color-text-white)'
  }
};

export const modalClasses = {
  overlay: 'fixed inset-0 z-50 flex items-center justify-center p-4',
  content: 'relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl',
  header: 'sticky top-0 flex justify-between items-center p-4 sm:p-6 border-b',
  title: 'text-xl sm:text-2xl font-bold',
  closeButton: 'ml-auto text-xl sm:text-2xl font-bold leading-none hover:opacity-70 transition-opacity',
  body: 'p-4 sm:p-6'
};


