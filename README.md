
# Checklist-AFM - Guia Completo Para Iniciantes

## 📋 O que vamos construir?

Um sistema completo de checklist para equipamentos AFM com:
- **Frontend**: Interface web em React (o que você vê no navegador)
- **Backend**: Servidor que processa os dados (Node.js + Express)
- **Banco de dados**: SQLite para armazenar as informações
- **Docker**: Containers para organizar tudo

## 🛠️ Pré-requisitos (O que você precisa instalar)

### 1. Instalar Docker Desktop

**No Windows:**
1. Vá para https://www.docker.com/products/docker-desktop/
2. Clique em "Download for Windows"
3. Execute o arquivo baixado (.exe)
4. Siga o instalador (clique "Next", "Next", "Install")
5. Reinicie o computador quando pedido
6. Abra o Docker Desktop (ícone da baleia azul)

**No Mac:**
1. Vá para https://www.docker.com/products/docker-desktop/
2. Clique em "Download for Mac"
3. Arraste o Docker.app para a pasta Applications
4. Abra o Docker Desktop

**No Linux (Ubuntu/Debian):**
```bash
# Atualizar sistema
sudo apt update

# Instalar Docker
sudo apt install docker.io docker-compose

# Adicionar seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar para aplicar mudanças
sudo reboot
```

### 2. Verificar se Docker está funcionando

Abra o **Terminal** (Windows: CMD ou PowerShell, Mac/Linux: Terminal) e digite:

```bash
docker --version
```

Você deve ver algo como: `Docker version 20.10.x`

```bash
docker-compose --version
```

Você deve ver: `docker-compose version 1.29.x`

## 📁 Estrutura do Projeto

Primeiro, vamos organizar os arquivos. No seu computador, crie esta estrutura:

```
checklist-afm/
├── frontend/          # Seu código React atual
├── backend/           # Servidor Node.js (vamos criar)
├── database/          # Scripts do banco SQLite
├── docker/            # Configurações Docker
├── deploy/            # Scripts para publicar
└── docker-compose.yml # Arquivo principal
```

## 🚀 Passo 1: Preparar o Ambiente

### 1.1 Criar as pastas

No terminal, navegue até onde você quer criar o projeto:

```bash
# Exemplo: ir para área de trabalho
cd Desktop

# Criar pasta principal
mkdir checklist-afm
cd checklist-afm

# Criar subpastas
mkdir backend database docker deploy
```

### 1.2 Mover seu código atual

Copie todos os arquivos do seu projeto React atual para a pasta `frontend/`:

```bash
# Se você está na pasta do projeto atual
cp -r . ../checklist-afm/frontend/

# Ou mova manualmente pelo explorador de arquivos
```

## 🗄️ Passo 2: Criar o Backend (Servidor)

### 2.1 Configurar o servidor Node.js

Entre na pasta backend:

```bash
cd backend
```

Crie o arquivo `package.json`:

```bash
cat > package.json << 'EOF'
{
  "name": "checklist-afm-backend",
  "version": "1.0.0",
  "description": "Backend API para Checklist AFM",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node scripts/init-database.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF
```

### 2.2 Criar o servidor principal

Crie o arquivo `server.js`:

```bash
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - permite comunicação entre frontend e backend
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos de upload (fotos, documentos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas da API - cada rota cuida de uma funcionalidade
app.use('/api/auth', require('./routes/auth'));           // Login/logout
app.use('/api/operators', require('./routes/operators')); // Operadores
app.use('/api/equipment', require('./routes/equipment')); // Equipamentos
app.use('/api/inspections', require('./routes/inspections')); // Inspeções
app.use('/api/leaders', require('./routes/leaders'));     // Líderes
app.use('/api/sectors', require('./routes/sectors'));     // Setores

// Rota para verificar se servidor está funcionando
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor Checklist AFM funcionando!',
    timestamp: new Date().toISOString() 
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Checklist AFM rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}/health`);
});
EOF
```

## 🗃️ Passo 3: Configurar o Banco de Dados SQLite

### 3.1 Criar estrutura do banco

```bash
# Criar pastas
mkdir -p database scripts

# Criar schema (estrutura das tabelas)
cat > database/schema.sql << 'EOF'
-- Tabela de operadores (pessoas que fazem checklist)
CREATE TABLE IF NOT EXISTS operators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    sector VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de equipamentos (máquinas para inspecionar)
CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    kp VARCHAR(20),
    sector VARCHAR(50),
    capacity VARCHAR(50),
    type VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de líderes (supervisores)
