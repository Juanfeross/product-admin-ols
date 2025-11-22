# 🛍️ OL Store - Product Admin

Aplicación de administración de productos desarrollada con Angular 21 como parte del reto técnico para OL Software. Permite gestionar productos de manera completa con operaciones CRUD, carrito de compras, y una interfaz moderna construida con Tailwind CSS.

## 🎯 Objetivo del Proyecto

Desarrollar una aplicación web completa para la administración de productos que permita:

- **CRUD completo** de productos (Crear, Leer, Actualizar, Eliminar)
- **Gestión de carrito de compras** con persistencia local
- **Búsqueda y filtrado** de productos por categoría
- **Ordenamiento** de productos por nombre, precio y rating
- **Vista detallada** de cada producto
- **Interfaz moderna y responsive** con Tailwind CSS
- **Experiencia de usuario optimizada** con modales, toasts, y estados de carga

## 🧪 Tecnologías Usadas y Por Qué

### Core Technologies

- **Angular 21** - Framework principal elegido por su robustez, sistema de componentes standalone, signals reactivos, y excelente ecosistema de herramientas
- **TypeScript** - Tipado estático para mayor seguridad y mantenibilidad del código
- **Tailwind CSS** - Framework de utilidades CSS para desarrollo rápido de interfaces modernas y consistentes
- **RxJS** - Programación reactiva para manejo de datos asíncronos y operaciones complejas

### APIs y Servicios

- **Fake Store API** - API REST pública elegida porque:
  - Proporciona datos realistas de productos (e-commerce)
  - Incluye categorías, imágenes, ratings, y descripciones completas
  - No requiere autenticación, ideal para desarrollo y pruebas
  - Endpoints RESTful estándar que facilitan la integración
  - Permite simular operaciones CRUD completas

### Herramientas de Desarrollo

- **Angular CLI 21** - Herramientas de línea de comandos para scaffolding y build
- **PostCSS** - Procesamiento de CSS con Tailwind

## 🏛️ Arquitectura Elegida

El proyecto sigue una arquitectura **Feature-First con Capas Internas**, organizando el código de manera escalable y mantenible:

```
src/
├── app/
│   ├── core/                    # Núcleo de la aplicación
│   │   ├── guards/              # Guards de rutas
│   │   ├── interceptors/        # Interceptores HTTP
│   │   ├── models/              # Modelos compartidos
│   │   └── services/            # Servicios core (API, Storage, Toast)
│   │
│   ├── features/                # Módulos de funcionalidad
│   │   └── products/
│   │       ├── components/      # Componentes específicos del feature
│   │       ├── models/          # Modelos del dominio
│   │       ├── pages/           # Páginas/containers
│   │       ├── services/        # Servicios del feature
│   │       └── validators/      # Validadores personalizados
│   │
│   ├── layout/                  # Componentes de layout
│   │   ├── components/
│   │   │   ├── header/
│   │   │   └── footer/
│   │   └── layout.component.ts
│   │
│   └── shared/                  # Componentes y utilidades compartidas
│       ├── components/          # Componentes reutilizables
│       │   ├── modal/
│       │   ├── toast/
│       │   ├── skeleton/
│       │   └── empty-state/
│       ├── directives/
│       ├── pipes/
│       └── utils/
│
└── styles.css                   # Estilos globales
```

### Principios de Arquitectura

- **Separación de responsabilidades**: Cada capa tiene un propósito claro
- **Reutilización**: Componentes compartidos en `shared/`
- **Escalabilidad**: Fácil agregar nuevos features sin afectar existentes
- **Mantenibilidad**: Código organizado y fácil de navegar
- **Clean Code**: Nombres descriptivos, funciones pequeñas, código autodocumentado

## 🧠 Decisiones Técnicas

### 1. **localStorage para Persistencia**

**Decisión**: Usar `localStorage` en lugar de una base de datos backend.

**Razones**:
- Requisito del reto técnico: simular persistencia sin backend
- Permite mantener el estado entre recargas de página
- Implementación rápida y sin dependencias externas
- Adecuado para un MVP o prototipo

**Implementación**:
- Servicio `StorageService` que abstrae el acceso a `localStorage`
- Almacenamiento de productos y carrito de compras
- Reseteo automático a datos originales de la API al recargar

