import handleAPI from "@/apis/handleAPI";
import { message } from "antd";
import saveAs from "file-saver";


export const handleExportExcel = async (api: string) => {


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
  } catch (error: any) {
    message.error(error.message);
  }
};