CREATE TABLE IF NOT EXISTS leaders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    sector VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de setores (departamentos)
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leader_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES leaders(id)
);

-- Tabela de inspeções (checklists preenchidos)
CREATE TABLE IF NOT EXISTS inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    operator_id INTEGER NOT NULL,
    equipment_id INTEGER NOT NULL,
    inspection_date DATE NOT NULL,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    signature TEXT,
    FOREIGN KEY (operator_id) REFERENCES operators(id),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);

-- Tabela de itens do checklist (cada pergunta/resposta)
CREATE TABLE IF NOT EXISTS checklist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspection_id INTEGER NOT NULL,
    item_text TEXT NOT NULL,
    answer VARCHAR(10) NOT NULL, -- Sim, Não, N/A
    observation TEXT,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id)
);

-- Tabela de fotos das inspeções
CREATE TABLE IF NOT EXISTS inspection_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspection_id INTEGER NOT NULL,
    photo_path VARCHAR(255) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id)
);

-- Tabela de usuários admin
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
EOF
```

### 3.2 Script para criar o banco

```bash
cat > scripts/init-database.js << 'EOF'
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

console.log('🗄️ Inicializando banco de dados SQLite...');

const dbPath = path.join(__dirname, '../database/checklist_afm.db');
const schemaPath = path.join(__dirname, '../database/schema.sql');

// Criar diretório se não existir
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('📁 Diretório do banco criado');
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco:', err);
        return;
    }
    console.log('✅ Conectado ao banco SQLite');
});

// Ler e executar schema
const schema = fs.readFileSync(schemaPath, 'utf8');

db.serialize(() => {
    console.log('📋 Criando tabelas...');
    
    // Executar schema
    db.exec(schema, (err) => {
        if (err) {
            console.error('❌ Erro ao criar schema:', err);
            return;
        }
        console.log('✅ Tabelas criadas com sucesso!');
    });

    // Inserir usuário admin padrão
    console.log('👤 Criando usuário admin...');
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(
        'INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)',
        ['admin', adminPassword],
        function(err) {
            if (err) {
                console.error('❌ Erro ao criar usuário admin:', err);
            } else {
                console.log('✅ Usuário admin criado! (admin/admin123)');
            }
        }
    );

    // Inserir dados de exemplo
    console.log('📊 Inserindo dados de exemplo...');
    
    const sampleOperators = [
        ['João Silva', 'Operador Senior', 'Produção'],
        ['Maria Santos', 'Operadora', 'Manutenção'],
        ['Carlos Oliveira', 'Supervisor', 'Armazém']
    ];

    const insertOperator = db.prepare('INSERT OR IGNORE INTO operators (name, position, sector) VALUES (?, ?, ?)');
    sampleOperators.forEach(operator => {
        insertOperator.run(operator);
    });
    insertOperator.finalize();

    const sampleEquipment = [
        ['Empilhadeira Toyota', 'EMP-001', 'Armazém', '2.5T', 'Empilhadeira'],
        ['Guindaste Liebherr', 'GUI-001', 'Produção', '50T', 'Guindaste'],
        ['Compressor Atlas', 'COMP-001', 'Manutenção', '10HP', 'Compressor']
    ];

    const insertEquipment = db.prepare('INSERT OR IGNORE INTO equipment (name, kp, sector, capacity, type) VALUES (?, ?, ?, ?, ?)');
    sampleEquipment.forEach(equipment => {
        insertEquipment.run(equipment);
    });
    insertEquipment.finalize();

    console.log('✅ Dados de exemplo inseridos!');
});

db.close((err) => {
    if (err) {
        console.error('❌ Erro ao fechar banco:', err);
    } else {
        console.log('🎉 Banco de dados inicializado com sucesso!');
        console.log('📍 Localização:', dbPath);
    }
});
EOF
```

## 🛣️ Passo 4: Criar as Rotas da API

### 4.1 Criar pasta de rotas

```bash
mkdir routes
cd routes
```

### 4.2 Rota de autenticação (Login)

```bash
cat > auth.js << 'EOF'
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Rota de login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`🔐 Tentativa de login: ${username}`);
    
    const db = new sqlite3.Database(dbPath);

    db.get(
        'SELECT * FROM admin_users WHERE username = ?',
        [username],
        (err, user) => {
            if (err) {
                console.error('❌ Erro no banco:', err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (!user || !bcrypt.compareSync(password, user.password_hash)) {
                console.log('❌ Login falhou: credenciais inválidas');
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET || 'checklist-afm-secret',
                { expiresIn: '24h' }
            );

            console.log('✅ Login realizado com sucesso');
            res.json({ 
                token, 
                user: { id: user.id, username: user.username } 
            });
        }
    );

    db.close();
});

