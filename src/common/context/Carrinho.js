import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeProduto, setQuantidadeProduto] = useState(0);

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, setCarrinho, quantidadeProduto, setQuantidadeProduto }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinhoContext = () => {
  const { carrinho, setCarrinho, quantidadeProduto, setQuantidadeProduto } =
    useContext(CarrinhoContext);

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
  
  useEffect(() => {
    const novaQuantidade = carrinho.reduce(
      (contador, produto) => contador + produto.quantidade,
      0
    );
    setQuantidadeProduto(novaQuantidade);
  }, [carrinho, setQuantidadeProduto]);

  return {
    carrinho,
    setCarrinho,
    adicionaProduto,
    removerProduto,
    quantidadeProduto,
    setQuantidadeProduto,
  };
};
