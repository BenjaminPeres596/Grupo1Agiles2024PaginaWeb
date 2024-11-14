"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Dish {
  name: "";
  price: 0;
  description: "";
  image: "";
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any>([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedDish, setSelectedDish] = useState<any>(null); // Estado para almacenar el plato seleccionado
  const [newDish, setNewDish] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
  }); // Estado para almacenar los datos del nuevo plato

  const handleLogin = async () => {
    setErrorMessage(""); // Resetea el mensaje de error antes de cada intento

    try {
      // Realizar la solicitud para obtener los datos del usuario
      const response = await fetch(
        "https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Usuarios?select=username,password,email,id&username=eq." +
          username,
        {
          method: "GET",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
          },
        }
      );

      const data = await response.json();
      console.log(data);
      // Verificar si el usuario existe
      const usuarioEncontrado = data.find(
        (user: { username: string; password: string }) =>
          user.username === username
      );

      if (!usuarioEncontrado) {
        setErrorMessage("El usuario no existe.");
        return;
      }

      // Verificar la contraseña
      if (usuarioEncontrado.password !== password) {
        setErrorMessage("Contraseña incorrecta.");
        return;
      }

      // Login exitoso
      const userData = {
        id: usuarioEncontrado.id,
        name: usuarioEncontrado.username,
        email: usuarioEncontrado.email, // Puedes agregar más datos si es necesario
      };

      // Verificar si el usuario es dueño de un restaurante (suponiendo que se guarda esta información)
      const ownerResponse = await fetch(
        "https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Usuarios?select=isOwner&username=eq." +
          username,
        {
          method: "GET",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
          },
        }
      );

      const ownerData = await ownerResponse.json();
      console.log(ownerData);
      // Verificar si el usuario es dueño de un restaurante
      if (!ownerData[0]?.isOwner) {
        setErrorMessage("No eres dueño de un restaurante.");
        return;
      }

      // Si el usuario es dueño de un restaurante, cargar los datos del restaurante
      const restaurantResponse = await fetch(
        "https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Restaurantes?select=id,name&userId=eq." +
          usuarioEncontrado.id,
        {
          method: "GET",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
          },
        }
      );

      const restaurantData = await restaurantResponse.json();
      if (restaurantData.length > 0) {
        setRestaurant(restaurantData[0]);

        // Obtener el menú del restaurante
        const menuResponse = await fetch(
          "https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Platos?select=*&restaurantId=eq." +
            restaurantData[0].id,
          {
            method: "GET",
            headers: {
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            },
          }
        );

        const menuData = await menuResponse.json();
        setMenu(menuData);
      }
    } catch (error) {
      setErrorMessage("Error en la solicitud");
      console.error(error);
    }
  };

  const handleEditClick = (dish: Dish) => {
    setSelectedDish(dish); // Establece el plato que se va a editar
    setShowModalEdit(true); // Muestra el modal de edición
  };

  const ModalEditDish = ({ onClose, onSave }: any) => {
    const [formData, setFormData] = useState(selectedDish); // Inicializa con selectedDish
    console.log(formData);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSave = () => {
      onSave(formData); // Pasa el formData al onSave cuando se guarda
      onClose(); // Cierra el modal
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md">
          <h3 className="text-lg font-semibold text-center text-[#EF4423]">
            Editar Plato
          </h3>
          <input
            type="text"
            name="name"
            placeholder="Nombre del plato"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
          />
          <input
            type="text"
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
          />
          <input
            type="text"
            name="image"
            placeholder="URL de la imagen"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => handleEditDish(formData.id, formData)}
              className="bg-[#EF4423] text-white px-4 py-2 rounded-lg"
            >
              Editar Plato
            </button>
            <button
              onClick={onClose} // Cierra el modal
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleEditDish = async (dishId: string, updateDish: Dish) => {
    const updatedDish = {
      name: updateDish.name,
      image: updateDish.image,
      price: updateDish.price,
      description: updateDish.description,
    };

    try {
      await fetch(
        `https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Platos?id=eq.${dishId}`,
        {
          method: "PATCH",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(updatedDish),
        }
      );
      alert("Plato actualizado exitosamente");
      // Opcionalmente, puedes hacer un refetch para obtener el menú actualizado
    } catch (error) {
      console.error("Error al editar el plato:", error);
      alert("Error al editar el plato.");
    }
  };

  const handleDeleteDish = async (dishId: number) => {
    try {
      await fetch(
        `https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Platos?id=eq.${dishId}`,
        {
          method: "DELETE",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
          },
        }
      );
      alert("Plato eliminado exitosamente");
      // Opcionalmente, puedes hacer un refetch para obtener el menú actualizado
    } catch (error) {
      console.error("Error al eliminar el plato:", error);
      alert("Error al eliminar el plato.");
    }
  };

  // Función para manejar el cambio de valores en el formulario de agregar plato
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDish((prevDish) => ({
      ...prevDish,
      [name]: value,
    }));
  };

  // Función para manejar el envío del formulario de agregar plato
  const handleAddDish = async () => {
    if (!newDish.name || !newDish.price || !newDish.image) {
      alert("Por favor complete todos los campos.");
      return;
    }

    const dishData = {
      restaurantId: restaurant.id, // Usamos el id del restaurante que el dueño ha iniciado sesión
      name: newDish.name,
      price: newDish.price,
      image: newDish.image,
    };

    try {
      // Enviar el nuevo plato al servidor
      await axios.post(
        "https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Platos",
        dishData,
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
          },
        }
      );

      alert("Plato agregado exitosamente");
      setNewDish({ name: "", price: 0, description: "", image: "" }); // Resetea los campos del formulario
      console.log(restaurant);
      // Volver a hacer el fetch para obtener el menú actualizado
      const menuResponse = await fetch(
        "https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Platos?select=*&restaurantId=eq." +
          restaurant.id,
        {
          method: "GET",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
          },
        }
      );

      const menuData = await menuResponse.json();
      setMenu(menuData);
    } catch (error) {
      console.error("Error al agregar el plato:", error);
      alert("Error al agregar el plato.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full bg-[#EF4423] text-white text-4xl py-6 text-center font-bold fixed top-0 left-0 right-0">
        DondeComo
      </header>

      {/* Contenedor de login y restaurante, centrado en el espacio restante */}
      <div className="flex-grow flex flex-col items-center justify-center py-20">
        {!restaurant ? (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full space-y-6 mt-12">
            <h2 className="text-2xl font-bold text-center text-[#EF4423]">
              Iniciar sesión
            </h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
            />
            <button
              onClick={handleLogin}
              className="w-full p-3 bg-[#EF4423] text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Iniciar sesión
            </button>
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center bg-white p-6 rounded-lg shadow-lg mt-12">
            <div className="w-full max-w-md p-4 bg-gray-50 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-center text-[#EF4423]">
                Restaurante: {restaurant.name}
              </h2>
              <button
                onClick={() => setShowModalAdd(true)} // Muestra el modal
                className="mt-4 p-2 bg-yellow-500 text-white rounded-full"
              >
                ➕ Agregar Plato
              </button>
            </div>

            {/* Mostrar el menú del restaurante */}
            <div className="mt-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-center text-[#EF4423]">
                Menú del Restaurante
              </h3>
              <ul className="space-y-4 mt-4">
                {menu.length > 0 ? (
                  menu.map((item: any) => (
                    <li
                      key={item.id}
                      className="bg-gray-100 p-4 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-[#EF4423]">
                            {item.name}
                          </h4>
                          <p className="text-sm">{item.description}</p>
                          <p className="text-lg font-bold">{`$${item.price}`}</p>
                        </div>
                        <div className="flex space-x-4">
                          {/* Botón de Editar */}
                          <button
                            onClick={() => handleEditClick(item)}
                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteDish(item.id)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No hay menú disponible en este momento.</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      {showModalEdit && selectedDish && (
        <ModalEditDish
          dish={selectedDish}
          onClose={() => setShowModalEdit(false)}
        />
      )}

      {showModalAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md">
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <h3 className="text-lg font-semibold text-center text-[#EF4423]">
                Agregar Nuevo Plato
              </h3>
              <input
                type="text"
                name="name"
                placeholder="Nombre del plato"
                value={newDish.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
              />
              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={newDish.price}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
              />
              <input
                type="text"
                name="description"
                placeholder="Descripción"
                value={newDish.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
              />
              <input
                type="text"
                name="image"
                placeholder="URL de la imagen"
                value={newDish.image}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4423]"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleAddDish}
                className="bg-[#EF4423] text-white px-4 py-2 rounded-lg"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowModalAdd(false)} // Cierra el modal
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
