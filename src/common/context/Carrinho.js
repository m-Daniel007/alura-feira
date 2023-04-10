import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { usePagamentoContext } from "./Pagamento";
import { UsuarioContext } from "./Usuario";


export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeProduto, setQuantidadeProduto] = useState(0);
  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        setCarrinho,
        quantidadeProduto,
        setQuantidadeProduto,
        valorTotalCarrinho,
        setValorTotalCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinhoContext = () => {
  const {
    carrinho,
    setCarrinho,
    quantidadeProduto,
    setQuantidadeProduto,
    valorTotalCarrinho,
    setValorTotalCarrinho,
  } = useContext(CarrinhoContext);

  const {formaPagamento} = usePagamentoContext();
  const {setSaldo} = useContext(UsuarioContext);


  const adicionaProduto = (novoProduto) => {
    const temProduto = carrinho.some(
      (itemCarrinho) => itemCarrinho.id === novoProduto.id
    );
    if (!temProduto) {
      novoProduto.quantidade = 1;
      return setCarrinho((carrinhoAnterior) => [
        ...carrinhoAnterior,
        novoProduto,
      ]);
    }

    setCarrinho((carrinhoAnterior) =>
      carrinhoAnterior.map((itemCarrinho) => {
        if (itemCarrinho.id === novoProduto.id) itemCarrinho.quantidade += 1;
        return itemCarrinho;
      })
    );
  };

  const removerProduto = (id) => {
    const produto = carrinho.find((itemCarrinho) => itemCarrinho.id === id);
    const eUltimoItem = produto.quantidade === 1;

    if (eUltimoItem) {
      return setCarrinho((carrinhoAnterior) =>
        carrinhoAnterior.filter((itemCarrinho) => itemCarrinho.id !== id)
      );
    }
    setCarrinho((carrinhoAnterior) =>
      carrinhoAnterior.map((itemCarrinho) => {
        if (itemCarrinho.id === id) itemCarrinho.quantidade -= 1;
        return itemCarrinho;
      })
    );
  };
const efetuarCompra = () => {
  setCarrinho([]);
  setSaldo(saldoAtual=> saldoAtual - valorTotalCarrinho)
}

  useEffect(() => {
    const { novoTotal, novaQuantidade } = carrinho.reduce(
      (contador, produto) => ({
        novaQuantidade: contador.novaQuantidade + produto.quantidade,
        novoTotal: contador.novoTotal + produto.valor * produto.quantidade,
      }),
      {
        novoTotal: 0,
        novaQuantidade: 0,
      }
    );
    setQuantidadeProduto(novaQuantidade);
    setValorTotalCarrinho(novoTotal * formaPagamento.juros);
  }, [carrinho, setQuantidadeProduto, setValorTotalCarrinho,formaPagamento]);

  return {
    carrinho,
    setCarrinho,
    adicionaProduto,
    removerProduto,
    quantidadeProduto,
    setQuantidadeProduto,
    valorTotalCarrinho,
    efetuarCompra
  };
};
