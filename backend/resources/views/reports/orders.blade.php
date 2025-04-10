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

        .company-info {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            margin-left: 15px;
            max-width: 80%;
        }

        .hotel-name {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .company-info div {
            font-size: 11px;
            white-space: nowrap;
        }

        .document-info {
            margin-top: 4px;
            font-size: 10.5px;
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

    <h2>Reporte de Órdenes</h2>
    <p><strong>Período:</strong> {{ $start_date ?? 'N/A' }} - {{ $end_date ?? 'N/A' }}</p>

    <table class="table">
        <thead>
            <tr>
                <th>Orden #</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $order)
                <tr>
                    <td>{{ $order->id }}</td>
                    <td>{{ $order->supplier->name }}</td>
                    <td>{{ $order->created_at->format('d/m/Y') }}</td>
                    <td>{{ $statusText($order->status_id) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <span>{{ now()->format('d/m/Y H:i') }}</span>
        <span>Generado por: {{ $userFullName }}</span>
        <span>Pag. 1</span>
    </div>

</body>


</html>
