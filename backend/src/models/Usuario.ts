export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: 'PRODUCTOR' | 'VETERINARIO' | 'ADMINISTRADOR';
  finca_id: string | null;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  activo: boolean;
  telefono?: string;
  direccion?: string;
  ultimo_acceso?: Date;
}

export interface UsuarioCreateInput {
  email: string;
  nombre: string;
  password: string;
  rol: 'PRODUCTOR' | 'VETERINARIO' | 'ADMINISTRADOR';
  finca_id?: string;
  telefono?: string;
  direccion?: string;
}

export interface UsuarioUpdateInput {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
}

export interface UsuarioLoginInput {
  email: string;
  password: string;
}

export interface UsuarioResponse {
  id: string;
  email: string;
  nombre: string;
  rol: 'PRODUCTOR' | 'VETERINARIO' | 'ADMINISTRADOR';
  finca_id: string | null;
  fecha_creacion: Date;
  telefono?: string;
  direccion?: string;
  token?: string;
}

export class UsuarioValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UsuarioValidationError';
  }
}

export class UsuarioNotFoundError extends Error {
  constructor(message: string = 'Usuario no encontrado') {
    super(message);
    this.name = 'UsuarioNotFoundError';
  }
}

export class UsuarioDuplicateError extends Error {
  constructor(message: string = 'El usuario ya existe') {
    super(message);
    this.name = 'UsuarioDuplicateError';
  }
}

export const validateUsuarioCreate = (input: UsuarioCreateInput): void => {
  if (!input.email || !input.email.includes('@')) {
    throw new UsuarioValidationError('Email inválido');
  }
  if (!input.nombre || input.nombre.trim().length < 2) {
    throw new UsuarioValidationError('Nombre debe tener al menos 2 caracteres');
  }
  if (!input.password || input.password.length < 8) {
    throw new UsuarioValidationError('Contraseña debe tener al menos 8 caracteres');
  }
  if (!['PRODUCTOR', 'VETERINARIO', 'ADMINISTRADOR'].includes(input.rol)) {
    throw new UsuarioValidationError('Rol inválido');
  }
};

export const mapUsuarioToResponse = (usuario: Usuario, token?: string): UsuarioResponse => {
  return {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
    finca_id: usuario.finca_id,
    fecha_creacion: usuario.fecha_creacion,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    token: token,
  };
};
