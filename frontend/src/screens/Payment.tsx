import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BACKEND_URL } from "../constants/routes";
import axios from "axios";
import usePersonStore from "../contexts/auth";
import Spinner from "../components/spinner";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const { secret_token } = useParams();
  const user = usePersonStore((state) => state.user);
  const navigate = useNavigate();

  const signature = searchParams.get("signature");
  const checkout_id = searchParams.get("checkout_id");

  useEffect(() => {
    // Make an API call to /success-transaction, send signature and checkout_id
    if (!signature || !checkout_id) return;
    async function updatePayments() {
      const url = `${BACKEND_URL}/payments/success-transaction`;
      try {
        const response = await axios.post(
          url,
          { checkout_id, secret_token },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const data = response.data;

        // redirect to /account if success
        if (data) {
          navigate("/account");
        }
      } catch (error) {
        console.error(`Error during fetching:`, error);
        alert("Something went wrong. Please try again.");
        navigate("/account");
      }
    }

    updatePayments();
  }, [signature, checkout_id, user?.token, navigate]);

  return <Spinner />;
}
