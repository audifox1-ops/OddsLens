import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import AgeGate from './components/AgeGate';
import { useAppStore } from './store/appStore';

export default function App() {
  return <RouterProvider router={router} />;
}
