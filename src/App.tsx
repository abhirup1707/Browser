import React from 'react';
import { useBookingStore } from './store/bookingStore';
import { CinemaExperience } from './pages/CinemaExperience';
import { Home } from './pages/Home';
import { TheatresPage } from './pages/TheatresPage';
import { OffersPage } from './pages/OffersPage';
import { SearchModal } from './components/SearchModal';
import './styles/cinema.css';

export const App: React.FC = () => {
  const currentView = useBookingStore((s) => s.currentView);

  return (
    <div className="w-full h-full bg-[#0a0c10] text-white overflow-hidden">
      {/* Dynamic View Switcher */}
      {currentView === 'experience' && <CinemaExperience />}
      {currentView === 'catalog' && <Home />}
      {currentView === 'theatres' && <TheatresPage />}
      {currentView === 'offers' && <OffersPage />}

      {/* Global Search Dialog */}
      <SearchModal />
    </div>
  );
};

export default App;
