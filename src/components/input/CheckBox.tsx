import { FieldValues, UseFormRegister } from "react-hook-form"

interface CheckboxProps{
    id:string
    label:string
    disabled?:boolean
    register:UseFormRegister<FieldValues>
}

const CheckBox: React.FC<CheckboxProps> = ({
  id,
  label,
  disabled,
  register,
}) => {
  return (
    <div className="w-full flex flex-row gap-2 items-center">
      <input
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id)}
        placeholder=""
        type="checkbox"
        className="cursor-pointer"

      />
      <label htmlFor={id}
      className="font-medium cursor-pointer">{label}</label>
    </div>
  )
}

export default CheckBox
