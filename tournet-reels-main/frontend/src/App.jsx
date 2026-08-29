import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import MobileNavbar from './components/MobileNavbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ReelsPage from './pages/ReelsPage.jsx';
import SingleReelPage from './pages/SingleReelPage.jsx';
import UploadReel from './pages/UploadReel.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-dusk-950">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/reels" replace />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/reels/:id" element={<SingleReelPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadReel /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/reels" replace />} />
        </Routes>
      </main>
      <MobileNavbar />
    </div>
  );
}
