import React from "react";
import Sigin from "../components/SigIn";
import { AnimatedLogo } from "../components/AnimatedLogo";
import { CheckCircle } from "lucide-react";
const BulletPoints = ({ label }) => {
  return (
    <div className="flex flex-row gap-2 text-gray-800 items-center bg-gray-50 rounded-3xl">
      <CheckCircle size={19} color="green"></CheckCircle>
      {label}
    </div>
  );
};

const page = () => {
  return (
    <section className="flex flex-col gap-6 items-center justify-center w-full min-h-screen text-center relative overflow-hidden">
      {/* This for the content section before the button */}
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="absolute w-[420px] h-[420px] rounded-full bg-red-50 -top-48 left-1/2 -translate-x-1/2 pointer-events-none z-[-1]" />
        <div className="absolute w-44 h-44 rounded-full bg-red-50 -bottom-12 -right-10 pointer-events-none z-[-1]" />

        <AnimatedLogo className="text-5xl text-black"></AnimatedLogo>
        <h2 className="text-gray-500 font-medium z-5">
          {" "}
          Your Family's Meal Planner
        </h2>
<div className="flex flex-col gap-5 mt-6 items-center">
        <p className="text-bold text-3xl font-extrabold w-7/12">
          Plan Meals, Skip the Stress.
          
        </p>
<p className="text-gray-400 font-semibold">Sigin to get your family's meals sorted in minutes</p>
</div>


        <Sigin />

        <div className="flex flex-col gap-3 mt-6">
          <BulletPoints label="Make your weekly meal Plan ahead"></BulletPoints>
          <BulletPoints label="Sync them with your family"></BulletPoints>
          <BulletPoints label="Manage meals and food without stress"></BulletPoints>
        </div>
      </div>
    </section>
  );
};

export default page;
