// Menú hamburguesa para móviles
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    // Cerrar menú al seleccionar una opción
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

const animeList = document.getElementById('animeList');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');

function showLoader(show = true) {
    if (loader) loader.style.display = show ? 'flex' : 'none';
}


async function fetchAnime(query = 'naruto', type = 'search') {
    showLoader(true);
    animeList.innerHTML = '';
    let url = '';
    if (type === 'search') {
        url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=12`;
    } else if (type === 'popular') {
        url = 'https://api.jikan.moe/v4/top/anime?limit=12';
    } else if (type === 'season') {
        url = 'https://api.jikan.moe/v4/seasons/now?limit=24';
    }
    try {
        const res = await fetch(url);
        const data = await res.json();
        let animes = data.data;
        // Si es temporada, mostrar 12 aleatorios
        if (type === 'season') {
            animes = animes.sort(() => Math.random() - 0.5).slice(0, 12);
        }
        showAnime(animes);
    } catch (err) {
        animeList.innerHTML = '<p style="color:#ff9800;font-weight:bold;">Error al cargar los animes.</p>';
    } finally {
        showLoader(false);
    }
}

function showAnime(animes) {
    if (!animes || animes.length === 0) {
        animeList.innerHTML = '<p style="color:#ff9800;font-weight:bold;">No se encontraron animes.</p>';
        return;
    }
    animeList.innerHTML = animes.map(anime => `
        <div class="anime-card animate-fadein">
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <div class="anime-card-content">
                <div class="anime-title">${anime.title}</div>
                <div class="anime-score">⭐ ${anime.score || 'N/A'}</div>
                <div class="anime-synopsis">${anime.synopsis ? anime.synopsis.substring(0, 120) + '...' : 'Sin sinopsis.'}</div>
            </div>
        </div>
    `).join('');
}


searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    fetchAnime(query || 'naruto', 'search');
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        fetchAnime(query || 'naruto', 'search');
    }
});

// Navegación activa y acciones
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        e.preventDefault();
        if (this.textContent.trim().toLowerCase() === 'populares') {
            fetchAnime('', 'popular');
        } else if (this.textContent.trim().toLowerCase() === 'temporada') {
            fetchAnime('', 'season');
        } else if (this.textContent.trim().toLowerCase() === 'inicio') {
            fetchAnime('', 'season');
        }
    });
});

// Al inicio mostrar animes variados de la temporada
fetchAnime('', 'season');

