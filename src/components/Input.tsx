interface Props {
  value: number | string;
  inputType?: string;
  onClick: () => void;
}

export default function Input({ value, inputType, onClick }: Props) {
  if (value === 0) inputType = inputType + " zero";

  return (
    <button className={`input ${inputType}`} onClick={onClick}>
      {value}
    </button>
  );
}
