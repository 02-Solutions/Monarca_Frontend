import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import Switch from "../ui/Switch";
import dayjs from "dayjs";

import { useForm, Controller, useFieldArray } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Select from "../ui/Select";
import FieldError from "../ui/FieldError";

type Option = { id: number | string; name: string };

const priorityOptions: Option[] = [
  { id: "alta", name: "Alta" },
  { id: "media", name: "Media" },
  { id: "baja", name: "Baja" },
];

const yesNo = [
  { id: true, name: "Sí" },
  { id: false, name: "No" },
];

const destinationSchema = z.object({
  destination_id: z.string().nonempty({ message: "Selecciona un destino" }),
  arrival_date: z.string().nonempty({ message: "Selecciona fecha de llegada" }),
  departure_date: z
    .string()
    .nonempty({ message: "Selecciona fecha de salida" }),
  stay_days: z.number().int().positive(),
  is_hotel_required: z.boolean(),
  is_plane_required: z.boolean(),
  is_last_destination: z.boolean(),
});

const formSchema = z.object({
  id_origin_city: z
    .string()
    .nonempty({ message: "Selecciona ciudad de origen" }),
  motive: z.string().nonempty({ message: "Escribe el motivo del viaje" }),
  priority: z.enum(["alta", "media", "baja"]),
  is_multi_user: z.boolean(),
  requirements: z.string().optional(),
  destinations: z.array(destinationSchema).min(1, "Al menos un destino"),
});

type FormValues = z.infer<typeof formSchema>;

function CreateTravelRequestForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_origin_city: "",
      motive: "",
      priority: "media",
      is_multi_user: false,
      requirements: "",
      destinations: [
        {
          destination_id: "",
          arrival_date: "",
          departure_date: "",
          stay_days: 1,
          is_hotel_required: false,
          is_plane_required: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "destinations",
  });

  const onSubmit = (data: FormValues) => {
    // post-procesar para que coincida 1:1 con tu BD -------------------
    const requestPayload = {
      id_origin_city: data.id_origin_city,
      motive: data.motive,
      is_multi_user: data.is_multi_user,
      status: "draft", // o lo que tu backend ponga por defecto
      requirements: data.requirements,
      priority: data.priority,
    };

    const destinationsPayload = data.destinations.map((dest, idx, arr) => ({
      destination_id: dest.destination_id,
      destination_order: idx + 1,
      stay_days: dest.stay_days,
      arrival_date: dayjs(dest.arrival_date).toISOString(),
      departure_date: dayjs(dest.departure_date).toISOString(),
      is_hotel_required: dest.is_hotel_required,
      is_plane_required: dest.is_plane_required,
      is_last_destination: idx === arr.length - 1,
    }));

    // 👉 aquí harías una única llamada (o dos) a tu API
    console.log({ requestPayload, destinationsPayload });
  };

  return (
    <section className="bg-gray-200 rounded-md">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 ">
          Datos del Viaje
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="motive"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Motivo
              </label>
              <Input {...register("motive")} />
              {errors.motive && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.motive.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Ciudad Origen
              </label>
              {/* placeholder hasta que cargues Destinations */}
              <Input {...register("id_origin_city")} placeholder="CDMX-MEX" />
              {errors.id_origin_city && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.id_origin_city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Prioridad
              </label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select
                    options={priorityOptions}
                    value={priorityOptions.find((o) => o.id === field.value)}
                    onChange={(opt) => field.onChange(opt.id)}
                  />
                )}
              />
              {errors.priority && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Viaje multidestino
              </label>
              <Controller
                control={control}
                name="is_multi_user"
                render={({ field }) => (
                  <Select
                    options={yesNo}
                    value={yesNo.find((o) => o.id === field.value)}
                    onChange={(opt) => field.onChange(opt.id)}
                  />
                )}
              />
              {errors.is_multi_user && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.is_multi_user.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Requerimientos
              </label>
              <TextArea rows={4} {...register("requirements")} />
              {errors.requirements && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.requirements.message}
                </p>
              )}
            </div>
          </div>
          <h3 className="mt-8 mb-4 text-lg font-semibold">Destinos</h3>

          {fields.map((field, idx) => {
            const destinationErrors = errors.destinations?.[idx];

            return (
              <div
                key={field.id}
                className="rounded-md p-4 mb-6 space-y-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Destino #{idx + 1}</span>
                  {fields.length > 1 && (
                    <Button type="button" onClick={() => remove(idx)}>
                      Quitar
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Destino
                    </label>
                    <Input
                      {...register(
                        `destinations.${idx}.destination_id` as const
                      )}
                      placeholder="PAR-CDG"
                    />
                    <FieldError
                      msg={destinationErrors?.destination_id?.message}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Fecha llegada
                    </label>
                    <Input
                      type="date"
                      {...register(`destinations.${idx}.arrival_date` as const)}
                    />
                    <FieldError
                      msg={destinationErrors?.arrival_date?.message}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Fecha salida
                    </label>
                    <Input
                      type="date"
                      {...register(
                        `destinations.${idx}.departure_date` as const
                      )}
                    />
                    <FieldError
                      msg={destinationErrors?.departure_date?.message}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      No. días estancia
                    </label>
                    <Input
                      type="number"
                      min={1}
                      {...register(`destinations.${idx}.stay_days` as const, {
                        valueAsNumber: true,
                      })}
                    />
                    <FieldError msg={destinationErrors?.stay_days?.message} />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      ¿Necesita hotel?
                    </label>
                    <Controller
                      control={control}
                      name={`destinations.${idx}.is_hotel_required` as const}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FieldError
                      msg={destinationErrors?.is_hotel_required?.message}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      ¿Necesita vuelo?
                    </label>
                    <Controller
                      control={control}
                      name={`destinations.${idx}.is_plane_required` as const}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FieldError
                      msg={destinationErrors?.is_plane_required?.message}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            onClick={() =>
              append({
                destination_id: "",
                arrival_date: "",
                departure_date: "",
                stay_days: 1,
                is_hotel_required: false,
                is_plane_required: true,
                is_last_destination: false,
              })
            }
          >
            + Añadir destino
          </Button>

          <Button type="submit" className="mt-4 sm:mt-6">
            Crear viaje
          </Button>
        </form>
      </div>
    </section>
  );
}
export default CreateTravelRequestForm;