module.exports = router;
EOF
```

### 4.3 Rota de operadores

```bash
cat > operators.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Listar todos os operadores
router.get('/', (req, res) => {
    console.log('📋 Buscando operadores...');
    const db = new sqlite3.Database(dbPath);
    
    db.all('SELECT * FROM operators ORDER BY name', (err, rows) => {
        if (err) {
            console.error('❌ Erro ao buscar operadores:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Encontrados ${rows.length} operadores`);
        res.json(rows);
    });
    
    db.close();
});

// Criar novo operador
router.post('/', (req, res) => {
    const { name, position, sector } = req.body;
    console.log(`➕ Criando operador: ${name}`);
    
    const db = new sqlite3.Database(dbPath);

    db.run(
        'INSERT INTO operators (name, position, sector) VALUES (?, ?, ?)',
        [name, position, sector],
        function(err) {
            if (err) {
                console.error('❌ Erro ao criar operador:', err);
                return res.status(500).json({ error: err.message });
            }
            console.log('✅ Operador criado com sucesso');
            res.json({ id: this.lastID, name, position, sector });
        }
    );

    db.close();
});

// Atualizar operador
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, position, sector } = req.body;
    console.log(`✏️ Atualizando operador ID: ${id}`);
    
    const db = new sqlite3.Database(dbPath);

    db.run(
        'UPDATE operators SET name = ?, position = ?, sector = ? WHERE id = ?',
        [name, position, sector, id],
        function(err) {
            if (err) {
                console.error('❌ Erro ao atualizar operador:', err);
                return res.status(500).json({ error: err.message });
            }
            console.log('✅ Operador atualizado com sucesso');
            res.json({ id, name, position, sector });
        }
    );

    db.close();
});

// Deletar operador
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log(`🗑️ Deletando operador ID: ${id}`);
    
    const db = new sqlite3.Database(dbPath);

    db.run('DELETE FROM operators WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('❌ Erro ao deletar operador:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('✅ Operador deletado com sucesso');
        res.json({ message: 'Operador deletado com sucesso' });
    });

    db.close();
});

module.exports = router;
EOF
```

### 4.4 Rota de equipamentos

```bash
cat > equipment.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Listar equipamentos
router.get('/', (req, res) => {
    console.log('🔧 Buscando equipamentos...');
    const db = new sqlite3.Database(dbPath);
    
    db.all('SELECT * FROM equipment ORDER BY name', (err, rows) => {
        if (err) {
            console.error('❌ Erro ao buscar equipamentos:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Encontrados ${rows.length} equipamentos`);
        res.json(rows);
    });
    
    db.close();
});

// Criar equipamento
router.post('/', (req, res) => {
    const { name, kp, sector, capacity, type } = req.body;
    console.log(`➕ Criando equipamento: ${name}`);
    
    const db = new sqlite3.Database(dbPath);

    db.run(
        'INSERT INTO equipment (name, kp, sector, capacity, type) VALUES (?, ?, ?, ?, ?)',
        [name, kp, sector, capacity, type],
        function(err) {
            if (err) {
                console.error('❌ Erro ao criar equipamento:', err);
                return res.status(500).json({ error: err.message });
            }
            console.log('✅ Equipamento criado com sucesso');
            res.json({ id: this.lastID, name, kp, sector, capacity, type });
        }
    );

    db.close();
});

// Outras rotas similares (PUT, DELETE)...
module.exports = router;
EOF
```

### 4.5 Outras rotas (criar arquivos similares)

```bash
# Rota de inspeções
cat > inspections.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Listar inspeções
router.get('/', (req, res) => {
    console.log('📊 Buscando inspeções...');
    const db = new sqlite3.Database(dbPath);
    
    const query = `
        SELECT 
            i.*,
            o.name as operator_name,
            e.name as equipment_name,
            e.kp as equipment_kp
        FROM inspections i
        LEFT JOIN operators o ON i.operator_id = o.id
        LEFT JOIN equipment e ON i.equipment_id = e.id
        ORDER BY i.submission_date DESC
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            console.error('❌ Erro ao buscar inspeções:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Encontradas ${rows.length} inspeções`);
        res.json(rows);
    });
    
    db.close();
});

