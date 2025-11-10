import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(() => auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading)
    return <p className="text-center mt-10">Checking user session...</p>;

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}
