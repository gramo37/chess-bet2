import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PaymentForm } from "./PaymentForm";
import { useState, useEffect } from "react";

const PaypalPage = () => {
  const [clientToken, setClientToken] = useState(null);

  const initialOptions = {
    "clientId": "test",
    "enable-funding": "paylater,venmo",
    "disable-funding": "",
    "data-sdk-integration-source": "integrationbuilder_ac",
    "data-client-token": clientToken,
    components: "hosted-fields,buttons",
  };

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/token", {
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
