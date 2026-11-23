import { BUSINESS_NAME, TAGLINE } from "@/lib/constants";

export default function Home() {
  return (
    <main>
      <h1>{BUSINESS_NAME}</h1>
      <p>{TAGLINE}</p>
    </main>
  );
}
