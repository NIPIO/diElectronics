<?php


namespace App\Repositories;

use App\Interfaces\RepositoryInterface;
use App\Models\Productos;
use App\Models\Ventas;

class ProductosRepository implements RepositoryInterface
{
   
    public function __construct() {}

    public function getProducto($id) {
        return Productos::whereId($id)->first();
    }

    public function setProducto($req) {
        return Productos::create([
            'nombre' => $req['nombre'],
            'marca' => $req['marca'],
            'costo' => $req['costo'],
            'stock' => $req['stock'],
            'stock_reservado' => 0,
            'en_transito_reservado' => 0,
        ]);
    }
    
    public function updateGeneralProducto($producto, $req) {
        return $producto->update([
            "marca" => $req['marca'],
            "stock" => $req['stock'],
            "costo" => $req['costo'],
        ]);
    }
    public function updateProducto($id, $campo, $valor) {
        Productos::whereId($id)->update([
            $campo => $valor,
        ]);
    }
    
    public function getStockTotal() {
        return [Productos::sum('stock'), Productos::sum('stock_reservado'), Productos::sum('en_transito'), Productos::sum('en_transito_reservado')];
    }

    public function incrementar($compraDetalleRow, $tipo) {
        Productos::whereId($compraDetalleRow['producto'])->increment($tipo, $compraDetalleRow['cantidad']);
    }

    public function chequearDisponibilidadStock($ventaDetalleRow, $esEdicion, $tipoStock) {
        // Obtengo el producto.
        $prod = $this->getProducto($ventaDetalleRow['producto'])->toArray();
        if ($esEdicion) {
            //Me fijo los que ya tenía reservados esa reserva:
            $ventaReserva = Ventas::whereId($ventaDetalleRow['venta_id'])->first()->toArray();

            if ($tipoStock === 'Fisico') {
                // Saco la diferencia entre lo reservado y lo nuevo. Si esa diferencia es mayor a lo que hay disponible, lanzo error.
                $diferenciaReservadoYNuevo = $ventaDetalleRow['cantidad'] - $ventaReserva['cantidad'];
                $stockDisponibleDelProducto = $prod['stock'] - $prod['stock_reservado'];

                if ($ventaReserva['tipo_stock'] !== $tipoStock) {
                   if ($ventaDetalleRow['producto']['stock'] - $ventaDetalleRow['producto']['stock_reservado'] - (int)$ventaDetalleRow['cantidad'] < 0) {
                        throw new \Exception('No hay stock suficiente para el ' . $prod['nombre'] . '. Stock disponible: ' . ($ventaDetalleRow['producto']['stock'] - $ventaDetalleRow['producto']['stock_reservado']));
                    }
                } 

                if ($diferenciaReservadoYNuevo > $stockDisponibleDelProducto) {
                    throw new \Exception('No hay stock suficiente para el ' . $prod['nombre'] . '. Stock disponible: ' . ($prod['stock'] - $prod['stock_reservado']));
                }
            } else {
                $diferenciaReservadoYNuevoEnTransito = $ventaDetalleRow['cantidad'] - $ventaReserva['cantidad'];
                $stockDisponibleDelProductoEnTransito = $prod['en_transito'] - $prod['en_transito_reservado'];

                if ($ventaReserva['tipo_stock'] !== $tipoStock) {
                    if ($ventaDetalleRow['producto']['en_transito'] - $ventaDetalleRow['producto']['en_transito_reservado'] - $ventaReserva['cantidad'] < 0) {
                         throw new \Exception('No hay stock suficiente para el ' . $prod['nombre'] . '. Stock en transito: ' . ($ventaDetalleRow['producto']['en_transito'] - $ventaDetalleRow['producto']['en_transito_reservado']));
                     }
                 } 

                if ($diferenciaReservadoYNuevoEnTransito > $stockDisponibleDelProductoEnTransito) {
                    throw new \Exception('No hay stock en transito suficiente para el ' . $prod['nombre'] . '. Stock disponible: ' . ($prod['en_transito'] - $prod['en_transito_reservado']));
                }
            }
        } else {
            if ($tipoStock === 'Fisico') {
                //Me fijo que no nos sobrepasemos de stock con la nueva venta.
                if ($prod['stock'] - $prod['stock_reservado'] - (int) $ventaDetalleRow['cantidad'] < 0 ) {
                    throw new \Exception('No hay stock suficiente para el ' . $prod['nombre'] . '. Stock disponible: ' . ($prod['stock'] - $prod['stock_reservado']));
                }
            } else {
                if ($prod['en_transito'] - $prod['en_transito_reservado'] - (int) $ventaDetalleRow['cantidad'] < 0 ) {
                    throw new \Exception('No hay stock en transito suficiente para el ' . $prod['nombre'] . '. Stock en transito: ' . ($prod['en_transito'] - $prod['en_transito_reservado']));
                }
            }
        }
    }
}

