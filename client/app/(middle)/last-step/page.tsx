import React from "react";
import LastStepForm from "./form";

const LastStepPage = () => {
  return (
    <div className="flex flex-col flex-grow sm:flex-grow-0 sm:grid grid-cols-12 transition-all">
      <div className="flex flex-col flex-grow sm:flex-grow-0 sm:col-start-3 sm:col-end-11 mx-auto w-full sm:max-w-screen-sm p-4">
        <div className="flex flex-col flex-grow space-y-6">
          <h1 className="text-2xl font-semibold tracking-tight text-center mt-4">
            <span>Bước cuối cùng</span>
          </h1>
          <LastStepForm />
        </div>
      </div>
    </div>
  );
};

export default LastStepPage;
