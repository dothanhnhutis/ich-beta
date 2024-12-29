import React from "react";
import { Input } from "@/components/ui/input";

const SmartDateInput = () => {
  const [day, setDay] = React.useState<string>(new Date().getDate().toString());
  const [month, setMonth] = React.useState<string>(
    (new Date().getUTCMonth() + 1).toString()
  );
  const [year, setYear] = React.useState<string>(
    new Date().getFullYear().toString()
  );

  // React.useEffect(() => {
  //   console.log(`${day}/${month}/${year}`);
  //   console.log(
  //     new Date(parseInt(year), parseInt(month), parseInt(day)).toISOString()
  //   );
  // }, [day, month, year]);

  const handleCheckDay = (value: string) => {
    if (value == "") return "01";
    const day = parseInt(value);
    const endDayOfMonth = new Date(
      parseInt(year),
      parseInt(month),
      0
    ).getDate();

    if (day <= 0) {
      return "01";
    } else if (day > endDayOfMonth) {
      return endDayOfMonth.toString();
    } else {
      if (value.length == 1 && day < 10) return "0" + value;
      return value;
    }
  };

  const handleCheckMonth = (value: string) => {
    if (value == "") return "01";
    const month = parseInt(value);

    if (month <= 0) {
      return "01";
    } else if (month > 12) {
      return "12";
    } else {
      if (value.length == 1 && month < 10) return "0" + value;
      return value;
    }
  };

  const handleCheckYear = (value: string) => {
    if (value == "") return "1990";
    const year = parseInt(value);
    const currYear = new Date(Date.now()).getFullYear();
    if (year <= 1990) {
      return "1990";
    } else if (year > currYear) {
      return currYear.toString();
    } else {
      return value;
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <Input
        type="text"
        maxLength={2}
        className="col-span-2"
        placeholder="Day"
        id="day"
        name="day"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        onBlur={() => {
          setDay(handleCheckDay(day));
        }}
      />
      <Input
        type="text"
        maxLength={2}
        className="col-span-2"
        placeholder="Month"
        id="month"
        name="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        onBlur={() => {
          const newMonth = handleCheckMonth(month);
          const endDayOfMonth = new Date(
            parseInt(year),
            parseInt(newMonth),
            0
          ).getDate();
          if (parseInt(day) > endDayOfMonth) {
            setDay(endDayOfMonth.toString());
          }
          setMonth(newMonth);
        }}
      />
      <Input
        type="text"
        maxLength={4}
        className="col-span-2"
        placeholder="Year"
        id="year"
        name="year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        onBlur={() => {
          const newYear = handleCheckYear(year);
          const endDayOfMonth = new Date(
            parseInt(newYear),
            parseInt(month),
            0
          ).getDate();
          if (parseInt(day) > endDayOfMonth) {
            setDay(endDayOfMonth.toString());
          }
          setYear(newYear);
        }}
      />
    </div>
  );
};

export default SmartDateInput;
