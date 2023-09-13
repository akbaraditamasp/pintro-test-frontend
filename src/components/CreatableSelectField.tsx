import { ComponentProps, ReactNode } from "react";
import {
  ControlProps,
  MenuProps,
  OptionProps,
  OptionsOrGroups,
  components,
} from "react-select";
import CreatableSelect from "react-select/creatable";

type CreatableSelectFieldProps = {
  label?: string;
  containerClassName?: string;
  icon?: ReactNode;
  className?: string;
  options?: OptionsOrGroups<any, never>;
  value?: (string | number)[] | string | number;
  message?: string;
};

export default function CreatableSelectField({
  label,
  containerClassName = "",
  icon,
  className = "",
  options = [],
  value = "",
  message = "",
  ...props
}: CreatableSelectFieldProps & ComponentProps<CreatableSelect>) {
  const Control = ({ children, ...rest }: ControlProps) => (
    <components.Control
      {...rest}
      getStyles={() => ({})}
      className={`flex w-full h-12 border ${
        message ? "border-red-600" : "border-gray-300"
      } rounded relative shadow-none!`}
    >
      {children}
    </components.Control>
  );

  const Option = ({ children, ...rest }: OptionProps) => (
    <components.Option
      {...rest}
      getStyles={() => ({})}
      className="p-3 h rounded hover:bg-blue-100 cursor-pointer"
    >
      {children}
    </components.Option>
  );

  const Menu = ({ children, ...rest }: MenuProps) => (
    <components.Menu
      {...rest}
      getStyles={() => ({})}
      className="p-1 bg-white rounded border absolute z-10 w-full mt-1"
    >
      {children}
    </components.Menu>
  );

  return (
    <div className={containerClassName}>
      {label && <label>{label}</label>}
      <CreatableSelect
        classNamePrefix={message ? "selectfield-error" : "selectfield"}
        value={
          props.isMulti && Array.isArray(value)
            ? (value || []).map((item) => {
                return (
                  options.find((option) => option.value === item) || {
                    label: item,
                    value: item,
                    __isNew__: true,
                  }
                );
              })
            : options.find((option) => option.value === value) || {
                label: value,
                value,
                __isNew__: true,
              }
        }
        options={options}
        components={{ Control, Option, Menu }}
        {...props}
      />
      {message && <div className="text-sm text-red-700">{message}</div>}
    </div>
  );
}
