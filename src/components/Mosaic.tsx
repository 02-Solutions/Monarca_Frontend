import { Link } from "react-router-dom"

interface MosaicProps {
  title: string;
  iconPath: string;
  link: string;
}

const Mosaic = ({ title, iconPath, link}: MosaicProps) => {


    return (
        <Link to={link}>
          <div
          className="relative bg-[#F4F6F8] w-64 h-30 rounded-2xl shadow-md flex items-end justify-center pt-12 hover:shadow-lg transition-shadow duration-300 ease-in-out"
        >
          <div className="absolute -top-8 bg-[#2C64C6] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
            <img src={iconPath} alt={title} />
          </div>
          <p className="text-center text-[#001233] font-extrabold text-base pb-3 leading-tight px-2">
            {title}
          </p>
        </div>
        </Link>
    )
}

export default Mosaic;