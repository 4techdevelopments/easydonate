export interface Ong {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  endereco: string;
}

export const ongs: Ong[] = [
  {
    id: 1,
    nome: "ONG Viver - Crianças e Adolescentes com Câncer",
    latitude: -23.329989247504727,
    longitude: -51.15615050407202,
    endereco: "R. Bernardo Sayão, 319",
  },
  {
    id: 2,
    nome: "ONG Patrulha das Águas",
    latitude: -23.334020901739546,
    longitude: -51.15835446501554,
    endereco: "R. da Canoagem, 10",
  },
];