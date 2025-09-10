# Configuración de Hosting para SPA (Single Page Application)

Este proyecto es una aplicación React (SPA) que requiere configuración especial para el hosting para manejar el enrutamiento del lado del cliente. Aquí están las configuraciones para los proveedores más populares:

## ✅ Configuraciones Incluidas

### 1. **Netlify** (Configuración automática)
- **Archivo**: `public/_redirects`
- **Contenido**: `/* /index.html 200`
- **Estado**: ✅ Configurado automáticamente

### 2. **Vercel** (Configuración automática)
- **Archivo**: `vercel.json`
- **Estado**: ✅ Configurado automáticamente
- Incluye rewrites y headers de seguridad

### 3. **Apache** (Configuración automática)
- **Archivo**: `public/.htaccess`
- **Estado**: ✅ Configurado automáticamente
- Incluye reglas de reescritura y headers de seguridad

### 4. **Nginx** (Configuración manual)
- **Archivo**: `nginx.conf.example`
- **Estado**: 📝 Requiere configuración manual

## 🔧 Configuraciones Manuales Adicionales

### **Digital Ocean / Ubuntu con Nginx**
Agregar al bloque `server` en `/etc/nginx/sites-available/tu-sitio`:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### **GitHub Pages**
Crear archivo `public/404.html` con el mismo contenido que `index.html`:
```bash
cp public/index.html public/404.html
```

### **Firebase Hosting**
Configurar en `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### **AWS S3 + CloudFront**
1. En S3 Bucket → Properties → Static Website Hosting:
   - Index document: `index.html`
   - Error document: `index.html`

2. En CloudFront → Error Pages:
   - HTTP Error Code: `404`
   - Response Page Path: `/index.html`
   - HTTP Response Code: `200`

### **Heroku**
Crear `static.json` en la raíz del proyecto:
```json
{
  "root": "dist/",
  "routes": {
    "/**": "index.html"
  }
}
```

## 🚀 Desarrollo Local

Para desarrollo, Vite está configurado con `historyApiFallback: true` en `vite.config.ts`, por lo que todas las rutas funcionarán correctamente durante el desarrollo.

## 🔍 Verificación

Para verificar que la configuración funciona:

1. **Sube tu aplicación** al hosting elegido
2. **Visita una ruta interna** directamente (ej: `tu-sitio.com/servicios`)
3. **Debería cargar correctamente** sin error 404

## ⚠️ Problemas Comunes

### Error 404 en rutas internas:
- ✅ Verifica que el archivo de configuración esté en la ubicación correcta
- ✅ Asegúrate de que el hosting soporte rewrites/redirects
- ✅ Revisa que la configuración sea válida

### Rutas funcionan en desarrollo pero no en producción:
- ✅ Verifica que el build esté usando el archivo de configuración
- ✅ Confirma que el hosting esté configurado para SPAs

## 📞 Soporte

Si tienes problemas con la configuración de hosting, revisa la documentación específica de tu proveedor o contacta su soporte técnico con esta información.

---

**Nota**: Las configuraciones incluidas en este proyecto cubren los casos más comunes. Para hosting providers específicos no listados, consulta su documentación sobre "Single Page Applications" o "Client-side routing".