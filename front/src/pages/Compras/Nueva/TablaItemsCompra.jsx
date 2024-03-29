import React from "react";
import { Row, Form, Select, Col, Button } from "antd";
import { Container } from "shards-react";
const { Option } = Select;

const TablaItemsCompra = ({ productos, filas, setFilas, setError }) => {
  const handleAddRow = () => {
    setError(false);
    const item = {
      producto: null,
      cantidad: null,
      costo: null
    };
    setFilas([...filas, item]);
  };
  const handleRemoveRow = idx => {
    const rows = [...filas];
    rows.splice(idx, 1);
    setFilas([...rows]);
  };

  const setearDato = (val, type, id) => {
    const filasCopia = [...filas];
    filasCopia[id][type] = val;

    if (type === "producto") {
      let precioProd = buscarPrecioProd(val);
      filasCopia[id]["costo"] = precioProd.costo;
    }

    setFilas([...filasCopia]);
  };

  const buscarPrecioProd = id => {
    let prod = productos.filter(prod => prod.id === id);
    return prod[0];
  };

  return (
    <Container fluid className="main-content-container px-4">
      <Row>
        <Col xs={24} span={8}>
          <Button onClick={() => handleAddRow()} type="primary">
            Agregar
          </Button>
        </Col>
      </Row>
      <Row className="page-header py-4">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th className="text-center"> Producto </th>
              <th className="text-center"> Cantidad </th>
              <th className="text-center"> Costo U. </th>
              <th className="text-center"> </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <Form.Item>
                    <Select
                      showSearch
                      allowClear
                      style={{ marginBottom: "3%", width: "100%" }}
                      placeholder="Elegí el producto"
                      optionFilterProp="children"
                      value={item.producto}
                      onChange={val => setearDato(val, "producto", idx)}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      {productos.map((producto, idx) => (
                        <Option key={idx} value={producto.id}>
                          {producto.nombre}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </td>
                <td>
                  <input
                    type="number"
                    onChange={val =>
                      setearDato(val.target.value, "cantidad", idx)
                    }
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder={filas[idx].costo}
                    onChange={val => setearDato(val.target.value, "costo", idx)}
                    className="form-control"
                  />
                </td>
                <td>
                  <Button type="success" onClick={() => handleRemoveRow(idx)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Row>
    </Container>
  );
};

export default TablaItemsCompra;
