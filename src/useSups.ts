import React from "react";
import { SupContext, SupContextType, SupElements } from "./SupProvider";

function useSups<T extends SupElements = SupElements>() {
  return React.useContext(SupContext) as SupContextType<T>;
}

export default useSups;
