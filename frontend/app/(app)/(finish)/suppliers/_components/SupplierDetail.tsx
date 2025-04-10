import { Supplier } from "@/types/supplier";
import { Descriptions, Modal } from "antd";

// const getStatus = (id: number) => {
//   switch (id) {
//     case 1:
//       return <Badge status="success" text="Activo" />;
//     case 2:
//       return <Badge status="default" text="Inactivo" />;
//   }
// };

const supplierItems = (supplier: Supplier) => [
  {
    key: "1",
    label: "RIF",
    children: supplier.document,
  },
  {
    key: "2",
    label: "Razón Social",
    children: supplier.name,
  },
  {
    key: "3",
    label: "Teléfono",
    children: supplier.phone,
  },
  {
    key: "4",
    label: "Email",
    children: supplier.email,
  },
  {
    key: "5",
    label: "Dirección",
    children: supplier.address,
  },
];

const SupplierDetail = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: Supplier;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <Modal
      title="Detalles del Proveedor"
      centered
      open={isModalOpen}
      onCancel={closeModal} // Cierra el modal correctamente
      destroyOnClose
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      footer={null}
    >
      <Descriptions
        bordered
        column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
        items={supplierItems(record)}
      />
    </Modal>
  );
};

export default SupplierDetail;
