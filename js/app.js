// Estado de la aplicación
const state = {
    followers: null,
    following: null,
    notFollowingBack: [],
    mutualFriends: [],
    fans: [],
    // Nuevos datos de Instagram
    closeFriends: [],
    recentlyUnfollowed: [],
    pendingRequests: [],
    receivedRequests: [],
    blockedProfiles: [],
    restrictedProfiles: [],
    favoritedProfiles: [],
    allDataLoaded: {}
};

// Elementos del DOM
const folderUpload = document.getElementById('folderUpload');
const folderInput = document.getElementById('folderInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('results');
const filesDetected = document.getElementById('filesDetected');
const filesList = document.getElementById('filesList');

// Inicializar eventos
function init() {
    setupFolderDragAndDrop();
    folderInput.addEventListener('change', handleFolderSelect);
    analyzeBtn.addEventListener('click', analyzeData);
    
    setupTabs();
    setupExportButtons();
    setupSearch();
    setupAccordion();
    
    // Cargar notas guardadas
    loadNotesFromLocalStorage();
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

// Configurar drag and drop para carpeta
function setupFolderDragAndDrop() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        folderUpload.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        folderUpload.addEventListener(eventName, () => {
            folderUpload.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        folderUpload.addEventListener(eventName, () => {
            folderUpload.classList.remove('dragover');
        });
    });

    folderUpload.addEventListener('drop', (e) => {
        const items = e.dataTransfer.items;
        handleDroppedItems(items);
    });
}

// Manejar selección de carpeta
function handleFolderSelect(event) {
    const files = Array.from(event.target.files);
    processMultipleFiles(files);
}

// Manejar items dropeados
async function handleDroppedItems(items) {
    const files = [];
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file && file.name.endsWith('.json')) {
                files.push(file);
            }
        }
    }
    
    if (files.length > 0) {
        processMultipleFiles(files);
    }
}

// Procesar múltiples archivos
async function processMultipleFiles(files) {
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
        alert('No se encontraron archivos JSON en la carpeta seleccionada.');
        return;
    }
    
    // Resetear estado
    state.allDataLoaded = {};
    filesList.innerHTML = '';
    filesDetected.style.display = 'block';
    
    // Procesar cada archivo
    for (const file of jsonFiles) {
        await processFile(file);
    }
    
    // Verificar si tenemos los archivos mínimos necesarios
    if (state.followers && state.following) {
        analyzeBtn.disabled = false;
        folderUpload.classList.add('uploaded');
        showToast(`${Object.keys(state.allDataLoaded).length} archivos cargados exitosamente`);
    }
}

