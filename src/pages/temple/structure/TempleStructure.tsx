import { Navigate } from 'react-router-dom';

export default function TempleStructure() {
  // Redirect to first sub-module
  return <Navigate to="/structure/temples" replace />;
}
