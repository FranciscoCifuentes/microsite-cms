# Microsite CMS

Un CMS multi-tenant para páginas de aterrizaje del sector salud con capacidades de edición de arrastrar y soltar.

## Características

- 🏢 **Arquitectura Multi-tenant**: Hospede múltiples sitios en diferentes dominios
- 🎨 **Editor de Arrastrar y Soltar**: Edición de contenido basada en bloques con react-page
- 🔐 **Autenticación y RBAC**: NextAuth con control de acceso basado en roles
- 📝 **Contenido Markdown**: Renderizado seguro de markdown con protección XSS
- 🖼️ **Gestión de Medios**: Carga de imágenes con conversión automática a WebP y miniaturas
- 🌍 **Internacionalización**: Soporte para locales es-CO, es-DO y en
- 🚀 **SSR/ISR**: Renderizado del lado del servidor con regeneración estática incremental
- 🔒 **Seguridad**: Sanitización de contenido, encabezados CSP y hooks de escaneo antivirus
- 📦 **Flujo de Trabajo de Vista Previa**: Borrador → Staging → Producción con enlaces de vista previa compartibles

## Stack Tecnológico

- **Framework**: Next.js 15 con App Router
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth
- **Editor**: react-page
- **Markdown**: remark + rehype con sanitización
- **Procesamiento de Imágenes**: Sharp
- **Almacenamiento**: Sistema de archivos local (adaptadores compatibles con S3 listos)

## Requisitos Previos

- Node.js 20+
- PostgreSQL 14+
- npm o yarn

## Comenzando

### 1. Clonar el repositorio

```bash
git clone https://github.com/FranciscoCifuentes/microsite-cms.git
cd microsite-cms
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edite el archivo `.env` y configure su conexión a la base de datos y otras configuraciones necesarias.

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar las migraciones
npm run prisma:migrate

# Sembrar datos de demostración (opcional)
npm run db:seed
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) en su navegador.

### 6. Iniciar sesión con las credenciales de demostración

- **Super Admin**: `admin@example.com` / `admin123`
- **Editor**: `editor@example.com` / `editor123`

## Estructura del Proyecto

```
microsite-cms/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── seed.ts                # Script de datos de inicialización
├── public/
│   └── uploads/               # Cargas de medios (almacenamiento local)
├── src/
│   ├── app/
│   │   ├── api/               # Rutas de API
│   │   │   ├── auth/          # Endpoints de NextAuth
│   │   │   ├── health/        # Verificación de salud
│   │   │   ├── media/         # Carga/listado de medios
│   │   │   └── pages/         # Operaciones CRUD
│   │   └── ...                # Componentes de página
│   ├── lib/
│   │   ├── auth.ts            # Configuración de NextAuth
│   │   ├── prisma.ts          # Cliente de Prisma
│   │   ├── tenant.ts          # Utilidades multi-tenant
│   │   └── markdown.ts        # Renderizado de Markdown
│   ├── types/
│   │   └── next-auth.d.ts     # Definiciones de tipos
│   └── middleware.ts          # Resolvedor multi-tenant
├── .env.example               # Plantilla de variables de entorno
└── package.json
```

## Endpoints de API

### Verificación de Salud
- `GET /api/health` - Verificar el estado del servicio

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signout` - Cerrar sesión

### Páginas
- `GET /api/pages` - Listar páginas
- `POST /api/pages` - Crear página
- `GET /api/pages/[id]` - Obtener página
- `PUT /api/pages/[id]` - Actualizar página
- `DELETE /api/pages/[id]` - Eliminar página
- `POST /api/pages/[id]/publish` - Publicar página (staging/producción)

### Medios
- `GET /api/media` - Listar archivos de medios
- `POST /api/media/upload` - Cargar archivo

## Variables de Entorno

Consulte `.env.example` para todas las opciones de configuración disponibles.

### Variables Requeridas

- `DATABASE_URL` - Cadena de conexión a PostgreSQL
- `NEXTAUTH_URL` - URL de la aplicación
- `NEXTAUTH_SECRET` - Clave secreta de NextAuth (mínimo 32 caracteres)

### Variables Opcionales

- `STORAGE_TYPE` - Adaptador de almacenamiento (local/s3)
- `ANTIVIRUS_ENABLED` - Habilitar escaneo antivirus
- `MAX_FILE_SIZE` - Tamaño máximo de carga en bytes
- `ALLOWED_MIME_TYPES` - Tipos MIME permitidos separados por comas

