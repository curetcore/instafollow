// Estado de la aplicación
const state = {
    followers: null,
    following: null,
    notFollowingBack: [],
    mutualFriends: [],
    fans: []
};

// Elementos del DOM
const followersUpload = document.getElementById('followersUpload');
const followingUpload = document.getElementById('followingUpload');
const followersFile = document.getElementById('followersFile');
const followingFile = document.getElementById('followingFile');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('results');

// Inicializar eventos
function init() {
    setupDragAndDrop(followersUpload, followersFile, 'followers');
    setupDragAndDrop(followingUpload, followingFile, 'following');
    
    followersFile.addEventListener('change', (e) => handleFileSelect(e, 'followers'));
    followingFile.addEventListener('change', (e) => handleFileSelect(e, 'following'));
    
    analyzeBtn.addEventListener('click', analyzeData);
    
    setupTabs();
    setupExportButtons();
    setupSearch();
    setupAccordion();
}

// Configurar acordeón
function setupAccordion() {
    const accordionHeader = document.getElementById('instructionsToggle');
    const accordionContent = document.getElementById('instructionsContent');
    
    if (!accordionHeader || !accordionContent) return;
    
    accordionHeader.addEventListener('click', () => {
        const isOpen = accordionContent.classList.contains('show');
        
        if (isOpen) {
            accordionContent.classList.remove('show');
            accordionHeader.classList.remove('active');
        } else {
            accordionContent.classList.add('show');
            accordionHeader.classList.add('active');
        }
    });
}

// Configurar drag and drop
function setupDragAndDrop(uploadBox, fileInput, type) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => {
            uploadBox.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => {
            uploadBox.classList.remove('dragover');
        });
    });

    uploadBox.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect({ target: fileInput }, type);
        }
    });

    uploadBox.addEventListener('click', () => {
        fileInput.click();
    });
}

// Manejar selección de archivos
function handleFileSelect(event, type) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
        alert('Por favor, selecciona un archivo JSON válido');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            processJSONData(data, type, file.name);
        } catch (error) {
            alert('Error al leer el archivo. Asegúrate de que sea un JSON válido de Instagram.');
            console.error(error);
        }
    };
    
    reader.readAsText(file);
}

// Procesar datos JSON
function processJSONData(data, type, fileName) {
    let users = [];
    
    // Diferentes formatos de Instagram
    if (Array.isArray(data)) {
        users = data;
    } else if (data.relationships_following) {
        users = data.relationships_following;
    } else if (data.relationships_followers) {
        users = data.relationships_followers;
    } else if (data[0] && data[0].string_list_data) {
        users = data;
    }
    
    // Extraer usernames
    const usernames = users.map(item => {
        if (item.string_list_data && item.string_list_data[0]) {
            return item.string_list_data[0].value;
        }
        return item.value || item;
    }).filter(Boolean);

    state[type] = usernames;
    
    // Actualizar UI
    const uploadBox = type === 'followers' ? followersUpload : followingUpload;
    const fileNameSpan = document.getElementById(`${type}FileName`);
    
    uploadBox.classList.add('uploaded');
    fileNameSpan.textContent = `✓ ${fileName} (${usernames.length} usuarios)`;
    
    // Activar botón de análisis si ambos archivos están cargados
    if (state.followers && state.following) {
        analyzeBtn.disabled = false;
    }
}

// Analizar datos
function analyzeData() {
    if (!state.followers || !state.following) {
        alert('Por favor, carga ambos archivos primero');
        return;
    }

    // Convertir a Sets para búsqueda rápida
    const followersSet = new Set(state.followers);
    const followingSet = new Set(state.following);

    // No te siguen de vuelta
    state.notFollowingBack = state.following.filter(user => !followersSet.has(user));

    // Amigos mutuos
    state.mutualFriends = state.following.filter(user => followersSet.has(user));

    // Tus fans (te siguen pero tú no los sigues)
    state.fans = state.followers.filter(user => !followingSet.has(user));

    // Mostrar resultados
    displayResults();
}

