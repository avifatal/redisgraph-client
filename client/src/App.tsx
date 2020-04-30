import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd'
import { CypherPage } from './Components/CypherPage';
const { Header, Content, Footer } = Layout;


function App() {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Cypher</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <CypherPage />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
