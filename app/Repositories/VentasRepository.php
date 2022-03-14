<?php


namespace App\Repositories;

use App\Interfaces\RepositoryInterface;
use App\Models\Ventas;
use App\Models\VentasDetalle;
use Carbon\Carbon;

class VentasRepository implements RepositoryInterface
{
   
    private $productosRepository;

    public function __construct(ProductosRepository $productosRepository) {
        $this->productosRepository = $productosRepository;
    }

    public function getVenta($id) {
        return Ventas::whereId($id)->first();
    }

    public function setVenta($req) {
        return Ventas::create([
            'cliente_id' => $req['cliente'],
            'vendedor_id' => $req['vendedor'],
            'cantidad' => array_sum(array_column($req['filas'], 'cantidad')),
            'precio_total' => 0,
            'costo' => 0,
            'activo' => 1,
            'fecha_venta' => Carbon::now()->format('Y-m-d'),
        ]);
    }

    public function updatePrecioVenta($venta, $totalPrecioVenta, $costo) {
        Ventas::whereId($venta->id)->update([
            "precio_total" => $totalPrecioVenta,
            "costo" => $costo,
            "utilidad" => $totalPrecioVenta - $costo,
            "vendedor_comision" => ($totalPrecioVenta * 0.01)
        ]);
    }

    public function getVentasConfirmadas() {
        return Ventas::where('confirmada', true)->get();
    }

}


class VentasDetalleRepository implements RepositoryInterface
{
   
    public function __construct() {}

    public function setVentaDetalle($venta, $ventaDetalleRow) {
        return VentasDetalle::create([
            'venta_id' => $venta->id,
            'producto_id' => $ventaDetalleRow['producto'],
            'cantidad' => $ventaDetalleRow['cantidad'],
            'precio' => $ventaDetalleRow['precioUnitario']
        ]);
    }

}