### 2. **Fake Store API**

**Decisión**: Integrar Fake Store API como fuente de datos inicial.

**Razones**:
- API pública y gratuita sin necesidad de autenticación
- Datos realistas de productos de e-commerce
- Estructura de datos completa (imágenes, categorías, ratings)
- Endpoints RESTful estándar
- Ideal para desarrollo y demostración

**Implementación**:
- Servicio `ApiService` genérico para peticiones HTTP
- `ProductsService` que combina API y localStorage
- Sincronización automática entre API y almacenamiento local

### 3. **Signals de Angular**

**Decisión**: Usar Signals en lugar de Observables para estado local.

**Razones**:
- API más simple y directa para estado reactivo
- Mejor rendimiento con detección de cambios granular
- Integración nativa con Angular 21
- Código más legible y mantenible

**Implementación**:
- Signals para productos, carrito, y estados de UI
- Computed signals para valores derivados (filtrados, totales)
- Integración con servicios que usan Observables

### 4. **Componentes Standalone**

**Decisión**: Usar componentes standalone en lugar de módulos.

**Razones**:
- Arquitectura moderna de Angular 21
- Menos boilerplate y configuración
- Mejor tree-shaking y optimización
- Importaciones explícitas y claras

### 5. **Tailwind CSS**

**Decisión**: Usar Tailwind CSS para estilos.

**Razones**:
- Desarrollo rápido de interfaces modernas
- Consistencia visual con sistema de diseño
- Utilidades CSS que reducen CSS personalizado
- Fácil mantenimiento y escalabilidad

### 6. **Estructura de Carpetas Feature-First**

**Decisión**: Organizar por features en lugar de por tipo de archivo.

**Razones**:
- Código relacionado agrupado lógicamente
- Fácil localizar funcionalidad específica
- Escalable para equipos grandes
- Reduce acoplamiento entre features

## 🚀 Cómo Correr el Proyecto

### Prerrequisitos

- **Node.js** 20.x o superior
- **npm** 10.x o superior (incluido con Node.js)

### Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/Juanfeross/product-admin-ols.git
cd product-admin-ols
```

2. **Instalar dependencias**:
```bash
npm install
```

### Desarrollo

**Iniciar servidor de desarrollo**:
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

El servidor se recarga automáticamente cuando detecta cambios en los archivos.

### Build

**Compilar para producción**:
```bash
npm run build
# o
ng build
```

Los archivos compilados se generan en la carpeta `dist/product-admin-ols/`

**Build optimizado para producción**:
```bash
ng build --configuration production
```

### Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm run watch` - Compila en modo watch

## 📊 Lighthouse y Performance

### Análisis de Performance

El proyecto ha sido optimizado para obtener excelentes métricas en Lighthouse:

- **Performance**: Optimización de bundle, lazy loading, y código eficiente
- **Accessibility**: ARIA labels, navegación por teclado, y focus management
- **Best Practices**: Uso de HTTPS, sin errores de consola, y código moderno
- **SEO**: Meta tags, estructura semántica, y contenido indexable

### Cómo Ejecutar Lighthouse

#### Opción 1: Chrome DevTools (Recomendado)

1. Abre la aplicación en Chrome
2. Abre DevTools (F12)
3. Ve a la pestaña **Lighthouse**
4. Selecciona las categorías que deseas analizar
5. Haz clic en **Generate report**

#### Opción 2: Lighthouse CLI

1. **Instalar Lighthouse CLI globalmente**:
```bash
npm install -g lighthouse
```

2. **Ejecutar análisis**:
```bash
# Para desarrollo local
lighthouse http://localhost:4200 --view

# Para producción
lighthouse https://product-admin-ols.vercel.app/products --view
```

3. **Generar reporte HTML**:
```bash
lighthouse https://product-admin-ols.vercel.app/products --output html --output-path ./lighthouse-report.html
```

#### Opción 3: Lighthouse CI (Para CI/CD)

```bash
npm install -g @lhci/cli
lhci autorun
```

### Optimizaciones Implementadas

