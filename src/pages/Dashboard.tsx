
export const Dashboard = () => {
  return (
    <div className="flex justify-start items-start gap-10 py-10 px-1 ml-0">
      {[
        {
          title: "Crear solicitud de viaje",
          iconPath:
            "M16.5 9.75V6a2.25 2.25 0 00-2.25-2.25h-4.5A2.25 2.25 0 007.5 6v3.75M3.75 9.75h16.5M6 9.75v10.5h12V9.75",
        },
        {
          title: "Historial de viajes",
          iconPath:
            "M8.25 6.75v-1.5a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v1.5m-8.25 0h9A2.25 2.25 0 0119.5 9v8.25A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V9a2.25 2.25 0 012.25-2.25zm5.25 3v4.5",
        },
        {
          title: "Solicitud de reembolso",
          iconPath:
            "M15.75 2.25v6M12 4.5h7.5M18 9.75V21a.75.75 0 01-.75.75H6.75A.75.75 0 016 21V3a.75.75 0 01.75-.75H12",
        },
      ].map(({ title, iconPath }, idx) => (
        <div
          key={idx}
          className="relative bg-[#F4F6F8] w-64 h-30 rounded-2xl shadow-md flex items-end justify-center pt-12 hover:shadow-lg transition-shadow duration-300 ease-in-out"
        >
          <div className="absolute -top-8 bg-[#2C64C6] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-9 h-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={iconPath}
              />
            </svg>
          </div>
          <p className="text-center text-[#001233] font-extrabold text-base pb-3 leading-tight px-2">
            {title}
          </p>
        </div>
      ))}
    </div>
  );
};
