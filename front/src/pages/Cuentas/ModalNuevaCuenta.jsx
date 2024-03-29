import React, { useEffect, useState } from "react";
import { Container } from "shards-react";
import { Form, Row, Modal, Select, InputNumber, Col, Radio } from "antd";

import { api } from "./../../hooks/api";
const { Option } = Select;

const ModalNuevaCuenta = ({
  modal,
  setModal,
  proveedores,
  clientes,
  showNotification,
  cuentaEdicion,
  setCuentaEdicion,
  queryClient
}) => {
  const [form] = Form.useForm();
  const [tipoCuenta, setTipoCuenta] = useState();
  const [tipoCaja, setTipoCaja] = useState();

  let rules = [
    {
      required: true,
      message: "Campo necesario!"
    }
  ];

  const onReset = () => {
    setCuentaEdicion(false);
    setTipoCuenta(false);
    form.resetFields();
    setModal(false);
  };

  const onCreate = values => {
    if (cuentaEdicion) {
      values.id = cuentaEdicion.id;
      values.tipoMovimiento = cuentaEdicion.mov;
      values.tipoCaja = tipoCaja;

      api
        .putCuenta(values)
        .then(res => {
          if (res.error) {
            showNotification("error", "Ocurrio un error", res.data);
          } else {
            showNotification(
              "success",
              `${cuentaEdicion.mov} generado correctamente`,
              ""
            );
            queryClient.invalidateQueries("cuentas");
            onReset();
          }
        })
        .catch(err => {
          showNotification(
            "error",
            "Ocurrio un error",
            err.response.data.message
          );
        });
    } else {
      values.tipoCuenta = tipoCuenta;
      api
        .setNuevaCtaCte(values)
        .then(res => {
          if (res.error) {
            showNotification("error", "Ocurrio un error", res.data);
          } else {
            showNotification("success", "Cuenta alteada", "");
            queryClient.invalidateQueries("cuentas");
            setModal(false);
            form.resetFields();
          }
        })
        .catch(err => {
          showNotification(
            "error",
            "Ocurrio un error",
            err.response.data.message
          );
        });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      proveedor: cuentaEdicion.proveedor_id
        ? cuentaEdicion.proveedor_id
        : cuentaEdicion.cliente_id,
      saldo: cuentaEdicion.saldo ? cuentaEdicion.saldo : 0
    });
    setTipoCuenta(cuentaEdicion.tipo_cuenta);
  }, [cuentaEdicion]);

  return (
    <Container fluid className="main-content-container px-4">
      <Row className="page-header py-4">
        <Modal
          visible={modal}
          title={
            cuentaEdicion ? `Generar ${cuentaEdicion.mov}` : "Nueva Cuenta"
          }
          okText={
            cuentaEdicion ? `Generar ${cuentaEdicion.mov}` : "Crear Cuenta"
          }
          cancelText="Cancelar"
          onCancel={() => onReset()}
          onOk={() => {
            form
              .validateFields()
              .then(values => {
                onCreate(values);
              })
              .catch(info => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          {/* GENERA PAGO O COBRO */}
          {cuentaEdicion.mov ? (
            <Form
              form={form}
              layout="vertical"
              name="form_in_modal"
              initialValues={{
                modifier: "public"
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name="cantidad" label="Cantidad" rules={rules}>
                    <InputNumber
                      formatter={value =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={value => value.replace(/\$\s?|(,*)/g, "")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="tipoCaja" label="Tipo Caja" rules={rules}>
                    <Select
                      allowClear
                      style={{ marginBottom: "3%", width: "100%" }}
                      onChange={e => setTipoCaja(e)}
                      placeholder="Elegí la caja"
                    >
                      {["Bille", "Pesos"].map((caja, idx) => (
                        <Option key={idx} value={caja}>
                          {caja}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            /* NUEVA CUENTA */
            <Form
              form={form}
              layout="vertical"
              name="form_in_modal"
              initialValues={{
                modifier: "public"
              }}
            >
              <Row gutter={24}>
                <Col xs={24}>
                  <Form.Item rules={rules}>
                    <Radio.Group
                      onChange={val => setTipoCuenta(val.target.value)}
                      label="Tipo de cuenta"
                      defaultValue={
                        cuentaEdicion ? cuentaEdicion.tipo_cuenta : null
                      }
                    >
                      <Radio.Button
                        disabled={cuentaEdicion.tipo_cuenta === "p"}
                        value={"c"}
                      >
                        Cliente
                      </Radio.Button>
                      <Radio.Button
                        disabled={cuentaEdicion.tipo_cuenta === "c"}
                        value={"p"}
                      >
                        Proveedor
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              {tipoCuenta && (
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="proveedor"
                      label={tipoCuenta === "c" ? "Cliente" : "Proveedor"}
                      rules={rules}
                    >
                      <Select
                        showSearch
                        allowClear
                        style={{ marginBottom: "3%", width: "100%" }}
                        placeholder={
                          "Elegí el " +
                          (tipoCuenta === "c" ? "cliente" : "proveedor")
                        }
                        optionFilterProp="children"
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
                        disabled={cuentaEdicion}
                      >
                        {(tipoCuenta === "c" ? clientes : proveedores).map(
                          (persona, idx) => (
                            <Option key={idx} value={persona.id}>
                              {persona.nombre}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="saldo"
                      label={cuentaEdicion ? "Saldo" : "Saldo Inicial"}
                      rules={rules}
                    >
                      <InputNumber
                        formatter={value =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={value => value.replace(/\$\s?|(,*)/g, "")}
                        style={{ width: "100%" }}
                        value={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Form>
          )}
        </Modal>
      </Row>
    </Container>
  );
};

export default ModalNuevaCuenta;
