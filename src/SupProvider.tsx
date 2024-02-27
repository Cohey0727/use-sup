import React, { useMemo } from "react";

type SupElement = { key: string; value: string };
type SupElements = SupElement[];

type SupKey<T extends SupElements = SupElements> = T[number]["key"][];

type SupProviderProps<T extends SupElements> = {
  children: React.ReactNode;
  sups: T;
};

type SupContextType<T extends SupElements = SupElements> = {
  use: (key: SupKey<T>) => number;
  sups: T[number][];
};

const SupContext = useMemo(
  () =>
    React.createContext<SupContextType<any>>({
      use: () => 0,
      sups: [],
    }),
  []
);

function SupProvider<T extends SupElements = SupElements>(
  props: SupProviderProps<T>
) {
  const { sups, children } = props;
  const usedRef = React.useRef<SupKey<T>[]>([]);

  const use = React.useCallback((key: SupKey<T>) => {
    if (usedRef.current.includes(key)) {
      return usedRef.current.indexOf(key) + 1;
    }
    usedRef.current = [...usedRef.current, key];
    return usedRef.current.length;
  }, []);

  const [usedSups, setUsedSups] = React.useState<T[number][]>([]);

  React.useEffect(() => {
    const newSups = sups.filter(({ key }) =>
      usedRef.current.includes(key as unknown as SupKey<T>)
    );
    if (
      newSups.every((a) => usedSups.includes(a)) &&
      newSups.length === usedSups.length
    ) {
      // No change
      return;
    }
    setUsedSups(newSups);
    () => {
      usedRef.current = [];
    };
  });

  return (
    <SupContext.Provider value={{ use, sups: usedSups }}>
      {children}
    </SupContext.Provider>
  );
}

export { SupElement, SupElements, SupContext, SupContextType };
export default SupProvider;
