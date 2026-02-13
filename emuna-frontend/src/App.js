import React, { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");

  // ESTADO PARA EL FORMULARIO (Agregado imageURL)
  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Plantas",
    imageURL: "", // <--- Paso 2.A: Campo para la imagen
  });

  const [editandoId, setEditandoId] = useState(null);

  // 1. OBTENER PRODUCTOS
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

  // 2. CERRAR MODAL
  const cerrarModal = () => {
    setMostrarModal(false);
    setEditandoId(null);
    setNuevoProducto({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "Plantas",
      imageURL: "",
    });
  };

  // 3. PREPARAR EDICIÓN (Incluye imageURL)
  const prepararEdicion = (producto) => {
    setNuevoProducto({
      name: producto.name,
      description: producto.description,
      price: producto.price,
      stock: producto.stock,
      imageURL: producto.imageURL || "", // Carga la imagen si existe
      category:
        producto.category === "plantas"
          ? "Plantas"
          : producto.category === "artesanías"
            ? "Artesanías"
            : producto.category,
    });
    setEditandoId(producto._id);
    setMostrarModal(true);
  };

  // 4. GUARDAR O ACTUALIZAR
  const manejarEnvio = async (e) => {
    e.preventDefault();
    const productoParaEnviar = {
      ...nuevoProducto,
      price: Number(nuevoProducto.price),
      stock: Number(nuevoProducto.stock),
    };

    const url = editandoId
      ? `http://localhost:5000/api/products/${editandoId}`
      : "http://localhost:5000/api/products";

    const metodo = editandoId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoParaEnviar),
      });

      const data = await response.json();

      if (response.ok) {
        if (editandoId) {
          setProductos(productos.map((p) => (p._id === editandoId ? data : p)));
        } else {
          setProductos([...productos, data]);
        }
        cerrarModal();
      } else {
        alert("Error del servidor: " + (data.message || "Revisa los campos"));
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // 5. ELIMINAR
  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          setProductos(productos.filter((p) => p._id !== id));
        } else {
          alert("Error al eliminar");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  // Filtramos los productos según el nombre o la categoría

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.name
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      filtroCategoria === "Todos" || producto.category === filtroCategoria;

    return coincideBusqueda && coincideCategoria;
  });

  //Resumen de productos

  const totalProductos = productos.length;
  const stockCritico = productos.filter((p) => p.stock < 5).length;
  const valorInventario = productos.reduce(
    (acc, p) => acc + p.price * p.stock,
    0,
  );

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
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg"
          >
            + Nuevo Producto
          </button>
        </header>
        {/* BARRA DE BÚSQUEDA */}

        {/* DASHBOARD DE RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex flex-col items-center">
            <span className="text-emerald-500 text-sm font-bold uppercase tracking-wider">
              Total Productos
            </span>
            <span className="text-4xl font-black text-emerald-900">
              {totalProductos}
            </span>
          </div>

          <div
            className={`p-6 rounded-3xl shadow-sm border flex flex-col items-center ${stockCritico > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-emerald-100"}`}
          >
            <span
              className={`${stockCritico > 0 ? "text-orange-600" : "text-emerald-500"} text-sm font-bold uppercase tracking-wider`}
            >
              Stock Crítico
            </span>
            <span
              className={`text-4xl font-black ${stockCritico > 0 ? "text-orange-700" : "text-emerald-900"}`}
            >
              {stockCritico}
            </span>
          </div>

          <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg flex flex-col items-center text-white">
            <span className="text-emerald-100 text-sm font-bold uppercase tracking-wider">
              Valor Inventario
            </span>
            <span className="text-4xl font-black">
              ${valorInventario.toLocaleString()}
            </span>
          </div>
        </div>

        {/* BOTONES DE FILTRO */}
        <div className="flex justify-center gap-4 mb-6">
          {["Todos", "Plantas", "Artesanías"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${
                filtroCategoria === cat
                  ? "bg-emerald-600 text-white scale-105"
                  : "bg-white text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {cat === "Todos"
                ? "🌍 Todos"
                : cat === "Plantas"
                  ? "🌵 Plantas"
                  : "🏺 Artesanías"}
            </button>
          ))}
        </div>
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar planta o artesanía..."
              className="w-full pl-10 pr-4 py-3 border-2 border-emerald-100 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all shadow-sm"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosFiltrados.map((producto) => (
            <div
              key={producto._id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 hover:scale-105 transition-transform flex flex-col"
            >
              {/* PASO 2.C: MOSTRAR IMAGEN REAL O EMOJI */}
              <div className="h-48 bg-emerald-200 flex items-center justify-center overflow-hidden">
                {producto.imageURL ? (
                  <img
                    src={producto.imageURL}
                    alt={producto.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">
                    {producto.category === "Plantas" ? "🌵" : "🏺"}
                  </span>
                )}
              </div>

              <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 capitalize">
                  {producto.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {producto.description}
                </p>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-emerald-600">
                      ${producto.price}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full w-fit mt-1">
                      Stock: {producto.stock}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => prepararEdicion(producto)}
                      className="p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => eliminarProducto(producto._id)}
                      className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CON CAMPO DE IMAGEN */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              {editandoId ? "Editar Producto" : "Añadir a Inventario"}
            </h2>
            <form onSubmit={manejarEnvio} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={nuevoProducto.name}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, name: e.target.value })
                }
              />
              <textarea
                placeholder="Descripción"
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
              {/* PASO 2.B: NUEVO INPUT PARA URL DE IMAGEN */}
              <input
                type="text"
                placeholder="URL de la imagen (Link)"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={nuevoProducto.imageURL}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    imageURL: e.target.value,
                  })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Precio"
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
                  placeholder="Stock"
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
                  onClick={cerrarModal}
                  className="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition"
                >
                  {editandoId ? "Actualizar" : "Guardar"}
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
