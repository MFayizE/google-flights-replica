import React, { useState, useEffect, useRef } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import useFlightSearchStore from "../store/state";
import apiClient from "../utils/client";

interface FlightDatePickerProps {
  originSkyId?: string;
  destinationSkyId?: string;
  roundTrip: boolean;
}

const FlightDatePicker: React.FC<FlightDatePickerProps> = ({
  originSkyId,
  destinationSkyId,
  roundTrip,
}) => {
  const { flightQuery, setFlightQuery } = useFlightSearchStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const selectedDates = [
    flightQuery.date ? new Date(flightQuery.date) : null,
    flightQuery.returnDate ? new Date(flightQuery.returnDate) : null,
  ].filter(Boolean) as Date[];
  useEffect(() => {
    const fetchPrices = async () => {
      const fromDate = format(currentMonth, "yyyy-MM-dd");
      try {
        const response = await apiClient.get(
          `/v1/flights/getPriceCalendar?originSkyId=${originSkyId}&destinationSkyId=${destinationSkyId}&fromDate=${fromDate}&currency=USD`
        );
        const data = await response.data ;
        const priceMap: { [key: string]: number } = {};
        data.data.flights.days.forEach(
          (day: { day: string; price: number }) => {
            priceMap[day.day] = day.price;
          }
        );
        setPrices(priceMap);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };
    if (originSkyId && destinationSkyId) {
      fetchPrices();
    }
  }, [originSkyId, destinationSkyId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !toggleRef.current?.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    const updatePosition = () => {
      if (showCalendar && toggleRef.current && calendarRef.current) {
        const toggleRect = toggleRef.current.getBoundingClientRect();
        const calendarEl = calendarRef.current;
        const calendarHeight = calendarEl.offsetHeight;
        const calendarWidth = calendarEl.offsetWidth;

        const spaceBelow = window.innerHeight - toggleRect.bottom;
        const spaceAbove = toggleRect.top;
        let top = toggleRect.bottom + 8;

        if (spaceBelow < calendarHeight && spaceAbove > spaceBelow) {
          top = toggleRect.top - calendarHeight - 8;
        }

        let left = toggleRect.left;
        const rightSpace = window.innerWidth - toggleRect.left;
        if (calendarWidth > rightSpace) {
          left = window.innerWidth - calendarWidth - 8;
        }
        left = Math.max(
          8,
          Math.min(left, window.innerWidth - calendarWidth - 8)
        );

        calendarEl.style.top = `${Math.max(
          8,
          Math.min(top, window.innerHeight - calendarHeight - 8)
        )}px`;
        calendarEl.style.left = `${left}px`;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    if (showCalendar) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [showCalendar]);

  const handleDateClick = (date: Date) => {
    if (!roundTrip) {
      setFlightQuery({ date: format(date, "yyyy-MM-dd"), returnDate: "" });
    } else {
      if (selectedDates.length === 0 || selectedDates.length === 2) {
        setFlightQuery({ date: format(date, "yyyy-MM-dd"), returnDate: "" });
      } else {
        const [startDate] = selectedDates;
        if (date < startDate) {
          setFlightQuery({
            date: format(date, "yyyy-MM-dd"),
            returnDate: format(startDate, "yyyy-MM-dd"),
          });
        } else {
          setFlightQuery({
            date: format(startDate, "yyyy-MM-dd"),
            returnDate: format(date, "yyyy-MM-dd"),
          });
        }
      }
    }
  };

  const handleReset = () => {
    setFlightQuery({ date: "", returnDate: "" });
  };

  const renderMonth = (monthOffset: number) => {
    const monthDate = addMonths(currentMonth, monthOffset);
    const days = eachDayOfInterval({
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate),
    });

    return (
      <div className="flex-1 min-w-[280px]">
        <h2 className="text-center font-bold text-lg mb-4 dark:text-[#E8EAED]">
          {format(monthDate, "MMMM yyyy")}
        </h2>
        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <span
              key={index}
              className="text-xs font-semibold text-gray-600 dark:text-gray-400"
            >
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
          {days.map((day) => {
            const formattedDate = format(day, "yyyy-MM-dd");
            const isSelected = selectedDates.some((selectedDate) =>
              isSameDay(selectedDate, day)
            );
            const isInRange =
              selectedDates.length === 2 &&
              isWithinInterval(day, {
                start: selectedDates[0],
                end: selectedDates[1],
              });
            return (
              <button
                key={formattedDate}
                className={`p-1 md:p-2 w-9 h-9 md:w-11 md:h-11 text-xs rounded-full flex flex-col gap-1 items-center justify-center transition-all
                    ${
                      isSelected
                        ? "bg-blue-500 dark:bg-[#8AB4F8] text-white"
                        : isInRange
                        ? "bg-blue-200 dark:bg-[#3C4043]"
                        : "hover:bg-gray-200 dark:hover:bg-[#474A4D]"
                    }`}
                onClick={() => handleDateClick(day)}
              >
                <span className="font-medium text-xs md:text-sm dark:text-[#E8EAED]">
                  {day.getDate()}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-[8px] md:text-[10px]">
                  {prices[formattedDate] ? `$${prices[formattedDate]}` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const currentMonthStart = startOfMonth(new Date());
  const prevMonth = subMonths(currentMonth, 1);
  const isPrevDisabled = prevMonth < currentMonthStart;

  return (
    <div className="relative">
      <div
        ref={toggleRef}
        className="flex gap-10 justify-between border border-gray-300 dark:border-[#3C4043] p-4 rounded-lg bg-white dark:bg-[#292A2D] hover:shadow-md dark:hover:bg-[#3C4043] transition-all cursor-pointer"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <button className="flex items-center justify-between text-left text-sm">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-[#E8EAED]">
              {flightQuery.date
                ? format(new Date(flightQuery.date), "EEE, MMM d")
                : "Select Date"}
            </span>
          </div>
        </button>
        {roundTrip && (
          <button className="flex items-center justify-between text-left text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 dark:text-[#E8EAED]">
                {flightQuery.returnDate
                  ? format(new Date(flightQuery.returnDate), "EEE, MMM d")
                  : "Return"}
              </span>
            </div>
          </button>
        )}
      </div>

      {showCalendar && (
        <div
          ref={calendarRef}
          className="fixed bg-white dark:bg-[#292A2D] p-4 md:p-6 shadow-lg dark:shadow-xl rounded-lg z-50"
          style={{
            maxWidth: "calc(100vw - 32px)",
            width: "720px",
            maxHeight: "95vh",
            overflowY: "auto",
          }}
        >
          <div className="flex-1 flex justify-start">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-black dark:text-white rounded  text-sm"
            >
              Reset
            </button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => setCurrentMonth(prevMonth)}
                disabled={isPrevDisabled}
                style={{ visibility: isPrevDisabled ? "hidden" : "visible" }}
              >
                <FaChevronLeft className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setCurrentMonth(addMonths(flightQuery.date, 1))}
              >
                <FaChevronRight className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {renderMonth(0)}
            {renderMonth(1)}
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 dark:bg-[#8AB4F8] text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-[#84A9EB]"
              onClick={() => setShowCalendar(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDatePicker;
