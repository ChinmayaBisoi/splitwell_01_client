import Copyright from "@/components/icons/Copyright";
import Heart from "@/components/icons/Heart";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 font-semibold">
        <p className="text-4xl">Developed with</p>
        <Heart width="28" height="28" />
      </div>
      <div className="flex flex-col">
        <p className="whitespace-nowrap">Email</p>
        <Link
          className="text-blue-500"
          href={"mailto: bisoi.chinmaya.1999@gmail.com"}>
          bisoi.chinmaya.1999@gmail.com
        </Link>{" "}
      </div>
      <div className="flex flex-col">
        <p className="whitespace-nowrap">Github</p>
        <Link
          className="text-blue-500"
          href={"https://github.com/ChinmayaBisoi/todo-app-client"}>
          https://github.com/ChinmayaBisoi/todo-app-client
        </Link>{" "}
      </div>
      <div className="flex items-center gap-1 whitespace-nowrap">
        <Copyright width="16" height="16" className="min-w-[16px]" />
        <p>2023 Chinmaya Bisoi</p>
      </div>
    </div>
  );
};

export default AboutPage;
