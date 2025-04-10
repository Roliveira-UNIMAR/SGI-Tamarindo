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

        .table th, .table td {
            font-size: 10px;
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

    <h2>Reporte de Ventas</h2>
    <p><strong>Período:</strong> {{ $start_date ?? 'N/A' }} - {{ $end_date ?? 'N/A' }}</p>

    <table class="table">
        <thead>
            <tr>
                <th>Fecha de Emisión</th>
                <th>Fecha de Pago</th>
                <th>Lugar de Emisión</th>
                <th>Cliente</th>
                <th>Documento</th>
                <th>Usuario</th>
                <th>Subtotal</th>
                <th>Descuento</th>
                <th>Total</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $sale)
                <tr>
                    <td>{{ $sale->issued_at }}</td>
                    <td>{{ $sale->cancelled_at ?? 'Pendiente' }}</td>
                    <td>{{ $sale->address }}</td>
                    <td>{{ $sale->client_name }}</td>
                    <td>{{ $sale->client_document }}</td>
                    <td>{{ $sale->user_name }}</td>
                    <td>{{ number_format($sale->subtotal, 2) }}</td>
                    <td>{{ number_format($sale->discount, 2) }}</td>
                    <td>{{ number_format($sale->total, 2) }}</td>
                    <td>{{ $statusText($sale->status_id) }}</td>
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
