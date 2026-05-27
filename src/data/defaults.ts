import { Term, Engineer } from '../types';

export const INITIAL_TERMS: Term[] = [
  { id: 'valor_mensal', name: 'Valor Mensal & Dia' },
  { id: 'bonificacao', name: 'Bonificação' },
  { id: 'carro_alugado', name: 'Carro Alugado' },
  { id: 'carro_proprio', name: 'Carro Próprio' },
  { id: 'gasolina', name: 'Gasolina' },
  { id: 'airbnb', name: 'Airbnb' },
  { id: 'ajuda_custo_alimentacao', name: 'Ajuda de custo de alimentação' },
  { id: 'nf', name: 'NF (Nota Fiscal)' }
];

export const INITIAL_ENGINEERS: Engineer[] = [
  {
    id: 'ricardo-default-id',
    name: 'Ricardo',
    values: {
      valor_mensal: 'R$ 12.500,00 dia 6',
      bonificacao: 'não',
      carro_alugado: 'temos que ver',
      carro_proprio: '2.500,00',
      gasolina: 'não',
      airbnb: 'sim',
      ajuda_custo_alimentacao: 'não',
      nf: 'Sim'
    },
    // Set static dates around early May 2026 for realistic timeline
    createdAt: '2026-05-18T14:30:00.000Z',
    updatedAt: '2026-05-20T10:15:00.000Z'
  }
];
