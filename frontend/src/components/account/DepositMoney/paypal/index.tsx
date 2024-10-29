import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PaymentForm } from "./PaymentForm";
import { useState, useEffect } from "react";
import { BACKEND_URL, PAYPALCLIENTID } from "../../../../constants/routes";

const PaypalPage = () => {
  const [clientToken, setClientToken] = useState(undefined);

  const initialOptions = {
    "clientId": PAYPALCLIENTID,
    "enableFunding": "paylater,venmo",
    "disableFunding": "",
    "dataSdkIntegrationSource": "integrationbuilder_ac",
    "dataClientToken": clientToken,
    components: "hosted-fields,buttons",
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/payments/paypal/token`, {
        method: "POST",
      });
      const { client_token } = await response.json();
      setClientToken(client_token);
    })();
  }, []);
  return (
    <>
      {clientToken ? (
        <PayPalScriptProvider options={initialOptions}>
          <PaymentForm />
        </PayPalScriptProvider>
      ) : (
        <h4>WAITING ON CLIENT TOKEN</h4>
      )}
    </>
  );
};

export default PaypalPage;
