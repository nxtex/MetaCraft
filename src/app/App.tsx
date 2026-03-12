import { RouterProvider } from 'react-router';
import { router } from './routes';
import { GlobalTextures } from './components/GlobalTextures';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <GlobalTextures />
      <RouterProvider router={router} />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0E1219',
            border: '1px solid #C9A84C',
            color: '#EDE8DC',
            fontFamily: 'IBM Plex Mono, monospace',
          },
        }}
      />
    </>
  );
}

export default App;
