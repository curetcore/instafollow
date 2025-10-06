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
    removedSuggestions: [],
    recentFollowRequests: [],
    allDataLoaded: {},
    // Sistema de detección de bots
    botScores: {},
    suspiciousAccounts: []
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
    
    // Cargar usuarios revisados
    loadReviewedFromLocalStorage();
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
        
        // Crear pestañas dinámicas sin ocultar nada
        setTimeout(() => {
            hideLoadingSection();
            createDynamicTabs();
        }, 500);
    }
}

// Ocultar solo la sección de carga, mantener el resto
function hideLoadingSection() {
    const uploadSection = document.querySelector('.upload-section');
    const instructionsSection = document.querySelector('.accordion-container');
    
    if (uploadSection) uploadSection.style.display = 'none';
    if (instructionsSection) instructionsSection.style.display = 'none';
}

// Crear pestañas dinámicas para cada archivo
function createDynamicTabs() {
    // Crear sidebar flotante
    const sidebar = document.createElement('div');
    sidebar.className = 'files-sidebar';
    sidebar.innerHTML = `
        <button class="sidebar-toggle" onclick="toggleSidebar()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
            <span class="sidebar-toggle-text">Archivos</span>
        </button>
        <div class="sidebar-content">
            <div class="sidebar-header">
                <h3>📂 Archivos Cargados</h3>
                <button class="sidebar-close" onclick="toggleSidebar()">×</button>
            </div>
            <div class="sidebar-files"></div>
        </div>
    `;
    
    document.body.appendChild(sidebar);
    
    const filesContainer = sidebar.querySelector('.sidebar-files');
    
    // Crear modal para mostrar contenido del archivo
    const modal = document.createElement('div');
    modal.className = 'file-modal';
    modal.id = 'fileModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle"></h3>
                <button class="modal-close" onclick="closeFileModal()">×</button>
            </div>
            <div class="modal-body" id="modalBody"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Crear un botón por cada archivo cargado
    Object.entries(state.allDataLoaded).forEach(([filename, data], index) => {
        const fileInfo = getFileInfo(filename);
        
        // Crear botón del archivo
        const fileButton = document.createElement('button');
        fileButton.className = 'sidebar-file-btn';
        fileButton.innerHTML = `
            <span class="sidebar-file-icon">${fileInfo.icon}</span>
            <span class="sidebar-file-name">${fileInfo.name}</span>
            <span class="sidebar-file-count">${fileInfo.count}</span>
        `;
        fileButton.onclick = () => showFileModal(filename, data, fileInfo);
        filesContainer.appendChild(fileButton);
    });
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.files-sidebar');
    sidebar.classList.toggle('open');
}