// Criar inspeção
router.post('/', (req, res) => {
    const { operator_id, equipment_id, inspection_date, comments, signature, checklist_items } = req.body;
    console.log(`➕ Criando inspeção para equipamento ID: ${equipment_id}`);
    
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // Inserir inspeção
        db.run(
            'INSERT INTO inspections (operator_id, equipment_id, inspection_date, comments, signature) VALUES (?, ?, ?, ?, ?)',
            [operator_id, equipment_id, inspection_date, comments, signature],
            function(err) {
                if (err) {
                    console.error('❌ Erro ao criar inspeção:', err);
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }
                
                const inspectionId = this.lastID;
                console.log(`✅ Inspeção criada com ID: ${inspectionId}`);
                
                // Inserir itens do checklist
                if (checklist_items && checklist_items.length > 0) {
                    const stmt = db.prepare('INSERT INTO checklist_items (inspection_id, item_text, answer, observation) VALUES (?, ?, ?, ?)');
                    
                    checklist_items.forEach(item => {
                        stmt.run([inspectionId, item.text, item.answer, item.observation || '']);
                    });
                    
                    stmt.finalize();
                    console.log(`✅ ${checklist_items.length} itens do checklist inseridos`);
                }
                
                db.run('COMMIT');
                res.json({ id: inspectionId, message: 'Inspeção criada com sucesso' });
            }
        );
    });

    db.close();
});

module.exports = router;
EOF

# Rotas simples para leaders e sectors
cat > leaders.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

router.get('/', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    db.all('SELECT * FROM leaders ORDER BY name', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
    db.close();
});

router.post('/', (req, res) => {
    const { name, email, sector } = req.body;
    const db = new sqlite3.Database(dbPath);
    db.run('INSERT INTO leaders (name, email, sector) VALUES (?, ?, ?)', [name, email, sector], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, email, sector });
    });
    db.close();
});

module.exports = router;
EOF

cat > sectors.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

router.get('/', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    db.all('SELECT * FROM sectors ORDER BY name', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
    db.close();
});

router.post('/', (req, res) => {
    const { name, description, leader_id } = req.body;
    const db = new sqlite3.Database(dbPath);
    db.run('INSERT INTO sectors (name, description, leader_id) VALUES (?, ?, ?)', [name, description, leader_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, description, leader_id });
    });
    db.close();
});

module.exports = router;
EOF
```

## 🐳 Passo 5: Configurar Docker

### 5.1 Voltar para pasta principal

```bash
cd ..  # Sair da pasta routes
cd ..  # Sair da pasta backend
```

### 5.2 Dockerfile para o Backend

```bash
cat > Dockerfile.backend << 'EOF'
# Usar Node.js versão 18 (estável)
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro (otimização de cache)
COPY backend/package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código do backend
COPY backend/ .

# Criar diretórios necessários
RUN mkdir -p uploads database

# Porta que o servidor vai usar
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["npm", "start"]
EOF
```

### 5.3 Dockerfile para o Frontend

```bash
cat > Dockerfile.frontend << 'EOF'
# Estágio 1: Build da aplicação React
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package.json do frontend
COPY frontend/package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte do frontend
COPY frontend/ .

# Fazer build da aplicação
RUN npm run build

# Estágio 2: Servir com Nginx
FROM nginx:alpine

# Copiar arquivos buildados para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Porta do nginx
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
EOF
```

### 5.4 Configuração do Nginx

```bash
mkdir -p docker
cat > docker/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    # Pasta onde estão os arquivos do React
    root /usr/share/nginx/html;
    index index.html;
    
    # Configuração para Single Page Application (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Redirecionar chamadas da API para o backend
    location /api/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Cache para arquivos estáticos (imagens, CSS, JS)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

### 5.5 Docker Compose (arquivo principal)

