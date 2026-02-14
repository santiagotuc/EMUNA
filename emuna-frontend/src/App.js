import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
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
    imageFile: null,
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error buscando productos:", error);
      }
    };
    obtenerDatos();
  }, []);

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
      imageFile: null,
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Verificación rápida antes de enviar
    if (!nuevoProducto.name || !nuevoProducto.price) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("name", nuevoProducto.name);
    formData.append("description", nuevoProducto.description);
    formData.append("price", nuevoProducto.price);
    formData.append("stock", nuevoProducto.stock);
    formData.append("category", nuevoProducto.category);

    if (nuevoProducto.imageFile) {
      formData.append("image", nuevoProducto.imageFile);
    } else {
      formData.append("imageURL", nuevoProducto.imageURL);
    }

    try {
      const url = editandoId
        ? `${API_URL}/api/products/${editandoId}`
        : `${API_URL}/api/products`;
      const response = await fetch(url, {
        method: editandoId ? "PUT" : "POST",
        headers: { "x-auth-token": token },
        body: formData, // El navegador pone el Content-Type automáticamente
      });

      const data = await response.json();

      if (response.ok) {
        if (editandoId) {
          setProductos(productos.map((p) => (p._id === editandoId ? data : p)));
        } else {
          setProductos([data, ...productos]);
        }
        alert("¡Guardado correctamente! ✨");
        cerrarModal();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
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
                  Salir
                </button>
              </>
            )}
          </div>
        </header>

        {token && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 text-center">
              <span className="text-emerald-500 text-sm font-bold uppercase">
                Total Productos
              </span>
              <p className="text-4xl font-black text-emerald-900">
                {productos.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 text-center">
              <span className="text-emerald-500 text-sm font-bold uppercase">
                Stock Crítico
              </span>
              <p className="text-4xl font-black text-orange-600">
                {productos.filter((p) => p.stock < 5).length}
              </p>
            </div>
            <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg text-center text-white">
              <span className="text-emerald-100 text-sm font-bold uppercase">
                Valor Inventario
              </span>
              <p className="text-4xl font-black">
                $
                {productos
                  .reduce((acc, p) => acc + p.price * p.stock, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="flex gap-2">
            {["Todos", "Plantas", "Artesanías"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-4 py-2 rounded-full font-bold transition ${filtroCategoria === cat ? "bg-emerald-600 text-white shadow-md" : "bg-white text-emerald-700 hover:bg-emerald-50"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar producto..."
            className="w-full max-w-md p-3 rounded-2xl border-2 border-emerald-100 outline-none focus:border-emerald-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos
            .filter(
              (p) =>
                (filtroCategoria === "Todos" ||
                  p.category === filtroCategoria) &&
                p.name.toLowerCase().includes(busqueda.toLowerCase()),
            )
            .map((producto) => (
              <div
                key={producto._id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-emerald-50"
              >
                <div className="h-48 bg-emerald-100 flex items-center justify-center overflow-hidden">
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
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {producto.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-emerald-600">
                        ${producto.price}
                      </span>
                      {token && (
                        <span className="text-xs font-bold text-gray-400">
                          Stock: {producto.stock}
                        </span>
                      )}
                    </div>
                    {token && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setNuevoProducto({ ...producto, imageFile: null });
                            setEditandoId(producto._id);
                            setMostrarModal(true);
                          }}
                          className="p-3 bg-blue-50 text-blue-500 rounded-full"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm("¿Eliminar?")) {
                              await fetch(
                                `${API_URL}/api/products/${producto._id}`,
                                {
                                  method: "DELETE",
                                  headers: { "x-auth-token": token },
                                },
                              );
                              setProductos(
                                productos.filter((p) => p._id !== producto._id),
                              );
                            }
                          }}
                          className="p-3 bg-red-50 text-red-500 rounded-full"
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

      {mostrarLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <form
            onSubmit={manejarLogin}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4"
          >
            <h2 className="text-2xl font-bold text-emerald-900 text-center">
              Admin EMUNA
            </h2>
            <input
              type="text"
              placeholder="Usuario"
              required
              className="w-full p-3 border rounded-xl outline-none"
              onChange={(e) =>
                setCredenciales({ ...credenciales, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Contraseña"
              required
              className="w-full p-3 border rounded-xl outline-none"
              onChange={(e) =>
                setCredenciales({ ...credenciales, password: e.target.value })
              }
            />
            <div className="flex gap-2">
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
      )}

      {mostrarModal && token && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form
            onSubmit={manejarEnvio}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-emerald-900">
              {editandoId ? "Editar" : "Nuevo Producto"}
            </h2>
            <input
              type="text"
              placeholder="Nombre"
              required
              className="w-full p-3 border rounded-xl outline-none"
              value={nuevoProducto.name}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, name: e.target.value })
              }
            />
            <textarea
              placeholder="Descripción"
              className="w-full p-3 border rounded-xl outline-none"
              value={nuevoProducto.description}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  description: e.target.value,
                })
              }
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-emerald-700 ml-1">
                Subir Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded-xl text-sm file:bg-emerald-50 file:border-0 file:rounded-full file:text-emerald-700"
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    imageFile: e.target.files[0],
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Precio"
                required
                className="p-3 border rounded-xl outline-none"
                value={nuevoProducto.price}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, price: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Stock"
                required
                className="p-3 border rounded-xl outline-none"
                value={nuevoProducto.stock}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
                }
              />
            </div>
            <select
              className="w-full p-3 border rounded-xl outline-none"
              value={nuevoProducto.category}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, category: e.target.value })
              }
            >
              <option value="Plantas">Plantas</option>
              <option value="Artesanías">Artesanías</option>
            </select>
            <div className="flex gap-2">
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
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