## Scripts de Base de Datos

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Crear migración
npm run prisma:migrate

# Desplegar migraciones (producción)
npm run prisma:deploy

# Abrir Prisma Studio
npm run prisma:studio

# Reiniciar base de datos y resembrar
npm run db:reset

# Sembrar base de datos únicamente
npm run db:seed
```

## Roles de Usuario

- **SUPER_ADMIN**: Acceso completo al sistema, puede crear tenants e invitar usuarios
- **EDITOR**: Puede crear y editar páginas, cargar medios
- **VIEWER**: Acceso de solo lectura

## Flujo de Trabajo de Publicación

1. **Borrador**: Estado inicial, no visible para el público
2. **Staging**: Publicado en staging con enlace de vista previa compartible
3. **Producción**: Publicado en producción con revalidación ISR

## Características de Seguridad

- Sanitización de contenido (rehype-sanitize)
- Protección XSS
- Protección CSRF (NextAuth)
- Control de acceso basado en roles
- Aislamiento de tenants
- Validación de carga de archivos
- Hooks de escaneo antivirus
- Limitación de tasa lista para usar

## Desarrollo

```bash
# Ejecutar linter
npm run lint

# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start
```

## Despliegue

Esta aplicación está diseñada para ser desplegada en cualquier plataforma que soporte Node.js:

- Vercel (recomendado)
- AWS
- Google Cloud
- DigitalOcean
- Auto-hospedado

### Requisitos

1. Base de datos PostgreSQL
2. Runtime de Node.js
3. Variables de entorno configuradas
4. Opcional: Almacenamiento compatible con S3 para medios

## Contribuir

1. Haga fork del repositorio
2. Cree su rama de característica
3. Haga commit de sus cambios
4. Haga push a la rama
5. Cree un Pull Request

## Licencia

Privado - Todos los derechos reservados

## Soporte

Para soporte y preguntas, por favor cree un issue en el repositorio.

---

## Guía Detallada de Configuración

### Configuración de la Base de Datos

El CMS utiliza PostgreSQL como base de datos principal. Puede configurarla de dos maneras:

#### Opción A: Usando Docker (Recomendado para Desarrollo)

El proyecto incluye un archivo `docker-compose.yml` que simplifica la configuración:

```bash
# Iniciar PostgreSQL en un contenedor Docker
docker-compose up -d

# Verificar que el contenedor esté corriendo
docker-compose ps

# Ver los logs si es necesario
docker-compose logs -f
```

Esta configuración crea automáticamente:
- Una base de datos PostgreSQL en el puerto 5432
- Usuario y contraseña predeterminados
- Volumen persistente para los datos

#### Opción B: PostgreSQL Local

Si prefiere usar PostgreSQL instalado localmente:

```bash
# Crear la base de datos
createdb microsite_cms