// Procesar un archivo individual
async function processFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <span class="file-status">Cargando...</span>
        `;
        filesList.appendChild(fileItem);
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const processed = detectAndProcessFileType(file.name, data);
                
                if (processed) {
                    state.allDataLoaded[file.name] = data;
                    fileItem.classList.add('success');
                    fileItem.querySelector('.file-status').textContent = `✓ ${processed}`;
                } else {
                    fileItem.classList.add('error');
                    fileItem.querySelector('.file-status').textContent = '✗ No reconocido';
                }
            } catch (error) {
                fileItem.classList.add('error');
                fileItem.querySelector('.file-status').textContent = '✗ Error al leer';
                console.error(`Error procesando ${file.name}:`, error);
            }
            resolve();
        };
        
        reader.readAsText(file);
    });
}

// Detectar y procesar tipo de archivo
function detectAndProcessFileType(fileName, data) {
    // Mapeo de archivos conocidos
    const fileTypeMap = {
        'followers_1.json': { key: 'followers', name: 'Seguidores', dataKey: 'relationships_followers' },
        'followers.json': { key: 'followers', name: 'Seguidores', dataKey: 'relationships_followers' },
        'following.json': { key: 'following', name: 'Seguidos', dataKey: 'relationships_following' },
        'close_friends.json': { key: 'closeFriends', name: 'Amigos cercanos', dataKey: 'relationships_close_friends' },
        'recently_unfollowed_profiles.json': { key: 'recentlyUnfollowed', name: 'Dejados de seguir', dataKey: 'relationships_unfollowed_users' },
        'pending_follow_requests.json': { key: 'pendingRequests', name: 'Solicitudes enviadas', dataKey: 'relationships_follow_requests_sent' },
        'follow_requests_you\'ve_received.json': { key: 'receivedRequests', name: 'Solicitudes recibidas', dataKey: 'relationships_follow_requests_received' },
        'blocked_profiles.json': { key: 'blockedProfiles', name: 'Bloqueados', dataKey: 'relationships_blocked_users' },
        'restricted_profiles.json': { key: 'restrictedProfiles', name: 'Restringidos', dataKey: 'relationships_restricted_users' },
        'profiles_you\'ve_favorited.json': { key: 'favoritedProfiles', name: 'Favoritos', dataKey: 'relationships_favorited' }
    };
    
    const fileInfo = fileTypeMap[fileName];
    if (!fileInfo) return null;
    
    // Extraer datos según el formato
    let extractedData = [];
    
    if (data[fileInfo.dataKey]) {
        extractedData = data[fileInfo.dataKey];
    } else if (Array.isArray(data)) {
        extractedData = data;
    }
    
    // Procesar usuarios con timestamps si están disponibles
    const processedData = extractedData.map(item => {
        // Caso 1: string_list_data con value
        if (item.string_list_data && item.string_list_data[0]) {
            const userData = item.string_list_data[0];
            return {
                username: userData.value || item.title || null,
                timestamp: userData.timestamp || null,
                href: userData.href || null
            };
        }
        // Caso 2: title directamente (formato de following.json)
        if (item.title) {
            return {
                username: item.title,
                timestamp: item.string_list_data?.[0]?.timestamp || null,
                href: item.string_list_data?.[0]?.href || null
            };
        }
        // Caso 3: value o el item mismo
        return {
            username: item.value || item,
            timestamp: item.timestamp || null
        };
    }).filter(item => item.username);
    
    // Guardar en el estado
    if (fileInfo.key === 'followers' || fileInfo.key === 'following') {
        // Para compatibilidad, guardar solo usernames
        state[fileInfo.key] = processedData.map(item => item.username);
    } else {
        // Para otros datos, guardar objeto completo
        state[fileInfo.key] = processedData;
    }
    
    return `${fileInfo.name} (${processedData.length})`;
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

    // Mostrar insights si hay datos adicionales
    displayInsights();

    // Mostrar sección de resultados
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Mostrar insights adicionales
function displayInsights() {
    const insightsGrid = document.getElementById('insightsGrid');
    insightsGrid.innerHTML = '';
    
    // Amigos cercanos
    if (state.closeFriends.length > 0) {
        const closeFriendsCard = createInsightCard(
            'Amigos Cercanos',
            '💚',
            state.closeFriends.length,
            'amigos cercanos',
            state.closeFriends.map(user => ({
                username: user.username,
                isFollowingBack: state.followers.includes(user.username)
            }))
        );
        insightsGrid.appendChild(closeFriendsCard);
    }
    
    // Dejados de seguir recientemente
    if (state.recentlyUnfollowed.length > 0) {
        const unfollowedCard = createInsightCard(
            'Dejaste de Seguir',
            '👋',
            state.recentlyUnfollowed.length,
            'unfollows recientes',
            state.recentlyUnfollowed,
            true
        );
        insightsGrid.appendChild(unfollowedCard);
    }
    
    // Solicitudes pendientes
    if (state.pendingRequests.length > 0) {
        const pendingCard = createInsightCard(
            'Solicitudes Enviadas',
            '⏳',
            state.pendingRequests.length,
            'pendientes',
            state.pendingRequests,
            true
        );
        insightsGrid.appendChild(pendingCard);
    }
    
    // Solicitudes recibidas
    if (state.receivedRequests.length > 0) {
        const receivedCard = createInsightCard(
            'Solicitudes Recibidas',
            '📨',
            state.receivedRequests.length,
            'esperando respuesta',
            state.receivedRequests
        );
        insightsGrid.appendChild(receivedCard);
    }
    
    // Perfiles bloqueados
    if (state.blockedProfiles.length > 0) {
        const blockedCard = createInsightCard(
            'Bloqueados',
            '🚫',
            state.blockedProfiles.length,
            'perfiles bloqueados',
            state.blockedProfiles
        );
        insightsGrid.appendChild(blockedCard);
    }
}

// Crear tarjeta de insight
function createInsightCard(title, icon, count, label, users, showDate = false) {
    const card = document.createElement('div');
    card.className = 'insight-card';
    
    const usersList = users.slice(0, 10).map(user => {
        const dateStr = showDate && user.timestamp ? 
            new Date(user.timestamp * 1000).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            }) : '';
            
        return `
            <div class="insight-item">
                <span class="insight-username">@${user.username}</span>
                ${dateStr ? `<span class="insight-date">${dateStr}</span>` : ''}
            </div>
        `;
    }).join('');
    
    card.innerHTML = `
        <h3><span class="icon">${icon}</span> ${title}</h3>
        <div class="insight-info">
            <span class="insight-count">${count}</span>
            <span class="insight-label">${label}</span>
        </div>
        ${users.length > 0 ? `
            <div class="insight-list">
                ${usersList}
                ${users.length > 10 ? `<div class="insight-item"><em>y ${users.length - 10} más...</em></div>` : ''}
            </div>
        ` : ''}
    `;
    
    return card;
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
        const hasNote = userNotes[username];
        const noteText = hasNote ? userNotes[username] : '';
        
        return `
            <div class="user-item">
                <div class="user-avatar">${initial}</div>
                <div class="user-info">
                    <div class="username">@${username}</div>
                    ${hasNote ? `<div class="user-note">${noteText}</div>` : ''}
                    <div class="user-actions">
                        <a href="https://instagram.com/${username}" target="_blank" class="action-btn action-profile" title="Ver perfil">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                        <button class="action-btn action-copy" onclick="copyUsername('${username}')" title="Copiar username">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        <button class="action-btn action-note ${hasNote ? 'has-note' : ''}" onclick="toggleNote('${username}')" title="${hasNote ? `Ver/Editar nota: "${noteText}"` : 'Agregar nota'}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Actualizar botones de notas después de renderizar
    users.forEach(username => {
        if (userNotes[username]) {
            updateNoteButton(username);
        }
    });
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

