import { Layout, MenuProps, Space, theme, Typography } from "antd";
import { UserType } from '@/types/user'

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({ user }: { user?: UserType }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    Nivel bajo de stock del producto XYZ
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <span>
                    Nivel bajo de stock del producto ABC
                </span>
            ),
        },
        {
            key: '3',
            label: (
                <span>
                    Nivel bajo de stock del producto DEF
                </span>
            ),
        }
    ];

    return (
        <Header style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
        }}>
            <Text strong style={{ fontSize: 16 }}>Panel de Administración</Text>
            <Space size="small">
                {/* <Dropdown menu={{ items }} placement="bottom" arrow>
                    <Badge count={3} overflowCount={9} size="default" style={{ cursor: "pointer" }}>
                        <BellOutlined style={{ fontSize: 20 }} />
                    </Badge>
                </Dropdown> */}
                <Space>
                    <Text>{user?.names}</Text>
                </Space>
            </Space>
        </Header>
    );
};

export default AppHeader;
