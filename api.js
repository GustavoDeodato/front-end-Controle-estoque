const API_BASE_URL = 'http://localhost:8080/v1/gerenciador-estoque';

// Conectividade
async function getConectividades() {
    const response = await fetch(`${API_BASE_URL}/conectividade`);
    return response.json();
}

async function createConectividade(data) {
    const response = await fetch(`${API_BASE_URL}/conectividade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateConectividade(id, data) {
    const response = await fetch(`${API_BASE_URL}/conectividade/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteConectividade(id) {
    const response = await fetch(`${API_BASE_URL}/conectividade/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// Marcas
async function getMarcas() {
    const response = await fetch(`${API_BASE_URL}/marcas`);
    return response.json();
}

async function createMarca(data) {
    const response = await fetch(`${API_BASE_URL}/marcas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateMarca(id, data) {
    const response = await fetch(`${API_BASE_URL}/marcas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteMarca(id) {
    const response = await fetch(`${API_BASE_URL}/marcas/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// Porta Entrada Saída
async function getPortasEntradaSaida() {
    const response = await fetch(`${API_BASE_URL}/porta-entrada-saida`);
    return response.json();
}

async function createPortaEntradaSaida(data) {
    const response = await fetch(`${API_BASE_URL}/porta-entrada-saida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updatePortaEntradaSaida(id, data) {
    const response = await fetch(`${API_BASE_URL}/porta-entrada-saida/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deletePortaEntradaSaida(id) {
    const response = await fetch(`${API_BASE_URL}/porta-entrada-saida/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// Sistema Operacional
async function getSistemasOperacionais() {
    const response = await fetch(`${API_BASE_URL}/sistema-operacional`);
    return response.json();
}

async function createSistemaOperacional(data) {
    const response = await fetch(`${API_BASE_URL}/sistema-operacional`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateSistemaOperacional(id, data) {
    const response = await fetch(`${API_BASE_URL}/sistema-operacional/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteSistemaOperacional(id) {
    const response = await fetch(`${API_BASE_URL}/sistema-operacional/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// Tipo Produto
async function getTiposProduto() {
    const response = await fetch(`${API_BASE_URL}/tipo-produto`);
    return response.json();
}

async function createTipoProduto(data) {
    const response = await fetch(`${API_BASE_URL}/tipo-produto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateTipoProduto(id, data) {
    const response = await fetch(`${API_BASE_URL}/tipo-produto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteTipoProduto(id) {
    const response = await fetch(`${API_BASE_URL}/tipo-produto/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// Usuário
async function createUsuario(data) {
    const response = await fetch(`${API_BASE_URL}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}