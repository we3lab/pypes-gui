import PageTitle from "@/components/global/page-title";
import { trpc } from "@/utils/trpc";


import { Card, CardContent } from "@mui/material";
export default function IndexPage() {
  // const { data } = trpc.example.protected.useQuery({ text: "hello" });

  // if (data?.error) {
  //   window.location.href = "/sign-in";
  // }

  // if (!data) {
  //   return <div>loading...</div>;
  // }

  return (
    <div className="max-w-none">
      <div className="max-w-full p-20 shadow-lg">
        <Card className="m-auto shadow-2xl max-w-2xl">
          <CardContent>
            <div className="h-full w-full">
              <div className="mt-10"><img className="mx-auto" src='/home_screen_img.png' /></div>
              <div className="mt-10 text-flows-home-title text-center">Welcome to Flows Energy</div>
              <div className="mt-4 text-flows-home-text text-center">Navigate through the items in the menu to manage your system.</div>
            </div>
          </CardContent>
          </Card>
              
        </div>
      </div>
  )
}
