"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

interface Dish {
  id: "";
  name: "";
  price: 0;
  description: "";
  image: "";
  isVegetarian: false;
  isVegan: false;
  isLactoseFree: false;
  isGlutenFree: false;
}

interface Restaurant {
  id: "";
  name: "";
  isVegetarian: false;
  isVegan: false;
  isLactoseFree: false;
  isGlutenFree: false;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]); // Lista de restaurantes del dueño
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null); // Restaurante seleccionado
  const [menu, setMenu] = useState<any>([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedDish, setSelectedDish] = useState<any>(null); // Estado para almacenar el plato seleccionado
  const [newDish, setNewDish] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
    isVegetarian: false,
    isVegan: false,
    isLactoseFree: false,
    isGlutenFree: false,
  });

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
        email: usuarioEncontrado.email,
      };

      // Verificar si el usuario es dueño de un restaurante
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
        "https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Restaurantes?select=*&userId=eq." +
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
      console.log(restaurantData);
      if (restaurantData.length > 0) {
        setRestaurants(restaurantData);

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
        console.log(menuData);

        // Declarar la variable updatedBooleanValues
        let updatedBooleanValues = {
          isVegan: false,
          isVegetarian: false,
          isLactoseFree: false,
          isGlutenFree: false,
        };

        // Si no hay platos, establecer las insignias en false
        if (menuData.length === 0) {
          updatedBooleanValues = {
            isVegan: false,
            isVegetarian: false,
            isLactoseFree: false,
            isGlutenFree: false,
          };
        } else {
          // Lógica para actualizar las insignias si hay platos
          updatedBooleanValues = {
            isVegan: menuData.some((dish: Dish) => dish.isVegan) || false,
            isVegetarian:
              menuData.some((dish: Dish) => dish.isVegetarian) || false,
            isLactoseFree:
              menuData.some((dish: Dish) => dish.isLactoseFree) || false,
            isGlutenFree:
              menuData.some((dish: Dish) => dish.isGlutenFree) || false,
          };
        }
        try {
          await axios.patch(
            `https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Restaurantes?id=eq.${restaurantData[0].id}`,
            updatedBooleanValues,
            {
              headers: {
                apikey:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
                "Content-Type": "application/json",
                Prefer: "return=minimal",
              },
            }
          );
        } catch (error) {
          console.error("Error al actualizar el restaurante:", error);
          setErrorMessage(
            "Hubo un error al actualizar los datos del restaurante."
          );
        }
      }
    } catch (error) {
      console.error("Error durante la autenticación:", error);
      setErrorMessage("Hubo un error durante la autenticación.");
    }
  };

  const handleEditClick = (dish: Dish) => {
    setSelectedDish(dish); // Establece el plato que se va a editar
    setShowModalEdit(true); // Muestra el modal de edición
  };

  const ModalEditDish = ({ onClose }: any) => {
    const [formData, setFormData] = useState(selectedDish); // Inicializa con selectedDish
    console.log(formData);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleCheckboxChangeEdit = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { name, checked } = e.target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: checked,
      }));
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
          <label className="block mb-3 flex items-center text-lg">
            <input
              type="checkbox"
              name="isVegetarian"
              checked={formData.isVegetarian}
              onChange={handleCheckboxChangeEdit}
              className="ml-3 mr-3 scale-125" // Agrandado el checkbox con scale-125
            />
            El plato es vegetariano
          </label>
          <label className="block mb-3 flex items-center text-lg">
            <input
              type="checkbox"
              name="isVegan"
              checked={formData.isVegan}
              onChange={handleCheckboxChangeEdit}
              className="ml-3 mr-3 scale-125" // Agrandado el checkbox con scale-125
            />
            El plato es vegano
          </label>
          <label className="block mb-3 flex items-center text-lg">
            <input
              type="checkbox"
              name="isLactoseFree"
              checked={formData.isLactoseFree}
              onChange={handleCheckboxChangeEdit}
              className="ml-3 mr-3 scale-125" // Agrandado el checkbox con scale-125
            />
            El plato es libre de lactosa
          </label>
          <label className="block mb-3 flex items-center text-lg">
            <input
              type="checkbox"
              name="isGlutenFree"
              checked={formData.isGlutenFree}
              onChange={handleCheckboxChangeEdit}
              className="ml-3 mr-3 scale-125" // Agrandado el checkbox con scale-125
            />
            El plato es apto para celiacos
          </label>
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
    if (!selectedRestaurant) {
      alert("Selecciona un restaurante antes de editar un plato.");
      return;
    }

    const updatedDish = {
      name: updateDish.name,
      image: updateDish.image,
      price: updateDish.price,
      description: updateDish.description,
      isVegetarian: updateDish.isVegetarian,
      isVegan: updateDish.isVegan,
      isLactoseFree: updateDish.isLactoseFree,
      isGlutenFree: updateDish.isGlutenFree,
      restaurantId: selectedRestaurant.id, // Asociamos el plato al restaurante correcto
    };

    try {
      // Hacer el PATCH al plato específico
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

      fetchMenu(selectedRestaurant);
    } catch (error) {
      console.error("Error al editar el plato:", error);
      alert("Error al editar el plato.");
    }
  };

  const handleDeleteDish = async (dishId: string) => {
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

      const menuResponse = await fetch(
        "https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Platos?select=*&restaurantId=eq." +
          selectedRestaurant.id,
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

      console.log(menuResponse);
      const menuData = await menuResponse.json();
      setMenu(menuData);

      const updatedBooleanValues = menuData.length
        ? {
            isVegan: menuData.some((dish: Dish) => dish.isVegan),
            isVegetarian: menuData.some((dish: Dish) => dish.isVegetarian),
            isLactoseFree: menuData.some((dish: Dish) => dish.isLactoseFree),
            isGlutenFree: menuData.some((dish: Dish) => dish.isGlutenFree),
          }
        : {
            isVegan: false,
            isVegetarian: false,
            isLactoseFree: false,
            isGlutenFree: false,
          };

      console.log("Valores actualizados:", updatedBooleanValues);

      // Realiza el PATCH para actualizar los valores
      await axios.patch(
        `https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Restaurantes?id=eq.${selectedRestaurant.id}`,
        updatedBooleanValues,
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
        }
      );

      const restaurantResponse = await fetch(
        `https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Restaurantes?select=*&id=eq.${selectedRestaurant.id}`,
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
      setSelectedRestaurant(restaurantData[0]); // Asegúrate de seleccionar el primer elemento si es una lista
      setMenu(menuData);
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
      restaurantId: selectedRestaurant.id,
      name: newDish.name,
      price: newDish.price,
      image: newDish.image,
      description: newDish.description,
      isVegetarian: newDish.isVegetarian,
      isVegan: newDish.isVegan,
      isLactoseFree: newDish.isLactoseFree,
      isGlutenFree: newDish.isGlutenFree,
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
      setNewDish({
        name: "",
        price: 0,
        description: "",
        image: "",
        isVegetarian: false,
        isVegan: false,
        isLactoseFree: false,
        isGlutenFree: false,
      });

      fetchMenu(selectedRestaurant);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al agregar el plato");
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewDish((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSelectedRestaurant = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant); // Actualiza el estado
    fetchMenu(restaurant); // Pasa directamente el restaurante seleccionado
  };

  const fetchMenu = async (restaurant: Restaurant) => {
    try {
      console.log("Restaurante seleccionado:", restaurant);

      const menuResponse = await fetch(
        `https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Platos?restaurantId=eq.${restaurant.id}`,
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

      // Lógica para definir los valores de los booleanos
      const updatedBooleanValues = menuData.length
        ? {
            isVegan: menuData.some((dish: Dish) => dish.isVegan),
            isVegetarian: menuData.some((dish: Dish) => dish.isVegetarian),
            isLactoseFree: menuData.some((dish: Dish) => dish.isLactoseFree),
            isGlutenFree: menuData.some((dish: Dish) => dish.isGlutenFree),
          }
        : {
            isVegan: false,
            isVegetarian: false,
            isLactoseFree: false,
            isGlutenFree: false,
          };

      console.log("Valores actualizados:", updatedBooleanValues);

      // Realiza el PATCH para actualizar los valores
      await axios.patch(
        `https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Restaurantes?id=eq.${restaurant.id}`,
        updatedBooleanValues,
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb2JnaXNsbHRhd2JtbHl4dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk2MzUsImV4cCI6MjA0NjU5NTYzNX0.LDFkamJY2LibAns-wIy1WCEl5DVdj5rjvaecIJVkJSU",
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
        }
      );

      const restaurantResponse = await fetch(
        `https://meobgislltawbmlyxuhw.supabase.co/rest/v1/Restaurantes?select=*&id=eq.${restaurant.id}`,
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
      setSelectedRestaurant(restaurantData[0]); // Asegúrate de seleccionar el primer elemento si es una lista
      setMenu(menuData);
      console.log("Datos del restaurante actualizados:", restaurantData[0]);
    } catch (error) {
      console.error("Error al actualizar el restaurante:", error);
      setErrorMessage("Hubo un error al actualizar los datos del restaurante.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full bg-[#EF4423] text-white text-4xl py-6 text-center font-bold fixed top-0 left-0 right-0">
        DondeComo
      </header>

      {/* Flecha para volver atrás */}
      {selectedRestaurant && (
        <button
          onClick={() => setSelectedRestaurant(null)} // Des-selecciona el restaurante
          className="absolute top-6 left-6 text-white text-3xl hover:text-gray-300"
        >
          &#8592; {/* Símbolo de flecha hacia atrás */}
        </button>
      )}

      {/* Contenedor de login y restaurante, centrado en el espacio restante */}
      <div className="flex-grow flex flex-col items-center justify-center py-20">
        {restaurants.length === 0 ? (
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
        ) : !selectedRestaurant ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#EF4423]">
              Selecciona un Restaurante
            </h2>
            <ul>
              {restaurants.map((restaurant) => (
                <li
                  key={restaurant.id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    console.log(restaurant); // Imprime el restaurante en la consola
                    handleSelectedRestaurant(restaurant); // Llama a la función con el restaurante seleccionado
                  }}
                >
                  {restaurant.name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center bg-white p-6 rounded-lg shadow-lg mt-12">
            <h2 className="text-xl font-semibold text-center text-[#EF4423]">
              Restaurante: {selectedRestaurant.name}
            </h2>
            {/* Contenedor de insignias */}
            <div className="flex justify-center mt-4 space-x-4">
              {selectedRestaurant.isVegan && (
                <img
                  src="https://images.vexels.com/content/136047/preview/gluten-free-ecology-label-badge-6f3058.png" // Ruta de la imagen de la insignia vegana
                  alt="Vegan"
                  className="w-8 h-8"
                />
              )}
              {selectedRestaurant.isVegetarian && (
                <img
                  src="https://images.vexels.com/content/136047/preview/gluten-free-ecology-label-badge-6f3058.png" // Ruta de la imagen de la insignia vegetariana
                  alt="Vegetarian"
                  className="w-8 h-8"
                />
              )}
              {selectedRestaurant.isLactoseFree && (
                <img
                  src="https://images.vexels.com/content/136047/preview/gluten-free-ecology-label-badge-6f3058.png" // Ruta de la imagen de la insignia libre de lactosa
                  alt="Lactose Free"
                  className="w-8 h-8"
                />
              )}
              {selectedRestaurant.isGlutenFree && (
                <img
                  src="https://images.vexels.com/content/136047/preview/gluten-free-ecology-label-badge-6f3058.png" // Ruta de la imagen de la insignia libre de gluten
                  alt="Gluten Free"
                  className="w-8 h-8"
                />
              )}
            </div>
            <div className="mt-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-center text-[#EF4423]">
                Menú
              </h3>
              <ul className="space-y-4 mt-4">
                {menu.map((dish: Dish) => (
                  <li
                    key={dish.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-[#EF4423]">
                          {dish.name}
                        </h4>
                        <p className="text-sm">{dish.description}</p>
                        <p className="text-lg font-bold">{`$${dish.price}`}</p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEditClick(dish)}
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowModalAdd(true)}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              ➕ Agregar Plato
            </button>
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
            <div>
              <label className="block mb-3 flex items-center text-lg">
                <input
                  type="checkbox"
                  name="isVegetarian"
                  checked={newDish.isVegetarian}
                  onChange={handleCheckboxChange}
                  className="ml-3 mr-3 scale-125" // Agrandado el checkbox con scale-125
                />
                El plato es vegetariano
              </label>
              <label className="block mb-3 flex items-center text-lg">
                <input
                  type="checkbox"
                  name="isVegan"
                  checked={newDish.isVegan}
                  onChange={handleCheckboxChange}
                  className="ml-3 mr-3 scale-125" // Agrandado el checkbox con scale-125
                />
                El plato es vegano
              </label>
              <label className="block mb-3 flex items-center text-lg">
                <input
                  type="checkbox"
                  name="isLactoseFree"
                  checked={newDish.isLactoseFree}
                  onChange={handleCheckboxChange}
                  className="ml-3 mr-3 scale-125" // Agrandado el checkbox con scale-125
                />
                El plato es libre de lactosa
              </label>
              <label className="block mb-3 flex items-center text-lg">
                <input
                  type="checkbox"
                  name="isGlutenFree"
                  checked={newDish.isGlutenFree}
                  onChange={handleCheckboxChange}
                  className="ml-3 mr-3 scale-125" // Agrandado el checkbox con scale-125
                />
                El plato es apto para celiacos
              </label>
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
