interface FormProps {
    barcode: string;
    productName: string;
    price: string;
    onProductNameChange: (name: string) => void;
    onPriceChange: (price: string) => void;
    onSubmit: () => void;
  }
  
  const Form: React.FC<FormProps> = ({
    barcode,
    productName,
    price,
    onProductNameChange,
    onPriceChange,
    onSubmit,
  }) => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl">Produto Escaneado: {barcode}</h2>
        <div>
          <label className="block text-left mb-2">Nome do Produto:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => onProductNameChange(e.target.value)}
            placeholder="Nome do Produto"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-left mb-2">Preço:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="Preço"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Salvar
          </button>
        </div>
      </div>
    );
  };
  
  export default Form;
  