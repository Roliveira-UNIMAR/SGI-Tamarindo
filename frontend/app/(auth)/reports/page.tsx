import { Metadata } from 'next';
import ProductsTable from './_components/ReportsTable';

export const metadata: Metadata = {
  title: "Dashboard - SGI Tamarindo",
  description: "Panel administrativo del SGI Tamarindo",
};

const App: React.FC = () => {
  return (
      <ProductsTable />
  );
}

export default App;