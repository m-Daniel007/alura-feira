import { createContext, useContext, useState } from "react";

export const PagamentoContext = createContext();
PagamentoContext.displayName = "Pagamento";

export const PagamentoProvider = ({ children }) => {
  const tipoPagamento = [
    {
      id: 1,
      nome: "Boleto",
      juros: 1,
    },
    {
      id: 2,
      nome: "Cartão de Crédito",
      juros: 1.3,
    },
    {
      id: 3,
      nome: "PIX",
      juros: 1,
    },
    {
      id: 4,
      nome: "Crediario",
      juros: 1.5,
    },
  ];
  const [formaPagamento, setFormaPagamento] = useState(tipoPagamento[1]);

  return (
    <PagamentoContext.Provider
      value={{
        tipoPagamento,
        formaPagamento,
        setFormaPagamento,
      }}
    >
      {children}
    </PagamentoContext.Provider>
  );
};

export const usePagamentoContext = () => {
  const { tipoPagamento, formaPagamento, setFormaPagamento } =
    useContext(PagamentoContext);

  const mudarFormaPagamento = (id) => {
    const pagamentoAtual = tipoPagamento.find(
      (pagamento) => pagamento.id === id
    );
    setFormaPagamento(pagamentoAtual);
  };
  return {
    tipoPagamento,
    formaPagamento,
    mudarFormaPagamento,
  };
};
