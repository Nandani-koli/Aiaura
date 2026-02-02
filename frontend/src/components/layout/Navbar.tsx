// Navbar component
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold">
                <h1 onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    AIAura
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {user && (
                    <>
                        <span className="text-sm">Welcome, {user.name || user.email || "User"}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                        >
                            Logout
                        </button>

                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;