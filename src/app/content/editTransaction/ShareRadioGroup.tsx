import RadioGroup from "@mui/material/RadioGroup";
import { useIsXcl } from "../../../authentication/authentication";
import { FormControlLabel, Radio } from "@mui/material";
import { IndividualShareRadio } from "./IndividualShareRadio";
import { ReactElement, useRef } from "react";

export type ShareType = "xcl" | "catb" | "custom";

type ShareRadioGroupProps = {
  shareType: ShareType;
  onShareTypeChanged: (newShareType: ShareType) => void;
};

export const ShareRadioGroup = ({
  shareType,
  onShareTypeChanged,
}: ShareRadioGroupProps) => {
  const isXcl = useIsXcl();

  const radioSet: Record<string, true> = {};
  const radioChoices: ReactElement[] = [];

  const previousShareTypeValues = useRef<Partial<Record<ShareType, true>>>({});
  previousShareTypeValues.current[shareType] = true;

  const addRadio = (name: string) => {
    radioChoices.push(<IndividualShareRadio key={name} name={name} />);

    radioSet[name] = true;
  };

  if (isXcl) {
    addRadio("xcl");
  } else {
    addRadio("catb");
  }

  for (const previousShareType of Object.keys(
    previousShareTypeValues.current
  )) {
    if (previousShareType === "custom") return;

    if (!radioSet[previousShareType]) {
      addRadio(previousShareType);
    }
  }

  return (
    <RadioGroup
      value={shareType}
      onChange={(event) => onShareTypeChanged(event.target.value as ShareType)}
    >
      {...radioChoices}
      <FormControlLabel value="custom" control={<Radio />} label="custom" />
    </RadioGroup>
  );
};
