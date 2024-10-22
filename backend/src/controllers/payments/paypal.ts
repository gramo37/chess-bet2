import { Request, Response } from "express";
import path from "path";
import { captureOrder, createOrder, generateClientToken } from "../../utils/paypal";

export const getURL = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    console.error("Error Sending Paypal URL:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const getPaypentPage = async (req: Request, res: Response) => {
  res.sendFile(path.resolve("./client/index.html"));
};

// return client token for hosted-fields component
export const getToken = async (req: Request, res: Response) => {
  try {
    const { jsonResponse, httpStatusCode } = await generateClientToken();
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to generate client token:", error);
    res.status(500).send({ error: "Failed to generate client token." });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

export const getOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};
