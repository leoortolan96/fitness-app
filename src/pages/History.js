import AppBar from "../components/layout/AppBar";
import BottomNavBar from "../components/layout/BottomNavBar";

function HistoryPage() {
  return (
    <div>
      <AppBar title="HISTÓRICO" showBackButton={false} />
      <section>
        <p>Em breve...</p>
      </section>
      <BottomNavBar />
    </div>
  );
}
export default HistoryPage;
