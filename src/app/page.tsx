import EODashboard from "@/pages/EO-dashboard";
import HomeView from "@/pages/home/home"
import SearchBar from "@/pages/home";

export default function Home() {
  return (
    <div>
      <div>
        <SearchBar />
      </div>
      <div>
        <HomeView />
      </div>
      <div>
        <EODashboard />
      </div>
    </div>
  )
}
