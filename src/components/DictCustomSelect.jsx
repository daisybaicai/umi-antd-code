import { Select } from "antd";
import React from "react";

const DictCustomSelect = React.memo(
  React.forwardRef(({ data, value, onChange, placeholder, ...rest }, ref) => {
    return (
      <Select value={value} onChange={onChange} ref={ref} {...rest}>
        {Object.keys(data).map((k) => (
          <Select.Option key={data[k].desc} value={data[k].code}>
            {data[k].desc}
          </Select.Option>
        ))}
      </Select>
    );
  })
);

export default DictCustomSelect;
