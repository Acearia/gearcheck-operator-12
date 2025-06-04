
# Checklist AFM - Sistema de Checklist de Equipamentos

Sistema completo de checklist para operadores de equipamentos, desenvolvido com React, Node.js, SQLite e Docker.

## Arquitetura do Sistema

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + SQLite
- **Containerização**: Docker + Docker Compose
- **Banco de Dados**: SQLite (para simplicidade e portabilidade)

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (apenas para desenvolvimento local)

## Passo a Passo Completo - Implementação

### 1. Preparação do Ambiente

#### 1.1 Estrutura do Projeto
```bash
checklist-afm/
├── frontend/               # Código React (atual)
├── backend/               # API Node.js + Express
├── database/              # Scripts e dados SQLite
├── docker/               # Configurações Docker
├── docker-compose.yml    # Orquestração dos containers
└── deploy/               # Scripts de deploy
```

#### 1.2 Criar estrutura de diretórios
```bash
mkdir -p backend database docker deploy
```

### 2. Configuração do Backend (Node.js + Express + SQLite)

#### 2.1 Criar package.json do backend
```bash
cd backend
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

#### 2.2 Criar servidor Express
```bash
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/operators', require('./routes/operators'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/inspections', require('./routes/inspections'));
app.use('/api/leaders', require('./routes/leaders'));
app.use('/api/sectors', require('./routes/sectors'));

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
EOF
```

#### 2.3 Configuração do banco SQLite
```bash
mkdir -p database scripts
cat > database/schema.sql << 'EOF'
-- Tabela de operadores
CREATE TABLE IF NOT EXISTS operators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    sector VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de equipamentos
CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    kp VARCHAR(20),
    sector VARCHAR(50),
    capacity VARCHAR(50),
    type VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de líderes
CREATE TABLE IF NOT EXISTS leaders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    sector VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de setores
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leader_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES leaders(id)
);

-- Tabela de inspeções
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

-- Tabela de itens de checklist
CREATE TABLE IF NOT EXISTS checklist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspection_id INTEGER NOT NULL,
    item_text TEXT NOT NULL,
    answer VARCHAR(10) NOT NULL, -- Sim, Não, N/A
    observation TEXT,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id)
);

-- Tabela de fotos
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

#### 2.4 Script de inicialização do banco
```bash
cat > scripts/init-database.js << 'EOF'
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../database/checklist_afm.db');
const schemaPath = path.join(__dirname, '../database/schema.sql');

// Criar diretório se não existir
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Ler e executar schema
const schema = fs.readFileSync(schemaPath, 'utf8');

db.serialize(() => {
    // Executar schema
    db.exec(schema, (err) => {
        if (err) {
            console.error('Erro ao criar schema:', err);
            return;
        }
        console.log('Schema criado com sucesso!');
    });

    // Inserir usuário admin padrão
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(
        'INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)',
        ['admin', adminPassword],
        function(err) {
            if (err) {
                console.error('Erro ao criar usuário admin:', err);
            } else {
                console.log('Usuário admin criado/verificado!');
            }
        }
    );

    // Inserir dados de exemplo
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

    console.log('Dados de exemplo inseridos!');
});

db.close((err) => {
    if (err) {
        console.error('Erro ao fechar banco:', err);
    } else {
        console.log('Banco de dados inicializado com sucesso!');
    }
});
EOF
```

#### 2.5 Rotas da API

**Criar diretório de rotas:**
```bash
mkdir routes
```

**Auth routes (routes/auth.js):**
```bash
cat > routes/auth.js << 'EOF'
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.get(
        'SELECT * FROM admin_users WHERE username = ?',
        [username],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (!user || !bcrypt.compareSync(password, user.password_hash)) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET || 'checklist-afm-secret',
                { expiresIn: '24h' }
            );

            res.json({ token, user: { id: user.id, username: user.username } });
        }
    );

    db.close();
});

module.exports = router;
EOF
```

