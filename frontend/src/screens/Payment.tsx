import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../constants/routes";
import axios from "axios";
import Spinner from "../components/spinner";

export default function Payment() {
  const { secret_token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Make an API call to /success-transaction, send signature and checkout_id
    if (!secret_token) {
      console.error(`Secret Token not found`);
      alert("Something went wrong. Please try again.");
      navigate("/account");
      return;
    }
    async function updatePayments() {
      const url = `${BACKEND_URL}/payments/success-transaction`;
      try {
        const response = await axios.post(
          url,
          { secret_token },
          {
            headers: {
              "Content-Type": "application/json",
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
  }, [navigate, secret_token]);

  return <Spinner />;
}