// Mostrar modal con contenido del archivo
function showFileModal(filename, data, fileInfo) {
    const modal = document.getElementById('fileModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.innerHTML = `${fileInfo.icon} ${fileInfo.name}`;
    modalBody.innerHTML = createFileContent(filename, data, fileInfo);
    modal.classList.add('show');
    
    // Cerrar sidebar en móvil
    if (window.innerWidth < 768) {
        toggleSidebar();
    }
}

// Cerrar modal
function closeFileModal() {
    const modal = document.getElementById('fileModal');
    modal.classList.remove('show');
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
        'profiles_you\'ve_favorited.json': { key: 'favoritedProfiles', name: 'Favoritos', dataKey: 'relationships_favorited' },
        'removed_suggestions.json': { key: 'removedSuggestions', name: 'Sugerencias eliminadas', dataKey: 'relationships_dismissed_suggested_users' },
        'recent_follow_requests.json': { key: 'recentFollowRequests', name: 'Solicitudes permanentes', dataKey: 'relationships_permanent_follow_requests' }
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

    // Analizar bots
    analyzeBots();

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

    // Mostrar estadísticas de bots
    updateBotStats();

    // Mostrar insights si hay datos adicionales
    displayInsights();
    
    // Actualizar progreso inicial
    updateProgress();

    // Mostrar sección de resultados
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Sistema de detección de bots
function analyzeBots() {
    state.botScores = {};
    state.suspiciousAccounts = [];
    
    // Analizar todos los usuarios
    const allUsers = [...new Set([...state.followers, ...state.following])];
    
    allUsers.forEach(username => {
        const score = calculateBotScore(username);
        state.botScores[username] = score;
        
        if (score >= 70) {
            state.suspiciousAccounts.push({
                username,
                score,
                reasons: getBotReasons(username, score)
            });
        }
    });
    
    // Ordenar cuentas sospechosas por score
    state.suspiciousAccounts.sort((a, b) => b.score - a.score);
}

// Calcular puntuación de bot (0-100, mayor = más probable bot)
function calculateBotScore(username) {
    let score = 0;
    const reasons = [];
    
    // 1. Patrones en el username (30 puntos max)
    // Muchos números al final
    if (/\d{4,}$/.test(username)) {
        score += 20;
        reasons.push('Muchos números al final');
    }
    // Username genérico con números
    if (/^[a-z]+\d{3,}$/.test(username.toLowerCase())) {
        score += 15;
        reasons.push('Nombre genérico con números');
    }
    // Muchos underscores o puntos
    if ((username.match(/[._]/g) || []).length >= 3) {
        score += 10;
        reasons.push('Muchos caracteres especiales');
    }
    // Username muy corto o muy largo
    if (username.length <= 3 || username.length >= 25) {
        score += 10;
        reasons.push('Longitud inusual');
    }
    
    // 2. Comportamiento de seguimiento (40 puntos max)
    const isFollower = state.followers.includes(username);
    const isFollowing = state.following.includes(username);
    
    // Te sigue pero tú no (comportamiento común de bots)
    if (isFollower && !isFollowing) {
        score += 15;
        reasons.push('Te sigue pero tú no');
        
        // Si además está en fans con patrón sospechoso
        if (state.fans.includes(username)) {
            score += 10;
        }
    }
    
    // 3. Patrones específicos de bots conocidos (30 puntos)
    // Keywords comunes en bots
    const botKeywords = ['follow', 'likes', 'gram', 'insta', 'bot', 'auto', 'boost', 'promo', 'shop', 'sale', 'deal', 'buy', 'click'];
    const lowerUsername = username.toLowerCase();
    
    if (botKeywords.some(keyword => lowerUsername.includes(keyword))) {
        score += 20;
        reasons.push('Contiene palabras sospechosas');
    }
    
    // Patrones de spam
    if (/(.)\1{3,}/.test(username)) {
        score += 15;
        reasons.push('Caracteres repetidos');
    }
    
    // Username aleatorio (consonantes y vocales mezcladas sin sentido)
    if (isRandomUsername(username)) {
        score += 25;
        reasons.push('Nombre aleatorio');
    }
    
    return Math.min(score, 100);
}

// Detectar usernames aleatorios
function isRandomUsername(username) {
    const cleaned = username.replace(/[0-9._]/g, '').toLowerCase();
    if (cleaned.length < 4) return false;
    
    // Contar transiciones consonante-vocal
    let transitions = 0;
    let lastWasVowel = null;
    const vowels = 'aeiou';
    
    for (let char of cleaned) {
        const isVowel = vowels.includes(char);
        if (lastWasVowel !== null && lastWasVowel !== isVowel) {
            transitions++;
        }
        lastWasVowel = isVowel;
    }
    
    // Si hay muy pocas vocales o consonantes, es sospechoso
    const vowelCount = cleaned.split('').filter(c => vowels.includes(c)).length;
    const consonantCount = cleaned.length - vowelCount;
    
    if (vowelCount === 0 || consonantCount === 0) return true;
    if (transitions > cleaned.length * 0.7) return true;
    
    return false;
}

// Obtener razones del bot score
function getBotReasons(username, score) {
    const reasons = [];
    
    if (/\d{4,}$/.test(username)) reasons.push('Muchos números');
    if (/^[a-z]+\d{3,}$/.test(username.toLowerCase())) reasons.push('Patrón genérico');
    if ((username.match(/[._]/g) || []).length >= 3) reasons.push('Muchos símbolos');
    
    const botKeywords = ['follow', 'likes', 'gram', 'insta', 'bot', 'auto', 'boost', 'promo'];
    if (botKeywords.some(keyword => username.toLowerCase().includes(keyword))) {
        reasons.push('Keywords sospechosas');
    }
    
    return reasons;
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
    
    // Sugerencias eliminadas
    if (state.removedSuggestions.length > 0) {
        const removedCard = createInsightCard(
            'Sugerencias Eliminadas',
            '🚮',
            state.removedSuggestions.length,
            'sugerencias rechazadas',
            state.removedSuggestions,
            true
        );
        insightsGrid.appendChild(removedCard);
    }
    
    // Solicitudes permanentes
    if (state.recentFollowRequests.length > 0) {
        const permanentCard = createInsightCard(
            'Solicitudes Permanentes',
            '🔒',
            state.recentFollowRequests.length,
            'solicitudes antiguas',
            state.recentFollowRequests,
            true
        );
        insightsGrid.appendChild(permanentCard);
    }
    
    // Cuentas sospechosas (bots)
    if (state.suspiciousAccounts.length > 0) {
        const botsCard = createBotInsightCard();
        insightsGrid.appendChild(botsCard);
    }
}

// Crear tarjeta especial para bots detectados
function createBotInsightCard() {
    const card = document.createElement('div');
    card.className = 'insight-card bot-card';
    
    // Estadísticas de bots
    const totalAnalyzed = state.followers.length + state.following.length;
    const botsInFollowers = state.suspiciousAccounts.filter(bot => 
        state.followers.includes(bot.username)).length;
    const botsInFollowing = state.suspiciousAccounts.filter(bot => 
        state.following.includes(bot.username)).length;
    
    const usersList = state.suspiciousAccounts.slice(0, 20).map(bot => {
        const isReviewed = reviewedUsers.has(bot.username);
        const hasNote = userNotes[bot.username];
        const botBadgeColor = bot.score >= 90 ? '#e74c3c' : bot.score >= 80 ? '#f39c12' : '#f1c40f';
        
        return `
            <div class="insight-item bot-item ${isReviewed ? 'reviewed' : ''}" 
                 data-username="${bot.username}" 
                 onclick="toggleReviewed('${bot.username}')"
                 style="cursor: pointer; border-left: 3px solid ${botBadgeColor};">
                <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                    <a href="https://instagram.com/${bot.username}" 
                       target="_blank" 
                       class="insight-username" 
                       onclick="event.stopPropagation()"
                       style="text-decoration: none; color: var(--text-primary);">
                        @${bot.username}
                    </a>
                    <span class="bot-score" style="background: ${botBadgeColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                        BOT ${bot.score}%
                    </span>
                    ${isReviewed ? '<span class="check-mark">✓</span>' : ''}
                    ${hasNote ? '<span class="note-indicator" title="' + userNotes[bot.username] + '">📝</span>' : ''}
                </div>
                <div class="bot-reasons" style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
                    ${bot.reasons.join(' • ')}
                </div>
            </div>
        `;
    }).join('');
    
    card.innerHTML = `
        <h3><span class="icon">🤖</span> Cuentas Sospechosas (Bots)</h3>
        <div class="insight-info">
            <span class="insight-count">${state.suspiciousAccounts.length}</span>
            <span class="insight-label">posibles bots detectados</span>
        </div>
        <div class="bot-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
            <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: 600; color: var(--ig-primary);">${botsInFollowers}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">en tus seguidores</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: 600; color: var(--ig-purple);">${botsInFollowing}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">en tus seguidos</div>
            </div>
        </div>
        ${state.suspiciousAccounts.length > 0 ? `
            <div class="insight-list bot-list">
                ${usersList}
                ${state.suspiciousAccounts.length > 20 ? 
                    `<div style="text-align: center; padding: 10px; color: var(--text-secondary); font-size: 12px;">
                        Y ${state.suspiciousAccounts.length - 20} más...
                    </div>` : ''}
            </div>
            <button class="btn-export-bots" onclick="exportBots()" style="width: 100%; margin-top: 15px; padding: 10px; background: var(--ig-primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                Exportar Lista de Bots
            </button>
        ` : ''}
    `;
    
    return card;
}

// Crear tarjeta de insight
function createInsightCard(title, icon, count, label, users, showDate = false) {
    const card = document.createElement('div');
    card.className = 'insight-card';
    
    // Mostrar TODOS los usuarios, no solo 10
    const usersList = users.map(user => {
        const username = user.username || user;
        const isReviewed = reviewedUsers.has(username);
        const hasNote = userNotes[username];
        const dateStr = showDate && user.timestamp ? 
            new Date(user.timestamp * 1000).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            }) : '';
            
        return `
            <div class="insight-item ${isReviewed ? 'reviewed' : ''}" 
                 data-username="${username}" 
                 onclick="toggleReviewed('${username}')"
                 style="cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <a href="https://instagram.com/${username}" 
                       target="_blank" 
                       class="insight-username" 
                       onclick="event.stopPropagation()"
                       style="text-decoration: none; color: var(--text-primary);">
                        @${username}
                    </a>
                    ${isReviewed ? '<span class="check-mark">✓</span>' : ''}
                    ${hasNote ? '<span class="note-indicator" title="' + userNotes[username] + '">📝</span>' : ''}
                </div>
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
        const isReviewed = reviewedUsers.has(username);
        const botScore = state.botScores[username] || 0;
        const isBot = botScore >= 70;
        const botBadgeColor = botScore >= 90 ? '#e74c3c' : botScore >= 80 ? '#f39c12' : '#f1c40f';
        
        return `
            <div class="user-item ${isReviewed ? 'reviewed' : ''} ${isBot ? 'is-bot' : ''}" 
                 data-username="${username}" 
                 onclick="toggleReviewed('${username}')"
                 style="${isBot ? `border-left: 3px solid ${botBadgeColor};` : ''}">
                <div class="user-avatar">${initial}</div>
                <div class="user-info">
                    <div class="username">
                        @${username}
                        ${isReviewed ? '<span class="check-mark">✓</span>' : ''}
                        ${isBot ? `<span class="bot-indicator" style="background: ${botBadgeColor}; color: white; padding: 1px 6px; border-radius: 10px; font-size: 10px; font-weight: 600; margin-left: 8px;">BOT ${botScore}%</span>` : ''}
                    </div>
                    ${hasNote ? `<div class="user-note">${noteText}</div>` : ''}
                    ${isBot ? `<div class="bot-warning" style="font-size: 11px; color: ${botBadgeColor}; margin-top: 2px;">⚠️ Posible bot detectado</div>` : ''}
                    <div class="user-actions">
                        <a href="https://instagram.com/${username}" target="_blank" class="action-btn action-profile" title="Ver perfil" onclick="event.stopPropagation()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                        <button class="action-btn action-copy" onclick="event.stopPropagation(); copyUsername('${username}')" title="Copiar username">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        <button class="action-btn action-note ${hasNote ? 'has-note' : ''}" onclick="event.stopPropagation(); toggleNote('${username}')" title="${hasNote ? `Ver/Editar nota: "${noteText}"` : 'Agregar nota'}">
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

// Set global para usuarios revisados
let reviewedUsers = new Set();

// Función para marcar usuario como revisado
function toggleReviewed(username) {
    if (reviewedUsers.has(username)) {
        reviewedUsers.delete(username);
    } else {
        reviewedUsers.add(username);
    }
    saveReviewedToLocalStorage();
    updateReviewedStatus(username);
}

// Guardar usuarios revisados en localStorage
function saveReviewedToLocalStorage() {
    localStorage.setItem('instagramAnalyzerReviewed', JSON.stringify([...reviewedUsers]));
}

// Cargar usuarios revisados desde localStorage
function loadReviewedFromLocalStorage() {
    const saved = localStorage.getItem('instagramAnalyzerReviewed');
    if (saved) {
        reviewedUsers = new Set(JSON.parse(saved));
    }
}

// Actualizar estado visual de revisado
function updateReviewedStatus(username) {
    const userElements = document.querySelectorAll(`.user-item[data-username="${username}"]`);
    userElements.forEach(element => {
        if (reviewedUsers.has(username)) {
            element.classList.add('reviewed');
        } else {
            element.classList.remove('reviewed');
        }
    });
    
    // Actualizar progreso
    updateProgress();
}

// Actualizar barra de progreso
function updateProgress() {
    // Actualizar progreso de "No te siguen"
    const notFollowingReviewed = state.notFollowingBack.filter(u => reviewedUsers.has(u)).length;
    const notFollowingTotal = state.notFollowingBack.length;
    
    if (notFollowingTotal > 0) {
        const progressFill = document.getElementById('progressFillNotFollowing');
        const progressText = document.getElementById('progressTextNotFollowing');
        
        if (progressFill && progressText) {
            const percentage = (notFollowingReviewed / notFollowingTotal) * 100;
            progressFill.style.width = percentage + '%';
            progressText.textContent = `${notFollowingReviewed} de ${notFollowingTotal} revisados`;
        }
    }
}

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

// Obtener información del archivo
function getFileInfo(filename) {
    const fileTypeMap = {
        'followers_1.json': { icon: '👥', name: 'Seguidores' },
        'followers.json': { icon: '👥', name: 'Seguidores' },
        'following.json': { icon: '➡️', name: 'Seguidos' },
        'close_friends.json': { icon: '💚', name: 'Amigos Cercanos' },
        'recently_unfollowed_profiles.json': { icon: '👋', name: 'Dejados de Seguir' },
        'pending_follow_requests.json': { icon: '⏳', name: 'Solicitudes Enviadas' },
        'follow_requests_you\'ve_received.json': { icon: '📨', name: 'Solicitudes Recibidas' },
        'blocked_profiles.json': { icon: '🚫', name: 'Bloqueados' },
        'restricted_profiles.json': { icon: '🔒', name: 'Restringidos' },
        'profiles_you\'ve_favorited.json': { icon: '⭐', name: 'Favoritos' },
        'removed_suggestions.json': { icon: '🚮', name: 'Sugerencias Eliminadas' },
        'recent_follow_requests.json': { icon: '🔐', name: 'Solicitudes Permanentes' }
    };
    
    const info = fileTypeMap[filename] || { icon: '📄', name: filename };
    
    // Obtener conteo
    let count = 0;
    if (filename.includes('followers')) count = state.followers?.length || 0;
    else if (filename.includes('following.json')) count = state.following?.length || 0;
    else {
        const stateKey = Object.entries(fileTypeMap).find(([file]) => file === filename)?.[0];
        if (stateKey) {
            const mappedKey = detectAndProcessFileType(filename, {})?.key;
            count = state[mappedKey]?.length || 0;
        }
    }
    
    return { ...info, count };
}

// Cambiar pestaña de archivo
function switchFileTab(tabId) {
    // Remover active de todas las pestañas
    document.querySelectorAll('.file-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.file-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activar la pestaña seleccionada
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Crear contenido para cada archivo
function createFileContent(filename, data, fileInfo) {
    const users = extractUsersFromFile(filename, data);
    
    if (!users || users.length === 0) {
        return `
            <div class="file-content-empty">
                <p>No hay datos en este archivo</p>
            </div>
        `;
    }
    
    // Crear lista de usuarios con funcionalidad completa
    const usersList = users.map(user => {
        const username = user.username || user;
        const isReviewed = reviewedUsers.has(username);
        const hasNote = userNotes[username];
        const timestamp = user.timestamp;
        const dateStr = timestamp ? new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }) : '';
        
        return `
            <div class="user-item ${isReviewed ? 'reviewed' : ''}" 
                 data-username="${username}" 
                 onclick="toggleReviewed('${username}')">
                <div class="user-avatar">${username.charAt(0).toUpperCase()}</div>
                <div class="user-info">
                    <div class="username">
                        @${username}
                        ${isReviewed ? '<span class="check-mark">✓</span>' : ''}
                    </div>
                    ${hasNote ? `<div class="user-note">${userNotes[username]}</div>` : ''}
                    ${dateStr ? `<div class="user-date">${dateStr}</div>` : ''}
                    <div class="user-actions">
                        <a href="https://instagram.com/${username}" target="_blank" class="action-btn action-profile" title="Ver perfil" onclick="event.stopPropagation()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                        <button class="action-btn action-copy" onclick="event.stopPropagation(); copyUsername('${username}')" title="Copiar username">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        <button class="action-btn action-note ${hasNote ? 'has-note' : ''}" onclick="event.stopPropagation(); toggleNote('${username}')" title="${hasNote ? `Ver/Editar nota: "${userNotes[username]}"` : 'Agregar nota'}">
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
    
    return `
        <div class="file-content-header">
            <h3>${fileInfo.icon} ${fileInfo.name}</h3>
            <span class="file-count">${users.length} usuarios</span>
        </div>
        <div class="file-content-search">
            <input type="text" class="search-input" placeholder="Buscar en ${fileInfo.name}..." onkeyup="searchInFileContent(this, '${filename}')">
        </div>
        <div class="user-list file-user-list" data-filename="${filename}">
            ${usersList}
        </div>
    `;
}

// Extraer usuarios de un archivo
function extractUsersFromFile(filename, data) {
    // Usar la función existente para detectar y procesar
    const processed = detectAndProcessFileType(filename, data);
    if (!processed) return [];
    
    // Obtener los datos según el tipo
    if (filename.includes('followers')) return state.followers || [];
    if (filename.includes('following.json')) return state.following || [];
    
    // Para otros archivos, obtener del estado
    const fileTypeMap = {
        'close_friends.json': 'closeFriends',
        'recently_unfollowed_profiles.json': 'recentlyUnfollowed',
        'pending_follow_requests.json': 'pendingRequests',
        'follow_requests_you\'ve_received.json': 'receivedRequests',
        'blocked_profiles.json': 'blockedProfiles',
        'restricted_profiles.json': 'restrictedProfiles',
        'profiles_you\'ve_favorited.json': 'favoritedProfiles',
        'removed_suggestions.json': 'removedSuggestions',
        'recent_follow_requests.json': 'recentFollowRequests'
    };
    
    const stateKey = fileTypeMap[filename];
    return state[stateKey] || [];
}

// Buscar en el contenido del archivo
function searchInFileContent(input, filename) {
    const searchTerm = input.value.toLowerCase();
    const listElement = document.querySelector(`.file-user-list[data-filename="${filename}"]`);
    const items = listElement.querySelectorAll('.user-item');
    
    items.forEach(item => {
        const username = item.querySelector('.username').textContent.toLowerCase();
        if (searchTerm === '' || username.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Función para exportar lista de bots
function exportBots() {
    if (state.suspiciousAccounts.length === 0) {
        alert('No hay bots detectados para exportar');
        return;
    }
    
    // Crear CSV con información detallada de bots
    const csvContent = 'Username,Bot Score,Razones,En Seguidores,En Seguidos,Profile URL\n' + 
        state.suspiciousAccounts.map(bot => {
            const inFollowers = state.followers.includes(bot.username) ? 'Sí' : 'No';
            const inFollowing = state.following.includes(bot.username) ? 'Sí' : 'No';
            return `@${bot.username},${bot.score}%,"${bot.reasons.join(', ')}",${inFollowers},${inFollowing},https://instagram.com/${bot.username}`;
        }).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bots-detectados.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`${state.suspiciousAccounts.length} bots exportados exitosamente`);
}

// Estado de filtros de bots
const botFilters = {
    notFollowingList: false,
    mutualList: false,
    fansList: false
};

// Toggle filtro de bots
function toggleBotFilter(listId) {
    botFilters[listId] = !botFilters[listId];
    const button = document.querySelector(`#toggleBots${listId.charAt(0).toUpperCase() + listId.slice(1).replace('List', '')}`);
    const items = document.querySelectorAll(`#${listId} .user-item`);
    
    if (botFilters[listId]) {
        // Ocultar bots
        button.textContent = '🤖 Mostrar Bots';
        button.style.background = '#ffebee';
        
        items.forEach(item => {
            if (item.classList.contains('is-bot')) {
                item.style.display = 'none';
            }
        });
    } else {
        // Mostrar bots
        button.textContent = '🤖 Ocultar Bots';
        button.style.background = '#f0f0f0';
        
        items.forEach(item => {
            if (item.classList.contains('is-bot')) {
                item.style.display = '';
            }
        });
    }
    
    // Actualizar contador visible
    updateVisibleCount(listId);
}

// Actualizar contador de elementos visibles
function updateVisibleCount(listId) {
    const items = document.querySelectorAll(`#${listId} .user-item`);
    const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
    const countElement = document.getElementById(`count${listId.charAt(0).toUpperCase() + listId.slice(1).replace('List', '')}`);
    
    if (countElement) {
        const totalCount = items.length;
        const visibleCount = visibleItems.length;
        
        if (botFilters[listId]) {
            countElement.textContent = `${visibleCount} de ${totalCount} (bots ocultos)`;
        } else {
            countElement.textContent = `${totalCount} total`;
        }
    }
}

// Actualizar estadísticas de bots
function updateBotStats() {
    // Contar bots en cada lista
    const botsInNotFollowing = state.notFollowingBack.filter(u => state.botScores[u] >= 70).length;
    const botsInMutual = state.mutualFriends.filter(u => state.botScores[u] >= 70).length;
    const botsInFans = state.fans.filter(u => state.botScores[u] >= 70).length;
    
    // Mostrar estadísticas
    const statsNotFollowing = document.getElementById('botStatsNotFollowing');
    if (statsNotFollowing && botsInNotFollowing > 0) {
        statsNotFollowing.style.display = 'block';
        statsNotFollowing.querySelector('.bot-count').textContent = botsInNotFollowing;
    }
}

// Exponer funciones al scope global para onclick attributes
window.toggleSidebar = toggleSidebar;
window.closeFileModal = closeFileModal;
window.showFileModal = showFileModal;
window.searchInFileContent = searchInFileContent;
window.exportNotes = exportNotes;
window.exportBots = exportBots;
window.copyUsername = copyUsername;
window.toggleNote = toggleNote;
window.toggleReviewed = toggleReviewed;
window.toggleBotFilter = toggleBotFilter;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
