

interface FilePreviewerProps {
    file: {
        file_url_pdf: string;
        file_url_xml: string;
    };
    fileIndex: number;
}



const FilePreviewer = ({ file, fileIndex }: FilePreviewerProps) => {
    return (
        <>
            <div className="w-full h-96 mb-4">
                <iframe
                  src={file.file_url_pdf}
                  width="100%"
                  height="100%"
                  title={`Comprobante de Solicitud ${fileIndex + 1}`}
                  className="border-0"
                />
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-4">
                  <a
                    href={file.file_url_xml}
                    download={`comprobante${fileIndex + 1}.xml`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer"
                  >
                    Descargar XML
                  </a>
                  <a
                    href={file.file_url_pdf}
                    download={`comprobante${fileIndex + 1}.pdf`}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 hover:cursor-pointer"
                  >
                    Descargar PDF
                  </a>
                </div>



                {/* <div className="flex space-x-4">
                    <button
                      // onClick={() => changeFile(fileIndex - 1)}
                      ref={prevRef}
                      // disabled={fileIndex === 0}
                      // className={`px-4 py-2 rounded-md hover:cursor-pointer ${
                      //   fileIndex === 0
                      //     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      //     : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      // }`}
                    >
                      Anterior
                    </button>
                    <button
                      // onClick={() => changeFile(fileIndex + 1)}
                      // disabled={fileIndex === fileUrls.length - 1}
                      ref={nextRef} 
                      // className={`px-4 py-2 rounded-md hover:cursor-pointer ${
                      //   fileIndex === fileUrls.length - 1
                      //     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      //     : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      // }`}
                    >
                      Siguiente
                    </button>
                </div> */}
              </div>
        </>
    )
}

export default FilePreviewer;