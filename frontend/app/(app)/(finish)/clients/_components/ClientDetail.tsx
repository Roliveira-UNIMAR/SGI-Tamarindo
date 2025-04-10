import { Client } from "@/types/client";
import { Descriptions, Modal } from "antd";

// const getStatus = (id: number) => {
//   switch (id) {
//     case 1:
//       return <Badge status="success" text="Activo" />;
//     case 2:
//       return <Badge status="default" text="Inactivo" />;
//   }
// };

const clientItems = (client: Client) => [
  {
    key: "1",
    label: "Cédula",
    children: client.document,
  },
  {
    key: "2",
    label: "Nombre y Apellido",
    children: client.full_name,
  },
  {
    key: "3",
    label: "Teléfono",
    children: client.phone,
  },
  {
    key: "4",
    label: "Email",
    children: client.email,
  },
  {
    key: "5",
    label: "Dirección",
    children: client.address,
  },
];

const ClientDetail = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: Client;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <Modal
      title="Detalles del Cliente"
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
        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
        items={clientItems(record)}
      />
    </Modal>
  );
};

export default ClientDetail;
