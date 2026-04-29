import Header from "@/components/habits/Header";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="max-w-6xl ">
        <Header />
        <div className="w-full ">
          
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
