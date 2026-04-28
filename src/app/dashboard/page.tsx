import ProtectedRoute from "@/components/shared/ProtectedRoute";

const Dashboard = () => {
  return <div>
    <ProtectedRoute>
      <div className="">dashboard</div>
    </ProtectedRoute>
  </div>;
};

export default Dashboard;
