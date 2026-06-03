import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrgTree() {
  const navigate = useNavigate();

  // Compatibility route: redirect to the Organization module's Org Tree tab
  useEffect(() => {
    navigate('/hr/organization?tab=orgtree', { replace: true });
  }, [navigate]);

  return null;
}
