# ShopApp: Catalogo PrestaShop (Ionic + Angular)

Este proyecto es una aplicacion movil desarrollada para consumir el Webservice de PrestaShop, mostrando un listado y detalle de productos con autenticacion simulada.

## Tecnologias

- **Framework**: Ionic 8 / Angular 18 (Standalone Components)
- **Motor**: Capacitor 6
- **Estado**: Angular Signals
- **Pruebas**: Jasmine / Karma (Unit Testing)

## Instalacion y Requisitos

### Requisitos del Sistema
- **Node.js**: v18+ (v20 recomendado)
- **Java**: JDK 17 (necesario para Android)
- **Android Studio**: Incluyendo Android SDK, SDK Build-Tools y Emulator.
- **Ionic CLI**: `npm install -g @ionic/cli`

### Pasos de Instalacion
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
   En caso de error, ejecutar
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Configurar variables de entorno**:
   Copia los archivos de ejemplo y añade tu API Key:
   ```bash
   cp src/environments/environment.ts.example src/environments/environment.ts
   cp src/environments/environment.prod.ts.example src/environments/environment.prod.ts
   ```
   *Nota: Edita los archivos creados y sustituye `YOUR_API_KEY_HERE` por la clave real.*

4. Ejecutar en desarrollo:
   ```bash
   ionic serve
   ```

## Pruebas Unitarias
Se han implementado tests para asegurar la calidad del codigo y el correcto mapeo de la API:
```bash
# Ejecutar tests una sola vez
ng test --watch=false
```

## Generacion de APK

Para generar un APK funcional:

1. **Preparar el build**:
   ```bash
   # Compila la web y sincroniza con el proyecto nativo
   npm run prepare:android
   ```
2. **Generar APK (Debug)**:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   El APK se generara en: `android/app/build/outputs/apk/debug/app-debug.apk`

## Decisiones Tecnicas

- **Standalone Components**: Eliminacion de NgModules para optimizar claridad.
- **Angular Signals**: Gestion de estado reactiva y eficiente.
- **Interceptores**: `BasicAuthInterceptor` para inyeccion automatica de credenciales.
- **Robustez de API**: Tipado de respuestas raw y mapeo seguro para evitar fallos por cambios en la estructura de la API.
- **Seguridad**: Se utiliza un sistema de plantillas (`.example`) para no exponer las API Keys en el repositorio. Los archivos `environment.ts` reales estan ignorados por Git.

## Autenticacion
- **Flujo**: Login simulado con fake token.
- **Credenciales**: `admin` / `admin`
