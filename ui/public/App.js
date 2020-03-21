/* eslint "react/react-in-jsx-scope": "off" */

/* globals React ReactDOM */

/* eslint "react/jsx-no-undef": "off" */

/* eslint "no-alert": "off" */
// eslint-disable-next-line react/prefer-stateless-function
class ProductInventory extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query{
            productList {
                id category name price image
            }
        }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.json();
    this.setState({
      products: result.data.productList
    });
  }

  async createProduct(product) {
    const query = `mutation addProduct($product: ProductInputs!){
            addProduct(product: $product){
                id
            }
        }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          product
        }
      })
    });

    if (response) {
      this.loadData();
    }
  }

  render() {
    const {
      products
    } = this.state;
    return React.createElement(React.Fragment, null, React.createElement("h1", null, "My Company Inventory"), React.createElement(ProductTable, {
      products: products
    }), React.createElement("br", null), React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

} // eslint-disable-next-line no-unused-vars


function ProductTable(props) {
  // eslint-disable-next-line react/destructuring-assignment
  // eslint-disable-next-line react/no-array-index-key
  // eslint-disable-next-line max-len
  // eslint-disable-next-line react/destructuring-assignment
  const productRows = props.products.map((product, index) => React.createElement(ProductRow, {
    key: index,
    product: product
  }));
  return React.createElement("div", null, React.createElement("p", null, "Showing all available products"), React.createElement("hr", null), React.createElement("table", {
    className: "bordered-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product Name"), React.createElement("th", null, "Price"), React.createElement("th", null, "Category"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, productRows)));
}

function ProductRow({
  product
}) {
  //   const { product } = props;
  return React.createElement("tr", null, React.createElement("td", null, product.name), React.createElement("td", null, "$", product.price), React.createElement("td", null, product.category), React.createElement("td", null, React.createElement("a", {
    href: product.image,
    target: "_blank"
  }, "View")));
}
/* globals React ReactDOM PropTypes */


class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      price: '$'
    };
    this.handlepriceChange = this.handlepriceChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      category: form.category.value,
      price: form.price.value.replace('$', ''),
      name: form.name.value,
      image: form.image.value
    }; // eslint-disable-next-line react/destructuring-assignment

    this.props.createProduct(product); // eslint-disable-next-line no-sequences
    // eslint-disable-next-line no-unused-expressions

    form.price.value = '$', form.name.value = '', form.image.value = '', form.category.value = '';
  }

  handlepriceChange() {
    this.setState({
      price: document.forms.productAdd.price.value
    });
  }

  render() {
    return React.createElement(React.Fragment, null, React.createElement("p", null, "Add a new product to inventory"), React.createElement("hr", null), React.createElement("form", {
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, React.createElement("div", {
      className: "form-container"
    }, React.createElement("div", {
      className: "form-col"
    }, "Category", React.createElement("br", null), React.createElement("select", {
      name: "category",
      className: "category"
    }, React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), React.createElement("option", {
      value: "Accessories"
    }, "Accessories")), React.createElement("br", null), "Product Name", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "name"
    })), React.createElement("div", {
      className: "form-col"
    }, "Price Per Unit", ' ', React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "price" // eslint-disable-next-line react/destructuring-assignment
      ,
      defaultValue: this.state.price,
      onChange: this.handlepriceChange
    }), React.createElement("br", null), "Image URL", React.createElement("br", null), React.createElement("input", {
      type: "url",
      name: "image"
    }))), React.createElement("button", {
      type: "submit"
    }, "Add Product")));
  }

}

ProductAdd.propTypes = {
  createProduct: PropTypes.func.isRequired
};
const element = React.createElement(ProductInventory, null);
ReactDOM.render(element, document.getElementById('contents'));