import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import AgeGate from './components/AgeGate';
import { useAppStore } from './store/appStore';

export default function App() {
  const ageVerified = useAppStore(s => s.ageVerified);

  return (
    <>
      {!ageVerified && <AgeGate />}
      {ageVerified && <RouterProvider router={router} />}
    </>
  );
}
