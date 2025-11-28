"use client";

import { useState, Fragment } from "react";
import Product from "./components/card";
import { send } from "process";

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  note?: string; // size, color, text, etc
};

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [phone, setPhone] = useState("");

  const cartText = cart
  .map(
    (item) =>
      `• ${item.name} (ID: ${item.id})\n  Quantity: ${item.quantity}${
        item.note ? `\n  Note: ${item.note}` : ""
      }`
  )
  .join("\n\n");

   const sendEmail = async () => {
  try {
    const res = await fetch("/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, phone }), // send cart here
    });

    const data = await res.json();
  } catch (err) {
  }
};

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) {
        return prev.map(p =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
  };

  return (
    <Fragment>
      <Product addToCart={addToCart} />

      <div className="fixed bottom-6 right-6 w-72 rounded-lg border bg-white p-4 shadow">
        <h3 className="font-bold mb-2">Kurv</h3>

        {cart.length === 0 && (
          <p className="text-sm text-gray-500">Ingen varer endnu</p>
        )}

        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name} x {item.quantity}</span>
          </div>
        ))}

        {cart.length > 0 && (
          <button
            onClick={() => setShowCheckout(true)}
            className="mt-3 w-full rounded bg-black py-2 text-white"
          >
            Gå til checkout
          </button>

        )}
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Bestilling</h2>

            {cart.map((item, index) => (
              <div key={item.id} className="border-b pb-2">
                <p className="font-semibold">
                  {item.name} x {item.quantity}
                </p>

                <input
                  placeholder="Fx størrelse, farve, tekst..."
                  className="mt-2 w-full rounded border px-2 py-1"
                  value={item.note || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCart(prev =>
                      prev.map((p, i) =>
                        i === index ? { ...p, note: value } : p
                      )
                    );
                  }}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium">Telefonnummer</label>
            <input
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="fx 12345678"
  className="mt-1 w-full rounded border px-2 py-1"
/>

            </div>
            <div>Jeg vender tilbage over SMS så snart jeg får tid!</div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="border px-4 py-1 rounded"
              >
                Annuller
              </button>

              <button
                onClick={() => {
                  if (!phone || !/^\d{8}$/.test(phone)) {
  alert("Indtast et gyldigt telefonnummer (8 cifre)!");
  return; // stop sending if invalid
}
                  setCart([]);
                  setPhone(phone);
                  setShowCheckout(false);
                  sendEmail();
                }}
                className="bg-black text-white px-4 py-1 rounded"
              >
                Send bestilling
              </button>
            </div>
          </div>
        </div>
      )}

    </Fragment>
  );
}
