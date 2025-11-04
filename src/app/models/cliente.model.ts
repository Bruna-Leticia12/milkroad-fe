export interface ClienteRequestDTO {
  nome: string;
  celular: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  perfil?: 'ADMIN' | 'CLIENTE';
}

export interface ClienteResponseDTO {
  id: number;
  nome: string;
  celular: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  ativo: boolean;
  perfil: 'ADMIN' | 'CLIENTE';
}