```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Frontend (React + Nginx)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "8080:80"  # Acesse pelo navegador em http://localhost:8080
    depends_on:
      - backend
    networks:
      - checklist-network

  # Backend (Node.js + Express)
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"  # API disponível em http://localhost:3001
    environment:
      - NODE_ENV=production
      - PORT=3001
      - JWT_SECRET=checklist-afm-super-secret-key-change-in-production
    volumes:
      - sqlite_data:/app/database      # Dados do SQLite persistem
      - uploads_data:/app/uploads      # Uploads persistem
    networks:
      - checklist-network
    # Inicializar banco antes de iniciar servidor
    command: sh -c "npm run init-db && npm start"

# Volumes para persistir dados
volumes:
  sqlite_data:      # Banco SQLite
  uploads_data:     # Arquivos enviados

# Rede para comunicação entre containers
networks:
  checklist-network:
    driver: bridge
EOF
```

## 🚀 Passo 6: Scripts de Deploy

### 6.1 Script de build

```bash
mkdir -p deploy

cat > deploy/build.sh << 'EOF'
#!/bin/bash

echo "🚀 === BUILD DO CHECKLIST AFM ==="
echo ""

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# Remover imagens antigas para build limpo
echo "🧹 Limpando imagens antigas..."
docker system prune -f

# Build dos containers
echo "🔨 Fazendo build dos containers..."
echo "   ⏳ Isso pode demorar alguns minutos na primeira vez..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build concluído com sucesso!"
    echo "📋 Próximo passo: execute ./deploy/deploy.sh"
else
    echo ""
    echo "❌ Erro no build! Verifique as mensagens acima."
    exit 1
fi
EOF

chmod +x deploy/build.sh
```

### 6.2 Script de deploy

```bash
cat > deploy/deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 === DEPLOY DO CHECKLIST AFM ==="
echo ""

# Fazer build primeiro
echo "🔨 Executando build..."
./deploy/build.sh

if [ $? -ne 0 ]; then
    echo "❌ Build falhou! Corrigindo..."
    exit 1
fi

# Iniciar containers
echo ""
echo "▶️ Iniciando containers..."
docker-compose up -d

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 10

# Verificar status
echo ""
echo "🔍 Verificando status dos containers..."
docker-compose ps

# Testar saúde dos serviços
echo ""
echo "🏥 Testando saúde dos serviços..."

# Testar backend
echo "   🔍 Testando backend..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "   ✅ Backend OK"
else
    echo "   ❌ Backend não está respondendo"
fi

# Testar frontend
echo "   🔍 Testando frontend..."
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "   ✅ Frontend OK"
else
    echo "   ❌ Frontend não está respondendo"
fi

echo ""
echo "🎉 === DEPLOY CONCLUÍDO ==="
echo ""
echo "📍 URLs de Acesso:"
echo "   🌐 Frontend: http://localhost:8080"
echo "   🔗 Backend API: http://localhost:3001"
echo "   🏥 Health Check: http://localhost:3001/health"
echo ""
echo "👤 Login Admin:"
echo "   📧 Usuário: admin"
echo "   🔑 Senha: admin123"
echo ""
echo "📊 Para ver logs: docker-compose logs -f"
echo "🛑 Para parar: docker-compose down"
EOF

chmod +x deploy/deploy.sh
```

### 6.3 Script de backup

```bash
cat > deploy/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "💾 === BACKUP DO CHECKLIST AFM ==="
echo ""

# Criar diretório de backup
mkdir -p $BACKUP_DIR

echo "📂 Fazendo backup do banco de dados..."
# Backup do banco SQLite
docker-compose exec -T backend cp /app/database/checklist_afm.db /app/database/backup_${TIMESTAMP}.db
docker cp $(docker-compose ps -q backend):/app/database/backup_${TIMESTAMP}.db $BACKUP_DIR/

echo "📁 Fazendo backup dos uploads..."
# Backup dos arquivos enviados
docker run --rm -v checklist-afm_uploads_data:/uploads -v $(pwd)/$BACKUP_DIR:/backup alpine tar czf /backup/uploads_${TIMESTAMP}.tar.gz -C /uploads .

echo ""
echo "✅ Backup concluído!"
echo "📍 Arquivos salvos em: $BACKUP_DIR"
echo ""
ls -la $BACKUP_DIR
EOF

chmod +x deploy/backup.sh
```

## ▶️ Passo 7: EXECUTAR TUDO!

### 7.1 Primeiro deploy

```bash
# No terminal, dentro da pasta checklist-afm
./deploy/deploy.sh
```

**O que você deve ver:**
- Muitas linhas de download e build (primeira vez demora)
- "Build concluído com sucesso!"
- "Containers iniciando..."
- "Deploy concluído!"

### 7.2 Testar se está funcionando

Abra seu navegador e acesse:

1. **Frontend**: http://localhost:8080
   - Você deve ver a página inicial do Checklist AFM

2. **Backend**: http://localhost:3001/health
   - Você deve ver: `{"status":"OK","message":"Servidor Checklist AFM funcionando!"}`

3. **Login Admin**: http://localhost:8080/admin/login
   - Usuário: `admin`
   - Senha: `admin123`

## 🔧 Comandos Úteis

### Ver o que está acontecendo
```bash
# Ver logs dos containers
docker-compose logs -f

# Ver apenas logs do backend
docker-compose logs -f backend

# Ver apenas logs do frontend
docker-compose logs -f frontend
```

### Parar e iniciar
```bash
# Parar tudo
docker-compose down

# Iniciar novamente
docker-compose up -d

# Reiniciar apenas um serviço
docker-compose restart backend
```

### Entrar nos containers
```bash
# Entrar no container do backend
docker-compose exec backend sh

# Ver banco SQLite diretamente
docker-compose exec backend sqlite3 /app/database/checklist_afm.db
```

### Backup manual
```bash
# Executar backup
./deploy/backup.sh
```

## 🆘 Resolução de Problemas

### Problema: "docker: command not found"
**Solução:** Docker não está instalado. Volte ao Passo 1.

### Problema: "Permission denied"
**Solução:** 
```bash
chmod +x deploy/*.sh
```

### Problema: "Port already in use"
**Solução:** Algum programa está usando a porta 8080 ou 3001
```bash
# Ver o que está usando a porta
lsof -i :8080
lsof -i :3001

# Matar processo
kill -9 <PID>
```

### Problema: Containers não iniciam
**Solução:**
```bash
# Ver logs de erro
docker-compose logs

# Rebuild completo
docker-compose down
docker system prune -a
./deploy/deploy.sh
```

### Problema: Frontend não carrega
**Verificar:**
1. http://localhost:8080 está acessível?
2. Logs do nginx: `docker-compose logs frontend`

### Problema: API não funciona
**Verificar:**
1. http://localhost:3001/health responde?
2. Logs do backend: `docker-compose logs backend`
3. Banco foi criado? `docker-compose exec backend ls -la database/`

## 📱 Conectar Frontend ao Backend

### Criar cliente de API no frontend

No seu projeto React, criar arquivo `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Em produção usa proxy do nginx
  : 'http://localhost:3001/api';  // Em desenvolvimento

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('checklist-afm-token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  // Métodos para usar na aplicação
  async login(username: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('checklist-afm-token', response.token);
    }
    
    return response;
  }

  async getOperators() {
    return this.request('/operators');
  }

  async getEquipment() {
    return this.request('/equipment');
  }

  async createInspection(inspection: any) {
    return this.request('/inspections', {
      method: 'POST',
      body: JSON.stringify(inspection),
    });
  }
}

export const apiClient = new ApiClient();
```

## 🏗️ Estrutura Final

```
checklist-afm/
├── frontend/              # Seu código React
├── backend/               # Servidor Node.js
│   ├── routes/           # Rotas da API
│   ├── scripts/          # Scripts do banco
│   ├── database/         # Banco SQLite
│   └── server.js         # Servidor principal
├── docker/               # Configurações Docker
├── deploy/               # Scripts de deploy
├── docker-compose.yml    # Arquivo principal
└── README.md            # Este guia
```

## 🎯 Resumo dos Comandos

```bash
# Deploy completo (primeira vez)
./deploy/deploy.sh

# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Backup
./deploy/backup.sh

# Rebuild (se algo der errado)
docker-compose down
docker system prune -a
./deploy/deploy.sh
```

## 🎉 Pronto!

Agora você tem:
- ✅ Frontend React rodando em http://localhost:8080
- ✅ Backend Node.js rodando em http://localhost:3001  
- ✅ Banco SQLite funcionando
- ✅ Docker organizando tudo
- ✅ Sistema de backup
- ✅ Login admin (admin/admin123)

**Próximos passos:**
1. Teste o sistema acessando http://localhost:8080
2. Faça login como admin
3. Conecte seu frontend React ao backend usando o arquivo `api.ts`
4. Configure backup automático (cron job)

**Para produção:**
- Mude a senha do admin
- Configure SSL/HTTPS
- Use um domínio próprio
- Configure monitoramento

Qualquer dúvida, execute `docker-compose logs -f` para ver o que está acontecendo! 🚀
