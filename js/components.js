const headerHTML = `
        <div class="header-principal">
            <div class="header-izquierda">
                <form role="search" aria-label="Buscar en Planeta Futbol" action="#" method="get">
                    <input type="search" name="q" placeholder="Buscar camisetas..." aria-label="Buscar camisetas">
                    <button type="submit">Buscar</button>
                </form>
            </div>
            <div class="header-centro">
                <h1><a href="index.html">Planeta Futbol</a></h1>
                <nav aria-label="Navegación principal">
                    <ul>
                        <li><a href="index.html">INICIO</a></li>
                        <li><a href="selecciones.html">SELECCIONES</a></li>
                        <li><a href="equipos.html">EQUIPOS</a></li>
                        <li><a href="especiales.html">ESPECIALES</a></li>
                    </ul>
                </nav>
            </div>
            <div class="header-derecha">
                <a href="carrito.html" class="btn-carrito" aria-label="Ver carrito de compras">🛒 Carrito</a>
            </div>
        </div>
        <div class="barra-promocion">
            <p>Envíos a todo el país</p>
        </div>
`;

const footerHTML = `
        <nav aria-label="Navegación del pie de página">
            <ul>
                <li><a href="#">Sobre nosotros</a></li>
                <li><a href="#">Política de devoluciones</a></li>
                <li><a href="#">Términos y condiciones</a></li>
                <li><a href="#">Contacto</a></li>
            </ul>
        </nav>
        <p>&copy; 2026 Planeta Futbol. Todos los derechos reservados.</p>
`;

function getPageName(url) {
    const clean = url.split("?")[0].split("#")[0];
    const parts = clean.split("/");
    const last = parts[parts.length - 1];
    return last === "" ? "index.html" : last;
}

function marcarActivo(ruta) {
    const nombre = getPageName(ruta);
    document.querySelectorAll(".header-centro nav a").forEach(a => {
        const href = a.getAttribute("href");
        if (href === nombre) {
            a.classList.add("activo");
            a.setAttribute("aria-current", "page");
        } else {
            a.classList.remove("activo");
            a.removeAttribute("aria-current");
        }
    });
    const carritoBtn = document.querySelector(".header-derecha .btn-carrito");
    if (carritoBtn) {
        if (nombre === "carrito.html") {
            carritoBtn.classList.add("activo");
        } else {
            carritoBtn.classList.remove("activo");
        }
    }
}

function cargarPagina(url, push) {
    const nombre = getPageName(url);
    fetch(nombre)
        .then(r => {
            if (!r.ok) throw new Error("fetch fail");
            return r.text();
        })
        .then(html => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            const nuevoMain = doc.querySelector("main");
            const mainActual = document.querySelector("main");
            if (nuevoMain && mainActual) {
                mainActual.innerHTML = nuevoMain.innerHTML;
            }
            document.title = doc.title;
            if (push) history.pushState({}, "", nombre);
            marcarActivo(nombre);
            window.scrollTo(0, 0);
        })
        .catch(() => {
            window.location.href = nombre;
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const headerEl = document.getElementById("site-header");
    const footerEl = document.getElementById("site-footer");
    if (headerEl) headerEl.innerHTML = headerHTML;
    if (footerEl) footerEl.innerHTML = footerHTML;
    marcarActivo(window.location.pathname);
    document.addEventListener("click", e => {
        const a = e.target.closest("a[href]");
        if (!a) return;
        const href = a.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) return;
        if (!href.endsWith(".html")) return;
        const dentroHeader = a.closest(".header-principal");
        if (!dentroHeader) return;
        e.preventDefault();
        const destino = getPageName(href);
        const actual = getPageName(window.location.pathname);
        if (destino === actual) return;
        cargarPagina(destino, true);
    });
});

window.addEventListener("popstate", () => {
    const ruta = getPageName(window.location.pathname);
    cargarPagina(ruta, false);
});
