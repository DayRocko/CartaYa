# 🧠 CartaYa: Gastronomía Inteligente

**CartaYa** es una plataforma integral de gestión para restaurantes (RestPro AI) diseñada para modernizar la operación, optimizar costos y potenciar las ventas a través de datos e Inteligencia Artificial.

---

## 🚀 Módulos Principales

### 1. ▦ POS / Punto de Venta Pro
Interfaz de alta fidelidad diseñada para la velocidad y precisión:
*   **Gestión de Mesas:** Control visual por zonas (Salón, Terraza, VIP) con estados en tiempo real.
*   **Personalización Avanzada:** Sistema de modificadores inteligentes y notas contextuales para cada plato.
*   **Sincronización:** Actualización instantánea entre salón y cocina vía WebSockets.

### 2. 📖 Carta & Menú (Gestión Maestro)
Control total sobre el corazón del negocio:
*   **Ingeniería de Menú:** Análisis de rentabilidad por plato (Matriz de Boston: Estrellas, Enigmas, Caballos, Perros).
*   **Recetarios Técnicos:** Costeo automático basado en ingredientes e insumos.
*   **Importación Masiva:** Herramientas para carga rápida vía Excel (.xlsx).

### 3. ✨ Brain AI
Tu asistente inteligente integrado:
*   Analiza tendencias de ventas.
*   Detecta fugas en inventario y variaciones de costos.
*   Sugiere ajustes de precios y promociones basados en datos reales.

### 4. 📈 Finanzas & Auditoría
*   **Margen Bruto Real:** Seguimiento de Prime Cost y utilidad neta por ítem.
*   **Gestión Fiscal:** Registro de resolución DIAN, prefijos de facturación y control de IVA/Impoconsumo.
*   **Alertas:** Notificaciones automáticas por stock bajo o metas de venta no alcanzadas.

### 5. 🛠 Operaciones & CRM
*   Gestión de reservas y perfiles de clientes.
*   Programas de fidelización y marketing segmentado.
*   Integración con apps de delivery (Rappi, etc.).

---

## 🛠 Stack Tecnológico

*   **Frontend:** [React 18](https://reactjs.org/) (JSX In-browser), [Tailwind CSS](https://tailwindcss.com/), CSS Custom Properties (Design System).
*   **Backend:** [Node.js](https://nodejs.org/) con arquitectura de eventos y [WebSockets](https://github.com/websockets/ws).
*   **Base de Datos:** [SQLite](https://sqlite.org/) (vía `better-sqlite3`).
*   **Procesamiento:** [SheetJS](https://sheetjs.com/) para gestión de archivos Excel.

---

## 📂 Estructura del Proyecto

*   `Avance2135.html`: Núcleo de la aplicación (SPA de alto rendimiento).
*   `server.js`: Servidor de API y archivos estáticos (Puerto 8001).
*   `db/schema.js`: Esquema y lógica de inicialización de la base de datos centralizada.
*   `import/`: Lógica de procesamiento de importaciones masivas.
*   `data/`: Almacenamiento de configuraciones locales y perfiles.

---

## 🏁 Inicio Rápido

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```
2.  **Iniciar el servidor:**
    ```bash
    node server.js
    ```
3.  **Acceder al Dashboard:**
    Abre en tu navegador: [http://localhost:8001/Avance2135.html](http://localhost:8001/Avance2135.html)

---

**Desarrollado para Project # 3 Startup AI - RestPro AI**