// Mostrar resultados
function displayResults() {
    // Actualizar estadísticas
    document.getElementById('followersCount').textContent = state.followers.length;
    document.getElementById('followingCount').textContent = state.following.length;
    document.getElementById('notFollowingBackCount').textContent = state.notFollowingBack.length;
    document.getElementById('mutualCount').textContent = state.mutualFriends.length;

    // Mostrar listas
    displayUserList('notFollowingList', state.notFollowingBack);
    displayUserList('mutualList', state.mutualFriends);
    displayUserList('fansList', state.fans);

    // Actualizar contadores de búsqueda
    document.getElementById('countNotFollowing').textContent = `${state.notFollowingBack.length} total`;
    document.getElementById('countMutual').textContent = `${state.mutualFriends.length} total`;
    document.getElementById('countFans').textContent = `${state.fans.length} total`;

    // Mostrar sección de resultados
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Mostrar lista de usuarios
function displayUserList(elementId, users) {
    const listElement = document.getElementById(elementId);
    
    if (users.length === 0) {
        listElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 30px;">No hay usuarios en esta categoría</p>';
        return;
    }

    listElement.innerHTML = users.map(username => {
        const initial = username.charAt(0).toUpperCase();
        return `
            <div class="user-item">
                <div class="user-avatar">${initial}</div>
                <div class="user-info">
                    <div class="username">@${username}</div>
                    <a href="https://instagram.com/${username}" target="_blank" class="profile-link">
                        Ver perfil →
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// Configurar tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');

            // Remover active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Agregar active al seleccionado
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Configurar botones de exportación
function setupExportButtons() {
    document.getElementById('exportNotFollowing').addEventListener('click', () => {
        exportToCSV(state.notFollowingBack, 'no-te-siguen.csv');
    });

    document.getElementById('exportMutual').addEventListener('click', () => {
        exportToCSV(state.mutualFriends, 'amigos-mutuos.csv');
    });

    document.getElementById('exportFans').addEventListener('click', () => {
        exportToCSV(state.fans, 'tus-fans.csv');
    });
}

// Exportar a CSV
function exportToCSV(users, filename) {
    if (users.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const csvContent = 'Username,Profile URL\n' + 
        users.map(username => `@${username},https://instagram.com/${username}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Configurar búsqueda
function setupSearch() {
    const searchInputs = [
        { input: 'searchNotFollowing', list: 'notFollowingList', count: 'countNotFollowing', data: 'notFollowingBack' },
        { input: 'searchMutual', list: 'mutualList', count: 'countMutual', data: 'mutualFriends' },
        { input: 'searchFans', list: 'fansList', count: 'countFans', data: 'fans' }
    ];

    searchInputs.forEach(({ input, list, count, data }) => {
        const searchInput = document.getElementById(input);
        const listElement = document.getElementById(list);
        const countElement = document.getElementById(count);

        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const userItems = listElement.querySelectorAll('.user-item');
            let visibleCount = 0;

            userItems.forEach(item => {
                const username = item.querySelector('.username').textContent.toLowerCase();
                
                if (searchTerm === '') {
                    item.classList.remove('search-hidden');
                    // Remover cualquier marca anterior
                    const usernameElement = item.querySelector('.username');
                    usernameElement.innerHTML = usernameElement.textContent;
                    visibleCount++;
                } else if (username.includes(searchTerm)) {
                    item.classList.remove('search-hidden');
                    // Resaltar el término de búsqueda
                    highlightSearchTerm(item.querySelector('.username'), searchTerm);
                    visibleCount++;
                } else {
                    item.classList.add('search-hidden');
                }
            });

            // Actualizar contador
            if (countElement) {
                if (searchTerm) {
                    countElement.textContent = `${visibleCount} de ${state[data].length}`;
                } else {
                    countElement.textContent = `${state[data].length} total`;
                }
            }

            // Mostrar mensaje si no hay resultados
            let noResultsMsg = listElement.querySelector('.no-results-message');
            if (visibleCount === 0 && searchTerm) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.style.cssText = 'text-align: center; color: var(--text-secondary); padding: 30px;';
                    noResultsMsg.textContent = `No se encontraron usuarios que contengan "${searchTerm}"`;
                    listElement.appendChild(noResultsMsg);
                } else {
                    noResultsMsg.textContent = `No se encontraron usuarios que contengan "${searchTerm}"`;
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        });
    });
}

// Función para resaltar el término de búsqueda
function highlightSearchTerm(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<mark>$1</mark>');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
