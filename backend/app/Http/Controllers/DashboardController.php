<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\ConsumptionNote;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\OrderDetail;
use App\Models\ConsumptionNoteDetail;
use App\Models\InventoryTransfer;

class DashboardController extends Controller
{
    public function getSummary()
    {
        $totalOrders = Order::whereMonth('created_at', now()->month)->count();
        $totalConsumptionNotes = ConsumptionNote::whereMonth('created_at', now()->month)->count();
        $inventoryValue = Inventory::sum('available_quantity');
        $pendingOrders = Order::where('status_id', 7)->count();

        return response()->json([
            'total_orders' => $totalOrders,
            'total_consumption_notes' => $totalConsumptionNotes,
            'inventory_value' => $inventoryValue,
            'pending_orders' => $pendingOrders,
        ]);
    }

    public function getOrdersAndNotes()
    {
        $ordersByStatus = Order::selectRaw('status_id, COUNT(*) as count')
            ->groupBy('status_id')
            ->get();

        $latestOrders = Order::with('supplier')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $latestNotes = ConsumptionNote::with('client')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'orders_by_status' => $ordersByStatus,
            'latest_orders' => $latestOrders,
            'latest_notes' => $latestNotes,
        ]);
    }

    public function getInventoryManagement()
    {
        $lowStockProducts = Inventory::whereColumn('available_quantity', '<', 'min_stock_level')
            ->limit(5)
            ->get();

        $recentTransfers = InventoryTransfer::orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        $topConsumedProducts = ConsumptionNoteDetail::selectRaw('recipe_id, SUM(quantity) as total_consumed')
            ->groupBy('recipe_id')
            ->orderByDesc('total_consumed')
            ->limit(5)
            ->with('recipe')
            ->get();

        return response()->json([
            'low_stock_products' => $lowStockProducts,
            'recent_transfers' => $recentTransfers,
            'top_consumed_products' => $topConsumedProducts,
        ]);
    }
}
