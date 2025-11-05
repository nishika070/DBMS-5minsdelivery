import React, { useState, useEffect } from "react";
import Header from "./Header";

const LandingPage = () => {
  const [hostelId, setHostelId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  // ✅ Fetch items from backend (MySQL)
  useEffect(() => {
    fetch("http://localhost:5000/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  // ✅ Backend Login
  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: hostelId, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsLoggedIn(true);
          setError("");
        } else {
          setError("Invalid Hostel ID or Password");
        }
      });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHostelId("");
    setPassword("");
    setCart([]);
    setError("");
  };

  // ✅ Add to Cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.item.item_id === item.item_id);
      if (existing) {
        return prevCart.map((c) =>
          c.item.item_id === item.item_id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
  };

  // ✅ Remove item from cart
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((c) => c.item.item_id !== itemId));
  };

  // ✅ Change quantity
  const changeQuantity = (itemId, newQty) => {
    if (newQty < 1) return;
    setCart((prevCart) =>
      prevCart.map((c) =>
        c.item.item_id === itemId ? { ...c, quantity: newQty } : c
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-10">
      <Header hostelId={hostelId} isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      {!isLoggedIn ? (
        <form
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto"
          onSubmit={handleLogin}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Login with Hostel ID
          </h2>

          <input
            type="text"
            placeholder="Enter Hostel ID"
            value={hostelId}
            onChange={(e) => setHostelId(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition">
            Login
          </button>
        </form>
      ) : (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-6">

          {/* ✅ Items List */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.item_id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">₹{item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* ✅ Cart */}
          <div className="w-full md:w-80 bg-gray-200 p-6 rounded-lg shadow flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Your Cart</h3>

              <div className="flex gap-2">
                <button onClick={clearCart} className="bg-yellow-400 text-gray-800 py-1 px-2 rounded-md hover:bg-yellow-500 transition text-sm">
                  Clear
                </button>

                <button onClick={handleLogout} className="bg-gray-300 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-400 transition text-sm">
                  Logout
                </button>
              </div>
            </div>

            <div className="bg-white rounded-md p-4 flex flex-col">
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  <ul className="flex flex-col gap-2">
                    {cart.map((c) => (
                      <li key={c.item.item_id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{c.item.name}</span>
                          <p className="text-gray-500 text-sm">₹{c.item.price}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQuantity(c.item.item_id, c.quantity - 1)} className="bg-gray-300 px-2 rounded">-</button>
                          <span>{c.quantity}</span>
                          <button onClick={() => changeQuantity(c.item.item_id, c.quantity + 1)} className="bg-gray-300 px-2 rounded">+</button>
                          <button onClick={() => removeFromCart(c.item.item_id)} className="text-red-500 font-bold px-2">x</button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <p className="font-semibold text-gray-700 mt-4">
                    Total: ₹{cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0)}
                  </p>

                  <button
  onClick={() => {
    fetch("http://localhost:5000/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: hostelId, cart }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("✅ Order Placed Successfully! Food will be delivered to your room 🍜💛");
        setCart([]); // empty cart after order
      });
  }}
  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition mt-2"
>
  Deliver to Room
</button>

                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
