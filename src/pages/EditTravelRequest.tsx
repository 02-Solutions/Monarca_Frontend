import { useParams } from "react-router-dom";
import TravelRequestForm from "../components/travel-requests/TravelRequestForm";
import { useGetRequest } from "../hooks/requests/useGetRequest";

function EditTravelRequest() {
  const { id } = useParams<{ id: string }>();
  const { data: travelRequest, isLoading } = useGetRequest(id!);

  console.log(travelRequest);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!travelRequest) {
    return <div>No se encontró la solicitud de viaje</div>;
  }

  return (
    <div>
      <TravelRequestForm requestId={id} initialData={travelRequest} />
    </div>
  );
}

export default EditTravelRequest;
