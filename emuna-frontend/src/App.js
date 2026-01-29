import React, { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);

  // --- NUEVOS ESTADOS PARA EL MODAL ---
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Plantas",
  });

  // Obtener productos (El "Empleado")
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
    obtenerDatos();
  }, []);

  // --- FUNCIÓN PARA GUARDAR EN LA BD ---
  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Convertimos precio y stock a números antes de enviar
    const productoParaEnviar = {
      ...nuevoProducto,
      price: Number(nuevoProducto.price),
      stock: Number(nuevoProducto.stock),
    };

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoParaEnviar), // Enviamos el objeto corregido
      });

      const data = await response.json(); // Leemos la respuesta para ver el error

      if (response.ok) {
        setProductos([...productos, data]);
        setMostrarModal(false);
        setNuevoProducto({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "Plantas",
        });
      } else {
        // SI HAY ERROR 400, ESTO NOS DIRÁ QUÉ FALTA
        console.error("Error del servidor:", data.message || data);
        alert("Error al guardar: " + (data.message || "Revisa los campos"));
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };
  return (
    <div className="min-h-screen bg-emerald-50 p-10 font-sans relative">
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
          {/* BOTÓN QUE ABRE EL MODAL */}
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg"
          >
            + Nuevo Producto
          </button>
        </header>

        {/* GRILLA DE PRODUCTOS */}
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

      {/* --- DISEÑO DEL MODAL (VENTANA FLOTANTE) --- */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              Añadir a Inventario
            </h2>
            <form onSubmit={manejarEnvio} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la planta/artesanía"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={nuevoProducto.name}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, name: e.target.value })
                }
              />
              <textarea
                placeholder="Descripción corta"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={nuevoProducto.description}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    description: e.target.value,
                  })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Precio ($)"
                  required
                  className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={nuevoProducto.price}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      price: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Stock inicial"
                  required
                  className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={nuevoProducto.stock}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      stock: e.target.value,
                    })
                  }
                />
              </div>
              <select
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={nuevoProducto.category}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    category: e.target.value,
                  })
                }
              >
                <option value="Plantas">Planta 🌵</option>
                <option value="Artesanías">Artesanía 🏺</option>
              </select>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
