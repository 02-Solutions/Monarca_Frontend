import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Hola
        </h5>
        <p className="font-normal text-gray-700">
          Pagina de inicio
        </p>
      </div>
    </Layout>
  );
}
