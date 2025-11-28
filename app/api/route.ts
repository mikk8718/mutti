import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const cart: {
      id: number;
      name: string;
      quantity: number;
      note?: string;
    }[] = body.cart;

    const phone: string = body.phone; // grab phone number from request
    const cartText = cart
      .map(
        (item) =>
          `• ${item.name} (ID: ${item.id})\n  Quantity: ${item.quantity}${
            item.note ? `\n  Note: ${item.note}` : "" 
          }`
      )
      .join("\n\n" + `${phone}`);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Shop" <${process.env.EMAIL_USER}>`,
      to: `${process.env.EMAIL_USER}`,
      subject: "New Order Received",
      text: `You have a new order:\n\n${cartText}`,
      html: `<p>You have a new order:</p><pre>${cartText}</pre> \n ${phone}`,
    });

    return new Response(JSON.stringify({ message: "Email sent!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to send email", error: err }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
