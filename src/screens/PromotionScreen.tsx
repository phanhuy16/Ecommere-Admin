import { AddPromotion } from "@/modals";
import { Button } from "antd";
import { useState } from "react";

const PromotionScreen = () => {
  const [isVisibleModalAddPromotion, setIsVisibleModalAddPromotion] =
    useState(false);

  return (
    <div>
      <Button onClick={() => setIsVisibleModalAddPromotion(true)}>
        Add Promotion
      </Button>
      <AddPromotion
        onAddNew={(val) => console.log(val)}
        visible={isVisibleModalAddPromotion}
        onClose={() => setIsVisibleModalAddPromotion(false)}
      />
    </div>
  );
};

export default PromotionScreen;
