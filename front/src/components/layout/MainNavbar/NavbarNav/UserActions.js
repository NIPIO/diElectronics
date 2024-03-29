import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";

export default class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  cerrarSesion() {
    localStorage.removeItem("logueado");
    window.location.href = "/login";
  }

  render() {
    let logueado = localStorage.getItem("logueado");
    logueado = JSON.parse(logueado);

    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
        <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
          <img
            className="user-avatar rounded-circle mr-2"
            src={require("./../../../../images/avatars/2.jpg")}
            alt="User Avatar"
          />
          <span className="d-none d-md-inline-block">{logueado.usuario}</span>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} small open={this.state.visible}>
          {/* <DropdownItem tag={Link} to="user-profile">
            <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="edit-user-profile">
            <i className="material-icons">&#xE8B8;</i> Edit Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="file-manager-list">
            <i className="material-icons">&#xE2C7;</i> Files
          </DropdownItem>
          <DropdownItem tag={Link} to="transaction-history">
            <i className="material-icons">&#xE896;</i> Transactions
          </DropdownItem>
          <DropdownItem divider /> */}
          <DropdownItem
            className="text-danger"
            onClick={() => this.cerrarSesion()}
          >
            <i className="material-icons text-danger">&#xE879;</i> Salir
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}
