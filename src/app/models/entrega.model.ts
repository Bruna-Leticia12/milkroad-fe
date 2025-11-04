export interface ClienteDTO {
  id: number;
  nome: string;
  celular: string;
  email: string;
}

export interface EntregaDTO {
  idEntrega: number;
  clienteNome: string;
  confirmada: boolean;
  dataEntrega: string;
}