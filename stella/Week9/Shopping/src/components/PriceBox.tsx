import { useEffect } from "react";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { CalculateTotals, type CartState } from "../slices/cartSlice";

const PriceBox = () => {
  const { total } = useSelector((state): CartState => state.cart);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CalculateTotals());
  });

  return <div className="p-12 flex justify-end">총 가격 {total}원</div>;
};

export default PriceBox;
