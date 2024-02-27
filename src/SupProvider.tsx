import React from "react";

type SupElement = { key: string; value: string };
type SupElementWithIndex<K extends string> = {
  key: K;
  value: string;
  index: number;
};
type SupElements = ReadonlyArray<SupElement>;

type SupKey<T extends SupElements = SupElements> = T[number]["key"];

type SupProviderProps<T extends SupElements> = {
  children: React.ReactNode;
  sups: T;
};

type SupContextType<T extends SupElements = SupElements> = {
  use: (key: SupKey<T>) => number;
  sups: SupElementWithIndex<SupKey<T>>[];
};

const SupContext = React.createContext<SupContextType<any>>({
  use: () => 0,
  sups: [],
});

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

  const [usedSups, setUsedSups] = React.useState<
    SupElementWithIndex<SupKey<T>>[]
  >([]);

  React.useEffect(() => {
    const newSups = sups.filter(({ key }) =>
      usedRef.current.includes(key as unknown as SupKey<T>)
    );
    const newSupKeys = newSups.map(({ key }) => key);
    const usedSupsKeys = usedSups.map(({ key }) => key);
    if (
      newSupKeys.length === usedSupsKeys.length &&
      newSupKeys.every((key, index) => usedSupsKeys[index] === key)
    ) {
      // No change
      return;
    }
    setUsedSups(newSups.map((sup, index) => ({ ...sup, index: index + 1 })));
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

export { SupContext };
export type { SupElement, SupElements, SupContextType };
export default SupProvider;
