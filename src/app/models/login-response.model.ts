export interface LoginResponse {
  token: string;
  id: number;
  nome: string;
  perfil: 'ADMIN' | 'CLIENTE';
  email?: string; // opcional (caso backend envie)
}
