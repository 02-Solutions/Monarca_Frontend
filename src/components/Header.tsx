import { useState } from "react";
import { useAuth } from "../hooks/auth/authContext";

function Header() {
  const { handleLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-[var(--dark-blue)] text-[var(--white)]">
      <div className="px-3 py-5 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
              * titulo dinámico aquí *
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3 relative">
              <div className="flex items-center gap-8">
                <h2 className="uppercase text-3xl">
                  <span className="text-[var(--ultra-light-blue)]">M</span>onarca
                </h2>
                <button
                  type="button"
                  className="flex text-sm bg-[var(--ultra-light-blue)] p-2 rounded-full"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  NS
                </button>
              </div>
              {dropdownOpen &&
                <div
                  className="z-50 absolute top-[80%] left-[20%] my-4 text-base list-none bg-[var(--blue)] divide-y divide-[var(--white)] rounded-sm shadow-sm"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm text-[var(--gray)]">
                      Neil Sims
                    </p>
                    <p className="text-sm font-medium text-[var(--gray)] truncate">
                      neil.sims@flowbite.com
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <button 
                        type="button" 
                        className="block px-4 py-2 text-sm w-full text-[var(--white)] hover:bg-[var(--gray)] hover:text-[var(--blue)]"
                        onClick={handleLogout}
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
