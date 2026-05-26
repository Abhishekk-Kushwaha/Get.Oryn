import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "whsec_mock";
  const rawBody = await getRawBody(req);

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(rawBody);
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Webhook signature is valid.");
    const event = JSON.parse(rawBody.toString());

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload.payment.entity;
      console.log("Payment captured for order:", payment.order_id);
      // TODO: Update user's pro status in Supabase
    }

    res.status(200).json({ status: "ok" });
  } else {
    console.error("Invalid signature");
    res.status(400).json({ error: "Invalid signature" });
  }
}
