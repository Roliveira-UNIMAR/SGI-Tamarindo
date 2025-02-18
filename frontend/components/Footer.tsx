import { Layout } from "antd";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
    return (
        <Footer style={{ textAlign: 'center' }}>
            SGI Tamarindo © {new Date().getFullYear()} - Hecho con ❤️ por <a href="https://github.com/Roliveira2208">Rodrigo Oliveira</a>
        </Footer>
    );
};

export default AppFooter;