import handleAPI from "@/apis/handleAPI";
import { FormModel } from "@/models/FormModel";
import { DateTime } from "@/utils/dateTime";
import { handleExportExcel } from "@/utils/handleExportExcel";
import {
  Checkbox,
  DatePicker,
  Divider,
  List,
  message,
  Modal,
  Space,
} from "antd";
import { useEffect, useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  api: string;
  name?: string;
}

const { RangePicker } = DatePicker;

const ModalExportData = (props: Props) => {
  const { visible, onClose, api, name } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [forms, setForms] = useState<FormModel>();
  const [checkedValue, setCheckedValue] = useState<string[]>([]);
  const [timeSelected, setTimeSelected] = useState<string>("ranger");
  const [dates, setDates] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    if (visible) {
      getForms();
    }
  }, [visible, api]);

  const getForms = async () => {
    const url = `/${api}/get-form`;
    setIsGetting(true);
    try {
      const res: any = await handleAPI(url);
      res.value.form && setForms(res.value.form);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGetting(false);
    }
  };

  const handleChangeCheckedValue = (val: string) => {
    const items = [...checkedValue];
    const index = items.findIndex((element) => element === val);

    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(val);
    }

    setCheckedValue(items);
  };

  const handleExport = async () => {
    let url = ``;
    if (timeSelected !== "all" && dates.start && dates.end) {
      if (new Date(dates.start).getTime() > new Date(dates.end).getTime()) {
        message.error("Time error");
      } else {
        url = `/${api}/get-export-data?start=${dates.start}&end=${dates.end}`;
      }
    } else {
      url = `/${api}/get-export-data`;
    }

    const data = checkedValue;
    if (Object.keys(data).length > 0) {
      setIsLoading(true);

      try {
        const res: any = await handleAPI(url, data, "post");

        res && (await handleExportExcel(res, api));

        onClose();
      } catch (error: any) {
        message.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      message.error("Please select 1 key of value");
    }
  };

  return (
    <Modal
      loading={isGetting}
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      onOk={handleExport}
      okButtonProps={{
        loading: isLoading,
      }}
      title="Export to excel"
    >
      <div>
        <div>
          <Checkbox
            checked={timeSelected === "all"}
            onChange={() =>
              setTimeSelected(timeSelected === "all" ? "ranger" : "all")
            }
          >
            Get all
          </Checkbox>

          <Checkbox
            checked={timeSelected === "ranger"}
            onChange={() =>
              setTimeSelected(timeSelected === "ranger" ? "all" : "ranger")
            }
          >
            Date ranger
          </Checkbox>
        </div>
        <div>
          {timeSelected === "ranger" && (
            <Space>
              <RangePicker
                onChange={(val: any) => {
                  setDates(
                    val && val[0] && val[1]
                      ? {
                          start: `${DateTime.CalendarDate(val[0])} 00:00:00`,
                          end: `${DateTime.CalendarDate(val[1])} 00:00:00`,
                        }
                      : {
                          start: "",
                          end: "",
                        }
                  );
                }}
              />
            </Space>
          )}
        </div>
      </div>
      <Divider />
      <div className="mt-2">
        <List
          dataSource={forms?.formItem}
          renderItem={(item) => (
            <List.Item key={item.key}>
              <Checkbox
                checked={checkedValue.includes(item.value)}
                onChange={() => handleChangeCheckedValue(item.value)}
              >
                {item.label}
              </Checkbox>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default ModalExportData;
