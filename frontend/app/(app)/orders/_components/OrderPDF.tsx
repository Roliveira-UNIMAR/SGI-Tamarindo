import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import MyReport from "@/components/reportPdf/MyReport"; // 🔥 Corrección aquí

// Definir interfaces para tipado
interface Supplier {
  name: string;
  document: string;
  phone: string;
  email: string;
}

interface OrderItem {
  product_name: string;
  ordered_quantity: number;
  unit_name: string;
}

interface Order {
  order_details: OrderItem[];
}

// Estilos para el reporte
const styles = StyleSheet.create({
  supplierContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f2f2f2",
  },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 5 },
  supplierText: { fontSize: 10 },
  tableContainer: {
    borderWidth: 1,
    borderColor: "black",
    marginTop: 8,
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  tableHeader: { backgroundColor: "#f2f2f2", fontWeight: "bold", padding: 4 },
  tableCell: { flex: 1, padding: 4, textAlign: "left" },
  tableCellRight: { flex: 1, padding: 4, textAlign: "center" },
});

const OrderPDF = ({
  order,
  supplier,
  userFullName,
}: {
  order: Order;
  supplier: Supplier;
  userFullName: string;
}) => {
  return (
    <MyReport userFullName={userFullName} reportTitle="Orden de Compra">
      {/* Datos del Proveedor */}
      <View style={styles.supplierContainer}>
        <Text style={styles.sectionTitle}>Datos del Proveedor</Text>
        <Text style={styles.supplierText}>Nombre: {supplier.name}</Text>
        <Text style={styles.supplierText}>RIF: {supplier.document}</Text>
        <Text style={styles.supplierText}>Teléfono: {supplier.phone}</Text>
        <Text style={styles.supplierText}>Email: {supplier.email}</Text>
      </View>

      {/* Tabla de Detalles de la Orden */}
      <View style={styles.tableContainer}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Producto</Text>
          <Text style={styles.tableCellRight}>Cantidad</Text>
        </View>
        {order.order_details.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.product_name}</Text>
            <Text style={styles.tableCellRight}>{item.ordered_quantity} {item.unit_name}</Text>
          </View>
        ))}
      </View>
    </MyReport>
  );
};

export default OrderPDF;
