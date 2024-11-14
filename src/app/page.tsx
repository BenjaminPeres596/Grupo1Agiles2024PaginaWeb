"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [restaurant, setRestaurant] = useState<any>(null);

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

      // Aquí puedes manejar la navegación, la actualización del contexto, etc.
      // Por ejemplo, guardar los datos del usuario en un contexto global (si es necesario).
      console.log("Login exitoso, usuario:", userData);

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
      }
    } catch (error) {
      setErrorMessage("Error en la solicitud");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Título DondeComo fijo en la parte superior */}
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
              <button className="mt-4 p-2 bg-yellow-500 text-white rounded-full">
                ✏️ Editar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
