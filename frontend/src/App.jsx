import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import EditForm from './pages/EditForm';
import FormSubmission from './pages/FormSubmission';
import ViewSubmissions from './pages/ViewSubmissions';
import PublicForms from './pages/PublicForms';
import CreateFolder from './pages/CreateFolder';
import FolderView from './pages/FolderView';
import FormResponses from './pages/FormResponses';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public-forms" element={<PublicForms />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/create-form" element={
            <PrivateRoute>
              <CreateForm />
            </PrivateRoute>
          } />
          <Route path="/edit-form/:id" element={
            <PrivateRoute>
              <EditForm />
            </PrivateRoute>
          } />
          <Route path="/form/:id" element={<FormSubmission />} />
          <Route path="/submissions/:id" element={
            <PrivateRoute>
              <ViewSubmissions />
            </PrivateRoute>
          } />
          <Route path="/create-folder" element={
            <PrivateRoute>
              <CreateFolder />
            </PrivateRoute>
          } />
          <Route path="/folder/:folderId" element={
            <PrivateRoute>
              <FolderView />
            </PrivateRoute>
          } />
          <Route path="/form-responses/:id" element={
            <PrivateRoute>
              <FormResponses />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 