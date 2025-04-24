interface HeaderProps {
  title?: string;
}

function Header({ title = "* título dinámico aquí *" }: HeaderProps) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-[var(--dark-blue)] text-[var(--white)]">
      <div className="px-3 py-5 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
              {title}
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div className="flex items-center gap-8">
                <h2 className="uppercase text-3xl">
                  <span className="text-[var(--ultra-light-blue)]">M</span>onarca
                </h2>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                </button>
              </div>
              <div
                className="z-50 hidden my-4 text-base list-none bg-[var(--blue)] divide-y divide-[var(--white)] rounded-sm shadow-sm"
                id="dropdown-user"
              >
                <div className="px-4 py-3" role="none">
                  <p className="text-sm text-[var(--gray)]" role="none">Neil Sims</p>
                  <p className="text-sm font-medium text-[var(--gray)] truncate" role="none">
                    neil.sims@flowbite.com
                  </p>
                </div>
                <ul className="py-1" role="none">
                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-[var(--white)] hover:bg-[var(--gray)] hover:text-[var(--blue)]" role="menuitem">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-[var(--white)] hover:bg-[var(--gray)] hover:text-[var(--blue)]" role="menuitem">
                      Settings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-[var(--white)] hover:bg-[var(--gray)] hover:text-[var(--blue)]" role="menuitem">
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
