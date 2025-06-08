export interface Doador {
  idDoador: number;
  idUsuario: number;
  nome: string;
  nomeSocial: string;
  cep: string;
  rua: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  ddd: string;
  telefone?: string;
  telefoneCelular?: string;
}