import formatDate from "../../utils/formatDate";
import formatMoney from "../../utils/formatMoney";


interface FilePreviewerProps {
    file: {
        file_url_pdf: string;
        file_url_xml: string;
        class: string;
        amount: number;
        date: string;
        status: string;
    };
    fileIndex: number;
}



const FilePreviewer = ({ file, fileIndex }: FilePreviewerProps) => {
    return (
        <>
            <div className="grid grid-cols-3 w-full h-96 mb-4">
                <iframe
                  src={`${file.file_url_pdf}#navpanes=0&view=FitH`}
                  width="100%"
                  height="100%"
                  title={`Comprobante de Solicitud ${fileIndex + 1}`}
                  className="border-0 col-span-2"
                />

                <div className="flex flex-col bg-white p-6 gap-3 col-span-1">
                  <p id={`class-file-${fileIndex}`}><span className="font-semibold text-[var(--blue)]">Clase: </span>{file.class}</p>
                  <p id={`amount-file-${fileIndex}`}><span className="font-semibold text-[var(--blue)]">Cantidad: </span><span className="text-green-700">{formatMoney(file.amount)}</span></p>
                  <p id={`date-file-${fileIndex}`}><span className="font-semibold text-[var(--blue)]">Fecha: </span>{formatDate(file.date)}</p>
                  <p id={`status-file-${fileIndex}`}><span className="font-semibold text-[var(--blue)]">Estado: </span>{file.status}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-4">
                  <a
                    id={`download-file-xml-${fileIndex}`}
                    href={file.file_url_xml}
                    download={`comprobante${fileIndex + 1}.xml`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer"
                  >
                    Descargar XML
                  </a>
                  <a
                    id={`download-file-pdf-${fileIndex}`}
                    href={file.file_url_pdf}
                    download={`comprobante${fileIndex + 1}.pdf`}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 hover:cursor-pointer"
                  >
                    Descargar PDF
                  </a>
                </div>
              </div>
        </>
    )
}

export default FilePreviewer;