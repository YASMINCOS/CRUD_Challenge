import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      price: '',
      stock: '',
      productId: '',
      productData: null,
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImlhdCI6MTcxMzc0MjMxNH0.zpT55x8wVQfbGqTe4ZnBdgMwfbBqcaug08Yx_bjoRIU"
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description, price, stock, token } = this.state;

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

  handleGetProduct = async () => {
    const { productId, token } = this.state;
  
    const authHeader = `Bearer ${token}`;
  
    try {
      const response = await axios.get(`https://interview.t-alpha.com.br/api/products/get-one-product/${productId}`, {
        headers: {
          'Authorization': authHeader 
        }
      });
      const productData = response.data.data;
      
      this.setState({ productData });
      console.log('Dados recebidos da API:', response.data);

    } catch (error) {
      console.error('Erro ao consultar o produto:', error);
      alert('Erro ao consultar o produto. Verifique o console para mais detalhes.');
    }
  };

  handleGetAllProducts = async () => {
    const { token } = this.state;
  
    const authHeader = `Bearer ${token}`;
  
    try {
      const response = await axios.get('https://interview.t-alpha.com.br/api/products/get-all-products', {
        headers: {
          'Authorization': authHeader 
        }
      });
      
      this.setState({ productData: response.data.data});
      console.log('Dados recebidos da API:', response.data);

    } catch (error) {
      console.error('Erro ao buscar todos os produtos:', error);
      alert('Erro ao buscar todos os produtos. Verifique o console para mais detalhes.');
    }
  };  

  handleUpdateProduct = async () => {
    const { productId, name, description, price, stock, token } = this.state;
  
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

  handleDeleteProduct = async (productIdToDelete) => {
    const { token } = this.state;
  
    const authHeader = `Bearer ${token}`;
  
    try {
      await axios.delete(`https://interview.t-alpha.com.br/api/products/delete-product/${productIdToDelete}`, {
        headers: {
          'Authorization': authHeader 
        }
      });
      
      alert('Produto excluído com sucesso!');
      
      this.handleGetAllProducts();

    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
      alert('Erro ao excluir o produto. Verifique o console para mais detalhes.');
    }
  };

  render() {
    const { name, description, price, stock, productId, productData } = this.state;

    return (
      <div className="container">
        <header className="App-header">
          <h1>Criar, Consultar, Atualizar e Excluir Produto</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Nome do Produto:</label>
              <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} required />
            </div>
            <div className="form-group">
              <label>Descrição do Produto:</label>
              <textarea className="form-control" name="description" value={description} onChange={this.handleChange} required />
            </div>
            <div className="form-group">
              <label>Preço do Produto:</label>
              <input type="number" className="form-control" name="price" value={price} onChange={this.handleChange} required />
            </div>
            <div className="form-group">
              <label>Estoque do Produto:</label>
              <input type="number" className="form-control" name="stock" value={stock} onChange={this.handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Criar Produto</button>
          </form>
          <div>
            <h2>Consultar Produto</h2>
            <div className="form-group">
              <label>ID do Produto:</label>
              <input type="text" className="form-control" name="productId" value={productId} onChange={this.handleChange} />
            </div>
            <button className="btn btn-info" onClick={this.handleGetProduct}>Consultar</button>
          </div>
          <div>
            <h2>Buscar Todos os Produtos</h2>
            <button className="btn btn-success" onClick={this.handleGetAllProducts}>Buscar Todos</button>
            {productData && (
              <div>
                {Array.isArray(productData) ? (
                  <div>
                    <h3>Dados de Todos os Produtos:</h3>
                    {productData.map((product, index) => (
                      <div key={index} className="card my-2">
                        <div className="card-body">
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
                          <button className="btn btn-warning mr-2" onClick={() => this.setState({ productId: product.id })}>Editar</button>
                          <button className="btn btn-danger" onClick={() => this.handleDeleteProduct(product.id)}>Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <h3>Dados do Produto:</h3>
                    <div className="card">
                      <div className="card-body">
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
                        <button className="btn btn-warning mr-2" onClick={() => this.setState({ productId: productData.id })}>Editar</button>
                        <button className="btn btn-danger" onClick={() => this.handleDeleteProduct(productData.id)}>Excluir</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {productId && (
            <div>
              <h2>Atualizar Produto</h2>
              <form onSubmit={this.handleUpdateProduct}>
                <div className="form-group">
                  <label>Nome do Produto:</label>
                  <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} required />
                </div>
                <div className="form-group">
                  <label>Descrição do Produto:</label>
                  <textarea className="form-control" name="description" value={description} onChange={this.handleChange} required />
                </div>
                <div className="form-group">
                  <label>Preço do Produto:</label>
                  <input type="number" className="form-control" name="price" value={price} onChange={this.handleChange} required />
                </div>
                <div className="form-group">
                  <label>Estoque do Produto:</label>
                  <input type="number" className="form-control" name="stock" value={stock} onChange={this.handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Atualizar Produto</button>
              </form>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