# O usando psql
psql -U postgres -c "CREATE DATABASE microsite_cms;"
```

Luego actualice su archivo `.env`:
```
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/microsite_cms"
```

### Configuración de Prisma

Prisma ORM gestiona el esquema de la base de datos y las migraciones:

1. **Generar el Cliente**: Crea los tipos TypeScript desde el esquema
   ```bash
   npm run prisma:generate
   ```

2. **Aplicar Migraciones**: Sincroniza el esquema con la base de datos
   ```bash
   npm run prisma:migrate
   ```

3. **Sembrar Datos**: Crea datos iniciales para desarrollo
   ```bash
   npm run db:seed
   ```

### Configuración de NextAuth

NextAuth maneja la autenticación y las sesiones:

1. Genere un secreto seguro:
   ```bash
   openssl rand -base64 32
   ```

2. Agregue al archivo `.env`:
   ```
   NEXTAUTH_SECRET=su_secreto_generado_aquí
   NEXTAUTH_URL=http://localhost:3000
   ```

3. En producción, actualice `NEXTAUTH_URL` con su dominio real:
   ```
   NEXTAUTH_URL=https://su-dominio.com
   ```

### Gestión de Medios

El sistema incluye gestión completa de medios con optimización automática:

#### Características de Procesamiento de Imágenes

- **Conversión Automática a WebP**: Las imágenes se convierten automáticamente al formato WebP moderno para mejor rendimiento
- **Generación de Miniaturas**: Crea múltiples tamaños para diferentes casos de uso
- **Validación de Archivos**: Verifica tipos de archivo y tamaños antes de la carga
- **Optimización**: Comprime imágenes manteniendo la calidad visual

#### Formatos Soportados

- PNG
- JPEG/JPG
- WebP
- SVG (sin procesamiento, almacenado tal cual)

#### Configuración de Almacenamiento

Por defecto, los archivos se almacenan localmente en `public/uploads/`. Para producción, puede configurar almacenamiento compatible con S3:

```env
STORAGE_TYPE=s3
S3_BUCKET=nombre-de-su-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY=su_clave_de_acceso
S3_SECRET_KEY=su_clave_secreta
```

### Arquitectura Multi-tenant

El sistema soporta múltiples tenants (inquilinos) con aislamiento completo de datos:

#### ¿Qué es un Tenant?

Un tenant representa una organización o cliente individual que usa el CMS. Cada tenant tiene:
- Su propio dominio o subdominio
- Usuarios aislados
- Páginas y contenido separados
- Configuración de marca personalizada (colores, fuentes, logo)

#### Cómo Funciona el Enrutamiento

El middleware de Next.js detecta automáticamente el tenant basándose en el dominio de la solicitud:

```
ejemplo1.com → Tenant 1
ejemplo2.com → Tenant 2
app.midominio.com → Tenant 3
```

#### Crear un Nuevo Tenant

Los usuarios con rol `SUPER_ADMIN` pueden crear nuevos tenants:

1. Inicie sesión como super admin
2. Navegue a la sección de administración de tenants
3. Complete el formulario:
   - **Nombre**: Nombre de la organización
   - **Dominio**: dominio.com o subdominio.dominio.com
   - **Logo URL**: URL del logo (opcional)
   - **Colores**: Personalización de marca

### Sistema de Roles y Permisos

#### SUPER_ADMIN

El rol más alto con permisos completos:
- Crear y gestionar tenants
- Invitar usuarios a cualquier tenant
- Acceder a todas las funcionalidades del sistema
- Ver métricas y análisis globales
- Configurar ajustes del sistema

**Casos de Uso**:
- Administradores de plataforma
- Personal de DevOps
- Soporte técnico de alto nivel

#### EDITOR

Rol estándar para creadores de contenido:
- Crear, editar y eliminar páginas
- Cargar y gestionar archivos de medios
- Publicar contenido en staging y producción
- Ver análisis de sus propias páginas
- Gestionar su propio perfil

**Casos de Uso**:
- Redactores de contenido
- Diseñadores web
- Gerentes de marketing
- Editores de contenido

#### VIEWER

Rol de solo lectura con acceso limitado:
- Ver páginas publicadas
- Ver archivos de medios
- Acceso de solo lectura a análisis
- Sin capacidades de edición

**Casos de Uso**:
- Partes interesadas
- Revisores externos
- Personal de auditoría
- Equipos de control de calidad

### Flujo de Trabajo de Contenido

#### Estados de la Página

1. **DRAFT (Borrador)**
   - Estado inicial de todas las páginas nuevas
   - Solo visible para usuarios autenticados
   - Se puede editar libremente sin afectar el contenido publicado
   - Ideal para trabajo en progreso

2. **STAGING**
   - Publicado en entorno de staging
   - Genera enlace de vista previa compartible
   - Útil para revisiones por parte de clientes o aprobaciones
   - No visible en el sitio de producción

3. **PRODUCTION (Producción)**
   - Publicado y visible para los usuarios finales
   - Activa la revalidación ISR
   - El contenido se sirve con alto rendimiento
   - Se cachea en el edge para velocidad óptima

#### Proceso de Publicación

```
Crear Página
    ↓
Guardar como Borrador
    ↓
Editar Contenido
    ↓
Publicar en Staging ← Compartir con revisores
    ↓
Revisar y Aprobar
    ↓
Publicar en Producción
    ↓
