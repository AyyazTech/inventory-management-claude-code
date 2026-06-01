// Return shape of the stock-adjustment server action, also the initial state
// for `useActionState` in the inline stock controls.
export type StockFormState = {
  ok: boolean;
  message?: string;
  errors?: { amount?: string[] };
};