**Operators routes (routes/operators.js):**
```bash
cat > routes/operators.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Listar operadores
router.get('/', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    
    db.all('SELECT * FROM operators ORDER BY name', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    
    db.close();
});

// Criar operador
router.post('/', (req, res) => {
    const { name, position, sector } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.run(
        'INSERT INTO operators (name, position, sector) VALUES (?, ?, ?)',
        [name, position, sector],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, name, position, sector });
        }
    );

    db.close();
});

// Atualizar operador
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, position, sector } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.run(
        'UPDATE operators SET name = ?, position = ?, sector = ? WHERE id = ?',
        [name, position, sector, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, name, position, sector });
        }
    );

    db.close();
});

// Deletar operador
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);

    db.run('DELETE FROM operators WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Operador deletado com sucesso' });
    });

    db.close();
});

module.exports = router;
EOF
```

**Equipment routes (routes/equipment.js):**
```bash
cat > routes/equipment.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Listar equipamentos
router.get('/', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    
    db.all('SELECT * FROM equipment ORDER BY name', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    
    db.close();
});

// Criar equipamento
router.post('/', (req, res) => {
    const { name, kp, sector, capacity, type } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.run(
        'INSERT INTO equipment (name, kp, sector, capacity, type) VALUES (?, ?, ?, ?, ?)',
        [name, kp, sector, capacity, type],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, name, kp, sector, capacity, type });
        }
    );

    db.close();
});

// Atualizar equipamento
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, kp, sector, capacity, type } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.run(
        'UPDATE equipment SET name = ?, kp = ?, sector = ?, capacity = ?, type = ? WHERE id = ?',
        [name, kp, sector, capacity, type, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, name, kp, sector, capacity, type });
        }
    );

    db.close();
});

// Deletar equipamento
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);

    db.run('DELETE FROM equipment WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Equipamento deletado com sucesso' });
    });

    db.close();
});

module.exports = router;
EOF
```

**Inspections routes (routes/inspections.js):**
```bash
cat > routes/inspections.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Listar inspeções
router.get('/', (req, res) => {
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
            return res.status(500).json({ error: err.message });
        }
        
        // Para cada inspeção, buscar os itens do checklist
        const inspections = [];
        let completed = 0;
        
        if (rows.length === 0) {
            return res.json([]);
        }
        
        rows.forEach((inspection, index) => {
            db.all(
                'SELECT * FROM checklist_items WHERE inspection_id = ?',
                [inspection.id],
                (err, items) => {
                    if (err) {
                        console.error('Erro ao buscar itens:', err);
                        items = [];
                    }
                    
                    inspections.push({
                        ...inspection,
                        checklist_items: items
                    });
                    
                    completed++;
                    if (completed === rows.length) {
                        res.json(inspections);
                    }
                }
            );
        });
    });
    
    db.close();
});

// Criar inspeção
router.post('/', (req, res) => {
    const { operator_id, equipment_id, inspection_date, comments, signature, checklist_items } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // Inserir inspeção
        db.run(
            'INSERT INTO inspections (operator_id, equipment_id, inspection_date, comments, signature) VALUES (?, ?, ?, ?, ?)',
            [operator_id, equipment_id, inspection_date, comments, signature],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }
                
                const inspectionId = this.lastID;
                
                // Inserir itens do checklist
                if (checklist_items && checklist_items.length > 0) {
                    const stmt = db.prepare('INSERT INTO checklist_items (inspection_id, item_text, answer, observation) VALUES (?, ?, ?, ?)');
                    
                    checklist_items.forEach(item => {
                        stmt.run([inspectionId, item.text, item.answer, item.observation || '']);
                    });
                    
                    stmt.finalize();
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
```

**Leaders routes (routes/leaders.js):**
```bash
cat > routes/leaders.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Listar líderes
router.get('/', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    
    db.all('SELECT * FROM leaders ORDER BY name', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    
    db.close();
});

// Criar líder
router.post('/', (req, res) => {
    const { name, email, sector } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.run(
        'INSERT INTO leaders (name, email, sector) VALUES (?, ?, ?)',
        [name, email, sector],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, name, email, sector });
        }
    );

    db.close();
});

module.exports = router;
EOF
```

