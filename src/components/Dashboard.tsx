import { useSelector } from "react-redux";

const Dashboard = () => {
  const token = useSelector((state: any) => state.auth.token);
  console.log("Token from Redux:", token);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
