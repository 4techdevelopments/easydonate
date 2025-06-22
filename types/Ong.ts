export interface Ong {
  idOng: number;
  idUsuario: number;
  nome: string;
  tipoAtividade: string;
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
  redeSocial?: string;
  site?: string;
  descricaoMissao?: string;
  logo: string;
}