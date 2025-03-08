import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../service/store";

const ProtectedRoute: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const userId = useSelector((state: RootState) => state.auth.user_id);

    return token && userId ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