Disponible para Usuarios Finales
```

#### Versionado

El sistema mantiene un historial de cambios:
- Cada actualización crea una nueva versión
- Puede revertir a versiones anteriores
- Rastrea quién hizo cambios y cuándo
- Útil para auditoría y resolución de problemas

### Editor de Bloques

El CMS usa react-page para edición visual de arrastrar y soltar:

#### Bloques Disponibles

1. **Bloque de Texto**
   - Texto enriquecido con formateo
   - Encabezados (H1-H6)
   - Listas (ordenadas y sin ordenar)
   - Enlaces e imágenes en línea
   - Negrita, cursiva, subrayado

2. **Bloque de Imagen**
   - Carga desde la biblioteca de medios
   - Texto alternativo para accesibilidad
   - Opciones de alineación
   - Redimensionamiento responsivo

3. **Bloque de Markdown**
   - Escribe markdown crudo
   - Vista previa en tiempo real
   - Renderizado seguro con sanitización
   - Soporte de sintaxis completo

4. **Bloques Personalizados**
   - Fácilmente extensible
   - Cree sus propios tipos de bloque
   - Configure opciones específicas
   - Integre componentes externos

#### Uso del Editor

```typescript
// Estructura del layout de la página
{
  "blocks": [
    {
      "type": "text",
      "content": "Su contenido aquí",
      "settings": {
        "align": "center"
      }
    },
    {
      "type": "image",
      "src": "/uploads/imagen.webp",
      "alt": "Descripción de imagen"
    }
  ]
}
```

### Renderizado de Markdown

El sistema incluye procesamiento seguro de markdown:

#### Pipeline de Procesamiento

```
Entrada Markdown
    ↓
Análisis (remark-parse)
    ↓
Transformación (remark-rehype)
    ↓
Sanitización (rehype-sanitize)
    ↓
HTML Seguro de Salida
```

#### Características de Seguridad

- **Prevención XSS**: Elimina scripts y contenido peligroso
- **Allowlist de Etiquetas**: Solo permite etiquetas HTML seguras
- **Sanitización de Atributos**: Limpia atributos peligrosos
- **Validación de URLs**: Verifica esquemas de URL seguros

#### Sintaxis Markdown Soportada

```markdown
# Encabezado 1
## Encabezado 2
### Encabezado 3

**Texto en negrita**
*Texto en cursiva*
~~Tachado~~

- Lista sin ordenar
1. Lista ordenada

