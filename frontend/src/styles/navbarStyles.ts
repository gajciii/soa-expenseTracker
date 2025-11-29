export const navbarStyles = {
  nav: {
    backgroundColor: 'var(--color-primary-dark)',
    borderRadius: '20px',
    margin: '2px 12px 16px 12px',
    left: 0,
    right: 0,
    width: 'calc(100% - 24px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  logoLink: {
    marginLeft: 0
  },
  logo: {
    display: 'block' as const
  },
  link: (isActive: boolean) => ({
    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
    color: 'var(--color-text-white)',
    ...(isActive ? {} : { opacity: 0.8 })
  }),
  label: {
    color: 'var(--color-text-white)',
    opacity: 0.9
  },
  input: {
    border: '1px solid var(--color-primary)',
    backgroundColor: 'var(--color-primary-dark)',
    color: 'var(--color-text-white)'
  }
};

export const navbarClasses = {
  nav: 'fixed z-50 py-4',
  container: 'flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-6 lg:px-8 gap-3 sm:gap-0',
  logoLink: 'no-underline hover:opacity-90 transition flex items-center',
  logo: 'h-6 sm:h-8 w-auto',
  linksContainer: 'flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto',
  linksWrapper: 'flex items-center gap-3 sm:gap-4 lg:gap-6',
  link: (isActive: boolean) => `px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 no-underline text-sm sm:text-base ${isActive ? 'font-semibold' : 'font-normal hover:opacity-80'}`,
  userInputContainer: 'flex items-center gap-2 sm:gap-3 w-full sm:w-auto',
  label: 'text-xs sm:text-sm font-medium whitespace-nowrap',
  input: 'px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-palette-blue-grey focus:border-transparent transition-all flex-1 sm:flex-initial sm:w-auto min-w-0'
};

