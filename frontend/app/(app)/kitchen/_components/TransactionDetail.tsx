import { Descriptions, Modal } from "antd";
import { InventoryTransaction } from "@/types/inventoryTransaction";

const transactionItems = (transaction: InventoryTransaction) => [
  { key: "1", label: "Producto", children: transaction.product_name },
  { key: "2", label: "Cantidad", children: transaction.quantity },
  { key: "3", label: "Tipo", children: transaction.transaction_type },
  { key: "4", label: "Fecha", children: transaction.transaction_date },
];

export const TransactionDetail = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: InventoryTransaction;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  return(
    <Modal
    title="Detalles de la Transacción"
    centered
    open={isModalOpen}
    onCancel={closeModal} // Cierra el modal correctamente
    destroyOnClose
    footer={null}
    width={{
      xs: "90%",
      sm: "80%",
      md: "70%",
      lg: "60%",
      xl: "50%",
      xxl: "40%",
    }}
  >
    <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} items={transactionItems(record)} />
  </Modal>
  )
};

export default TransactionDetail;
