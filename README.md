## **Proyecto Monarca - Frontend**

Este repositorio forma parte de **Proyecto Monarca**, una iniciativa estratégica diseñada para revolucionar la gestión de viajes empresariales mediante una plataforma integral, segura y altamente adaptable.  

## Visión general

Frontend construido con React + Vite (TypeScript). Consume la API que corre en NestJS.

Objetivos principales:

- Interfaz para diferentes roles (Solicitante, Aprobador, Control de costos, Agente de viajes).

- Flujo de autenticación y autorización basado en JWT.

- Gestión de estado para formularios y datos remotos.

- Rutas protegidas según rol.

- Modularidad y reusabilidad de componentes.

- Tests unitarios y de integración (componentes, hooks, servicios).

## Estructura

```md
src/
├─ __tests__/         # Tests unitarios / de integración (Jest, React Testing Library)
├─ assets/            # Imágenes, fuentes, íconos, archivos estáticos importados en componentes
├─ components/        # Componentes reutilizables (UI atoms/molecules/organisms)
├─ config/            # Configuración global (endpoints API, constantes, contextos de configuración)
├─ hooks/             # Custom hooks (e.g., useAuth, useFetch, useForm, usePagination)
├─ pages/             # Páginas o vistas (cada ruta principal). Ej: LoginPage, DashboardPage, RequestPage, ApprovalPage
├─ public/            # Archivos estáticos expuestos directamente por Vite (favicon, index.html referencia)
├─ types/             # Tipos TypeScript compartidos (interfaces de datos, enums, tipos de respuesta API)
├─ utils/             # Funciones auxiliares (formatters, helpers de fechas, validaciones genéricas)
├─ App.css            # Estilos globales básicos (reseteos o utilidades mínimas)
├─ index.css          # Estilos raíz, importados en main.tsx
├─ main.tsx           # Punto de entrada: renderiza <App /> y configura Providers (Router, Contexts, etc.)
├─ vite-env.d.ts      # Declaraciones de tipos para Vite
└─ (posible) serviceWorker.ts  # Si se usa PWA
```


## Requisitos

- Node.js (usamos `nvm` para manejar versiones)
- `npm` (Node Package Manager)
- `direnv`

> Al entrar al repo, corre `direnv allow` si es la primera vez.

## ⚙️ Instalación de herramientas
Instalar **direnv**

- macOS: `brew install direnv`

Agrega el siguiente hook a tu shell:
```bash
# Bash
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc

# Zsh
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
```

Habilitar **direnv** para este repositorio
```bash
direnv allow
```

Instalar **nvm** y **Node.js**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

source ~/.bashrc # o ~/.zshrc según tu shell

nvm install
```

## Instalación del Proyecto

```bash
npm install
```

### Levantar en local

```bash
npm run dev
```

### Variables de entorno
Crear un archivo `.env` con el contenido especificado en el `.env.example`:

```bash
VITE_API_URL=
```

