-- Cria a tabela de Usuários
CREATE TABLE Usuarios (
    UsuarioID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Senha TEXT NOT NULL,
    Categoria TEXT CHECK(Categoria IN ('Paciente', 'Médico', 'Administrador')) NOT NULL
);

-- Cria a tabela de agendmento das Consultas
CREATE TABLE Consultas (
    ConsultaID INTEGER PRIMARY KEY AUTOINCREMENT,
    PacienteID INTEGER,
    MedicoID INTEGER,
    DataConsulta DATE NOT NULL,
    Descricao TEXT,
    FOREIGN KEY (PacienteID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (MedicoID) REFERENCES Usuarios(UsuarioID)
);

-- Cria a tabela de Prontuários, registros das consultas
CREATE TABLE Prontuarios (
    ProntuarioID INTEGER PRIMARY KEY AUTOINCREMENT,
    PacienteID INTEGER,
    MedicoID INTEGER,
    Conteudo TEXT,
    FOREIGN KEY (PacienteID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (MedicoID) REFERENCES Usuarios(UsuarioID)
);

-- Cria a tabela de registro de Logins
CREATE TABLE Logins (
    LoginID INTEGER PRIMARY KEY AUTOINCREMENT,
    UsuarioID INTEGER,
    DataLogin DATETIME NOT NULL,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

-- Insere dados de exemplo
-- Inserir usuários
INSERT INTO Usuarios (Nome, Email, Senha, Categoria) VALUES
    ('Paciente1', 'paciente1@email.com', 'senha123', 'Paciente'),
    ('Paciente2', 'paciente2@email.com', 'senha456', 'Paciente'),
    ('Paciente3', 'paciente3@email.com', 'senha789', 'Paciente'),
    ('Médico1', 'medico1@email.com', 'senhaMedico1', 'Médico'),
    ('Médico2', 'medico2@email.com', 'senhaMedico2', 'Médico'),
    ('Administrador', 'admin@email.com', 'senhaAdmin', 'Administrador');

-- Inserir consultas
INSERT INTO Consultas (PacienteID, MedicoID, DataConsulta, Descricao) VALUES
    (1, 4, '2023-01-01', 'Consulta para Paciente1 com Médico1'),
    (2, 5, '2023-02-01', 'Consulta para Paciente2 com Médico2'),
    (3, 4, '2023-03-01', 'Consulta para Paciente3 com Médico1');

-- Inserir logins
INSERT INTO Logins (UsuarioID, DataLogin) VALUES
    (1, '2023-01-01 08:00:00'),
    (2, '2023-02-01 09:30:00'),
    (3, '2023-03-01 10:45:00'),
    (4, '2023-01-01 11:15:00'),
    (5, '2023-02-01 14:00:00'),
    (6, '2023-03-01 15:30:00');

-- Inserir prontuários
INSERT INTO Prontuarios (PacienteID, MedicoID, Conteudo) VALUES
    (1, 4, 'Prontuário para Paciente1 após a consulta com Médico1 em 2023-01-01'),
    (2, 5, 'Prontuário para Paciente2 após a consulta com Médico2 em 2023-02-01'),
    (3, 4, 'Prontuário para Paciente3 após a consulta com Médico1 em 2023-03-01');
