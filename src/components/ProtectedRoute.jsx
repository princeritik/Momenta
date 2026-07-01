import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
    const authStatus = useSelector(
        (state) => state.auth.status
    );

    if (!authStatus) {
        return <Navigate to="/login" />;
    }

    return children;
} 