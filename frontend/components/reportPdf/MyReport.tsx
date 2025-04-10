import React, { FC, ReactNode } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

// Estilos
const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  logo: { width: 50, height: 50, marginRight: 10 },
  companyInfo: { fontSize: 10, lineHeight: 1.5 },
  separator: { borderBottomWidth: 1, borderBottomColor: "black", marginBottom: 10 },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 10 },
  content: { marginBottom: 20 },
  footer: { flexDirection: "row", justifyContent: "space-between", fontSize: 10, position: "absolute", bottom: 30, width: "100%" },
});

interface ReportProps {
  reportTitle: string;
  children: ReactNode;
  userFullName: string;
}

const MyReport: FC<ReportProps> = ({ reportTitle, userFullName, children }) => {
  return (
    <Document>
      <Page size="A4" style={{ padding: 20 }}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image src="/logo_2.jpg" style={styles.logo} alt="logo" />
          <View>
            <Text style={styles.companyInfo}>HOTEL PARADISE TAMARINDO</Text>
            <Text style={styles.companyInfo}>
              Avenida Principal, Playa Guacuco, 6317, Arismendi, Nueva Esparta
            </Text>
            {/* <Text style={styles.companyInfo}>OPERADORA TAMARINDO PARADISE 1802, C. A.</Text> */}
            <Text style={styles.companyInfo}>J-41242556-0 | 0412-25142294</Text>
          </View>
        </View>
        <View style={styles.separator} />

        {/* Título del reporte */}
        <Text style={styles.title}>{reportTitle}</Text>

        {/* Contenido del reporte */}
        <View style={styles.content}>{children}</View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>{dayjs().format("DD/MM/YYYY HH:mm")}</Text>
          <Text>{`Generado por: ${userFullName}`}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyReport;
