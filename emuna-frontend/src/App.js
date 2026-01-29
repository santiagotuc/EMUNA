import React, { useEffect, useState } from "react";

function App() {
  // Aquí guardaremos los productos que traigamos del backend
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Hacemos la llamada a la API que creamos
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => console.error("Error buscando productos:", error));
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f4f9f4",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ color: "#2d5a27" }}>🌿 Inventario de EMUNA</h1>
      <hr />

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {productos.length === 0 ? (
          <p>No hay productos cargados todavía...</p>
        ) : (
          productos.map((producto) => (
            <div
              key={producto._id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "white",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                width: "200px",
              }}
            >
              <h2 style={{ fontSize: "1.2rem", margin: "0 0 10px 0" }}>
                {producto.name}
              </h2>
              <p style={{ color: "#666" }}>{producto.description}</p>
              <p style={{ fontWeight: "bold", color: "#2d5a27" }}>
                ${producto.price}
              </p>
              <small>Stock: {producto.stock} unidades</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
