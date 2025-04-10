export const parseCsvLine = (row: any) => {
    return {
      nome: row.nome,
      cpf: row.cpf,
      valor: parseFloat(row.valor),
      vencimento: new Date(row.vencimento),
    };
  };
  