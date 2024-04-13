import { TextField } from "@mui/material";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";

type CustomSharesProps = {
  defaultActualPayerShares: Record<string, number>;
  defaultIdealPayerShares: Record<string, number>;
  onChange: (
    actualPayerShares: Record<string, number>,
    idealPayerShares: Record<string, number>
  ) => void;
};

export const CustomShares = ({
  defaultActualPayerShares: actualPayerShares,
  defaultIdealPayerShares: idealPayerShares,
  onChange,
}: CustomSharesProps) => {
  const textFromProps = JSON.stringify(
    { actualPayerShares, idealPayerShares },
    undefined,
    2
  );
  const [textValue, setTextValue] = useState(textFromProps);

  const valueFromText = (() => {
    try {
      const jsonValue = JSON.parse(textValue);
      if (typeof jsonValue !== "object") return undefined;
      if (!("actualPayerShares" in jsonValue)) return undefined;
      if (typeof jsonValue.actualPayerShares !== "object") return undefined;
      if (Object.keys(jsonValue.actualPayerShares).length < 1) return undefined;
      if (!("idealPayerShares" in jsonValue)) return undefined;
      if (typeof jsonValue.idealPayerShares !== "object") return undefined;
      if (Object.keys(jsonValue.idealPayerShares).length < 1) return undefined;
      return jsonValue;
    } catch (error) {
      console.warn("Invalid json", textValue, error);
      return undefined;
    }
  })();

  useEffect(() => {
    if (
      !valueFromText ||
      isEqual({ actualPayerShares, idealPayerShares }, valueFromText)
    ) {
      return;
    }

    onChange(valueFromText.actualPayerShares, valueFromText.idealPayerShares);
  }, [actualPayerShares, idealPayerShares, onChange, valueFromText]);

  return (
    <TextField
      multiline
      rows={8}
      value={textValue}
      onChange={(event) => setTextValue(event.target.value)}
      error={!valueFromText}
    />
  );
};