- ✅ **Lazy Loading**: Rutas cargadas bajo demanda
- ✅ **Tree Shaking**: Eliminación de código no usado
- ✅ **Code Splitting**: Bundles optimizados por ruta
- ✅ **Image Optimization**: Placeholders y manejo de errores
- ✅ **Caching**: Estrategias de caché para assets estáticos
- ✅ **Minification**: Código minificado en producción

## 🌐 Deploy

### Link al Deploy

🔗 **Aplicación en producción**: [https://product-admin-ols.vercel.app/products](https://product-admin-ols.vercel.app/products)

### Plataforma de Deploy

El proyecto está desplegado en **Vercel**, aprovechando:

- Deploy automático desde GitHub
- SSL/HTTPS incluido
- CDN global para mejor performance
- Preview deployments para cada PR
- Configuración cero para proyectos Angular

### Repositorio

📦 **Código fuente**: [https://github.com/Juanfeross/product-admin-ols](https://github.com/Juanfeross/product-admin-ols)

## 📱 Funcionalidades Principales

### Gestión de Productos

- ✅ **Listar productos** con paginación y "Cargar más"
- ✅ **Crear productos** con validación completa
- ✅ **Editar productos** desde lista o detalle
- ✅ **Eliminar productos** con confirmación
- ✅ **Búsqueda en tiempo real** con debounce
- ✅ **Filtrado por categoría**
- ✅ **Ordenamiento** (nombre, precio, rating)

### Carrito de Compras

- ✅ **Agregar productos** al carrito
- ✅ **Actualizar cantidades** desde tarjetas o sidebar
- ✅ **Eliminar productos** del carrito
- ✅ **Calcular totales** automáticamente
- ✅ **Persistencia** en localStorage
- ✅ **Sidebar deslizable** con animaciones

### Experiencia de Usuario

- ✅ **Modales** para crear/editar productos
- ✅ **Toasts** para feedback de acciones
- ✅ **Skeleton loaders** durante carga
- ✅ **Estados vacíos** con mensajes descriptivos
- ✅ **Manejo de errores** visual
- ✅ **Validación de formularios** en tiempo real
- ✅ **Accesibilidad** (ARIA, navegación por teclado)

## 🛠️ Estructura del Proyecto

```
product-admin-ols/
├── src/
│   ├── app/
│   │   ├── core/              # Servicios core y modelos
│   │   ├── features/          # Features de la aplicación
│   │   ├── layout/            # Componentes de layout
│   │   └── shared/            # Componentes compartidos
│   ├── styles.css             # Estilos globales
│   └── main.ts                # Punto de entrada
├── public/                     # Assets estáticos
├── angular.json               # Configuración Angular
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

## 📝 Notas Adicionales

### Características Técnicas Destacadas

- **Signals Reactivos**: Estado reactivo moderno de Angular 21
- **Standalone Components**: Arquitectura sin módulos
- **Reactive Forms**: Formularios con validación avanzada
- **Custom Validators**: Validadores personalizados (URL, números positivos)
- **Debounce Search**: Búsqueda optimizada con RxJS
- **Computed Signals**: Valores derivados reactivos
- **LocalStorage Abstraction**: Servicio genérico para almacenamiento
- **Error Handling**: Manejo centralizado de errores
- **Loading States**: Estados de carga en todas las operaciones
- **Accessibility**: ARIA labels y navegación por teclado

## 🤵 Contacto

### Juan Fernando Álvarez Gallego

- 📧 **Email**: [Disponible en LinkedIn](https://www.linkedin.com/in/juan-fernando-%C3%A1lvarez-gallego-b97b31212/)
- 💼 **LinkedIn**: [https://www.linkedin.com/in/juan-fernando-%C3%A1lvarez-gallego-b97b31212/](https://www.linkedin.com/in/juan-fernando-%C3%A1lvarez-gallego-b97b31212/)
- 📱 **Teléfono**: +57 302 2856079
- 🌐 **Portfolio/Proyecto**: [https://product-admin-ols.vercel.app/products](https://product-admin-ols.vercel.app/products)
- 💻 **GitHub**: [https://github.com/Juanfeross/product-admin-ols](https://github.com/Juanfeross/product-admin-ols)

---

## 📄 Licencia

Este proyecto fue desarrollado como parte de un reto técnico para OL Software.

---

**Desarrollado con ❤️ usando Angular 21**
