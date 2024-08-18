import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { defaultIdealPayerShares } from "../TransactionData";
import { sum } from "lodash";

type IndividualShareRadioProps = {
  name: string;
};

export const IndividualShareRadio = ({ name }: IndividualShareRadioProps) => (
  <FormControlLabel
    value={name}
    control={<Radio />}
    label={`${name} paid (${
      (defaultIdealPayerShares as Record<string, number>)[name]
    }/${sum(Object.values(defaultIdealPayerShares))})`}
  />
);