**Sectors routes (routes/sectors.js):**
```bash
cat > routes/sectors.js << 'EOF'
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/checklist_afm.db');

// Listar setores
router.get('/', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    
    db.all('SELECT * FROM sectors ORDER BY name', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    
    db.close();
});

// Criar setor
router.post('/', (req, res) => {
    const { name, description, leader_id } = req.body;
    const db = new sqlite3.Database(dbPath);

    db.run(
        'INSERT INTO sectors (name, description, leader_id) VALUES (?, ?, ?)',
        [name, description, leader_id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, name, description, leader_id });
        }
    );

    db.close();
});

module.exports = router;
EOF
```

### 3. Configuração Docker

#### 3.1 Dockerfile para o Backend
```bash
cat > Dockerfile.backend << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY backend/package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY backend/ .

# Criar diretórios necessários
RUN mkdir -p uploads database

# Expor porta
EXPOSE 3001

# Comando para iniciar
CMD ["npm", "start"]
EOF
```

#### 3.2 Dockerfile para o Frontend
```bash
cat > Dockerfile.frontend << 'EOF'
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Usar nginx para servir os arquivos
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
```

#### 3.3 Configuração do Nginx
```bash
mkdir -p docker
cat > docker/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Configuração para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy para API
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
    
    # Cache para arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

#### 3.4 Docker Compose
```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    networks:
      - checklist-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - JWT_SECRET=checklist-afm-super-secret-key
    volumes:
      - sqlite_data:/app/database
      - uploads_data:/app/uploads
    networks:
      - checklist-network
    command: sh -c "npm run init-db && npm start"

volumes:
  sqlite_data:
  uploads_data:

networks:
  checklist-network:
    driver: bridge
EOF
```

### 4. Scripts de Deploy

#### 4.1 Script de Build
```bash
cat > deploy/build.sh << 'EOF'
#!/bin/bash

echo "🚀 Iniciando build do Checklist AFM..."

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# Remover imagens antigas (opcional)
echo "🧹 Limpando imagens antigas..."
docker system prune -f

# Build dos containers
echo "🔨 Fazendo build dos containers..."
docker-compose build --no-cache

echo "✅ Build concluído!"
EOF

chmod +x deploy/build.sh
```

#### 4.2 Script de Deploy
```bash
cat > deploy/deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Iniciando deploy do Checklist AFM..."

# Build dos containers
./deploy/build.sh

# Iniciar containers
echo "▶️ Iniciando containers..."
docker-compose up -d

# Verificar status
echo "🔍 Verificando status dos containers..."
docker-compose ps

echo "✅ Deploy concluído!"
echo "🌐 Frontend disponível em: http://localhost:8080"
echo "🔗 Backend API disponível em: http://localhost:3001"
echo "💾 Banco SQLite salvo em volume Docker: sqlite_data"
EOF

chmod +x deploy/deploy.sh
```

#### 4.3 Script de Backup
```bash
cat > deploy/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "💾 Iniciando backup do Checklist AFM..."

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco SQLite
echo "📂 Fazendo backup do banco de dados..."
docker-compose exec backend cp /app/database/checklist_afm.db /app/database/backup_${TIMESTAMP}.db
docker cp $(docker-compose ps -q backend):/app/database/backup_${TIMESTAMP}.db $BACKUP_DIR/

# Backup dos uploads
echo "📁 Fazendo backup dos uploads..."
docker run --rm -v checklist-afm_uploads_data:/uploads -v $(pwd)/$BACKUP_DIR:/backup alpine tar czf /backup/uploads_${TIMESTAMP}.tar.gz -C /uploads .

echo "✅ Backup concluído!"
echo "📍 Arquivos salvos em: $BACKUP_DIR"
ls -la $BACKUP_DIR
EOF

chmod +x deploy/backup.sh
```

### 5. Comandos de Execução

#### 5.1 Para desenvolvimento
```bash
# Backend (separado)
cd backend
npm install
npm run init-db
npm run dev

# Frontend (separado)
npm install
npm run dev
```

#### 5.2 Para produção com Docker
```bash
# Build e deploy completo
./deploy/deploy.sh

# Ou passo a passo:
docker-compose build
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### 6. Configuração do Frontend para usar a API

