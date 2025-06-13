import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import Switch from "../ui/Switch";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "../ui/Select";
import FieldError from "../ui/FieldError";
import { useCreateTravelRequest } from "../../hooks/requests/useCreateRequest";
import { useUpdateTravelRequest } from "../../hooks/requests/useUpdateRequest";
import { useDestinations } from "../../hooks/destinations/useDestinations";
import { CreateRequest } from "../../types/requests";
import GoBack from "../GoBack";
import { useEffect } from "react";

type Option = { id: number | string; name: string };

const priorityOptions: Option[] = [
  { id: "alta", name: "Alta" },
  { id: "media", name: "Media" },
  { id: "baja", name: "Baja" },
];

const destinationSchema = z.object({
  id_destination: z.string().nullable(),
  arrival_date: z.string().nonempty({ message: "Selecciona fecha de llegada" }),
  departure_date: z
    .string()
    .nonempty({ message: "Selecciona fecha de salida" }),
  stay_days: z.number().int(),
  // .positive({ message: "El número de días debe ser positivo" }),
  is_hotel_required: z.boolean(),
  is_plane_required: z.boolean(),
  details: z.string().nonempty({ message: "Agrega detalles" }),
});

const formSchema = z.object({
  id_origin_city: z.string().nullable(),
  motive: z.string().nonempty({ message: "Escribe el motivo del viaje" }),
  title: z.string().nonempty({ message: "Escribe el título del viaje" }),
  priority: z.enum(["alta", "media", "baja"]),
  requirements: z.string().optional(),
  advance_money: z
    .number()
    .int()
    .positive({ message: "El dinero adelantado debe ser positivo" }),
  requests_destinations: z
    .array(destinationSchema)
    .min(1, "Al menos un destino"),
});

type RawFormValues = z.infer<typeof formSchema>;

interface TravelRequestFormProps {
  initialData?: CreateRequest;
  requestId?: string;
}

interface DestinationFieldsProps {
  idx: number;
  control: Control<RawFormValues>;
  register: UseFormRegister<RawFormValues>;
  destinationOptions: { id: string | number; name: string }[];
  errors: FieldErrors<RawFormValues>["requests_destinations"];
  remove: (index: number) => void;
  setValue: UseFormSetValue<RawFormValues>;
  isLoadingDestinations: boolean;
}

