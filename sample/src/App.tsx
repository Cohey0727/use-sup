import { useSups, SupProvider } from "../lib";

const sups = [
  {
    key: "foo",
    value: "bar",
  },
  {
    key: "baz",
    value: "qux",
  },
] as const;

type Sups = typeof sups;

function App() {
  return (
    <SupProvider sups={sups}>
      <Main />
      <ReferenceList />
    </SupProvider>
  );
}

function Main() {
  const { use } = useSups<Sups>();
  return (
    <div>
      {`This is a bar*${use("foo")}`}
      {`This is a qux*${use("baz")}`}
    </div>
  );
}

function ReferenceList() {
  const { sups } = useSups<Sups>();
  return (
    <ul>
      {sups.map((sup) => (
        <li key={sup.key}>{`${sup.index} ${sup.value}`}</li>
      ))}
    </ul>
  );
}

export default App;
