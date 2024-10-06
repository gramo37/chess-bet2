export const calculateStartDate = (timeRange:string) => {
    const range = timeRange;
    const currentDate = new Date();

    if (range === "today") {
      const startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
      return startDate;
    }

    if (range === "7days") {
      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 7);
      return startDate;
    }

    if (range === "1month") {
      const startDate = new Date(currentDate);
      startDate.setMonth(currentDate.getMonth() - 1);
      return startDate;
    }

    if (range === "1year") {
      const startDate = new Date(currentDate);
      startDate.setFullYear(currentDate.getFullYear() - 1);
      return startDate;
    }

    return null;
  };