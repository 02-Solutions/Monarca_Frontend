import { MdRefresh } from "react-icons/md";

const RefreshButton = () => {

    return (
        <button
            className="p-2 bg-white rounded-md shadow hover:bg-gray-100"
        >
            <MdRefresh className="h-6 w-6 text-[#0a2c6d]" />
        </button>
    )

}


export default RefreshButton;