#### 6.1 Arquivo de configuração da API
```bash
cat > src/lib/api.ts << 'EOF'
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Em produção, usa proxy do nginx
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

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
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

  // Operators
  async getOperators() {
    return this.request('/operators');
  }

  async createOperator(operator: any) {
    return this.request('/operators', {
      method: 'POST',
      body: JSON.stringify(operator),
    });
  }

  async updateOperator(id: string, operator: any) {
    return this.request(`/operators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(operator),
    });
  }

  async deleteOperator(id: string) {
    return this.request(`/operators/${id}`, {
      method: 'DELETE',
    });
  }

  // Equipment
  async getEquipment() {
    return this.request('/equipment');
  }

  async createEquipment(equipment: any) {
    return this.request('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipment),
    });
  }

  async updateEquipment(id: string, equipment: any) {
    return this.request(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipment),
    });
  }

  async deleteEquipment(id: string) {
    return this.request(`/equipment/${id}`, {
      method: 'DELETE',
    });
  }

  // Inspections
  async getInspections() {
    return this.request('/inspections');
  }

  async createInspection(inspection: any) {
    return this.request('/inspections', {
      method: 'POST',
      body: JSON.stringify(inspection),
    });
  }

  // Leaders
  async getLeaders() {
    return this.request('/leaders');
  }

  async createLeader(leader: any) {
    return this.request('/leaders', {
      method: 'POST',
      body: JSON.stringify(leader),
    });
  }

  // Sectors
  async getSectors() {
    return this.request('/sectors');
  }

  async createSector(sector: any) {
    return this.request('/sectors', {
      method: 'POST',
      body: JSON.stringify(sector),
    });
  }
}

export const apiClient = new ApiClient();
EOF
```

### 7. Testes e Verificação

#### 7.1 Script de teste
```bash
cat > deploy/test.sh << 'EOF'
#!/bin/bash

echo "🧪 Testando Checklist AFM..."

# Testar se containers estão rodando
echo "📋 Verificando containers..."
docker-compose ps

# Testar saúde do backend
echo "🏥 Testando saúde do backend..."
curl -f http://localhost:3001/health || echo "❌ Backend não responde"

# Testar frontend
echo "🌐 Testando frontend..."
curl -f http://localhost:8080 > /dev/null || echo "❌ Frontend não responde"

# Testar API
echo "📡 Testando API..."
curl -f http://localhost:3001/api/operators || echo "❌ API não responde"

echo "✅ Testes concluídos!"
EOF

chmod +x deploy/test.sh
```

### 8. Comandos Úteis

```bash
# Ver logs dos containers
docker-compose logs -f

# Acessar shell do container backend
docker-compose exec backend sh

# Acessar banco SQLite diretamente
docker-compose exec backend sqlite3 /app/database/checklist_afm.db

# Reiniciar apenas um serviço
docker-compose restart backend

# Ver status dos volumes
docker volume ls

# Backup manual do banco
docker-compose exec backend cp /app/database/checklist_afm.db /app/database/backup_manual.db
```

### 9. Estrutura Final do Projeto

```
checklist-afm/
├── src/                     # Frontend React
├── backend/                 # API Node.js
│   ├── routes/             # Rotas da API
│   ├── scripts/            # Scripts utilitários
│   ├── database/           # Schemas e dados
│   └── server.js           # Servidor principal
├── docker/                 # Configurações Docker
├── deploy/                 # Scripts de deploy
├── docker-compose.yml      # Orquestração
├── Dockerfile.frontend     # Build do frontend
├── Dockerfile.backend      # Build do backend
└── README.md              # Esta documentação
```

### 10. Próximos Passos

1. **Execute o deploy**: `./deploy/deploy.sh`
2. **Teste a aplicação**: `./deploy/test.sh`
3. **Configure backup automático**: Agende o script `deploy/backup.sh`
4. **Monitore logs**: `docker-compose logs -f`
5. **Configure SSL/HTTPS** (para produção)

### Notas Importantes

- **Dados persistentes**: SQLite e uploads são salvos em volumes Docker
- **Backup automático**: Configure cron job para executar `deploy/backup.sh`
- **Monitoramento**: Use `docker-compose logs` para debug
- **Segurança**: Altere JWT_SECRET em produção
- **Performance**: SQLite é adequado para uso médio; considere PostgreSQL para alta carga

O sistema está completo e pronto para uso! 🚀
EOF
```
