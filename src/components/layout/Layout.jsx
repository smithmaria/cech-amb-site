import Navbar from './Navbar';

const Layout = ({children}) => {
    return (
      <div className="layout">
        <Navbar />
        <main>
          {children}
        </main>
      </div>
    );
};

export default Layout;