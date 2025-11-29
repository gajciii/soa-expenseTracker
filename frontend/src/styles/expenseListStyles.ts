export const expenseListStyles = {
  title: {
    color: 'var(--color-text-primary)'
  },
  error: {
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid var(--color-primary-dark)',
    color: 'var(--color-text-primary)'
  },
  loading: {
    color: 'var(--color-text-primary)'
  },
  empty: {
    color: 'var(--color-text-primary)',
    opacity: 0.7
  },
  subtitle: {
    color: 'var(--color-text-primary)'
  }
};

export const expenseListClasses = {
  container: '',
  header: 'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6',
  title: 'text-xl sm:text-2xl font-bold',
  buttonsContainer: 'flex gap-2',
  error: 'mb-4 p-4 rounded-lg',
  filtersContainer: 'mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-end',
  filterInput: 'w-full sm:flex-1 sm:min-w-[200px]',
  loading: 'text-center py-12',
  content: '',
  subtitle: 'text-lg font-semibold mb-4',
  empty: 'text-center py-12 italic',
  itemsContainer: 'space-y-4'
};

