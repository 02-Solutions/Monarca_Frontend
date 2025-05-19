
import { Link } from "react-router-dom";

interface SidebarOptionProps {
    label: string;
    pathIcon: string;
    link: string;
}

const SidebarOption = ({ label, pathIcon, link }: SidebarOptionProps) => {

    return (
        <li>
            <Link
              to={link}
              className="group flex items-center p-2 text-[var(--dark-blue)] text-sm rounded-lg hover:bg-[var(--blue)] hover:text-[var(--white)] gap-2"
            >
              <img
                src={pathIcon}
                alt={label}
                className="w-6 h-6 group-hover:invert-0 invert"
              />
              <span className="whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_80%,transparent)] w-[130px]">{label}</span>
            </Link>
          </li>
    )
};


export default SidebarOption;