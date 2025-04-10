<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Inventory;
use App\Models\ConsumptionNote;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function getReportData($type, Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|integer'
        ]);

        $data = match ($type) {
            'orders' => $this->getOrdersReport($request),
            'inventory' => $this->getInventoryReport($request),
            'sales' => $this->getSalesReport($request),
            default => throw new \Exception('Tipo de reporte no válido'),
        };

        return response()->json($data);
    }

    private function getOrdersReport(Request $request)
    {
        $query = Order::query()
            ->when($request->filled('start_date'), function ($q) use ($request) {
                $q->whereDate('created_at', '>=', $request->start_date);
            })
            ->when($request->filled('end_date'), function ($q) use ($request) {
                $q->whereDate('created_at', '<=', $request->end_date);
            })
            ->when($request->filled('status_id'), function ($q) use ($request) {
                $q->where('status_id', $request->status);
            });

        return $query->with(['details', 'supplier'])->get();
    }

    private function getInventoryReport(Request $request)
    {
        $query = Inventory::query()
            ->when($request->filled('start_date'), function ($q) use ($request) {
                $q->whereDate('updated_at', '>=', $request->start_date);
            })
            ->when($request->filled('end_date'), function ($q) use ($request) {
                $q->whereDate('updated_at', '<=', $request->end_date);
            })
            ->when($request->filled('status_id'), function ($q) use ($request) {
                $q->where('status_id', $request->status);
            });

        return $query->with(['product'])->get();
    }

    private function getSalesReport(Request $request)
    {
        $query = ConsumptionNote::query()
            ->when($request->filled('start_date'), function ($q) use ($request) {
                $q->whereDate('updated_at', '>=', $request->start_date);
            })
            ->when($request->filled('end_date'), function ($q) use ($request) {
                $q->whereDate('updated_at', '<=', $request->end_date);
            })
            ->when($request->filled('status'), function ($q) use ($request) {
                $q->where('status_id', $request->status);
            });

        return $query->with(['items', 'client'])->get();
    }


    public function generateReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reportType' => 'required|in:orders,inventory,sales',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|integer'
        ], [
            'reportType' => 'El tipo de reporte es requerido',
            'start_date' => 'Debe se una fecha',
            'end_date' => 'Debe ser una fecha',
            'status' => 'El status debe ser un integer'
        ]);

        if ($validator->fails()) {
            $errorMessages = collect(['Error de validación'])
                ->merge($validator->errors()->all())
                ->toArray();

            return response()->json([
                'message' => $errorMessages,
            ], 400);
        }

        $data = match ($request->reportType) {
            'orders' => $this->getOrdersReport($request),
            'inventory' => $this->getInventoryReport($request),
            'sales' => $this->getSalesReport($request),
            default => throw new \Exception('Tipo de reporte no válido'),
        };

        $pdf = Pdf::loadView('reports.' . $request->reportType, [
            'data' => $data,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => $request->status,
            'statusText' => [$this, 'getStatusText'], // Pasar el método como callback
            'userFullName' => $request->user()->fullName
        ]);

        $options = $pdf->getDomPDF()->getOptions();
        $options->setIsPhpEnabled(true);
        $options->setIsHtml5ParserEnabled(true);

        $pdf->render();
        return $pdf->stream('reporte.pdf');
    }

    public function getStatusText(int $status): string
    {
        return match ($status) {
            1 => 'Activo',
            2 => 'Inactivo',
            3 => 'Enviada',
            4 => 'Recibida',
            5 => 'Retrasada',
            6 => 'Verificada',
            7 => 'Pendiente',
            8 => 'Anulada',
            9 => 'Emitida',
            10 => 'Cancelada',
            default => 'Desconocido',
        };
    }
}
