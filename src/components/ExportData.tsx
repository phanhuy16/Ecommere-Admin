import handleAPI from "@/apis/handleAPI";
import { colors } from "@/constants/color";
import { Button, Card, Spin } from "antd";
import { useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { saveAs } from "file-saver";

const ExportData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExcel = async () => {
    setIsLoading(true);

    const api = "/Suppliers/export-excel";

    try {
      const res = await handleAPI(api);

      const byteCharacters = atob(res.data.fileContents);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Convert byte array to a blob
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: res.data.contentType });

      saveAs(blob, res.data.fileDownloadName);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePDF = async () => {};

  return (
    <div>
      <Card className="shadow" title="Download" size="small">
        {isLoading ? (
          <Spin />
        ) : (
          <div className="row m-0">
            <div className="col">
              <Button
                type="default"
                icon={
                  <PiMicrosoftExcelLogoDuotone
                    size={22}
                    color={colors.gray600}
                  />
                }
                onClick={handleExcel}
              >
                Print Excel
              </Button>
            </div>
            <div className="col">
              <Button
                type="default"
                icon={<FaRegFilePdf size={18} color={colors.gray600} />}
                onClick={handlePDF}
              >
                Print PDF
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExportData;
