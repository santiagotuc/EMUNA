import React, { useEffect, useState } from "react";

// --- CONFIGURACIÓN DE URL DINÁMICA ---
// Esto detecta automáticamente si debe usar el backend local o el de la nube
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");

  // --- SEGURIDAD ---
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [credenciales, setCredenciales] = useState({
    username: "",
    password: "",
  });

  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Plantas",
    imageURL: "",
  });

  const [editandoId, setEditandoId] = useState(null);

  // 1. OBTENER PRODUCTOS (PÚBLICO)
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Usamos la variable API_URL
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error buscando productos:", error);
      }
    };
    obtenerDatos();
  }, []);

  // 2. LÓGICA DE LOGIN
  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciales),
      });
      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setMostrarLogin(false);
        setCredenciales({ username: "", password: "" });
        alert("¡Bienvenida, dueña de EMUNA! 🌿");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cerrarSesion = () => {
    setToken(null);
    localStorage.removeItem("token");
    alert("Sesión cerrada.");
  };

  // 3. FILTRADO Y MÉTRICAS
  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.name
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      filtroCategoria === "Todos" || producto.category === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  const totalProductos = productos.length;
  const stockCritico = productos.filter((p) => p.stock < 5).length;
  const valorInventario = productos.reduce(
    (acc, p) => acc + p.price * p.stock,
    0,
  );

  // 4. FUNCIONES CRUD (CON TOKEN)
  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const url = editandoId
        ? `${API_URL}/api/products/${editandoId}`
        : `${API_URL}/api/products`;
      const response = await fetch(url, {
        method: editandoId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({
          ...nuevoProducto,
          price: Number(nuevoProducto.price),
          stock: Number(nuevoProducto.stock),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (editandoId)
          setProductos(productos.map((p) => (p._id === editandoId ? data : p)));
        else setProductos([...productos, data]);
        cerrarModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro?")) {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: "DELETE",
          headers: { "x-auth-token": token },
        });
        if (response.ok) setProductos(productos.filter((p) => p._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

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

  const prepararEdicion = (producto) => {
    setNuevoProducto({ ...producto });
    setEditandoId(producto._id);
    setMostrarModal(true);
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-emerald-900">
              🌿 EMUNA
            </h1>
            <p className="text-emerald-700">Inventario Profesional</p>
          </div>

          <div className="flex gap-2">
            {!token ? (
              <button
                onClick={() => setMostrarLogin(true)}
                className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-bold hover:bg-emerald-200 transition"
              >
                Acceso Admin 🔐
              </button>
            ) : (
              <>
                <button
                  onClick={() => setMostrarModal(true)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg"
                >
                  + Nuevo Producto
                </button>
                <button
                  onClick={cerrarSesion}
                  className="bg-red-100 text-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-200 transition"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </header>

        {/* DASHBOARD - SOLO VISIBLE PARA ADMIN */}
        {token && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex flex-col items-center">
              <span className="text-emerald-500 text-sm font-bold uppercase">
                Total Productos
              </span>
              <span className="text-4xl font-black text-emerald-900">
                {totalProductos}
              </span>
            </div>
            <div
              className={`p-6 rounded-3xl shadow-sm border flex flex-col items-center ${stockCritico > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-emerald-100"}`}
            >
              <span className="text-sm font-bold uppercase">Stock Crítico</span>
              <span className="text-4xl font-black">{stockCritico}</span>
            </div>
            <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg flex flex-col items-center text-white">
              <span className="text-emerald-100 text-sm font-bold uppercase">
                Valor Inventario
              </span>
              <span className="text-4xl font-black">
                ${valorInventario.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* BÚSQUEDA Y FILTROS (PÚBLICO) */}
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="flex gap-4">
            {["Todos", "Plantas", "Artesanías"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-6 py-2 rounded-full font-bold transition ${filtroCategoria === cat ? "bg-emerald-600 text-white shadow-md" : "bg-white text-emerald-700 hover:bg-emerald-50"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar producto..."
            className="w-full max-w-md p-3 rounded-2xl border-2 border-emerald-100 outline-none focus:border-emerald-500 shadow-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* GRILLA DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosFiltrados.map((producto) => (
            <div
              key={producto._id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-emerald-50"
            >
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
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {producto.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {producto.description}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-emerald-600">
                      ${producto.price}
                    </span>
                    {/* STOCK SOLO PARA ADMIN */}
                    {token && (
                      <span className="text-xs font-bold text-gray-400">
                        Stock: {producto.stock}
                      </span>
                    )}
                  </div>
                  {token && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => prepararEdicion(producto)}
                        className="p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto._id)}
                        className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL LOGIN */}
      {mostrarLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
              Acceso Administrador
            </h2>
            <form onSubmit={manejarLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Usuario"
                required
                className="w-full p-3 border rounded-xl"
                value={credenciales.username}
                onChange={(e) =>
                  setCredenciales({ ...credenciales, username: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Contraseña"
                required
                className="w-full p-3 border rounded-xl"
                value={credenciales.password}
                onChange={(e) =>
                  setCredenciales({ ...credenciales, password: e.target.value })
                }
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMostrarLogin(false)}
                  className="flex-1 py-3 text-gray-500 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INVENTARIO (PROTEGIDO) */}
      {mostrarModal && token && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              {editandoId ? "Editar Producto" : "Añadir a Inventario"}
            </h2>
            <form onSubmit={manejarEnvio} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                required
                className="w-full p-3 border rounded-xl"
                value={nuevoProducto.name}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, name: e.target.value })
                }
              />
              <textarea
                placeholder="Descripción"
                required
                className="w-full p-3 border rounded-xl"
                value={nuevoProducto.description}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="URL Imagen"
                className="w-full p-3 border rounded-xl"
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
                  className="p-3 border rounded-xl"
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
                  className="p-3 border rounded-xl"
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
                className="w-full p-3 border rounded-xl"
                value={nuevoProducto.category}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    category: e.target.value,
                  })
                }
              >
                <option value="Plantas">Plantas</option>
                <option value="Artesanías">Artesanías</option>
              </select>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 py-3 text-gray-500 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl"
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
