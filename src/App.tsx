import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import LensPage from './pages/LensPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LensResultsPage from './pages/LensResultsPage';
import { SearchHistoryProvider } from './contexts/SearchHistoryContext';
// import SpeechRecognitionComponent from './SpeechRecognitionComponent';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/lens',
    element: <LensPage />,
  },
  {
    path: '/search',
    element: <SearchResultsPage />,
  },
  {
    path: '/lens-results',
    element: <LensResultsPage />,
  },
  // {
  //   path : '/speech',
  //   element : <SpeechRecognitionComponent/>
  // }
]);

export default function App() {
  return (
    <SearchHistoryProvider>
      <AnimatePresence mode="wait">
        <RouterProvider router={router} />
      </AnimatePresence>
    </SearchHistoryProvider>
  );
}
