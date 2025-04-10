<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ConsumptionNoteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\InventoryTransactionController;
use App\Http\Controllers\InventoryTransferController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Models\Category;
use App\Models\DocumentType;
use App\Models\Gender;
use App\Models\PhoneOperator;
use App\Models\Role;
use App\Models\Unit;
use App\Models\User;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return response()->json($request->user());
});

Route::apiResources([
    'categories' => CategoryController::class,
    'consumption-notes' => ConsumptionNoteController::class,
    'inventories' => InventoryController::class,
    'inventory-transactions' => InventoryTransactionController::class,
    'inventory-transfers' => InventoryTransferController::class,
    'locations' => LocationController::class,
    'orders' => OrderController::class,
    'products' => ProductController::class,
    'recipes' => RecipeController::class,
    'users' => UserController::class,
    'clients' => ClientController::class,
    'suppliers' => SupplierController::class,
]);

Route::get('/document-types', function (Request $request) {
    $query = DocumentType::query();

    if ($request->query('type') === 'user') {
        // Solo devuelve los tipos 1 y 2
        $query->whereIn('id', [1, 2]);
    }

    if ($request->query('type') === 'supplier') {
        // Excluye el tipo 4
        $query->whereNotIn('id', [4]);
    }

    if ($request->query('type') === 'client') {
        // Filtra solo los tipos 5 y 6
        $query->whereNotIn('id', [5, 6]);
    }

    return response()->json($query->get()->map(function ($documentType) {
        return [
            'id' => $documentType->id,
            'name' => $documentType->char,
        ];
    }));
});

Route::get('/phone-operators', function () {
    return PhoneOperator::all()->map(function ($phoneOperator) {
        return [
            'id' => $phoneOperator->id,
            'name' => $phoneOperator->code,
        ];
    })->toJson();
});

Route::get('/categories', function () {
    return Category::all()->map(function ($category) {
        return [
            'id' => $category->id,
            'name' => $category->name,
        ];
    })->toJson();
});

Route::get('/genders', function () {
    return Gender::all()->map(function ($gender) {
        return [
            'id' => $gender->id,
            'name' => $gender->name,
        ];
    })->toJson();
});

Route::get('/roles', function (Request $request) {
    $query = Role::query();

    if ($request->query('type') === 'create') {
        $query->whereNotIn('id', [1, 2]);
    }

    return response()->json($query->get()->map(function ($role) {
        return [
            'id' => $role->id,
            'name' => $role->name,
        ];
    }));
});

Route::get('/units', function () {
    return Unit::all()->map(function ($unit) {
        return [
            'id' => $unit->id,
            'abbr' => $unit->abbreviation,
        ];
    })->toJson();
});

Route::get('/dashboard/summary', [DashboardController::class, 'getSummary']);

Route::get('/dashboard/orders-notes', [DashboardController::class, 'getOrdersAndNotes']);

Route::get('/dashboard/inventory', [DashboardController::class, 'getInventoryManagement']);

Route::post('/reports/generate', [ReportController::class, 'generateReport']);
