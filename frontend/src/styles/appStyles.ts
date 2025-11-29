export const appStyles = {
  background: (bgImage: string) => ({
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    zIndex: 0
  })
};

export const appClasses = {
  background: 'min-h-screen fixed inset-0',
  content: 'relative z-10 min-h-screen',
  main: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'
};

