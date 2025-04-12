Este es un ejemplo básico de como hacer requests con el archvio de apiService. Este caso es el del login.

```javascript
// Función para manejar el envío del formulario de login
const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await postRequest("/login", { username, password });
    setResponseMsg("Login exitoso!");
    console.log("Respuesta de login:", response);
    setErrorMsg("");
  } catch (error) {
    setErrorMsg("Error al iniciar sesión");
    setResponseMsg("");
    console.error("Error en login:", error);
  }
};
```
