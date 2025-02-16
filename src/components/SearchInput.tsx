import { useCallback, useState } from "react";
import { Input } from "./ui/input";

interface SearchInputParams {
  value?: string
  onChange: (value: string) => void;
}

export default function SearchInput(props: SearchInputParams) {
  const { value, onChange } = props;
  const [keyword, setKeyword] = useState(value ? value : "");

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setKeyword(newValue);
      onChange(newValue)
    },
    [onChange]
  );

  return (
    <div>
      <Input name="search" placeholder="Search ..." onChange={onChangeHandler} value={keyword} />
    </div>
  );
}
