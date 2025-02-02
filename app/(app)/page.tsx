import { SheetResponse } from "@/types/SheetTypes";
import { GetSheetData,  } from "../actions/sheets";
import HomePageClient from "./page.client";

export default function Page() {
  return <HomePageServer />
}

async function HomePageServer() {
  const sheetsData: SheetResponse | undefined = await GetSheetData();

  return <HomePageClient sheetsData={sheetsData} isDevMode={false} />
}