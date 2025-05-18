import { useNavigate } from "react-router-dom";

const GoBack = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            aria-label="Regresar"
            type="button"
            className="mb-6 text-sm w-fit text-[var(--blue)] hover:text-[var(--dark_blue)] flex items-center gap-2 justify-center"

        >
            <span className="text-xl">&larr;</span> Regresar
        </button>
    )
}

export default GoBack;