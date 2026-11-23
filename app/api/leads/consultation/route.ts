import { handleLeadRequest } from "@/lib/leads/handler";

export async function POST(request: Request) {
  return handleLeadRequest(request, "consultation");
}
