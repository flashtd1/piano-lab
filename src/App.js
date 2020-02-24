import React from 'react';
import {BrowserRouter} from 'react-router-dom'
import {Layout} from 'antd'
import router from './router/router'
import Header from './components/layout/header'
import Content from './components/layout/content'
import Footer from './components/layout/footer'


function App() {
  return (
    <BrowserRouter className="App">
      <Layout>
        <Header 
          router={router}
        />
        <Content
          router={router}
        />
        <Footer />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
