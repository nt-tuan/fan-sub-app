import React from "react";
import dataSource from "./lang.json";
import { Select } from "antd";

interface Props {
  availableLangs?: string[];
  value: string;
  onChange?: (value: string) => void;
}

const transform = ({ code, name }: { code: string; name: string }) => ({
  label: name,
  value: code,
});
const LangSelect = ({ availableLangs, value, onChange }: Props) => {
  const options = React.useMemo(() => {
    if (!availableLangs) return dataSource.map(transform);
    return dataSource
      .filter((lang) => availableLangs.includes(lang.code))
      .map(transform);
  }, [availableLangs]);
  return <Select options={options} value={value} onChange={onChange} />;
};
export default LangSelect;
