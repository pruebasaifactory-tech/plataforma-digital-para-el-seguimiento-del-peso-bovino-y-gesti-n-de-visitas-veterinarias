export interface Finca {
  id: string;
  nombre: string;
  ubicacion: string;
  propietario: string;
  fecha_registro: Date;
  fecha_actualizacion: Date;
  activa: boolean;
  hectareas?: number;
  capacidad_maxima?: number;
  telefono_contacto?: string;
  email_contacto?: string;
}

export interface FincaCreateInput {
  nombre: string;
  ubicacion: string;
  propietario: string;
  hectareas?: number;
  capacidad_maxima?: number;
  telefono_contacto?: string;
  email_contacto?: string;
}

export interface FincaUpdateInput {
  nombre?: string;
  ubicacion?: string;
  propietario?: string;
  hectareas?: number;
  capacidad_maxima?: number;
  telefono_contacto?: string;
  email_contacto?: string;
  activa?: boolean;
}

export interface FincaResponse {
  id: string;
  nombre: string;
  ubicacion: string;
  propietario: string;
  fecha_registro: Date;
  hectareas?: number;
  capacidad_maxima?: number;
  telefono_contacto?: string;
  email_contacto?: string;
  activa: boolean;
  total_animales?: number;
}

export class FincaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FincaValidationError';
  }
}

export class FincaNotFoundError extends Error {
  constructor(message: string = 'Finca no encontrada') {
    super(message);
    this.name = 'FincaNotFoundError';
  }
}

export const validateFincaCreate = (input: FincaCreateInput): void => {
  if (!input.nombre || input.nombre.trim().length < 2) {
    throw new FincaValidationError('Nombre debe tener al menos 2 caracteres');
  }
  if (!input.ubicacion || input.ubicacion.trim().length < 5) {
    throw new FincaValidationError('Ubicación debe tener al menos 5 caracteres');
  }
  if (!input.propietario || input.propietario.trim().length < 2) {
    throw new FincaValidationError('Propietario debe tener al menos 2 caracteres');
  }
  if (input.hectareas && input.hectareas < 0) {
    throw new FincaValidationError('Hectáreas no puede ser negativo');
  }
  if (input.capacidad_maxima && input.capacidad_maxima < 0) {
    throw new FincaValidationError('Capacidad máxima no puede ser negativo');
  }
  if (input.email_contacto && !input.email_contacto.includes('@')) {
    throw new FincaValidationError('Email de contacto inválido');
  }
};

export const mapFincaToResponse = (finca: Finca, totalAnimales?: number): FincaResponse => {
  return {
    id: finca.id,
    nombre: finca.nombre,
    ubicacion: finca.ubicacion,
    propietario: finca.propietario,
    fecha_registro: finca.fecha_registro,
    hectareas: finca.hectareas,
    capacidad_maxima: finca.capacidad_maxima,
    telefono_contacto: finca.telefono_contacto,
    email_contacto: finca.email_contacto,
    activa: finca.activa,
    total_animales: totalAnimales,
  };
};
