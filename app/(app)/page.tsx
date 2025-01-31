import { DataInterface, GetSheetData } from "../actions/sheets";
import HomePageClient from "./page.client";

export default function Page() {
  return <HomePageServer />
}

async function HomePageServer() {
  const sheetsData: DataInterface[] | undefined = await GetSheetData();

  return <HomePageClient sheetsData={sheetsData} />
}