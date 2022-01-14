import React, { useEffect } from "react";
import { Container } from "shards-react";
import { Form, Input, Row, Modal, Col } from "antd";

import { api } from "./../../hooks/api";

const ModalNuevoCliente = ({
  modal,
  setModal,
  openNotificationWithIcon,
  clienteEdicion,
  setClienteEdicion
}) => {
  const [form] = Form.useForm();

  let rules = [
    {
      required: true,
      message: "Campo necesario!"
    }
  ];

  const onReset = () => {
    setClienteEdicion(false);
    form.resetFields();
    setModal(false);
  };

  const onCreate = values => {
    if (clienteEdicion) {
      values.id = clienteEdicion.id;
      api
        .putCliente(values)
        .then(res => {
          if (res.error) {
            openNotificationWithIcon("error", "Ocurrio un error", res.data);
          } else {
            openNotificationWithIcon(
              "success",
              "Cliente modificado correctamente",
              ""
            );
            onReset();
          }
        })
        .catch(err => {
          openNotificationWithIcon(
            "error",
            "Ocurrio un error",
            err.response.data.message
          );
        });
    } else {
      api
        .setNuevoCliente(values)
        .then(res => {
          if (res.error) {
            openNotificationWithIcon("error", "Ocurrio un error", res.data);
          } else {
            openNotificationWithIcon("success", "Cliente alteado", "");
            setModal(false);
            form.resetFields();
          }
        })
        .catch(err => {
          openNotificationWithIcon(
            "error",
            "Ocurrio un error",
            err.response.data.message
          );
        });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      nombre: clienteEdicion.nombre,
      telefono: clienteEdicion.telefono,
      email: clienteEdicion.email
    });
  }, [clienteEdicion]);

  return (
    <Container fluid className="main-content-container px-4">
      <Row className="page-header py-4">
        <Modal
          visible={modal}
          title={(clienteEdicion ? "Editar" : "Nueva") + " Cliente"}
          okText={clienteEdicion ? "Editar" : "Crear"}
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
                <Form.Item name="nombre" label="Nombre" rules={rules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="telefono" label="Telefono">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item name="email" label="Email">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Row>
    </Container>
  );
};

export default ModalNuevoCliente;
