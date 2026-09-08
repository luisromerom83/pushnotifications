# 📩 PushInbox: Aplicación con Firebase Auth, Inbox HTML y Push Notifications (FCM)

Esta aplicación implementa un sistema completo donde:
1. **Los usuarios se registran e inician sesión** mediante **Firebase Authentication**.
2. Al ingresar acceden a una **Bandeja de Entrada (Inbox)** diseñada con **Bootstrap 5**, que sincroniza en tiempo real los mensajes recibidos.
3. Cada mensaje del Inbox es un **contenido HTML rico** (facturas, alertas, recibos, etc.) renderizado de forma aislada y segura en un visor interactivo.
4. Una **API REST externa** (`POST /api/inbox/send`) permite que cualquier sistema tercero envíe nuevos elementos al usuario enviando el `title`, `html`, `pushTitle` y `pushBody`.
5. Al recibir la petición por la API, el usuario recibe inmediatamente una **Notificación Push (Web Push con Firebase Cloud Messaging - FCM)** en sus dispositivos.

---

## 🚀 Inicio Rápido

### 1. Requisitos Previos
- Node.js versión 18 o superior.
- Una cuenta en [Firebase Console](https://console.firebase.google.com/).

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Iniciar el servidor
```bash
npm start
```
Abre tu navegador en: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuración Paso a Paso en Firebase (Consola en Inglés)

Para conectar la aplicación con tu proyecto de Firebase, sigue estos pasos guiados utilizando los nombres tal como aparecen en la interfaz en inglés de [Firebase Console](https://console.firebase.google.com/):

### Paso A: Crear o seleccionar tu proyecto
1. Ingresa a [Firebase Console](https://console.firebase.google.com/).
2. Haz clic en **"Add project"** (o selecciona tu proyecto existente).
3. Escribe el nombre de tu proyecto (ej. `push-inbox-demo`) y completa el asistente.

### Paso B: Habilitar Firebase Authentication
1. En el menú lateral izquierdo, puedes hacer clic directamente en **"Authentication"** (en *Project shortcuts*), o buscarlo en la barra superior **"Search for products"**.
2. Haz clic en el botón **"Get started"**.
3. En la pestaña **"Sign-in method"**, haz clic en el proveedor **"Email/Password"**.
4. Activa el interruptor **Enable** para **"Email/Password"** y presiona **"Save"**.

### Paso C: Habilitar Cloud Firestore Database
1. En el menú lateral izquierdo, ve a **Product categories > Databases & Storage** y en la sección **NoSQL** selecciona **"Firestore"**.
2. Haz clic en **"Create database"**.
3. Selecciona tu ubicación/región de preferencia para Cloud Firestore.
4. En el paso de reglas de seguridad, selecciona **"Start in test mode"** (para pruebas de desarrollo) y haz clic en **"Next"** > **"Enable"**.

### Paso D: Registrar la App Web y obtener la VAPID Key (Web Push)
1. En el menú lateral, haz clic en **Project Overview** (o ve a **Settings > Project settings > General**).
2. En la sección de tus aplicaciones (*Your apps*), haz clic en el ícono Web **`</>`** (o en **"Add app" > Web**).
3. Asigna un nombre como `PushInbox Web` y haz clic en **"Register app"**.
4. Copia los valores del objeto `firebaseConfig`:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
5. En el menú lateral izquierdo, ve a **Settings > Project settings** (o el ícono de engrane ⚙️).
6. Ve a la pestaña **"Cloud Messaging"**.
7. Desplázate hacia abajo hasta la sección **"Web configuration"** (o **"Web Push certificates"**).
8. En el apartado **"Key pair"**, haz clic en **"Generate key pair"**.
9. Copia la clave pública generada (este es tu **VAPID Key**).
10. Ahora abre la aplicación en tu navegador ([http://localhost:3000](http://localhost:3000)), haz clic en el botón superior **"⚙️ Configurar Firebase"**, pega estos valores y presiona **"Guardar y Recargar"**.

### Paso E: Generar la Clave de Servicio Privada (Service Account para el Backend)
1. En el menú lateral izquierdo, ve a **Settings > Project settings**.
2. Ve a la pestaña **"Service accounts"**.
3. Asegúrate de que esté seleccionado **"Firebase Admin SDK"** y el lenguaje **Node.js**.
4. Haz clic en el botón **"Generate new private key"**.
5. Confirma haciendo clic en **"Generate key"**. Se descargará un archivo `.json`.
6. Renombra ese archivo como **`serviceAccountKey.json`** y colócalo en la carpeta raíz de este proyecto:
   ```text
   /PushNotifications/serviceAccountKey.json
   ```
7. Reinicia el servidor en tu terminal:
   ```bash
   npm start
   ```

---

## 📡 Uso de la API REST Externa

### Endpoint
```http
POST /api/inbox/send
Content-Type: application/json
```

### Parámetros del Body (JSON)
| Campo | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `userEmail` | String | Sí* | Correo del usuario registrado (o usar `userId`) |
| `userId` | String | Sí* | UID del usuario en Firebase Auth |
| `title` | String | **Sí** | Título que aparecerá en el listado del Inbox |
| `html` | String | **Sí** | Contenido HTML completo a visualizar |
| `pushTitle` | String | **Sí** | Título que se mostrará en la Notificación Push |
| `pushBody` | String | **Sí** | Cuerpo/texto descriptivo de la Notificación Push |

### Ejemplo con cURL
```bash
curl -X POST "http://localhost:3000/api/inbox/send" \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "usuario@ejemplo.com",
    "title": "Factura de Servicio #FAC-2026-9810",
    "pushTitle": "📄 Nueva Factura Disponible",
    "pushBody": "Tu factura de septiembre por $1,450.00 MXN ya está disponible.",
    "html": "<html><body style=\"font-family: sans-serif; padding: 20px;\"><h2>Factura #FAC-2026-9810</h2><p>Estimado cliente, su factura ha sido generada con éxito.</p></body></html>"
  }'
```

### Ejemplo con JavaScript / Node.js
```javascript
const response = await fetch("http://localhost:3000/api/inbox/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userEmail: "usuario@ejemplo.com",
    title: "Aviso de Pago Aprobado",
    pushTitle: "✅ Pago recibido",
    pushBody: "Hemos procesado tu pago correspondiente al periodo actual.",
    html: "<h1>Comprobante de Pago</h1><p>Monto: $500.00</p>"
  })
});
const result = await response.json();
console.log(result);
```

### Ejemplo con Python
```python
import requests

payload = {
    "userEmail": "usuario@ejemplo.com",
    "title": "Aviso de Seguridad",
    "pushTitle": "🛡️ Alerta de Seguridad",
    "pushBody": "Nuevo inicio de sesión detectado.",
    "html": "<h1>Alerta de Seguridad</h1><p>Acceso desde una nueva IP.</p>"
}

response = requests.post("http://localhost:3000/api/inbox/send", json=payload)
print(response.json())
```

---

## ☁️ Despliegue en Vercel (Frontend y Backend)

Tanto la interfaz web como la API REST están configurados para ejecutarse en Vercel sin cambios:

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard) y haz clic en **"Add New... > Project"**.
2. Selecciona e importa tu repositorio de GitHub: **`luisromerom83/pushnotifications`**.
3. En la sección **Environment Variables**, agrega:
   - **Nombre:** `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Valor:** Pega todo el contenido de tu archivo `serviceAccountKey.json` en una sola línea (o en bloque JSON).
4. Haz clic en **Deploy**.
5. Vercel te proporcionará una URL de producción pública (ej: `https://pushnotifications-xxx.vercel.app`), que ya cuenta con HTTPS obligatorio para Web Push Notifications.

---

## 🤖 Compilación de Android App Bundle (.aab) para Google Play Console

El repositorio cuenta con un **GitHub Action** automatizado que compila y firma el archivo `.aab` listo para subirlo a Google Play Console:

### 1. ¿Cómo obtener el archivo `.aab`?
1. Cada vez que hagas un `push` a la rama `main`, o bien desde la pestaña **Actions** en tu repositorio:
   [https://github.com/luisromerom83/pushnotifications/actions](https://github.com/luisromerom83/pushnotifications/actions)
2. Selecciona el workflow: **"Generar AAB para Google Play Console"**.
3. Haz clic en la última ejecución exitosa.
4. Al final de la página, en la sección **Artifacts**, descarga:
   - **`app-release-aab`**: Archivo `.zip` que contiene el `app-release.aab` firmado para Google Play.
   - **`release-keystore`**: La clave de firma utilizada (consérvala para futuras actualizaciones).

### 2. Subir a Google Play Console (Prueba Cerrada / Closed Testing)
1. Ingresa a [Google Play Console](https://play.google.com/console).
2. Selecciona o crea tu aplicación (Nombre: *PushInbox*, Tipo: *App*, Gratis).
3. En el menú lateral izquierdo, ve a **Release > Testing > Closed testing** (o *Pruebas cerradas*).
4. En la pista de pruebas (Alpha/Closed track), haz clic en **"Manage track" > "Create new release"**.
5. En la sección **App bundles**, arrastra y suelta tu archivo `app-release.aab` descargado.
6. En **Release notes**, escribe una nota breve (ej. *Versión 1.0.0 - Prueba cerrada con notificaciones push*).
7. Haz clic en **"Next"** y luego en **"Save and publish"** para iniciar la prueba cerrada con tus testers.

---

## 🌟 Características de la Aplicación

- **Diseño con Bootstrap 5.3**: Interfaz visual adaptable, limpia y receptiva para móviles y escritorios.
- **Autenticación con Firebase Auth**: Pestaña de inicio de sesión y registro de nuevos usuarios con validación de formularios y mensajes de error en español.
- **Inbox en Tiempo Real**: Conectado a Firestore con escucha reactiva (`onSnapshot`), buscador de mensajes y filtro de leídos/no leídos.
- **Lector HTML en Sandbox**: Cada mensaje se previsualiza en un `iframe` aislado que respeta estilos, tablas, botones y gráficos sin afectar el diseño exterior.
- **Acciones Rápidas**: Marcar como leído/no leído, abrir en pestaña completa, imprimir y eliminar.
- **Notificaciones Push (FCM)**:
  - Manejo en **segundo plano** a través de `firebase-messaging-sw.js`.
  - Manejo en **primer plano** con alertas Toast de Bootstrap y efecto de sonido.
  - Al hacer clic en la notificación, se enfoca la app y se abre directamente el mensaje.
- **Simulador de API Integrado**: Permite probar el envío de HTML y Push con 1 clic usando plantillas precargadas (Factura, Alerta de Seguridad, Boletín).
- **PWA & TWA para Android**: Incluye `manifest.json`, iconos adaptativos e integración con `androidbrowserhelper` para publicación en Google Play Store.

---

## 📂 Estructura del Código

```text
├── .github/workflows/
│   └── build-aab.yml              # GitHub Action para compilar y firmar el AAB
├── android/                       # Proyecto Android TWA para Google Play Store
│   ├── app/build.gradle           # Configuración Gradle de la app Android
│   └── app/src/main/              # Manifest, iconos mipmap y recursos nativos
├── api/
│   └── index.js                   # Adaptador Serverless para Vercel
├── vercel.json                    # Configuración de despliegue en Vercel
├── package.json                   # Dependencias de backend Express y Firebase
├── server.js                      # Servidor Express y API /api/inbox/send
├── serviceAccountKey.json.example # Plantilla para clave de cuenta de servicio
├── .env.example                   # Plantilla de variables de entorno
└── public/
    ├── index.html                 # Interfaz con Bootstrap 5
    ├── manifest.json              # PWA Web App Manifest
    ├── css/styles.css             # Estilos personalizados
    ├── js/
    │   ├── firebase-config.js     # Configuración de Firebase y VAPID Key
    │   ├── auth.js                # Login, registro y estado de sesión
    │   ├── fcm.js                 # Manejador de Web Push y Service Worker
    │   ├── inbox.js               # Listado en tiempo real y visor HTML
    │   └── api-tester.js          # Simulador de peticiones y generador de snippets
    └── firebase-messaging-sw.js   # Service Worker para notificaciones push en segundo plano
```