// Función para copiar username al portapapeles
function copyUsername(username) {
    const textToCopy = `@${username}`;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`Username @${username} copiado!`);
        }).catch(err => {
            console.error('Error al copiar:', err);
            fallbackCopy(textToCopy);
        });
    } else {
        fallbackCopy(textToCopy);
    }
}

// Fallback para copiar
function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('Username copiado!');
    } catch (error) {
        console.error('Error al copiar:', error);
    } finally {
        document.body.removeChild(textArea);
    }
}

// Objeto global para notas de usuarios
let userNotes = {};

// Función para toggle nota
function toggleNote(username) {
    const existingNote = userNotes[username];
    
    if (existingNote) {
        // Si ya tiene nota, mostrar/editar
        const newNote = prompt(`Nota para @${username}:`, existingNote);
        if (newNote !== null) {
            if (newNote.trim()) {
                userNotes[username] = newNote.trim();
                showToast(`Nota actualizada para @${username}`);
            } else {
                delete userNotes[username];
                showToast(`Nota eliminada para @${username}`);
            }
            updateNoteButton(username);
            saveNotesToLocalStorage();
        }
    } else {
        // Nueva nota
        const newNote = prompt(`Agregar nota para @${username}:`);
        if (newNote && newNote.trim()) {
            userNotes[username] = newNote.trim();
            updateNoteButton(username);
            saveNotesToLocalStorage();
            showToast(`Nota agregada para @${username}`);
        }
    }
}

// Actualizar botón de nota
function updateNoteButton(username) {
    const buttons = document.querySelectorAll(`button[onclick="toggleNote('${username}')"]`);
    buttons.forEach(button => {
        if (userNotes[username]) {
            button.classList.add('has-note');
            button.title = `Ver/Editar nota: "${userNotes[username]}"`;
        } else {
            button.classList.remove('has-note');
            button.title = 'Agregar nota';
        }
    });
    
    // Actualizar contador de notas
    updateNotesCounter();
}

// Actualizar contador de notas
function updateNotesCounter() {
    let counter = document.getElementById('notesManager');
    const notesCount = Object.keys(userNotes).length;
    
    if (!counter && notesCount > 0) {
        counter = document.createElement('div');
        counter.id = 'notesManager';
        counter.className = 'notes-manager';
        document.body.appendChild(counter);
    }
    
    if (counter) {
        if (notesCount > 0) {
            counter.innerHTML = `
                <span>${notesCount} ${notesCount === 1 ? 'nota' : 'notas'}</span>
                <button onclick="exportNotes()" class="btn-export-notes">Exportar notas</button>
            `;
            counter.style.display = 'flex';
        } else {
            counter.style.display = 'none';
        }
    }
}

// Guardar notas en localStorage
function saveNotesToLocalStorage() {
    localStorage.setItem('instagramAnalyzerNotes', JSON.stringify(userNotes));
}

// Cargar notas desde localStorage
function loadNotesFromLocalStorage() {
    const saved = localStorage.getItem('instagramAnalyzerNotes');
    if (saved) {
        userNotes = JSON.parse(saved);
        updateNotesCounter();
    }
}

// Exportar notas
function exportNotes() {
    if (Object.keys(userNotes).length === 0) {
        alert('No hay notas para exportar');
        return;
    }
    
    const csvContent = 'Username,Nota\n' + 
        Object.entries(userNotes)
            .map(([username, note]) => `@${username},"${note.replace(/"/g, '""')}"`)
            .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'notas-usuarios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Mostrar notificación toast
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
