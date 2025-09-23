import { Navigate } from "react-router-dom";
import { getauth} from '../Utils/auth'
export default function PrivateRoute({ children }) {
  const auth = getauth();
  return auth?.token ? children : <Navigate to="/login" />;
}

