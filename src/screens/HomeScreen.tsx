import { StatisticComponent } from "@/components";
import { colors } from "@/constants/color";
import { StatisticModel } from "@/models/StatisticModel";
import { LiaCoinsSolid } from "react-icons/lia";

const HomeScreen = () => {
  const salesData: StatisticModel[] = [
    {
      key: "sales",
      descriptions: "Sales",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "curency",
    },
    {
      key: "revenue",
      descriptions: "Revenue",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "number",
    },
    {
      key: "profit",
      descriptions: "Profit",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "curency",
    },
    {
      key: "cost",
      descriptions: "Cost",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "number",
    },
  ];

  const inventoryDatas: StatisticModel[] = [
    {
      key: "profit",
      descriptions: "Profit",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "curency",
      type: "vertical",
    },
    {
      key: "cost",
      descriptions: "Cost",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "number",
      type: "vertical",
    },
  ];
  return (
    <div>
      <div className="row">
        <div className="col-md-8">
          <StatisticComponent datas={salesData} title="Sales Overview" />
          <StatisticComponent datas={salesData} title="Sales Overview" />
        </div>
        <div className="col-md-4">
          <StatisticComponent
            datas={inventoryDatas}
            title="Inventory Summary"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