[Enlaces](https://ejemplo.com)
![Imágenes](imagen.jpg)

> Citas

`Código en línea`

\`\`\`javascript
// Bloques de código
const ejemplo = "código";
\`\`\`

Tablas | Soportadas
-------|----------
Fila 1 | Dato 1
Fila 2 | Dato 2
```

### Internacionalización (i18n)

El CMS soporta múltiples locales:

#### Locales Configurados

- **es-CO**: Español (Colombia)
- **es-DO**: Español (República Dominicana)
- **en**: Inglés

#### Estructura de Contenido

Cada página está asociada a un locale específico:

```typescript
{
  slug: "acerca-de",
  title: "Acerca de Nosotros",
  locale: "es-CO",
  content: "..."
}
```

#### Agregar Nuevos Locales

1. Actualice la configuración de i18n en `next.config.ts`
2. Agregue traducciones de la interfaz
3. Cree páginas específicas del locale
4. Configure el enrutamiento de locale

### Características de Rendimiento

#### Server-Side Rendering (SSR)

- Las páginas se renderizan en el servidor
- Tiempo de carga inicial más rápido
- Mejor SEO
- Contenido totalmente hidratado

#### Incremental Static Regeneration (ISR)

```typescript
// Revalidar cada 60 segundos
export const revalidate = 60;
```

Beneficios:
- Combina SSR y generación estática
- Actualiza contenido sin reconstruir todo el sitio
- Sirve páginas cacheadas para velocidad
- Regenera en segundo plano

#### Optimizaciones de Imagen

```typescript
import Image from 'next/image';

<Image
  src="/uploads/imagen.webp"
  width={800}
  height={600}
  alt="Descripción"
  loading="lazy"
/>
```

- Lazy loading automático
- Redimensionamiento responsivo
- Formato WebP moderno
- Servicio optimizado

### Seguridad

#### Content Security Policy (CSP)

El sistema implementa encabezados CSP estrictos:

```
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
```

#### Prevención de Ataques

1. **XSS (Cross-Site Scripting)**
   - Sanitización de contenido
   - Escapado de salida
   - CSP headers

2. **CSRF (Cross-Site Request Forgery)**
   - Tokens de NextAuth
   - Validación de origen
   - Cookies SameSite

3. **Inyección SQL**
   - Consultas parametrizadas de Prisma
   - Validación de entrada
   - Sanitización de tipo

4. **Carga de Archivos**
   - Validación de tipo MIME
   - Límites de tamaño
   - Sanitización de nombres
   - Escaneo antivirus opcional

#### Hooks de Escaneo Antivirus

Configure escaneo antivirus para cargas de archivos:

```env
ANTIVIRUS_ENABLED=true
ANTIVIRUS_API_URL=https://su-servicio-antivirus.com/scan
ANTIVIRUS_API_KEY=su_clave_api
```

El sistema soporta integración con:
- ClamAV
- VirusTotal
- Metadefender
- Servicios personalizados

### Solución de Problemas

#### Base de Datos

**Error: No se puede conectar a la base de datos**

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Verificar logs
docker-compose logs postgres

# Reiniciar contenedor
docker-compose restart postgres

# Verificar la cadena de conexión en .env
echo $DATABASE_URL
```

**Error: Esquema desincronizado**

```bash
# Resetear la base de datos
npm run db:reset

# O aplicar migraciones manualmente
npm run prisma:migrate
```

#### Prisma

**Error: Prisma Client no encontrado**

```bash
# Generar el cliente
npm run prisma:generate

# Si persiste, limpie e instale de nuevo
rm -rf node_modules
npm install
npm run prisma:generate
```

**Error: Conflicto de migración**

```bash
# Ver estado de migraciones
npx prisma migrate status

# Resolver migraciones
npx prisma migrate resolve --applied "nombre_migracion"
```

#### Next.js

**Error: Puerto 3000 en uso**

```bash
# Encontrar y matar el proceso
lsof -ti:3000 | xargs kill -9

# O usar un puerto diferente
PORT=3001 npm run dev
```

**Error: Build falla**

```bash
# Limpiar caché de Next.js
rm -rf .next

# Limpiar node_modules si es necesario
rm -rf node_modules
npm install

# Construir de nuevo
npm run build
```

**Error: Prisma en producción**

```bash
# Asegurarse de que Prisma Client se genere en el build
npm run build

# O agregar en package.json
"postinstall": "prisma generate"
```

#### Problemas Comunes

**Las imágenes no se cargan**

1. Verificar permisos de carpeta `public/uploads/`
2. Verificar tamaño máximo de archivo
3. Verificar tipos MIME permitidos
4. Revisar logs del servidor

**Sesión expirada constantemente**

1. Verificar `NEXTAUTH_SECRET` en producción
2. Verificar configuración de cookies
3. Verificar HTTPS en producción
4. Verificar configuración del dominio

**El contenido no se actualiza**

1. Limpiar caché de Next.js
2. Verificar configuración de ISR
3. Forzar revalidación de página
4. Verificar conexión a base de datos

### Mejores Prácticas

#### Desarrollo

1. **Use TypeScript estrictamente**
   ```typescript
   // Siempre defina tipos
   interface PageData {
     slug: string;
     title: string;
     locale: string;
   }
   ```

2. **Maneje errores apropiadamente**
   ```typescript
   try {
     await crearPagina(data);
   } catch (error) {
     console.error('Error al crear página:', error);
     // Maneje el error apropiadamente
   }
   ```

3. **Valide la entrada del usuario**
   ```typescript
   import { z } from 'zod';
   
   const esquemaPagina = z.object({
     slug: z.string().min(1).max(100),
     title: z.string().min(1).max(200),
     locale: z.enum(['es-CO', 'es-DO', 'en'])
   });
   ```

4. **Use Prisma Studio para depuración**
   ```bash
   npm run prisma:studio
   ```

#### Seguridad

1. **Nunca haga commit del archivo .env**
   - Ya está en `.gitignore`
   - Use variables de entorno en producción
   - Use secretos para información sensible

2. **Use contraseñas fuertes**
   - Mínimo 12 caracteres
   - Mezcle mayúsculas, minúsculas, números, símbolos
   - Use un gestor de contraseñas

3. **Actualice dependencias regularmente**
   ```bash
   npm audit
   npm update
   ```

4. **Revise logs regularmente**
   - Monitoree intentos de inicio de sesión
   - Rastree subidas de archivos
   - Detecte patrones inusuales

#### Rendimiento

1. **Optimice imágenes antes de subir**
   - Redimensione a las dimensiones necesarias
   - Use formatos modernos (WebP)
   - Comprima sin pérdida visible de calidad

2. **Use ISR apropiadamente**
   ```typescript
   // Para contenido que cambia ocasionalmente
   export const revalidate = 300; // 5 minutos
   
   // Para contenido muy dinámico
   export const dynamic = 'force-dynamic';
   ```

3. **Implemente lazy loading**
   ```typescript
   import dynamic from 'next/dynamic';
   
   const EditorPesado = dynamic(() => import('./Editor'), {
     loading: () => <p>Cargando editor...</p>
   });
   ```

4. **Monitoree el rendimiento**
   - Use Lighthouse
   - Analice Web Vitals
   - Monitoree tiempos de respuesta del servidor

#### Producción

1. **Configure variables de entorno**
   ```env
   NODE_ENV=production
   NEXTAUTH_URL=https://su-dominio.com
   DATABASE_URL=postgresql://...
   ```

2. **Habilite compresión**
   - Configure gzip/brotli en su servidor
   - Use CDN para activos estáticos

3. **Configure backups**
   - Backups automáticos de base de datos
   - Respalde archivos de medios
   - Pruebe la restauración regularmente

4. **Monitoree la aplicación**
   - Configure logs de errores
   - Use herramientas de monitoreo (Sentry, DataDog)
   - Configure alertas para problemas críticos

### Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Construcción de producción
npm run start            # Servidor de producción
npm run lint             # Linter de código

# Base de datos
npm run prisma:generate  # Generar Prisma Client
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:deploy    # Desplegar migraciones (producción)
npm run prisma:studio    # GUI de base de datos
npm run prisma:seed      # Sembrar datos
npm run db:reset         # Resetear base de datos

# Docker
docker-compose up -d     # Iniciar servicios
docker-compose down      # Detener servicios
docker-compose logs -f   # Ver logs
docker-compose ps        # Listar servicios

# Git
git status               # Ver cambios
git add .                # Agregar cambios
git commit -m "mensaje"  # Hacer commit
git push                 # Subir cambios
git pull                 # Bajar cambios
```

### Recursos Adicionales

#### Documentación del Proyecto

- [QUICKSTART.md](./QUICKSTART.md) - Guía de inicio rápido
- [USER_MANUAL.md](./USER_MANUAL.md) - Manual de usuario
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guía de desarrollo
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentación de arquitectura
- [SECURITY.md](./SECURITY.md) - Prácticas de seguridad
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guía de contribución
- [CHANGELOG.md](./CHANGELOG.md) - Registro de cambios
- [ROADMAP.md](./ROADMAP.md) - Hoja de ruta del proyecto

#### Documentación Externa

- [Next.js](https://nextjs.org/docs) - Framework
- [Prisma](https://www.prisma.io/docs) - ORM de base de datos
- [NextAuth](https://next-auth.js.org) - Autenticación
- [react-page](https://react-page.github.io) - Editor de bloques
- [Tailwind CSS](https://tailwindcss.com/docs) - Framework CSS
- [TypeScript](https://www.typescriptlang.org/docs) - Lenguaje

#### Comunidad y Soporte

- **Issues de GitHub**: Para reportar bugs y solicitar características
- **Discussions**: Para preguntas y discusiones
- **Pull Requests**: Para contribuir código
- **Wiki**: Para documentación adicional

### Preguntas Frecuentes (FAQ)

**¿Puedo usar este CMS para otros sectores además de salud?**

Sí, aunque está optimizado para el sector salud, el CMS es completamente personalizable y puede adaptarse a cualquier sector modificando los tipos de contenido y la configuración de marca.

**¿Soporta múltiples idiomas por página?**

Actualmente, cada página está asociada a un solo locale. Para contenido multilingüe, cree páginas separadas para cada idioma con slugs localizados.

**¿Cómo escalo la aplicación?**

- Use una base de datos PostgreSQL administrada (AWS RDS, Google Cloud SQL)
- Despliegue en múltiples regiones con Vercel Edge
- Use S3 o almacenamiento compatible para medios
- Configure Redis para caching
- Use CDN para activos estáticos

**¿Es compatible con dispositivos móviles?**

Sí, tanto el editor como las páginas publicadas son completamente responsivos y funcionan en todos los dispositivos.

**¿Puedo importar contenido existente?**

Sí, puede crear scripts de migración usando Prisma para importar datos desde otras fuentes. Consulte la documentación de Prisma para ejemplos.

**¿Hay límite de páginas o usuarios?**

No hay límites técnicos impuestos por el CMS. Los límites dependerán de su infraestructura de hosting y base de datos.

**¿Soporta SSO (Single Sign-On)?**

NextAuth soporta múltiples proveedores de autenticación. Puede configurar OAuth, SAML u otros proveedores según sea necesario.

---

¿Necesita ayuda? Cree un issue en GitHub o consulte la documentación adicional en la carpeta del proyecto.
