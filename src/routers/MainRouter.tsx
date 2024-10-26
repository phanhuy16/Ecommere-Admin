import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Affix, Layout } from "antd";
import HomeScreen from "@/screens/HomeScreen";
import {
  AddProduct,
  Categories,
  CategoryDetail,
  InventoryScreen,
  ManageStoreScreen,
  OrderScreen,
  ProductDetail,
  PromotionScreen,
  ReportScreen,
  SupplierScreen,
} from "@/screens";
import { HeaderComponent, SiderComponent } from "@/components";

const { Content, Footer } = Layout;

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>
        <Layout>
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content className="container-fluid my-3">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route>
                <Route path="/inventory" element={<InventoryScreen />} />
                <Route path="/inventory/add-product" element={<AddProduct />} />
                <Route
                  path="/inventory/detail/:slug"
                  element={<ProductDetail />}
                />
              </Route>
              <Route path="/report" element={<ReportScreen />} />
              <Route path="/suppliers" element={<SupplierScreen />} />
              <Route path="/orders" element={<OrderScreen />} />
              <Route>
                <Route path="/categories" element={<Categories />} />
                <Route
                  path="/categories/detail/:slug"
                  element={<CategoryDetail />}
                />
              </Route>
              <Route path="/manage-store" element={<ManageStoreScreen />} />
              <Route path="/promotion" element={<PromotionScreen />} />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
