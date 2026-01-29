import React, { useEffect, useState } from "react";

function App() {
  // 1. La "estantería" para guardar las plantas
  const [productos, setProductos] = useState([]);

  // 2. El "empleado" (Efecto) que busca la mercadería
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error buscando productos:", error);
      }
    };

    obtenerDatos(); // llamo a la función
  }, []); // El [] asegura que solo se ejecute una vez al cargar

  // 3. El diseño (Lo que ve el usuario)

  return (
    <div className="min-h-screen bg-emerald-50 p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-emerald-900">
              🌿 EMUNA
            </h1>
            <p className="text-emerald-700">
              Inventario de Plantas y Artesanías
            </p>
          </div>
          <button className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 transition">
            + Nuevo Producto
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto) => (
            <div
              key={producto._id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 hover:scale-105 transition-transform"
            >
              <div className="h-48 bg-emerald-200 flex items-center justify-center text-6xl">
                {producto.category === "Plantas" ? "🌵" : "🏺"}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 capitalize">
                  {producto.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {producto.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-emerald-600">
                    ${producto.price}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    Stock: {producto.stock}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
