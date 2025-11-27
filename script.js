'use strict'

class StockManager {
    constructor() {
        this.products = [];
        this.marcas = [];
        this.tiposProduto = [];
        this.sistemasOperacionais = [];
        this.currentEditId = null;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadData();
        this.populateBrandFilter();
        this.populateCategoryFilter();
        this.renderProducts();
        this.updateStats();
    }

    async loadData() {
        try {
            console.log('Carregando dados da API...');
            
            const marcasResult = await getMarcas();
            console.log('Marcas result:', marcasResult);
            if (marcasResult && marcasResult.Marcas) {
                this.marcas = marcasResult.Marcas;
            }
            
            const tiposResult = await getTiposProduto();
            console.log('Tipos result:', tiposResult);
            if (tiposResult && tiposResult.TipoProduto) {
                this.tiposProduto = tiposResult.TipoProduto;
            }
            
            const sosResult = await getSistemasOperacionais();
            console.log('SOs result:', sosResult);
            if (sosResult && sosResult.SistemaOperacional) {
                this.sistemasOperacionais = sosResult.SistemaOperacional;
            }
            
            console.log('Dados carregados:', {
                marcas: this.marcas.length,
                tipos: this.tiposProduto.length,
                sos: this.sistemasOperacionais.length
            });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    bindEvents() {
        // Modal events
        document.getElementById('addProductBtn').addEventListener('click', () => this.openModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('productForm').addEventListener('submit', (e) => this.saveProduct(e));

        // Search and filters
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterProducts());
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterProducts());
        document.getElementById('brandFilter').addEventListener('change', () => this.filterProducts());

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('productModal')) {
                this.closeModal();
            }
        });
    }

    openModal(product = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('modalTitle');
        
        this.populateModalSelects();
        
        if (product) {
            title.textContent = 'Editar Produto';
            this.currentEditId = product.id;
            this.fillForm(product);
        } else {
            title.textContent = 'Adicionar Produto';
            this.currentEditId = null;
            document.getElementById('productForm').reset();
        }
        
        modal.style.display = 'block';
    }

    populateModalSelects() {
        // Popular marcas no modal
        const brandSelect = document.getElementById('productBrand');
        brandSelect.innerHTML = '<option value="">Selecione...</option>';
        this.marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.nome;
            brandSelect.appendChild(option);
        });
        
        // Popular categorias no modal
        const categorySelect = document.getElementById('productCategory');
        categorySelect.innerHTML = '<option value="">Selecione...</option>';
        this.tiposProduto.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nome;
            categorySelect.appendChild(option);
        });
        
        // Popular sistemas operacionais no modal
        const soSelect = document.getElementById('sistemaOperacional');
        soSelect.innerHTML = '<option value="">Selecione...</option>';
        this.sistemasOperacionais.forEach(so => {
            const option = document.createElement('option');
            option.value = so.id;
            option.textContent = so.nome;
            soSelect.appendChild(option);
        });
    }

    closeModal() {
        document.getElementById('productModal').style.display = 'none';
        this.currentEditId = null;
    }

    fillForm(product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productColor').value = product.color || '';
        document.getElementById('tensao').value = product.tensao || '';
        document.getElementById('dimensoes').value = product.dimensoes || '';
        document.getElementById('resolucaoTela').value = product.resolucao_tela || '';
        document.getElementById('capacidade').value = product.capacidade || '';
        document.getElementById('memoriaRam').value = product.memoria_ram || '';
        document.getElementById('armazenamento').value = product.armazenamento || '';
        document.getElementById('resolucaoCamera').value = product.resolucao_camera || '';
        document.getElementById('peso').value = product.peso || '';
        document.getElementById('acessorios').value = product.acessorios || '';
        document.getElementById('quantidade').value = product.quantidade || '';
        document.getElementById('sistemaOperacional').value = product.sistema_operacional || '';
    }

    saveProduct(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('productName').value,
            code: document.getElementById('productCode').value,
            category: document.getElementById('productCategory').value,
            brand: document.getElementById('productBrand').value,
            price: parseFloat(document.getElementById('productPrice').value),
            color: document.getElementById('productColor').value,
            tensao: document.getElementById('tensao').value,
            dimensoes: document.getElementById('dimensoes').value,
            resolucao_tela: document.getElementById('resolucaoTela').value,
            capacidade: document.getElementById('capacidade').value,
            memoria_ram: document.getElementById('memoriaRam').value,
            armazenamento: document.getElementById('armazenamento').value,
            resolucao_camera: document.getElementById('resolucaoCamera').value,
            peso: document.getElementById('peso').value,
            acessorios: document.getElementById('acessorios').value,
            quantidade: parseInt(document.getElementById('quantidade').value) || 0,
            sistema_operacional: document.getElementById('sistemaOperacional').value
        };

        // Check if code already exists
        const existingProduct = this.products.find(p => p.code === formData.code && p.id !== this.currentEditId);
        if (existingProduct) {
            alert('Código do produto já existe!');
            return;
        }

        if (this.currentEditId) {
            // Edit existing product
            const index = this.products.findIndex(p => p.id === this.currentEditId);
            this.products[index] = { ...this.products[index], ...formData };
        } else {
            // Add new product
            formData.id = Date.now().toString();
            this.products.push(formData);
        }

        this.saveToStorage();
        this.renderProducts();
        this.updateStats();
        this.populateBrandFilter();
        this.closeModal();
    }

    deleteProduct(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveToStorage();
            this.renderProducts();
            this.updateStats();
            this.populateBrandFilter();
        }
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const filteredProducts = this.getFilteredProducts();
        
        if (filteredProducts.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7f8c8d;">Nenhum produto encontrado</div>';
            return;
        }

        grid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-header">
                    <div class="product-title">${product.name}</div>
                    <div class="product-code">${product.code}</div>
                </div>
                
                <div class="product-info">
                    <p><strong>Categoria:</strong> ${this.getCategoryName(product.category)}</p>
                    <p><strong>Marca:</strong> ${this.getBrandName(product.brand)}</p>
                    ${product.color ? `<p><strong>Cor:</strong> ${product.color}</p>` : ''}
                </div>
                
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                
                ${this.renderSpecs(product)}
                
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="stockManager.openModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">Editar</button>
                    <button class="btn btn-danger" onclick="stockManager.deleteProduct('${product.id}')">Excluir</button>
                </div>
            </div>
        `).join('');
    }

    renderSpecs(product) {
        const specItems = [];
        if (product.tensao) specItems.push(`<div class="spec-item"><strong>Tensão:</strong> ${product.tensao}</div>`);
        if (product.dimensoes) specItems.push(`<div class="spec-item"><strong>Dimensões:</strong> ${product.dimensoes}</div>`);
        if (product.resolucao_tela) specItems.push(`<div class="spec-item"><strong>Resolução:</strong> ${product.resolucao_tela}</div>`);
        if (product.capacidade) specItems.push(`<div class="spec-item"><strong>Capacidade:</strong> ${product.capacidade}</div>`);
        if (product.memoria_ram) specItems.push(`<div class="spec-item"><strong>RAM:</strong> ${product.memoria_ram}</div>`);
        if (product.armazenamento) specItems.push(`<div class="spec-item"><strong>Armazenamento:</strong> ${product.armazenamento}</div>`);
        if (product.resolucao_camera) specItems.push(`<div class="spec-item"><strong>Câmera:</strong> ${product.resolucao_camera}</div>`);
        if (product.peso) specItems.push(`<div class="spec-item"><strong>Peso:</strong> ${product.peso}</div>`);
        if (product.acessorios) specItems.push(`<div class="spec-item"><strong>Acessórios:</strong> ${product.acessorios}</div>`);
        if (product.sistema_operacional) specItems.push(`<div class="spec-item"><strong>SO:</strong> ${this.getSOName(product.sistema_operacional)}</div>`);
        if (product.quantidade) specItems.push(`<div class="spec-item"><strong>Quantidade:</strong> ${product.quantidade}</div>`);
        
        return specItems.length > 0 ? `
            <div class="specs">
                <h4>Especificações</h4>
                <div class="specs-grid">${specItems.join('')}</div>
            </div>
        ` : '';
    }

    getFilteredProducts() {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const brand = document.getElementById('brandFilter').value;
        
        return this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(search) || 
                                product.code.toLowerCase().includes(search) ||
                                product.brand.toLowerCase().includes(search);
            const matchesCategory = !category || product.category === category;
            const matchesBrand = !brand || product.brand === brand;
            
            return matchesSearch && matchesCategory && matchesBrand;
        });
    }

    updateStats() {
        const totalProducts = this.products.length;
        const totalValue = this.products.reduce((sum, p) => sum + p.price, 0);
        
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('lowStockCount').textContent = '0';
        document.getElementById('totalValue').textContent = `R$ ${totalValue.toFixed(2)}`;
    }

    populateBrandFilter() {
        const brandFilter = document.getElementById('brandFilter');
        const currentValue = brandFilter.value;
        
        brandFilter.innerHTML = '<option value="">Todas as Marcas</option>';
        
        this.marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.nome;
            brandFilter.appendChild(option);
        });
        
        brandFilter.value = currentValue;
    }

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        const currentValue = categoryFilter.value;
        
        categoryFilter.innerHTML = '<option value="">Todas as Categorias</option>';
        
        this.tiposProduto.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nome;
            categoryFilter.appendChild(option);
        });
        
        categoryFilter.value = currentValue;
    }

    getCategoryName(categoryId) {
        const categoria = this.tiposProduto.find(t => t.id == categoryId);
        return categoria ? categoria.nome : categoryId;
    }

    getBrandName(brandId) {
        const marca = this.marcas.find(m => m.id == brandId);
        return marca ? marca.nome : brandId;
    }

    getSOName(soId) {
        const so = this.sistemasOperacionais.find(s => s.id == soId);
        return so ? so.nome : soId;
    }

    filterProducts() {
        this.renderProducts();
    }

    saveToStorage() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }
}

// Initialize the application
let stockManager;

// Aguardar carregamento da página
document.addEventListener('DOMContentLoaded', async () => {
    stockManager = new StockManager();
});

