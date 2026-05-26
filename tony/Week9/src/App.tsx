import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
// 미션 2에서 추가 예정
// import Modal from './components/Modal';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <CartContainer />
      </main>
      {/* 미션 2에서 추가: <Modal /> */}
    </div>
  );
}

export default App;
