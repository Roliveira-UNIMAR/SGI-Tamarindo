<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
            position: relative;
            min-height: 100vh;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 20px;
        }

        .logo {
            width: 100%;
            height: auto;
            flex-shrink: 0;
        }

        .separator {
            border-top: 1px solid #000;
            margin: 8px 0;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .table th,
        .table td {
            font-size: 14px;
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
        }

        .table th {
            background-color: #f2f2f2;
        }

        .footer {
            font-size: 10px;
            display: flex;
            justify-content: space-between;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 90%;
            padding: 10px 20px;
            background-color: #f9f9f9;
            border-top: 1px solid #ccc;
        }
    </style>
</head>

<body>

    <div class="header">
        <img src="{{ public_path('logo.jpg') }}" class="logo" alt="logo">
    </div>

    <hr class="separator">

    <h2>Reporte de Inventario</h2>
    <p><strong>Fecha:</strong> {{ now()->format('d/m/Y') }}</p>

    <table class="table">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad Disp.</th>
                <th>Mínimo</th>
                <th>Máximo</th>
                <th>Unidad</th>
                <th>Refrigeración</th>
                <th>Disponible</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $inventory)
                <tr>
                    <td>{{ $inventory->product_name }}</td>
                    <td>{{ $inventory->available_quantity }}</td>
                    <td>{{ $inventory->min_stock_level }}</td>
                    <td>{{ $inventory->max_stock_level }}</td>
                    <td>{{ $inventory->unit_abbr }}</td>
                    <td>{{ $inventory->requires_refrigeration ? 'Sí' : 'No' }}</td>
                    <td>{{ $inventory->is_available ? 'Sí' : 'No' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <span>{{ now()->format('d/m/Y H:i') }}</span>
        <span>Generado por: {{ $userFullName }}</span>
        <span>Pag. 2</span>
    </div>

</body>

</html>

