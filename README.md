# GenaWeb · Portfolio + Neon Courier

Sitio web estático listo para publicar en GitHub Pages. No necesita Node.js, npm ni un proceso de compilación: GitHub puede servir `index.html` directamente.

## Archivos principales

- `index.html`: portfolio principal.
- `game.html`: minijuego **Neon Courier**.
- `css/styles.css`: estilos del portfolio.
- `css/game.css`: estilos del juego.
- `js/script.js`: navegación, revelado al hacer scroll y código animado.
- `js/game.js`: lógica del juego, partículas, sonido y récord local.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube el contenido de esta carpeta manteniendo la estructura de directorios.
3. En el repositorio, abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige la rama principal y la carpeta `/ (root)`.
6. Guarda y espera a que GitHub genere la URL pública.

El sitio usa rutas relativas (`css/...`, `js/...`, `game.html`), por lo que funciona tanto en la raíz de un dominio como dentro de una URL de repositorio de GitHub Pages.

## Juego

Entra desde la tarjeta **Jugar ahora** del portfolio o abre `game.html`. Usa `WASD` o las flechas del teclado para mover la nave. El récord se guarda en `localStorage` del navegador. El juego respeta `prefers-reduced-motion` en el portfolio y funciona sin dependencias externas.

Las tipografías de Google Fonts son opcionales: si no cargan, el sitio usa fuentes del sistema como alternativa.
