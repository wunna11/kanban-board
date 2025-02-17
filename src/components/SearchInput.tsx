import { useCallback } from "react";
import { Input } from "./ui/input";

interface SearchInputParams {
  name: string
  value: string
  onChange:(value: string) => void
}

export default function SearchInput(props: SearchInputParams) {

  const { name, value, onChange } = props;

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );


  return (
    <div className="w-1/2">
      <Input
        type="search"
        placeholder="Search ..."
        name={name}
        value={value}
        onChange={handleOnChange}
      />
    </div>
  )
}