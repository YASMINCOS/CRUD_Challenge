import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      price: '',
      stock: '',
      productId: '', // Estado para armazenar o ID do produto a ser consultado
      productData: null, // Estado para armazenar os dados do produto consultado
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImlhdCI6MTcxMzc0MjMxNH0.zpT55x8wVQfbGqTe4ZnBdgMwfbBqcaug08Yx_bjoRIU" // Token de autenticação
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description, price, stock, token } = this.state;

    // Crie um cabeçalho de autorização com o token
    const authHeader = `Bearer ${token}`;

    try {
      await axios.post(
        'https://interview.t-alpha.com.br/api/products/create-product',
        {
          name,
          description,
          price: Number(price),
          stock: Number(stock)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader 
          }
        }
      );
      alert('Produto criado com sucesso!');
      this.setState({
        name: '',
        description: '',
        price: '',
        stock: ''
      });
    } catch (error) {
      console.error('Erro ao criar o produto:', error);
      alert('Erro ao criar o produto. Verifique o console para mais detalhes.');
    }
  };

  // Função para consultar um produto específico
  handleGetProduct = async () => {
    const { productId, token } = this.state;
  
    // Crie um cabeçalho de autorização com o token
    const authHeader = `Bearer ${token}`;
  
    try {
      const response = await axios.get(`https://interview.t-alpha.com.br/api/products/get-one-product/${productId}`, {
        headers: {
          'Authorization': authHeader 
        }
      });
      const productData = response.data.data;
      
      // Atualiza o estado com os dados do produto consultado
      this.setState({ productData });
      console.log('Dados recebidos da API:', response.data);

    } catch (error) {
      console.error('Erro ao consultar o produto:', error);
      alert('Erro ao consultar o produto. Verifique o console para mais detalhes.');
    }
  };

  // Função para buscar todos os produtos
  handleGetAllProducts = async () => {
    const { token } = this.state;
  
    // Crie um cabeçalho de autorização com o token
    const authHeader = `Bearer ${token}`;
  
    try {
      const response = await axios.get('https://interview.t-alpha.com.br/api/products/get-all-products', {
        headers: {
          'Authorization': authHeader 
        }
      });
      
      // Armazena os dados dos produtos no estado do componente
      this.setState({ productData: response.data.data});
      console.log('Dados recebidos da API:', response.data);

    } catch (error) {
      console.error('Erro ao buscar todos os produtos:', error);
      alert('Erro ao buscar todos os produtos. Verifique o console para mais detalhes.');
    }
  };  

  // Função para atualizar um produto
  handleUpdateProduct = async () => {
    const { productId, name, description, price, stock, token } = this.state;
  
    // Crie um cabeçalho de autorização com o token
    const authHeader = `Bearer ${token}`;
  
    try {
      await axios.put(`https://interview.t-alpha.com.br/api/products/update-product/${productId}`, {
        name,
        description,
        price: Number(price),
        stock: Number(stock)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader 
        }
      });
      
      alert('Produto atualizado com sucesso!');
      
      // Limpa os campos após a atualização
      this.setState({
        name: '',
        description: '',
        price: '',
        stock: '',
        productId: ''
      });

    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
      alert('Erro ao atualizar o produto. Verifique o console para mais detalhes.');
    }
  };

  // Função para excluir um produto
  handleDeleteProduct = async (productIdToDelete) => {
    const { token } = this.state;
  
    // Crie um cabeçalho de autorização com o token
    const authHeader = `Bearer ${token}`;
  
    try {
      await axios.delete(`https://interview.t-alpha.com.br/api/products/delete-product/${productIdToDelete}`, {
        headers: {
          'Authorization': authHeader 
        }
      });
      
      alert('Produto excluído com sucesso!');
      
      // Atualiza a lista de produtos após a exclusão
      this.handleGetAllProducts();

    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
      alert('Erro ao excluir o produto. Verifique o console para mais detalhes.');
    }
  };

  render() {
    const { name, description, price, stock, productId, productData } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Criar, Consultar, Atualizar e Excluir Produto</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              Nome do Produto:
              <input type="text" name="name" value={name} onChange={this.handleChange} required />
            </label>
            <label>
              Descrição do Produto:
              <textarea name="description" value={description} onChange={this.handleChange} required />
            </label>
            <label>
              Preço do Produto:
              <input type="number" name="price" value={price} onChange={this.handleChange} required />
            </label>
            <label>
              Estoque do Produto:
              <input type="number" name="stock" value={stock} onChange={this.handleChange} required />
            </label>
            <button type="submit">Criar Produto</button>
          </form>
          <div>
            <h2>Consultar Produto</h2>
            <label>
              ID do Produto:
              <input type="text" name="productId" value={productId} onChange={this.handleChange} />
            </label>
            <button onClick={this.handleGetProduct}>Consultar</button>
          </div>
          <div>
            <h2>Buscar Todos os Produtos</h2>
            <button onClick={this.handleGetAllProducts}>Buscar Todos</button>
            {productData && ( // Verifica se productData não é nulo
              <div>
                {Array.isArray(productData) ? ( // Verifica se productData é um array
                  <div>
                    <h3>Dados de Todos os Produtos:</h3>
                    {productData.map((product, index) => (
                      <div key={index}>
                        <p>Nome: {product.name}</p>
                        <p>Descrição: {product.description}</p>
                        <p>Preço: {product.price}</p>
                        <p>Estoque: {product.stock}</p>
                        {product.createdAt && (
                          <p>Criado em: {product.createdAt}</p>
                        )}
                        {product.updatedAt && (
                          <p>Atualizado em: {product.updatedAt}</p>
                        )}
                        <button onClick={() => this.setState({ productId: product.id })}>Editar</button>
                        <button onClick={() => this.handleDeleteProduct(product.id)}>Excluir</button>
                      </div>
                    ))}
                  </div>
                ) : ( // Caso contrário, productData é um objeto
                  <div>
                    <h3>Dados do Produto:</h3>
                    <div>
                      <p>Nome: {productData.name}</p>
                      <p>Descrição: {productData.description}</p>
                      <p>Preço: {productData.price}</p>
                      <p>Estoque: {productData.stock}</p>
                      {productData.createdAt && (
                        <p>Criado em: {productData.createdAt}</p>
                      )}
                      {productData.updatedAt && (
                        <p>Atualizado em: {productData.updatedAt}</p>
                      )}
                      <button onClick={() => this.setState({ productId: productData.id })}>Editar</button>
                      <button onClick={() => this.handleDeleteProduct(productData.id)}>Excluir</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Formulário de atualização do produto */}
          {productId && (
            <div>
              <h2>Atualizar Produto</h2>
              <form onSubmit={this.handleUpdateProduct}>
                <label>
                  Nome do Produto:
                  <input type="text" name="name" value={name} onChange={this.handleChange} required />
                </label>
                <label>
                  Descrição do Produto:
                  <textarea name="description" value={description} onChange={this.handleChange} required />
                </label>
                <label>
                  Preço do Produto:
                  <input type="number" name="price" value={price} onChange={this.handleChange} required />
                </label>
                <label>
                  Estoque do Produto:
                  <input type="number" name="stock" value={stock} onChange={this.handleChange} required />
                </label>
                <button type="submit">Atualizar Produto</button>
              </form>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