function DestinationFields({
  idx,
  control,
  register,
  destinationOptions,
  errors,
  remove,
  setValue,
  isLoadingDestinations,
}: DestinationFieldsProps) {
  const arrivalDate = useWatch({
    control,
    name: `requests_destinations.${idx}.arrival_date`,
  });

  const departureDate = useWatch({
    control,
    name: `requests_destinations.${idx}.departure_date`,
  });

  const stayDays =
    arrivalDate && departureDate
      ? dayjs(arrivalDate).diff(dayjs(departureDate), "day")
      : 0;

  useEffect(() => {
    setValue(`requests_destinations.${idx}.stay_days`, stayDays);
  }, [arrivalDate, departureDate, idx, setValue, stayDays]);

  const destinationErrors = errors?.[idx];

  return (
    <div className="rounded-md p-4 mb-6 space-y-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <span className="font-medium">Destino #{idx + 1}</span>
        {idx > 0 && (
          <Button type="button" onClick={() => remove(idx)}>
            Quitar
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`destination-${idx}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Destino
          </label>
          <Controller
            control={control}
            name={`requests_destinations.${idx}.id_destination`}
            render={({ field }) => (
              <Select
                id={`destination-${idx}`}
                options={destinationOptions}
                value={
                  field.value
                    ? destinationOptions.find((o) => o.id === field.value)
                    : null
                }
                onChange={(opt) => field.onChange(opt.id)}
                isLoading={isLoadingDestinations}
                placeholder="Selecciona destino"
              />
            )}
          />
          <FieldError msg={destinationErrors?.id_destination?.message} />
        </div>

        <div>
          <label
            htmlFor={`details-${idx}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Detalles
          </label>
          <Input
            id={`details-${idx}`}
            {...register(`requests_destinations.${idx}.details`)}
          />
          <FieldError msg={destinationErrors?.details?.message} />
        </div>

        <div>
          <label
            htmlFor={`departure-${idx}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Fecha salida
          </label>
          <Controller
            control={control}
            name={`requests_destinations.${idx}.departure_date`}
            render={({ field }) => (
              <Input
                id={`departure-${idx}`}
                type="date"
                value={field.value ? dayjs(field.value).format("YYYY-MM-DD") : ""}
                onChange={e => field.onChange(e.target.value)}
              />
            )}
          />
          <FieldError msg={destinationErrors?.departure_date?.message} />
        </div>

        <div>
          <label
            htmlFor={`arrival-${idx}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Fecha llegada
          </label>
          <Controller
            control={control}
            name={`requests_destinations.${idx}.arrival_date`}
            render={({ field }) => (
              <Input
                id={`arrival-${idx}`}
                type="date"
                value={field.value ? dayjs(field.value).format("YYYY-MM-DD") : ""}
                onChange={e => field.onChange(e.target.value)}
              />
            )}
          />
          <FieldError msg={destinationErrors?.arrival_date?.message} />
        </div>

        <div>
          <label
            htmlFor={`stay-days-${idx}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            No. días estancia
          </label>
          <Input
            id={`stay-days-${idx}`}
            type="number"
            value={stayDays}
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor={`hotel-${idx}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            ¿Necesita hotel?
          </label>
          <Controller
            control={control}
            name={`requests_destinations.${idx}.is_hotel_required`}
            render={({ field }) => (
              <Switch
                id={`hotel-${idx}`}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div>
          <label
            htmlFor={`plane-${idx}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            ¿Necesita vuelo?
          </label>
          <Controller
            control={control}
            name={`requests_destinations.${idx}.is_plane_required`}
            render={({ field }) => (
              <Switch
                id={`plane-${idx}`}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

function TravelRequestForm({ initialData, requestId }: TravelRequestFormProps) {
  const navigate = useNavigate();
  const { destinationOptions, isLoading: isLoadingDestinations } =
    useDestinations();
  const { createTravelRequestMutation, isPending: isCreating } =
    useCreateTravelRequest();
  const { updateTravelRequestMutation, isPending: isUpdating } =
    useUpdateTravelRequest();

  const isEditing = !!requestId;
  const isPending = isEditing ? isUpdating : isCreating;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RawFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      id_origin_city: null,
      motive: "",
      title: "",
      priority: "media",
      advance_money: 0,
      requirements: "",
      requests_destinations: [
        {
          id_destination: null,
          arrival_date: "",
          departure_date: "",
          stay_days: 1,
          is_hotel_required: true,
          is_plane_required: true,
          details: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requests_destinations",
  });

  const onSubmit = async (data: RawFormValues) => {
    if (!data.id_origin_city) {
      toast.error("Selecciona una ciudad de origen");
      return;
    }

    const hasInvalidStay = data.requests_destinations.some((d) => {
      const diff = dayjs(d.arrival_date).diff(dayjs(d.departure_date), "day");
      return diff <= 0;
    });

    if (hasInvalidStay) {
      toast.error("Los días de estancia deben ser positivos", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const requests_destinations = data.requests_destinations.map(
      (d, idx, arr) => {
        if (!d.id_destination) {
          throw new Error("Selecciona un destino");
        }

        return {
          id_destination: d.id_destination,
          destination_order: idx + 1,
          stay_days: d.stay_days,
          arrival_date: dayjs(d.arrival_date).toISOString(),
          departure_date: dayjs(d.departure_date).toISOString(),
          is_hotel_required: d.is_hotel_required,
          is_plane_required: d.is_plane_required,
          is_last_destination: idx === arr.length - 1,
          details: d.details,
        };
      }
    );

    const payload = {
      id_origin_city: data.id_origin_city,
      title: data.motive,
      motive: data.motive,
      requirements: data.requirements || undefined,
      priority: data.priority,
      advance_money: data.advance_money,
      requests_destinations,
    };

    try {
      if (isEditing && requestId) {
        await updateTravelRequestMutation({ requestId, payload });
        toast.success("¡Solicitud de viaje actualizada exitosamente!");
      } else {
        await createTravelRequestMutation(payload);
        toast.success("¡Solicitud de viaje creada exitosamente!");
      }

      reset();
      navigate("/dashboard");
    } catch (error) {
      let errorMessage = isEditing
        ? "Error al actualizar la solicitud de viaje"
        : "Error al crear la solicitud de viaje";

      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <GoBack />
      <section className="bg-gray-200 rounded-md mb-10">
        <div className="p-10 mx-auto">
          <h2 className="text-2xl font-bold text-[var(--blue)] mt-0 mb-4">
            {isEditing ? "Editar Viaje" : "Datos del Viaje"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="motive"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Motivo
                </label>
                <Input
                  id="motive"
                  {...register("motive")}
                  placeholder="Viaje de Negocios"
                />
                <FieldError msg={errors.motive?.message} />
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Título
                </label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Viaje a CDMX"
                />
                <FieldError msg={errors.title?.message} />
              </div>

              <div>
                <label
                  htmlFor="id_origin_city"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Ciudad Origen
                </label>
                <Controller
                  control={control}
                  name="id_origin_city"
                  render={({ field }) => (
                    <Select
                      id="id_origin_city"
                      options={destinationOptions}
                      value={
                        field.value
                          ? destinationOptions.find((o) => o.id === field.value)
                          : null
                      }
                      onChange={(opt) => field.onChange(opt.id)}
                      isLoading={isLoadingDestinations}
                      placeholder="Selecciona ciudad de origen"
                    />
                  )}
                />
                <FieldError msg={errors.id_origin_city?.message} />
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Prioridad
                </label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select
                      id="priority"
                      options={priorityOptions}
                      value={priorityOptions.find((o) => o.id === field.value)}
                      onChange={(opt) => field.onChange(opt.id)}
                      placeholder="Selecciona prioridad"
                    />
                  )}
                />
                <FieldError msg={errors.priority?.message} />
              </div>

              <div>
                <label
                  htmlFor="advance_money"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Dinero adelantado
                </label>
                <Input
                  id="advance_money"
                  type="number"
                  {...register("advance_money", { valueAsNumber: true })}
                />
                <FieldError msg={errors.advance_money?.message} />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="requirements"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Requisitos adicionales
                </label>
                <TextArea
                  id="requirements"
                  {...register("requirements")}
                  placeholder="Requisitos adicionales del viaje"
                />
              </div>
            </div>

            <h3 className="mt-8 mb-4 text-lg font-semibold">Destinos</h3>
            {fields.map((field, idx) => (
              <DestinationFields
                key={field.id}
                idx={idx}
                control={control}
                register={register}
                destinationOptions={destinationOptions}
                errors={errors.requests_destinations}
                remove={remove}
                setValue={setValue}
                isLoadingDestinations={isLoadingDestinations}
              />
            ))}

            <Button
              type="button"
              onClick={() =>
                append({
                  id_destination: null,
                  arrival_date: "",
                  departure_date: "",
                  stay_days: 1,
                  is_hotel_required: false,
                  is_plane_required: true,
                  details: "",
                })
              }
            >
              + Añadir destino
            </Button>

            <Button type="submit" className="mt-4 sm:mt-6" disabled={isPending}>
              {isPending
                ? isEditing
                  ? "Actualizando..."
                  : "Creando..."
                : isEditing
                ? "Actualizar viaje"
                : "Crear viaje"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default TravelRequestForm;
