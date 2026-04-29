import DashboardComponent from "@/components/habits/Dashboard";
import Header from "@/components/habits/Header";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardComponent/>
    </ProtectedRoute>
  );
};

export default Dashboard;
