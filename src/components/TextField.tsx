import { HTMLProps, LegacyRef, forwardRef } from "react";
import { IconType } from "react-icons";

export type TextFieldProps = {
  containerClassName?: string;
  label?: string;
  className?: string;
  message?: string | boolean;
  icon?: IconType;
};

const TextField = forwardRef(
  (
    {
      containerClassName = "",
      label,
      className,
      message,
      icon: Icon,
      ...props
    }: TextFieldProps & HTMLProps<HTMLInputElement>,
    ref: LegacyRef<HTMLInputElement>
  ) => {
    return (
      <div className={containerClassName}>
        {label && <label>{label}</label>}
        <div className="relative w-full overflow-hidden">
          <input
            {...props}
            ref={ref}
            className={`w-full h-12 border ${
              message ? "border-red-600" : "border-gray-300"
            } px-3 rounded ${className} ${Icon ? "pl-12" : ""}`}
          />
          {Icon && (
            <div className="absolute top-0 left-0 w-12 h-12 flex justify-center items-center pointer-events-none">
              {<Icon />}
            </div>
          )}
        </div>
        {typeof message === "string" && (
          <div className="text-sm text-red-600">{message}</div>
        )}
      </div>
    );
  }
);

export default TextField;
