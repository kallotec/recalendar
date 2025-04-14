import DatePicker from "@/ui/DatePicker";
import CalendarView from "@/ui/CalendarView";
import EditEventForm from "@/ui/EditEventForm";

export default async function Home() {
  // const data = await fetch('https://api.vercel.app/blog');
  // const posts = await data.json();
  return (
    <div>
      <DatePicker />
      <CalendarView />
      <EditEventForm />
      {/* <ul>
        {posts.map((post: { id: number, title: string }) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul> */}
    </div>
  );
}
