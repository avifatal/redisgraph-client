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
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Cypher</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <CypherPage />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
