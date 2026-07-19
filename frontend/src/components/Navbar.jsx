import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  Search,
  Mic,
  Moon,
  Sun,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useUiStore } from "../stores/useUiStore";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();

  const { theme, toggleTheme, searchTerm, setSearchTerm } = useUiStore();

  const navigate = useNavigate();

  const [listening, setListening] = useState(false);

  const isAdmin = user?.role === "admin";

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("Listening...");
      setListening(true);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;

      console.log("Voice:", voiceText);

      // Put voice text inside search bar
      setSearchTerm(voiceText);
    };

    recognition.onerror = (event) => {
      console.log("Speech error:", event.error);
    };

    recognition.onend = () => {
      console.log("Stopped listening");
      setListening(false);
    };

    recognition.start();
  };

  return (
    <header
      className="
      fixed top-0 left-0 w-full z-50
      bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
      border-b border-gray-200 dark:border-emerald-800
      shadow-lg transition-colors duration-300
      "
    >
      <div className="container mx-auto px-4 py-3">
        {/* TOP NAVBAR */}
        <div className="flex items-center justify-between gap-5">
          {/* LOGO */}
          <Link
            to="/"
            className="
            text-3xl font-extrabold
            whitespace-nowrap
            "
          >
            {/* Dynamic brand name switching black <-> white */}
            <span className="text-gray-900 dark:text-white">Nep</span>
            <span className="text-emerald-500 dark:text-emerald-400">Cart</span>
          </Link>

          {/* SEARCH BAR */}
          <div
            className="
            hidden md:flex flex-1 max-w-xl
            relative
            "
          >
            <Search
              size={20}
              className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-gray-400 dark:text-gray-500
              "
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/category/all?search=${searchTerm}`);
                }
              }}
              placeholder="Search products..."
              className="
              w-full
              bg-gray-100 dark:bg-gray-800
              text-gray-900 dark:text-white
              rounded-full
              py-3
              pl-12
              pr-14
              border border-gray-300 dark:border-gray-700
              focus:outline-none
              focus:border-emerald-500
              "
            />

            <button
              onClick={startVoiceSearch}
              className={`
              absolute right-2 top-1/2
              -translate-y-1/2
              p-2 rounded-full
              text-white
              transition
              ${listening ? "bg-red-500" : "bg-emerald-500 hover:bg-emerald-600"}
              `}
            >
              <Mic size={18} />
            </button>
          </div>

          {/* RIGHT BUTTONS */}
          <nav
            className="
            flex items-center gap-3
            "
          >
            {/* THEME BUTTON */}
            <button
              onClick={toggleTheme}
              className="
              p-2 rounded-full
              bg-gray-200 dark:bg-gray-700
              hover:bg-gray-300 dark:hover:bg-gray-600
              text-gray-800 dark:text-white
              transition-colors
              "
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* CART */}
            {user && (
              <Link
                to="/cart"
                className="
                  relative
                  text-gray-600 dark:text-gray-300
                  hover:text-emerald-500 dark:hover:text-emerald-400
                  "
              >
                <ShoppingCart size={24} />

                {cart.length > 0 && (
                  <span
                    className="
                      absolute
                      -top-3
                      -right-3
                      bg-emerald-500
                      text-white
                      text-xs
                      rounded-full
                      px-2
                      py-1
                      "
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {/* ADMIN */}
            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="
                  hidden lg:flex
                  items-center
                  gap-1
                  bg-emerald-600 dark:bg-emerald-700
                  hover:bg-emerald-500 dark:hover:bg-emerald-600
                  px-3 py-2
                  rounded-md
                  text-white
                  "
              >
                <Lock size={18} />
                Dashboard
              </Link>
            )}

            {/* LOGIN LOGOUT */}
            {user ? (
              <button
                onClick={logout}
                className="
                flex items-center gap-2
                bg-gray-200 dark:bg-gray-700
                hover:bg-gray-300 dark:hover:bg-gray-600
                text-gray-800 dark:text-white
                px-3 py-2
                rounded-md
                transition-colors
                "
              >
                <LogOut size={18} />
                <span className="hidden sm:block">Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="
                  flex items-center gap-2
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  px-3 py-2
                  rounded-md
                  "
                >
                  <UserPlus size={18} />
                  <span className="hidden sm:block">Signup</span>
                </Link>

                <Link
                  to="/login"
                  className="
                  flex items-center gap-2
                  bg-gray-200 dark:bg-gray-700
                  hover:bg-gray-300 dark:hover:bg-gray-600
                  text-gray-800 dark:text-white
                  px-3 py-2
                  rounded-md
                  transition-colors
                  "
                >
                  <LogIn size={18} />
                  <span className="hidden sm:block">Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* SECOND MENU ROW */}
        <div
          className="
          flex justify-center
          border-t border-gray-200 dark:border-gray-800
          mt-3 pt-3
          "
        >
          <nav
            className="
            flex flex-wrap
            justify-center
            gap-6
            text-sm
            font-medium
            "
          >
            {[
              "Home",
              "Categories",
              "Deals",
              "New Arrivals",
              "About Us",
              "Contact",
            ].map((item) => (
              <Link
                key={item}
                to={item === "Categories" ? "/category/all" : "/"}
                className="text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
